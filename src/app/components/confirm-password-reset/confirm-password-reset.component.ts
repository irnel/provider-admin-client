import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, NgZone } from '@angular/core';

import { AuthService, NotificationService } from '../../services';
import { FirebaseError } from '../../helpers';

@Component({
  selector: 'app-confirm-password-reset',
  templateUrl: './confirm-password-reset.component.html',
  styleUrls: ['./confirm-password-reset.component.scss']
})
export class ConfirmPasswordResetComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  sending = false;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly notification: NotificationService
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)]
      )],
      passwordConfirmation: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

  }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.controls.password.value === formGroup.controls.passwordConfirmation.value
      ? null : { passwordMismatch: true };
  }

  get form() { return this.resetForm.controls; }

  resetPassword() {
    this.loading = true;
    // Mark control as dirty

    if (this.resetForm.invalid) {
      this.form.password.markAsDirty();
      this.form.passwordConfirmation.markAsDirty();

      if (this.resetForm.hasError('passwordMismatch')) {
        this.notification.ErrorMessage('Passwords do not match', '', 2000);
      }

      this.loading = false;
      return;
    }

    this.sending = true;
    const code = this.route.snapshot.queryParams.oobCode;
    const password = this.form.password.value;

    this.authService.ConfirmPasswordReset(code, password).then(() => {
      this.loading = false;
      this.sending = false;

      this.notification.SuccessMessage(
        'Your password has reset successfully', '', 2500);

      this.ngZone.run(() => {
        this.router.navigate(['/auth/sign-in']);
      });
    })
    .catch(error => {
      this.loading = false;
      this.sending = false;

      this.notification.ErrorMessage(
        FirebaseError.Parse(error.code), '');
    });
  }

}
