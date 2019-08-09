import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { User } from '../../../../../models';
import { UserService, NotificationService } from '../../../../../services';
import { Config } from '../../../../../infrastructure';
import { Roles } from '../../../../../helpers';

@Component({
  selector: 'app-users-workspace',
  templateUrl: './users-workspace.component.html',
  styleUrls: ['./users-workspace.component.scss']
})
export class UsersWorkspaceComponent implements OnInit {
  public columnsToDisplay: string [] = ['name', 'email', 'publish', 'view'];
  public dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  users: User[];
  observer$: Observable<any>;
  pageSizeOptions: number[] = Config.pageSizeOptions;
  state = 'waiting';
  visibility = false;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private readonly userService: UserService,
    private readonly notification: NotificationService
  ) {}

  ngOnInit() {
    this.observer$ = this.userService.getAllUsersByType(Roles.Provider);
    this.observer$.subscribe(
      users => {
        this.users = users;
        this.dataSource = new MatTableDataSource(users);
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

  redirectToHome() {
    this.ngZone.run(() => {
      this.router.navigate(['admin-dashboard/workspace/home']);
    });
  }

  redirectToProviderWorkspace(userId) {
    this.ngZone.run(() => {
      this.router.navigate([`admin-dashboard/workspace/users/${userId}/providers`]);
    });
  }

  // apply filter to data table
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.paginator.firstPage();
    }
  }

  update(user: User) {
    let msg = '';

    if (user.publish) {
      msg = `${user.displayName} can not publish`;
      user.publish = false;
    } else {
      msg = `${user.displayName} can publish`;
      user.publish = true;
    }

    this.userService.update(user).then(() => {
      this.notification.SuccessMessage(msg, '', 2500);
    })
    .catch(error => {
      this.notification.ErrorMessage(error.message, '', 2500);
    });
  }

  setVisibility(value: boolean) {
    this.visibility = value;
  }
}
