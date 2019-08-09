import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { DateService, NotificationService, OrderService, UserService } from '../../../../services';
import { Order, User } from '../../../../models';
import { Roles, OrderState, IStatus } from '../../../../helpers';

@Component({
  selector: 'app-order-details-workspace',
  templateUrl: './order-details-workspace.component.html',
  styleUrls: ['./order-details-workspace.component.scss']
})
export class OrderDetailsWorkspaceComponent implements OnInit, IStatus {
  user: User;
  userId: string;
  providerId: string;
  cashierId: string;
  orderId: string;
  userRole: string;
  order: Order;
  observer$: Observable<any>;
  date: Date;
  state = 'waiting';
  panelOpenState = false;
  isAdmin = false;
  isProvider = false;
  isCashier = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private readonly orderService: OrderService,
    private readonly dateService: DateService,
    private readonly userService: UserService,
    private readonly notification: NotificationService
  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe(data => this.userRole = data.role);

    // Role Admin
    if (this.userRole === Roles.Admin) {
      this.isAdmin = true;
      this.userId = this.route.snapshot.params['userId'];
      this.userService.getUserById(this.userId).subscribe(user => this.user = user);
    } else if (this.userRole === Roles.Provider) {
      this.isProvider = true;
    } else {
      this.isCashier = true;
    }

    this.providerId = this.route.snapshot.params['providerId'];
    this.orderId = this.route.snapshot.params['orderId'];
    const year = this.route.snapshot.params['year'];
    const month = this.route.snapshot.params['month'];
    const day = this.route.snapshot.params['day'];
    this.date = new Date(year, month, day);
    // send date event
    this.dateService.sendDate(this.date);

    this.observer$ = this.orderService.getOrderData(this.providerId, this.orderId, this.date);
    this.observer$.subscribe(
      order => {
        this.order = order;
        this.state = 'finish';
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

  redirectToCashierHome() {
    this.ngZone.run(() => {
      this.router.navigate(['cashier-dashboard/workspace/home']);
    });
  }

  updateOrderStatus(value) {
    this.order.status = value;

    this.notification.SuccessMessage(
      `Status changed to ${this.order.status}`, '', 2500);

    // this.orderService.update(this.order, this.date).then(
    //   () => this.notification.SuccessMessage(
    //     `Status changed to ${this.order.status}`, '', 2500)
    // ).catch(error => {
    //   this.notification.ErrorMessage(error.message, '', 2500);
    // });
  }

  previousStatus(value) {
    let status = '';
    if (value === OrderState.Canceled ||
        value === OrderState.Completed) {

      status = OrderState.Ready;
    } else if (value === OrderState.Ready) {
      status = OrderState.Pending;
    }

    // Update Status
    this.updateOrderStatus(status);
  }

  get total() {
    return this.order.products.map(p => p.price).reduce((total, price) => total + price);
  }

  valueToString(value) {
    return String(value);
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
