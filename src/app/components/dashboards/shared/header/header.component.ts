import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Output, EventEmitter, NgZone } from '@angular/core';
import { SnotifyService } from 'ng-snotify';

import { AuthService } from './../../../../services';
import { User } from './../../../../models';


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
    private readonly toast: SnotifyService
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
      this.toast.error(error.message, '', {
        backdrop: 0.2,
        closeOnClick: true,
        pauseOnHover: true,
        showProgressBar: false,
        timeout: 2500
      });
    });
  }

  public onToggleSideNav = () => {
    this.sidenavToggle.emit();
  }

}
