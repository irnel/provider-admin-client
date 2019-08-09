import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';

import { Config } from '../../../../infrastructure';
import { ProviderService, NotificationService, UserService, AuthService } from '../../../../services';
import { Roles } from '../../../../helpers';
import { Provider, User } from '../../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-provider-workspace',
  templateUrl: './provider-workspace.component.html',
  styleUrls: ['./provider-workspace.component.scss']
})
export class ProviderWorkspaceComponent implements OnInit {
  public columnsToDisplay: string [] = ['image', 'name', 'address', 'phone', 'operation'];
  public dataSource: MatTableDataSource<Provider>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('frame', {static: true}) frame: ElementRef;

  user: User;
  providers: Provider [];
  observer$: Observable<any>;
  maxChar: number = Config.maxChar;
  pageSizeOptions: number[] = Config.pageSizeOptions;
  userRole: string;
  userId: string;
  deleting = false;
  state = 'waiting';
  visibility = false;
  isAdmin = false;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
    private readonly notification: NotificationService
  ) {}

  ngOnInit() {
    this.route.parent.data.subscribe(data => this.userRole = data.role);

    // Admin role
    if (this.userRole === Roles.Admin) {
      this.isAdmin = true;
      this.userId = this.route.snapshot.params['userId'];

      this.userService.getUserById(this.userId).subscribe(
        user => this.user = user
      );
    }

    // Provider Role
    if (this.userRole === Roles.Provider) {
      this.userId = this.authService.currentUserValue.uid;
    }

    this.observer$ = this.providerService.getAllProviderByUserId(this.userId);
    this.observer$.subscribe(
      providers => {
        this.providers = providers;
        this.dataSource = new MatTableDataSource(providers);
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

  // redirect to edit provider
  redirectToEditProvider(id: string) {
    this.ngZone.run(() => {
      this.router.navigate([
        `provider-dashboard/workspace/providers/${id}/edit`]);
    });
  }

  // redirect to provider details
  redirectToProviderDetails(providerId: string) {
    this.ngZone.run(() => {
      let url = '';
      // Admin Role
      if (this.userRole === Roles.Admin) {
        url = `admin-dashboard/workspace/users/${this.userId}/providers/${providerId}/details`;
      }

      // Provider Role
      if (this.userRole === Roles.Provider) {
        url = `provider-dashboard/workspace/providers/${providerId}/details`;
      }

      this.router.navigate([url]);
    });
  }

  // apply filter to data table
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.paginator.firstPage();
    }
  }

  deleteProvider(provider) {
    this.deleting = true;
    this.providerService.delete(provider).then(() => {
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
