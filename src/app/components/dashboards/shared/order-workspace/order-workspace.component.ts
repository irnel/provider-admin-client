import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { Order, Provider, User } from '../../../../models';
import { Config } from '../../../../infrastructure';
import { OrderState, Roles, IStatus } from '../../../../helpers';
import { OrderService, NotificationService, DateService, ProviderService, UserService } from '../../../../services';

@Component({
  selector: 'app-order-workspace',
  templateUrl: './order-workspace.component.html',
  styleUrls: ['./order-workspace.component.scss']
})
export class OrderWorkspaceComponent implements OnInit, OnDestroy, IStatus {
  public columnsToDisplay = ['createdDate', 'pickupTime', 'provider', 'paid', 'status', 'view'];
  public dataSource: MatTableDataSource<Order>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('frame', {static: true}) frame: any;

  subscription: Subscription;
  pageSizeOptions = Config.pageSizeOptions;
  orderState = OrderState.Pending;
  userId: string;
  providerId: string;
  cashierId: string;
  provider: Provider;
  user: User;
  userRole: string;
  orders: Order [];
  observer$: Observable<any>;
  message: string;
  state = 'waiting';
  selectedOrder: Order;
  currentDate: Date;
  date: FormControl;
  currentDateFormat: string;
  isAdmin = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ngZone: NgZone,
    private readonly orderService: OrderService,
    private readonly providerService: ProviderService,
    private readonly userService: UserService,
    private readonly dateService: DateService,
    private readonly notification: NotificationService
  ) {}

  ngOnInit() {
    this.route.parent.data.subscribe(data => this.userRole = data.role);
    this.providerId = this.route.snapshot.params['providerId'];

    this.observer$ = this.providerService.getProviderById(this.providerId);
    this.observer$.subscribe(
      provider => this.provider = provider
    );

    if (this.userRole === Roles.Admin) {
      this.isAdmin = true;
      this.userId = this.route.snapshot.params['userId'];
      this.userService.getUserById(this.userId).subscribe(
        user => this.user = user
      );
    }

    this.subscription = this.dateService.currentDateSubject.subscribe(
      date => {
        !date
          ? this.getAllOrdersByDate(new Date())
          : this.getAllOrdersByDate(date);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  redirectToOrderDetails(orderId) {
    this.ngZone.run(() => {
      let url = '';
      // Admin role
      if (this.isAdmin) {
        url = `admin-dashboard/workspace/users/${this.userId}/providers/${this.providerId}/orders/${orderId}/date/` +
              `${this.currentDate.getDate()}/${this.currentDate.getMonth()}/${this.currentDate.getFullYear()}/details`;
      } else {
        url = `provider-dashboard/workspace/providers/${this.providerId}/orders/${orderId}/date/` +
              `${this.currentDate.getDate()}/${this.currentDate.getMonth()}/${this.currentDate.getFullYear()}/details`;
      }

      this.router.navigate([url]);
    });
  }

  getAllOrdersByDate(date: Date) {
    this.currentDate = date;
    this.date = new FormControl(date);
    this.observer$ = this.orderService.getAllOrdersByProviderId(this.providerId, this.currentDate);
    this.observer$.subscribe(
      orders => {
        this.orders = orders;
        this.dataSource = new MatTableDataSource(this.orders);
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

  getStatusColor(status: string) {
    switch (status) {
      case OrderState.Pending:
        return '#9933CC';

      case OrderState.Ready:
          return '#FF8800';

      case OrderState.Completed:
          return '#00C851';

      case OrderState.Canceled:
        return '#ff4444';
    }
  }
}
