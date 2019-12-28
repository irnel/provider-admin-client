import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Output, EventEmitter, NgZone } from '@angular/core';

import { AuthService, NotificationService } from './../../../../services';
import { User } from './../../../../models';
import { FirebaseError } from '../../../../helpers/firebase-error';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User;
  @Output() public sidenavToggle = new EventEmitter();

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private readonly authService: AuthService,
    private readonly notification: NotificationService
  ) {

    this.currentUser = this.authService.currentUserValue;
   }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  public SignOut() {
    this.authService.SignOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigate(['auth/sign-in']);
      });
    })
    .catch(error => {
      this.notification.ErrorMessage(
        FirebaseError.Parse(error.code), '');
    });
  }

  public onToggleSideNav = () => {
    this.sidenavToggle.emit();
  }
}
