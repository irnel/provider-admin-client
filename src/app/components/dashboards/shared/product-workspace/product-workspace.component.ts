import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Product, User, Category } from '../../../../models';
import { Config } from '../../../../infrastructure';
import { ProductService, NotificationService, AuthService, UserService, CategoryService } from '../../../../services';
import { Roles } from '../../../../helpers';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-workspace',
  templateUrl: './product-workspace.component.html',
  styleUrls: ['./product-workspace.component.scss']
})
export class ProductWorkspaceComponent implements OnInit {
  displayedColumns: string[] = [
    'image', 'name', 'price', 'description', 'operation'
  ];

  dataSource: MatTableDataSource<Product>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('frame', {static: true}) frame: ElementRef;

  product: Product;
  category: Category;
  user: User;
  products: Product [] = [];
  observer$: Observable<any>;
  maxChar = Config.maxChar;
  pageSizeOptions = Config.pageSizeOptions;
  userId: string;
  providerId: string;
  categoryId: string;
  userRole: string;
  deleting = false;
  state = 'waiting';
  visibility = false;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private readonly productService: ProductService,
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
    this.categoryService.getCategoryData(this.providerId, this.categoryId).subscribe(
      category => this.category = category
    );

    this.observer$ = this.productService.getAllProductsData(this.providerId, this.categoryId);
    this.observer$.subscribe(
      products => {
        this.products = products;
        this.dataSource = new MatTableDataSource(this.products);
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
      this.dataSource.paginator.firstPage();
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

  redirectToEditProduct(productId) {
    this.ngZone.run(() => {
      this.router.navigate([
        `provider-dashboard/workspace/providers/` +
        `${this.providerId}/categories/${this.categoryId}/products/${productId}/edit`
      ]);
    });
  }

  redirectToProductDetails(productId) {
    this.ngZone.run(() => {
      let url = '';
      // Admin role
      if (this.userRole === Roles.Admin) {
        url = `admin-dashboard/workspace/users/${this.userId}/providers/` +
              `${this.providerId}/categories/${this.categoryId}/products/${productId}/details`;
      }

      if (this.userRole === Roles.Provider) {
        url = `provider-dashboard/workspace/providers/` +
              `${this.providerId}/categories/${this.categoryId}/products/${productId}/details`;
      }

      this.router.navigate([url]);
    });
  }

  deleteProduct(product) {
    this.deleting = true;
    this.productService.delete(product).then(() => {
      this.notification.SuccessMessage('removed provider', '', 2500);
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
