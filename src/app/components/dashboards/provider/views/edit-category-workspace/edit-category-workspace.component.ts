import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';

import { Observable, interval } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import {
  ProviderService,
  NotificationService,
  CategoryService,
  FileService,
  AuthService
} from '../../../../../services';

import { Provider, Category, FileInfo } from '../../../../../models';
import { Config } from './../../../../../infrastructure';
import { Roles } from '../../../../../helpers';

@Component({
  selector: 'app-edit-category-workspace',
  templateUrl: './edit-category-workspace.component.html',
  styleUrls: ['./edit-category-workspace.component.scss']
})
export class EditCategoryWorkspaceComponent implements OnInit {
  editForm: FormGroup;
  edit: boolean;
  title: string;
  msg: string;
  nameError: string;
  regEx: string = Config.regex[0];
  regEx1: string = Config.regex[1];

  localFiles: FileInfo [] = [];  // create mode
  serverFiles$: Observable<any>; // edit mode
  observer$: Observable<any>;
  allPercentage: Observable<number>;
  category: Category;
  provider: Provider;
  userId: string;
  providerId: string;
  userRole: string;
  mode: string;
  loading = false;
  state = 'waiting';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private readonly notification: NotificationService,
    private readonly categoryService: CategoryService,
    private readonly providerService: ProviderService,
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) { }

  ngOnInit() {
    // create controls
    this.editForm = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.regEx)]
      )],
      description: ['',  Validators.nullValidator]
    });

    this.route.parent.data.subscribe(data => this.userRole = data.role);
    this.providerId = this.route.snapshot.params['providerId'];

    // Change Form values
    this.route.data.subscribe(data => {
      // find provider by url params
      this.mode = data.mode;
      // Admin role
      if (this.userRole === Roles.Admin) {
        this.userId = this.route.snapshot.params['userId'];
      } else {
        this.userId = this.authService.currentUserValue.uid;
      }

      if (data.mode === 'create') {
        this.edit = false;
        this.title = 'Create Category';

        // initialize observable with interval
        this.serverFiles$ = interval(1);
        this.observer$ = this.providerService.getProviderById(this.providerId);
        this.observer$.subscribe(
          provider => {
            this.provider = provider;
            this.state = 'finished';
          },
          error => {
            this.state = 'failed';
            this.notification.ErrorMessage(error.message, '', 2500);
          }
        );
      } else {
        this.edit = true;
        this.title = 'Edit Category';

        this.providerService.getProviderById(this.providerId).subscribe(
          provider => this.provider = provider
        );

        const catId = this.route.snapshot.params['catId'];
        // Images value
        this.serverFiles$ = this.fileService.getAllFilesInfoByModelId(catId);
        // current category
        this.observer$ = this.categoryService.getCategoryData(this.providerId, catId);
        this.observer$.subscribe(
          category => {
            this.category = category;
            this.state = 'finished';
            this.editForm.patchValue(category);
          },
          error => {
            this.state = 'failed';
            this.notification.ErrorMessage(error.message, '', 2500);
          }
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
  }

  get form() { return this.editForm.controls; }

  redirectToHome() {
    this.ngZone.run(() => {
      this.router.navigate(['provider-dashboard/workspace/home']);
    });
  }

  redirectToCategoryWorkspace() {
    this.notification.SuccessMessage(this.msg, '', 2500);

    this.ngZone.run(() => {
      this.router.navigate([
        `provider-dashboard/workspace/providers/${this.providerId}/categories`]);
    });
  }

  cancel() {
    this.ngZone.run(() => {
      this.router.navigate([
        `provider-dashboard/workspace/providers/${this.providerId}/categories`]);
    });
  }

  async editCategory() {
    this.loading = true;
    // Mark the control as dirty
    if (this.editForm.invalid) {
      this.form.name.markAsDirty();
      this.loading = false;

      return;
    }

    if (!this.edit) {
      this.msg = 'New category created';

      const data: Category = {
        name: this.form.name.value,
        description: this.form.description.value,
        providerName: this.provider.name,
        providerId: this.provider.id,
        url: ''
      };

      // mark as principal by default
      if (this.localFiles.length > 0) {
        const index = this.localFiles.findIndex(file => file.markAsPrincipal === true);
        if (index === -1) { this.localFiles[0].markAsPrincipal = true; }
      }

      // create category
      await this.categoryService.create(data).then(
        async (category) => {
          this.category = category;
        })
        .catch(error => {
          this.notification.ErrorMessage(error.message, '', 2500);
          this.loading = false;

          return;
        });

        this.uploadFiles();

    } else {
      this.msg = 'Category edited';

      // updated category attributes
      this.category.name = this.form.name.value;
      this.category.description = this.form.description.value;

      this.categoryService.update(this.category).then(() => {
        this.uploadFiles();
      })
      .catch(error => {
        this.notification.ErrorMessage(error.message, '', 2500);
        this.loading = false;

        return;
      });
    }
  }

  uploadFiles() {
    // filtering local files
    const filterFiles = this.localFiles.filter(file => file.file);

    // redirect to category workspace if not upload images
    if (filterFiles.length === 0) {
      this.redirectToCategoryWorkspace();
    } else {
      this.allPercentage = this.fileService.upload(filterFiles, this.category);
      // complete operation
      this.allPercentage.subscribe(progress => {
        if (progress === 100) {
          this.redirectToCategoryWorkspace();
        }
      });
    }
  }

  // receive files from gallery-component
  onSelectedFiles(files: FileInfo []) {
    this.localFiles = files.map(file => {
      file.modelType = 'categories';
      return file;
    });
  }
}
