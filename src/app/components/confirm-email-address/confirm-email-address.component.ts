import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';

import { AuthService, NotificationService } from './../../services';
import { FirebaseError } from '../../helpers/firebase-error';

@Component({
  selector: 'app-confirm-email-address',
  templateUrl: './confirm-email-address.component.html',
  styleUrls: ['./confirm-email-address.component.scss']
})
export class ConfirmEmailAddressComponent implements OnInit {

  message: string;
  title: string;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly notification: NotificationService
  ) {

    const code = this.activatedRoute.snapshot.queryParams.oobCode;
    // activation account - change emailverified to true
    this.authService.VerifyEmailAddress(code).then(() => {
      this.title = 'Activation completed';
      this.message = 'The registration process has been completed successfully.';
    })
    .catch(error => {
      this.title = 'Activation error';
      this.message = FirebaseError.Parse(error.code);
    });
  }

  ngOnInit() {
  }

  redirectToLogin() {
    this.ngZone.run(() => {
      this.router.navigate(['auth/sign-in']);
    });
  }

}
