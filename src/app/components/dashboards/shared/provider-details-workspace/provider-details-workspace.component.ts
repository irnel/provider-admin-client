import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Provider, User } from '../../../../models';
import { ProviderService, NotificationService, UserService } from '../../../../services';
import { Roles } from '../../../../helpers';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-provider-details-workspace',
  templateUrl: './provider-details-workspace.component.html',
  styleUrls: ['./provider-details-workspace.component.scss']
})
export class ProviderDetailsWorkspaceComponent implements OnInit {
  user: User;
  provider: Provider;
  userId: string;
  providerId: string;
  userRole: string;
  observer$: Observable<any>;
  panelOpenState = false;
  state = 'waiting';
  isAdmin = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private readonly providerService: ProviderService,
    private readonly userService: UserService,
    private readonly notification: NotificationService
  ) {}

  ngOnInit() {
    this.route.parent.data.subscribe(data => this.userRole = data.role);

    // Admin Role
    if (this.userRole === Roles.Admin) {
      this.isAdmin = true;
      this.userId = this.route.snapshot.params['userId'];
      this.userService.getUserById(this.userId).subscribe(
        user => this.user = user
      );
    }

    this.providerId = this.route.snapshot.params['providerId'];
    this.observer$ = this.providerService.getProviderById(this.providerId);
    this.observer$.subscribe(
      provider => {
        this.provider = provider;
        this.state = 'finished';
      },
      error => {
        this.state = 'failed';
        this.notification.ErrorMessage(error.message, '', 2500);
      }
    );
  }

  redirectToProviderHome() {
    this.ngZone.run(() => {
      this.router.navigate(['provider-dashboard/workspace/home']);
    });
  }

  redirectToAdminHome() {
    this.ngZone.run(() => {
      this.router.navigate(['admin-dashboard/workspace/home']);
    });
  }

  redirectToCategoryWorkspace() {
    this.ngZone.run(() => {
      let url = '';
      // Admin Role
      if (this.userRole === Roles.Admin) {
        url = `admin-dashboard/workspace/users/${this.userId}/providers/${this.providerId}/categories`;
      }

      // Provider Role
      if (this.userRole === Roles.Provider) {
        url = `provider-dashboard/workspace/providers/${this.providerId}/categories`;
      }

      this.router.navigate([url]);
    });
  }

  redirectToEditCategory() {
    this.ngZone.run(() => {
      this.router.navigate([
        `provider-dashboard/workspace/providers/${this.providerId}/categories/create`
      ]);
    });
  }

  redirectToCashierWorkspace() {
    this.ngZone.run(() => {
      let url = '';
      // Admin Role
      if (this.userRole === Roles.Admin) {
        url = `admin-dashboard/workspace/users/${this.userId}/providers/${this.providerId}/cashiers`;
      }

      // Provider Role
      if (this.userRole === Roles.Provider) {
        url = `provider-dashboard/workspace/providers/${this.providerId}/cashiers`;
      }

      this.router.navigate([url]);
    });
  }

  redirectToEditCashier() {
    this.ngZone.run(() => {
      this.router.navigate([
        `provider-dashboard/workspace/providers/${this.providerId}/cashiers/create`
      ]);
    });
  }

  redirectToOrderWorkspace() {
    this.ngZone.run(() => {
      let url = '';
      // Admin Role
      if (this.userRole === Roles.Admin) {
        url = `admin-dashboard/workspace/users/${this.userId}/providers/${this.providerId}/orders`;
      }

      // Provider Role
      if (this.userRole === Roles.Provider) {
        url = `provider-dashboard/workspace/providers/${this.providerId}/orders`;
      }

      this.router.navigate([url]);
    });
  }
}
