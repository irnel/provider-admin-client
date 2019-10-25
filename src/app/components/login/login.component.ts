import { startWith, map } from 'rxjs/operators';

import { Component, OnInit, NgZone, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, NotificationService } from '../../services';
import { FirebaseCode } from '../../helpers/firebase-code';
import { Roles } from '../../helpers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  resetPasswordForm: FormGroup;
  clicked = false;
  loading = false;
  googleLoading = false;
  sending = false;
  returnUrl: string;
  emailError: string;
  resetEmailError: string;

  @ViewChild('frameForgotPassword', {static: true}) frameForgotPassword: ElementRef;
  @ViewChild('frameActivationAccount', {static: true}) frameActivationAccount: ElementRef;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private render: Renderer2,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly notification: NotificationService
  ) {
    // redirect to specific dashboard if already logged in
    this.authService.currentUser.subscribe(
      currentUser => {
        if (currentUser) {
          currentUser.roles.forEach(rol => {
            if (rol === Roles.Admin) {
              // redirect to admin dashboard
              this.router.navigate(['/admin-dashboard/workspace/home']);
            } else if (rol === Roles.Provider) {
              this.router.navigate(['/provider-dashboard/workspace/home']);
            } else {
              // redirect to cashier dashboard
              this.router.navigate(['/cashier-dashboard/workspace/home']);
            }
          });
        }
      }
    );
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.resetPasswordForm = this.formBuilder.group({
      resetEmail: ['', Validators.compose([Validators.required, Validators.email])]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // validate email
    this.form.email.valueChanges.pipe(
      startWith(''),
      map(() => {
        let error = '';
        if (this.form.email.hasError('required')) {
          error = 'email is required';
        }

        if (this.form.email.hasError('email')) {
          error = 'invalid email';
        }

        return error;
      })
    ).subscribe(error => this.emailError = error);

    // validate email for reset password
    this.formReset.resetEmail.valueChanges.pipe(
      startWith(''),
      map(() => {
        let error = '';
        if (this.formReset.resetEmail.hasError('required')) {
          error = 'email is required';
        }

        if (this.formReset.resetEmail.hasError('email')) {
          error = 'invalid email';
        }

        return error;
      })
    ).subscribe(error => this.resetEmailError = error);

  }

  get form() { return this.loginForm.controls; }

  get formReset() { return this.resetPasswordForm.controls; }

  login() {
    // Mark the control as dirty
    if (this.loginForm.invalid) {
      this.form.email.markAsDirty();
      this.form.password.markAsDirty();

      return;
    }

    this.clicked = true;
    this.loading = true;

    this.authService.SignIn(this.form.email.value, this.form.password.value)
      .then(accountVerified => {
        this.loading = false;
        this.clicked = false;

        if (!accountVerified) {
          this.showModalActivationAccount();

          return;
        }

        this.ngZone.run(() => {
          this.router.navigate([this.returnUrl]);
        });
      })
      .catch(error => {
        let msg: string;
        this.loading = false;
        this.clicked = false;

        if (error.code === FirebaseCode.USER_NOT_FOUND ||
            error.code === FirebaseCode.WRONG_PASSWORD) {

          msg = 'Invalid username and password.';
        } else {
          msg = error.message;
        }

        this.notification.ErrorMessage(msg, '', 2500);
      });
  }

  loginWithGoogle() {
    this.clicked = true;
    this.googleLoading = true;
    this.authService.GoogleAuth().then(() => {
      this.clicked = false;
      this.googleLoading = false;

      this.ngZone.run(() => {
        this.router.navigate([this.returnUrl]);
      });
    })
    .catch(error => {
      this.loading = false;
      this.clicked = false;

      this.notification.ErrorMessage(error.message, '');
    });
  }

  forgotPassword() {
    if (this.resetPasswordForm.invalid) {
      this.formReset.resetEmail.markAsDirty();

      return;
    }

    this.sending = true;
    const email = this.formReset.resetEmail.value;
    this.authService.ForgotPassword(email).then(() => {
      this.sending = false;
      this.hideModalForgotPassword();

      this.notification.SuccessMessage(
        `forgot password sent email to ${email}`, '', 2500);
    })
    .catch(error => {
       this.notification.ErrorMessage(error.message, '', 2500);
    });
  }

  sendVerificationMail() {
    this.sending = true;
    this.authService.SendVerificationMail().then(() => {
      this.sending = false;
      this.hideModalActivationAccount();

      this.notification.SuccessMessage(
        `Verification email sent to ${this.form.email.value}`, '');
    })
    .catch(error => {
      this.notification.ErrorMessage(error.message, '', 2500);
    });
  }

  showModalForgotPassword() {
    this.formReset.resetEmail.reset('');

    const modal = this.render.selectRootElement(this.frameForgotPassword);
    modal.show();

  }

  hideModalForgotPassword() {
    const modal = this.render.selectRootElement(this.frameForgotPassword);
    modal.hide();
  }

  showModalActivationAccount() {
    const modal = this.render.selectRootElement(this.frameActivationAccount);
    modal.show();

  }

  hideModalActivationAccount() {
    const modal = this.render.selectRootElement(this.frameActivationAccount);
    modal.hide();
  }
}
