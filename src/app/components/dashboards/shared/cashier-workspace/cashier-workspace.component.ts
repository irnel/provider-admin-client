import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { Observable } from 'rxjs';
import { Config } from '../../../../infrastructure';
import { User, Provider } from '../../../../models';
import { Roles } from '../../../../helpers';
import { UserService, NotificationService } from '../../../../services';
import { ProviderService } from '../../../../services/provider/provider.service';


@Component({
  selector: 'app-cashier-workspace',
  templateUrl: './cashier-workspace.component.html',
  styleUrls: ['./cashier-workspace.component.scss']
})
export class CashierWorkspaceComponent implements OnInit {
  columnsToDisplay: string [] = ['name', 'email', 'provider', 'operation'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  pageSizeOptions: number[] = Config.pageSizeOptions;
  observer$: Observable<any>;
  user: User;
  provider: Provider;
  cashiers: User [];
  providerId: string;
  userRole: string;
  userId: string;
  deleting = false;
  state = 'waiting';
  visibility = false;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private readonly userService: UserService,
    private readonly providerService: ProviderService,
    private readonly notification: NotificationService
  ) {}

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
    this.providerService.getProviderById(this.providerId).subscribe(
      provider => this.provider = provider
    );

    this.observer$ = this.userService.getAllUsersByParentId(this.providerId);
    this.observer$.subscribe(
      cashiers => {
        this.cashiers = cashiers;
        this.dataSource = new MatTableDataSource(cashiers);
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

  redirectToEditCashier(id: number) {
    this.ngZone.run(() => {
      this.router.navigate([
        `provider-dashboard/workspace/providers/${this.providerId}/cashiers/${id}/edit`
      ]);
    });
  }

  deleteCashier(id) {
    this.deleting = true;
    this.userService.delete(id).then(() => {
      this.notification.SuccessMessage('cashier removed', '', 2500);
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
