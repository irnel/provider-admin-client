import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';

import { Config } from '../../../../infrastructure';
import { Category, User, Provider } from '../../../../models';
import { CategoryService, NotificationService, AuthService, UserService, ProviderService } from '../../../../services';
import { Observable } from 'rxjs';
import { Roles } from 'src/app/helpers';

@Component({
  selector: 'app-category-workspace',
  templateUrl: './category-workspace.component.html',
  styleUrls: ['./category-workspace.component.scss']
})
export class CategoryWorkspaceComponent implements OnInit {
  columnsToDisplay: string[] = ['image', 'name', 'description', 'operation'];
  dataSource: MatTableDataSource<Category>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('frame', {static: true}) frame: ElementRef;

  category: Category;
  provider: Provider;
  user: User;
  categories: Category [];
  observer$: Observable<any>;
  userId: string;
  providerId: string;
  providerName: string;
  maxChar: number = Config.maxChar;
  pageSizeOptions: number[] = Config.pageSizeOptions;
  state = 'waiting';
  deleting = false;
  userRole: string;
  visibility = false;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private readonly providerService: ProviderService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
    private readonly notification: NotificationService
  ) {}

  ngOnInit() {
    this.route.parent.data.subscribe(data => this.userRole = data.role);

    // Role Admin
    if (this.userRole === Roles.Admin) {
      this.isAdmin = true;
      this.userId = this.route.snapshot.params.userId;
      this.userService.getUserById(this.userId).subscribe(
        user => this.user = user
      );
    }

    this.providerId = this.route.snapshot.params.providerId;
    this.providerService.getProviderById(this.providerId).subscribe(
      provider => this.provider = provider
    );

    this.observer$ = this.categoryService.getAllCategoriesByProviderId(this.providerId);
    this.observer$.subscribe(
      categories => {
        this.categories = categories;
        this.dataSource = new MatTableDataSource(this.categories);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.state = 'finished';
      },
      error => {
        this.state = 'failed';
        this.notification.ErrorMessage(error.message, '', 2500);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.paginator.firstPage();
    }
  }

  redirectToAdminHome() {
    this.ngZone.run(() => {
      this.router.navigate(['admin-dashboard/workspace/home']);
    });
  }

  redirectToProviderHome() {
    this.ngZone.run(() => {
      this.router.navigate(['provider-dashboard/workspace/home']);
    });
  }

  redirectToEditCategory(catId: number) {
    this.ngZone.run(() => {
      this.router.navigate([
        `provider-dashboard/workspace/providers/${this.providerId}/categories/${catId}/edit`
      ]);
    });
  }

  redirectToCategoryDetails(catId: number) {
    this.ngZone.run(() => {
      let url = '';
      // Admin role
      if (this.userRole === Roles.Admin) {
        url = `admin-dashboard/workspace/users/${this.userId}/providers/${this.providerId}/categories/${catId}/details`;
      }

      // Provider role
      if (this.userRole === Roles.Provider) {
        url = `provider-dashboard/workspace/providers/${this.providerId}/categories/${catId}/details`;
      }

      this.router.navigate([url]);
    });
  }

  deleteCategory(category) {
    this.deleting = true;
    this.categoryService.delete(category).then(() => {
      this.notification.SuccessMessage('removed category', '', 2500);
      this.deleting = false;
    })
    .catch(error => {
      this.notification.ErrorMessage(error.message, '', 2500);
      this.deleting = false;
    });
  }

  setVisibility(value: boolean) {
    this.visibility = value;
  }
}
