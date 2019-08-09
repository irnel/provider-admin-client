import { Observable } from 'rxjs';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Provider, Category, User } from '../../../../models';
import { CategoryService, NotificationService, UserService } from './../../../../services';
import { Roles } from '../../../../helpers';

@Component({
  selector: 'app-category-details-workspace',
  templateUrl: './category-details-workspace.component.html',
  styleUrls: ['./category-details-workspace.component.scss']
})
export class CategoryDetailsWorkspaceComponent implements OnInit {
  userId: string;
  providerId: string;
  userRole: string;
  categoryId: string;
  isAdmin: boolean;
  category: Category;
  user: User;
  observer$: Observable<any>;
  state = 'waiting';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
    private readonly notification: NotificationService
  ) {}

  ngOnInit() {
    this.route.parent.data.subscribe(data => this.userRole = data.role);
    // Role Admin
    if (this.userRole === Roles.Admin) {
      this.isAdmin = true;
      this.userId = this.route.snapshot.params['userId'];
      this.userService.getUserById(this.userId).subscribe(
        user => this.user = user
      );
    }

    this.providerId = this.route.snapshot.params['providerId'];
    this.categoryId = this.route.snapshot.params['catId'];
    this.observer$ = this.categoryService.getCategoryData(this.providerId, this.categoryId);
    this.observer$.subscribe(
      category => {
        this.category = category;
        this.state = 'waiting';
      },
      error => {
        this.state = 'failed';
        this.notification.ErrorMessage(error.message, '', 2500);
      }
    );
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

  redirectToProductWorkspace() {
    this.ngZone.run(() => {
      let url = '';
      // Admin role
      if (this.userRole === Roles.Admin) {
        url = `admin-dashboard/workspace/users/${this.userId}/providers/` +
              `${this.providerId}/categories/${this.categoryId}/products`;
      }
      // Provider role
      if (this.userRole === Roles.Provider) {
        url = `provider-dashboard/workspace/providers/` +
              `${this.providerId}/categories/${this.categoryId}/products`;
      }

      this.router.navigate([url]);
    });
  }

  redirectToEditProduct() {
    this.ngZone.run(() => {
      this.router.navigate([
        `provider-dashboard/workspace/providers/${this.providerId}/categories/${this.category.id}/products/create`
      ]);
    });
  }
}
