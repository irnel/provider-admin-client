import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product, User } from '../../../../models';
import { ProductService, NotificationService, UserService } from '../../../../services';
import { Roles } from '../../../../helpers';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-details-workspace',
  templateUrl: './product-details-workspace.component.html',
  styleUrls: ['./product-details-workspace.component.scss']
})
export class ProductDetailsWorkspaceComponent implements OnInit {
  user: User;
  product: Product;
  observer$: Observable<any>;
  userId: string;
  providerId: string;
  categoryId: string;
  userRole: string;
  state = 'waiting';
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly notification: NotificationService
  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe(data => this.userRole = data.role);

    // Admin role
    if (this.userRole === Roles.Admin) {
      this.isAdmin = true;
      this.userId = this.route.snapshot.params.userId;
      this.userService.getUserById(this.userId).subscribe(
        user => this.user = user
      );
    }

    this.providerId = this.route.snapshot.params.providerId;
    this.categoryId = this.route.snapshot.params.catId;
    const productId = this.route.snapshot.params.prodId;

    this.observer$ = this.productService.getProductData(this.providerId, this.categoryId, productId);
    this.observer$.subscribe(
      product => {
        this.product = product;
        this.state = 'finished';
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

  redirectToProviderWorkspace() {
    this.ngZone.run(() => {
      let url = '';
      // Admin role
      if (this.userRole === Roles.Admin) {
        url = `admin-dashboard/workspace/users/${this.userId}/providers`;
      }

      // Provider role
      if (this.userRole === Roles.Provider) {
        url = 'provider-dashboard/workspace/providers';
      }

      this.router.navigate([url]);
    });
  }

  redirectToCategoryWorkspace() {
    this.ngZone.run(() => {
      let url = '';
      // Admin role
      if (this.userRole === Roles.Admin) {
        url = `admin-dashboard/workspace/users/${this.userId}/providers/${this.providerId}/categories`;
      }

      // Provider role
      if (this.userRole === Roles.Provider) {
        url = `provider-dashboard/workspace/providers/${this.providerId}/categories`;
      }

      this.router.navigate([url]);
    });
  }

  redirectToProductWorkSpace() {
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
}
