import { OrderDetailsWorkspaceComponent } from './../../../shared/order-details-workspace/order-details-workspace.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { OrderState, IStatus } from '../../../../../helpers';
import { OrderService, AuthService, NotificationService, DateService } from '../../../../../services';
import { Order } from '../../../../../models';
import { Config } from '../../../../../infrastructure';


@Component({
  selector: 'app-home-cashier-workspace',
  templateUrl: './home-cashier-workspace.component.html',
  styleUrls: ['./home-cashier-workspace.component.scss']
})
export class HomeCashierWorkspaceComponent implements OnInit, OnDestroy, IStatus {
  public columnsToDisplay = ['Id', 'createdDate', 'pickupTime', 'provider', 'paid', 'status', 'view'];
  public dataSource: MatTableDataSource<Order>;

  @ViewChild(OrderDetailsWorkspaceComponent, {static: true}) child: OrderDetailsWorkspaceComponent;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  cashierId: string;
  providerId: string;
  orders: Order [];
  ordersPending: Order [];
  ordersReady: Order [];
  ordersCompleted: Order [];
  ordersCanceled: Order [];
  orderState = OrderState.All;

  subscription: Subscription;
  pageSizeOptions = Config.pageSizeOptions;
  observer$: Observable<any>;
  message: string;
  state = 'waiting';
  date: FormControl;
  currentDate: Date;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private readonly orderService: OrderService,
    private readonly authService: AuthService,
    private readonly dateService: DateService,
    private readonly notification: NotificationService
  ) {}

  ngOnInit() {
    this.cashierId = this.authService.currentUserValue.uid;
    this.providerId = this.authService.currentUserValue.parentId;

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

  onClickAllOrders() {
    this.message = null;
    this.orderState = OrderState.All;

    if (this.orders.length === 0) {
      this.message = 'There are no orders';
    } else {
      this.dataSource = new MatTableDataSource(this.orders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onClickPendingOrders() {
    this.message = null;
    this.orderState = OrderState.Pending;

    if (this.ordersPending.length === 0) {
      this.message = 'There are no pending orders';
    } else {
      this.dataSource = new MatTableDataSource(this.ordersPending);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onClickReadyOrders() {
    this.message = null;
    this.orderState = OrderState.Ready;

    if (this.ordersReady.length === 0) {
      this.message = 'There are no ready orders';
    } else {
      this.dataSource = new MatTableDataSource(this.ordersReady);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onClickCompletedOrders() {
    this.message = null;
    this.orderState = OrderState.Completed;

    if (this.ordersCompleted.length === 0) {
      this.message = 'There are no completed orders';
    } else {
      this.dataSource = new MatTableDataSource(this.ordersCompleted);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  onClickCanceledOrders() {
    this.message = null;
    this.orderState = OrderState.Canceled;

    if (this.ordersCanceled.length === 0) {
      this.message = 'There are no canceled orders';
    } else {
      this.dataSource = new MatTableDataSource(this.ordersCanceled);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  updateStatus(order: Order, status: string) {
    order.status = status;
    this.orderService.update(order, this.currentDate).then(() => {
      this.notification.SuccessMessage(`The status of the order is ${status}`, '', 2500);
    })
    .catch(error => {
      this.notification.ErrorMessage(error.message, '', 2500);
    });
  }

  getAllOrdersByDate(date: Date) {
    this.currentDate = date;
    this.date = new FormControl(date);
    this.observer$ = this.orderService.getAllOrdersByProviderId(this.providerId, this.currentDate);
    this.observer$.subscribe(
      orders => {
        this.orders = orders;
        this.state = 'finished';

        // Filter orders by status
        this.ordersPending = this.orders.filter(order => order.status === OrderState.Pending);
        this.ordersReady = this.orders.filter(order => order.status === OrderState.Ready);
        this.ordersCompleted = this.orders.filter(order => order.status === OrderState.Completed);
        this.ordersCanceled = this.orders.filter(order => order.status === OrderState.Canceled);

        if (this.orderState === OrderState.All) {
          this.onClickAllOrders();
        } else if (this.orderState === OrderState.Pending) {
          this.onClickPendingOrders();
        } else if (this.orderState === OrderState.Ready) {
          this.onClickReadyOrders();
        } else if (this.orderState === OrderState.Completed) {
          this.onClickCompletedOrders();
        } else {
          this.onClickCanceledOrders();
        }
      },
      error => {
        this.state = 'failed';
        this.notification.ErrorMessage(error.message, '', 2500);
      }
    );
  }

  ApplyFilter(filterValue: String) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  redirectToOrderDetails(orderId) {
    this.ngZone.run(() => {
      const url = `cashier-dashboard/workspace/cashiers/${this.cashierId}/providers/${this.providerId}/orders/${orderId}/date/` +
              `${this.currentDate.getDate()}/${this.currentDate.getMonth()}/${this.currentDate.getFullYear()}/details`;

      this.router.navigate([url]);
    });
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
