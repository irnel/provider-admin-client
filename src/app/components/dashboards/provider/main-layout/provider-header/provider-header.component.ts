import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';

import { AuthService, NotificationService } from '../../../../../services';
import { User } from '../../../../../models';

@Component({
  selector: 'app-provider-header',
  templateUrl: './provider-header.component.html',
  styleUrls: ['./provider-header.component.scss']
})
export class ProviderHeaderComponent implements OnInit {
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

  public SignOut() {
    this.authService.SignOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigate(['auth/sign-in']);
      });
    })
    .catch(error => {
      this.notification.ErrorMessage(error.message, '', 2500);
    });
  }

  public onToggleSideNav = () => {
    this.sidenavToggle.emit();
  }

}
