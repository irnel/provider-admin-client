import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith, map, tap } from 'rxjs/operators';

import { Config } from './../../../../../infrastructure';
import { Product, Category, FileInfo } from '../../../../../models';
import { CategoryService, ProductService, NotificationService } from '../../../../../services';
import { Observable, interval } from 'rxjs';
import { FileService } from '../../../../../services/file/file.service';

@Component({
  selector: 'app-edit-product-workspace',
  templateUrl: './edit-product-workspace.component.html',
  styleUrls: ['./edit-product-workspace.component.scss']
})
export class EditProductWorkspaceComponent implements OnInit {
  editForm: FormGroup;
  title: string;
  msg: string;

  regEx = Config.regex[0];
  regEx1 = Config.regex[1];
  regEx2 = Config.regex[2];
  edit: boolean;
  nameError: string;
  priceError: string;

  localFiles: FileInfo [] = [];  // create mode
  serverFiles$: Observable<any>; // edit mode
  allPercentage: Observable<number>;
  observer$: Observable<any>;
  product: Product;
  category: Category;
  providerId: string;
  categoryId: string;
  mode: string;
  loading = false;
  state = 'waiting';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly notification: NotificationService,
    private readonly fileService: FileService
  ) {}

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.regEx)]
      )],
      price: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.regEx2)]
      )],
      description: ['', Validators.nullValidator]
    });

    // Change Form values
    this.route.data.subscribe(data => {
      this.providerId = this.route.snapshot.params['providerId'];
      this.categoryId = this.route.snapshot.params['catId'];
      this.mode = data.mode;

      if (data.mode === 'create') {
        this.edit = false;
        this.title = 'Create Product';

        // initialize observable with interval
        this.serverFiles$ = interval(1);
        this.observer$ = this.categoryService.getCategoryData(this.providerId, this.categoryId);
        this.observer$.subscribe(
          category => {
            this.category = category;
            this.state = 'finished';
          },
          error => {
            this.state = 'failed';
            this.notification.ErrorMessage(error.message, '', 2500);
          }
        );

      } else {
        this.edit = true;
        this.title = 'Edit Product';

        const productId = this.route.snapshot.params['prodId'];
        this.categoryService.getCategoryData(this.providerId, this.categoryId).subscribe(
          category => this.category = category
        );

        this.observer$ = this.productService.getProductData(this.providerId, this.categoryId, productId);
        this.observer$.subscribe(
          product => {
            this.product = product;
            this.editForm.patchValue(product);
            this.state = 'finished';
          },
          error => {
            this.state = 'failed';
            this.notification.ErrorMessage(error.message, '', 2500);
          }
        );

        // Images value
        this.serverFiles$ = this.fileService.getAllFilesInfoByModelId(productId);
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
    ).subscribe(error => this.nameError = error);

    // validate price
    this.form.price.valueChanges.pipe(
      startWith(''),
      map(() => {
        let error = '';
        if (this.form.price.hasError('required')) {
          error = 'price is required';
        }

        if (this.form.price.hasError('pattern')) {
          error = 'invalid number format';
        }

        return error;
      })
    ).subscribe(error => this.priceError = error);

  }

  get form() { return this.editForm.controls; }

  redirectToHome() {
    this.ngZone.run(() => {
      this.router.navigate(['provider-dashboard/workspace/home']);
    });
  }

  redirectToProviderWorkspace() {
    this.ngZone.run(() => {
      this.router.navigate([`provider-dashboard/workspace/providers`]);
    });
  }

  redirectToCategoryWorkspace() {
    this.ngZone.run(() => {
      this.router.navigate([
        `provider-dashboard/workspace/providers/${this.providerId}/categories`
      ]);
    });
  }

  redirectToProductWorkSpace() {
    this.notification.SuccessMessage(this.msg, '', 2500);

    this.ngZone.run(() => {
      this.router.navigate([
        `provider-dashboard/workspace/providers/` +
        `${this.providerId}/categories/${this.categoryId}/products`
      ]);
    });
  }

  cancel() {
    this.ngZone.run(() => {
      this.router.navigate([
        `provider-dashboard/workspace/providers/` +
        `${this.providerId}/categories/${this.categoryId}/products`
      ]);
    });
  }

  async editProduct() {
    this.loading = true;
    // Mark the control as dirty
    if (this.editForm.invalid) {
      this.form.name.markAsDirty();
      this.form.price.markAsDirty();

      this.loading = false;

      return;
    }

    if (!this.edit) {
      this.msg = 'New product created';

      const data: Product = {
        name: this.form.name.value,
        price: this.form.price.value,
        description: this.form.description.value,
        categoryName: this.category.name,
        providerName: this.category.providerName,
        categoryId: this.category.id,
        providerId: this.category.providerId,
        url: ''
      };

      // mark as principal by default
      if (this.localFiles.length > 0) {
        const index = this.localFiles.findIndex(file => file.markAsPrincipal === true);
        if (index === -1) { this.localFiles[0].markAsPrincipal = true; }
      }

      // create product
      await this.productService.create(data).then(async product => {
        this.product = product;
      }).catch(error => {
        this.notification.ErrorMessage(error.message, '', 2500);
        this.loading = false;

        return;
      });

      this.uploadFiles();

    } else {
      this.msg = 'product edited';

      this.product.name = this.form.name.value;
      this.product.price = this.form.price.value;
      this.product.description = this.form.description.value;

      this.productService.update(this.product).then(() => {
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

    // redirect to provider workspace if not upload images
    if (filterFiles.length === 0) {
      this.redirectToProductWorkSpace();
    } else {
      this.allPercentage = this.fileService.upload(filterFiles, this.product);
      // complete operation
      this.allPercentage.subscribe(progress => {
        if (progress === 100) {
          this.redirectToProductWorkSpace();
        }
      });
    }
  }

  // receive files from gallery-component
  onSelectedFiles(files: FileInfo []) {
    this.localFiles = files.map(file => {
      file.modelType = 'products';
      return file;
    });
  }
}
