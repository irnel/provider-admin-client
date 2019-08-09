import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, NgZone } from '@angular/core';
import { startWith, map, tap } from 'rxjs/operators';

import { Config } from './../../../../../infrastructure';
import { Provider, User } from '../../../../../models';
import { ProviderService, UserService, NotificationService, AuthService } from '../../../../../services';
import { Roles, FirebaseCode } from '../../../../../helpers';
import { Observable } from 'rxjs';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-edit-cashier-workspace',
  templateUrl: './edit-cashier-workspace.component.html',
  styleUrls: ['./edit-cashier-workspace.component.scss']
})
export class EditCashierWorkspaceComponent implements OnInit {
  editForm: FormGroup;
  title: string;
  edit: boolean;
  msg: string;

  regEx = Config.regex[0];
  nameError: string;
  emailError: string;

  observer$: Observable<any>;
  provider: Provider;
  userId: string;
  providerId: string; // to navigation
  userRole: string;
  cashier: User;
  state = 'waiting';
  waiting = true;
  loading = false;
  mode: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private readonly providerService: ProviderService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly notification: NotificationService
    ) {}

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.regEx)]
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

     // Change Form values
     this.route.parent.data.subscribe(data => this.userRole = data.role);

     this.route.data.subscribe(data => {
      this.providerId = this.route.snapshot.params['providerId'];
      this.mode = data.mode;

      // Admin role
      if (this.userRole === Roles.Admin) {
        this.userId = this.route.snapshot.params['userId'];
      } else {
        this.userId = this.authService.currentUserValue.uid;
      }

      if (data.mode === 'edit') {
        this.edit = true;
        this.title = 'Edit Cashier';

        this.providerService.getProviderById(this.providerId).subscribe(
          provider => this.provider = provider
        );

        // update form if mode is edit
        const cashierId = this.route.snapshot.params['cashierId'];
        this.observer$ = this.userService.getUserById(cashierId).pipe(
          tap(cashier => {
            this.cashier = cashier;
            this.state = 'finished';
            this.editForm.patchValue({
              name: this.cashier.displayName,
              email: this.cashier.email,
              password: this.cashier.password,
              passwordConfirmation: this.cashier.password
            });
          })
        );

      } else {
        // mode create
        this.edit = false;
        this.title = 'Create Cashier';

        this.observer$ = this.providerService.getProviderById(this.providerId)
          .pipe(
            tap(provider => {
              this.provider = provider;
              this.state = 'finished';
            })
        );
      }
    });

    // validate name
    this.form.name.valueChanges.pipe(
      startWith(''),
      map(() => {
        let error = '';
        if (this.form.name.hasError('required')) {
          error = 'name is required';
        }

        if (this.form.name.hasError('pattern')) {
          error = 'only letters and numbers are allowed';
        }

        return error;
      })
    ).subscribe(error => this.nameError = error );

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

  get form() { return this.editForm.controls; }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.controls.password.value === formGroup.controls.passwordConfirmation.value
      ? null : { passwordMismatch: true };
  }

  redirectToHome() {
    this.ngZone.run(() => {
      this.router.navigate(['provider-dashboard/workspace/home']);
    });
  }

  redirectToCashierWorkspace() {
    this.notification.SuccessMessage(this.msg, '', 2500);

    this.ngZone.run(() => {
      this.router.navigate([
        `/provider-dashboard/workspace/providers/${this.providerId}/cashiers`
      ]);
    });
  }

  cancel() {
    this.ngZone.run(() => {
      this.router.navigate([
        `/provider-dashboard/workspace/providers/${this.providerId}/cashiers`
      ]);
    });
  }

  editCashier() {
    this.loading = true;
    let errorMsg = '';

    // Mark the control as dirty
    if (this.editForm.invalid) {
      this.form.name.markAsDirty();
      this.form.email.markAsDirty();
      this.loading = false;
      this.form.password.markAsDirty();
      this.form.passwordConfirmation.markAsDirty();

      if (this.editForm.hasError('passwordMismatch')) {
        this.notification.ErrorMessage('Passwords do not match', '', 2000);
      }

      this.loading = false;
      return;
    }

    if (!this.edit) {
      this.msg = 'New cashier created';

      const cashier = {
        displayName: this.form.name.value,
        email: this.form.email.value,
        password: this.form.password.value,
        emailVerified: true,
        publish: false,
        roles: [Roles.Cashier],
        parentId: this.provider.id,
        providerName: this.provider.name
      };

      // create cashier
      this.authService.SignUp(cashier, false).then(() => {
        this.redirectToCashierWorkspace();
      })
      .catch(error => {
        this.loading = false;

        if (error.code === FirebaseCode.EMAIL_ALREADY_IN_USE) {
          errorMsg = 'The email address is already in use by another cashier.';
        } else {
          errorMsg = error.message;
        }

        this.notification.ErrorMessage(error.message, '', 2500);
      });

    } else {
      this.msg = 'cashier edited';

      this.cashier.displayName = this.form.name.value;
      this.cashier.email = this.form.email.value;
      this.cashier.password = this.form.password.value;

      this.userService.update(this.cashier).then(() => {
        this.redirectToCashierWorkspace();
      })
      .catch(error => {
        this.loading = false;

        if (error.code === FirebaseCode.EMAIL_ALREADY_IN_USE) {
          errorMsg = 'The email address is already in use by another cashier.';
        } else {
          errorMsg = error.message;
        }

        this.notification.ErrorMessage(error.message, '', 2500);
      });
    }
  }
}
