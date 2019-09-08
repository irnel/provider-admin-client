import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';

import { startWith, map } from 'rxjs/operators';

import { AuthService, NotificationService } from '../../services';
import { Config } from '../../infrastructure';
import { Roles } from '../../helpers/enum-roles';
import { FirebaseCode } from '../../helpers/firebase-code';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  sending = false;
  submitted = false;
  email: string;
  fullNameError: string;
  emailError: string;
  phoneError: string;
  existEmail = false;

  @ViewChild('frame', {static: true}) frame: ElementRef;
  regExName = Config.regex[0]; // pattern for names

  constructor(
    private router: Router,
    private render: Renderer2,
    private formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
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
            }
          });
        }
      }
    );
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.regExName)]
      )],
      email: ['', Validators.compose([
        Validators.required,
        Validators.email]
      )],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)]
      )],
      passwordConfirmation: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    // validate Full Name
    this.form.fullName.valueChanges.pipe(
      startWith(''),
      map(() => {
        let error = '';
        if (this.form.fullName.hasError('required')) {
          error = 'full name is required';
        }

        if (this.form.fullName.hasError('pattern')) {
          error = 'character not allowed';
        }

        return error;
      })
    ).subscribe(error => this.fullNameError = error);

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
  }

  get form() { return this.registerForm.controls; }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.controls.password.value === formGroup.controls.passwordConfirmation.value
      ? null : { passwordMismatch: true };
  }

  createAccount() {
    this.loading = true;
    // Mark the control as dirty
    if (this.registerForm.invalid) {
      this.form.fullName.markAsDirty();
      this.form.email.markAsDirty();
      this.form.password.markAsDirty();
      this.form.passwordConfirmation.markAsDirty();

      if (this.registerForm.hasError('passwordMismatch')) {
        this.notificationService.ErrorMessage('Passwords do not match', '', 2000);
      }

      this.loading = false;
      return;
    }

    const data = {
      displayName: this.form.fullName.value,
      email: this.form.email.value,
      password: this.form.password.value,
      publish: false,
      roles: [Roles.Provider],
      parentId: null
    };

    this.authService.SignUp(data).then(user => {
      this.loading = false;
      this.email = user.email;
      this.showModal();
    }).catch(error => {
      let msg: string;
      this.loading = false;

      if (error.code === FirebaseCode.EMAIL_ALREADY_IN_USE) {
        msg = 'The email address is already in use by another account.';
      } else {
        msg = error.message;
      }

      this.notificationService.ErrorMessage(msg, '');
    });
  }

  sendVerificationMail() {
    this.sending = false;
    this.authService.SendVerificationMail().then(() => {
      this.sending = true;
      this.notificationService.SuccessMessage(
        `Verification email sent to ${this.email}`, '');
    })
    .catch(error => {
      this.notificationService.ErrorMessage(error.message, '');
    });
  }

  showModal() {
    const modal = this.render.selectRootElement(this.frame);
    modal.show();
  }

  hideModal() {
    const modal = this.render.selectRootElement(this.frame);
    modal.hide();
    this.router.navigate(['/auth/sign-in']);
  }
}
