/// <reference types="@types/googlemaps" />

import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, NgZone, Inject } from '@angular/core';
import { startWith, map } from 'rxjs/operators';

import { MapsAPILoader } from '@agm/core';
import { ProviderService, AuthService, NotificationService, FileService } from './../../../../../services';
import { Config } from '../../../../../infrastructure';
import { Address, Provider, FileInfo } from '../../../../../models';
import { Observable, interval } from 'rxjs';

@Component({
  selector: 'app-edit-provider-workspace',
  templateUrl: './edit-provider-workspace.component.html',
  styleUrls: ['./edit-provider-workspace.component.scss']
})
export class EditProviderWorkspaceComponent implements OnInit {
  editForm: FormGroup;
  public zoom: number;
  public provider: Provider;
  public address: Address;

  // HTML values
  @ViewChild('search', {static: false}) search: any;
  title: string;
  edit: boolean;
  test: string;

  localFiles: FileInfo [] = [];  // create mode
  serverFiles$: Observable<any>; // edit mode
  allPercentage: Observable<number>;
  observer$: Observable<any>;
  regEx: string = Config.regex[0];
  regEx1: string = Config.regex[1];
  userId: string;
  msg: string;
  nameError: string;
  addressError: string;
  mode: string;
  loading = false;
  state = 'waiting';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private readonly mapsAPILoader: MapsAPILoader,
    private readonly authService: AuthService,
    private readonly providerService: ProviderService,
    private readonly fileService: FileService,
    private readonly notification: NotificationService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.regEx)]
      )],
      address: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.regEx)]
      )],
      phone: ['', Validators.nullValidator],
      // schedule: ['', Validators.nullValidator],
      description: ['', Validators.nullValidator]
    });

    this.route.data.subscribe(data => {
      this.mode = data.mode;

      this.authService.isAdmin
        ? this.userId = this.route.snapshot.params['userId']
        : this.userId = this.authService.currentUserValue.uid;

      if (data.mode === 'create') {
        this.title = 'Create Provider';
        this.edit = false;

        // initialize observable with interval
        // to hide progress interface
        this.observer$ = interval(1);
        this.serverFiles$ = interval(1);

        // google maps values
        this.zoom = 4;
        this.address = {
          lat: 39.8282,
          lng: -98.5795,
          number: '',
          formattedAddress: ''
        };

        // set current position
        this.setCurrentPosition();

      } else {
        this.title = 'Edit Provider';
        this.edit = true;

        const providerId = this.route.snapshot.params['providerId'];
        // Images value
        this.serverFiles$ = this.fileService.getAllFilesInfoByModelId(providerId);

        this.observer$ = this.providerService.getProviderById(providerId);
        this.observer$.subscribe(
          provider => {
            this.provider = provider;
            this.state = 'finished';
            // google maps values
            this.address = this.provider.address;
            this.zoom = 12;
            // updated Form Control values
            this.editForm.patchValue({
              name: this.provider.name,
              address: this.provider.address.formattedAddress,
              phone: this.provider.phone,
              // schedule: this.provider.schedule,
              description: this.provider.description
            });
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
    ).subscribe(error => this.nameError = error);

    // validate Address
    this.form.address.valueChanges.pipe(
      startWith(''),
      map(() => {
        let error = '';
        if (this.form.address.hasError('required')) {
          error = 'address is required';
        }

        if (this.form.address.hasError('pattern')) {
          error = 'only letters and numbers are allowed';
        }

        return error;
      })
    ).subscribe(error => this.addressError = error);

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.search.nativeElement, {
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.address.formattedAddress = place.formatted_address;

          // verify result
          if (place.geometry === undefined || !place.geometry) {
            // reset formattedAddress
            this.address.formattedAddress = '';
            return;
          }

          // set latitude, longitude and zoom
          this.address.lat = place.geometry.location.lat();
          this.address.lng = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  get form() { return this.editForm.controls; }

  private setCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.address.lat = position.coords.latitude;
        this.address.lng = position.coords.longitude;
        this.zoom = 8;
      });
    }
  }

  redirectToHome() {
    this.ngZone.run(() => {
      this.router.navigate(['provider-dashboard/workspace/home']);
    });
  }

  redirectToProviderWorkspace() {
    this.notification.SuccessMessage(this.msg, '', 2500);

    this.ngZone.run(() => {
      this.router.navigate(['/provider-dashboard/workspace/providers']);
    });
  }

  cancel() {
    this.ngZone.run(() => {
      this.router.navigate(['/provider-dashboard/workspace/providers']);
    });
  }

  async editProvider() {
    this.loading = true;
    // Mark the control as dirty
    if (this.editForm.invalid) {
      this.form.name.markAsDirty();
      this.form.address.markAsDirty();
      this.loading = false;
      // scroll behavior
      if (this.form.name.errors || this.form.address.errors) {
        // TODO: implement page scroll
      }

      return;
    }

    // validate address
    if (this.address.formattedAddress === '' && this.form.address.value !== '') {
      this.notification.ErrorMessage(
        'select a valid address from the list.', '', 2500);

      this.loading = false;
      this.goToTop();

      return;
    }

    // create
    if (!this.edit) {
      this.msg = 'Provider created';
      const data: Provider = {
        name:  this.form.name.value,
        address: this.address,
        phone: this.form.phone.value,
        description: this.form.description.value,
        userId: this.authService.currentUserValue.uid,
        url: ''
      };

      // mark as principal by default
      if (this.localFiles.length > 0) {
        const index = this.localFiles.findIndex(file => file.markAsPrincipal === true);
        if (index === -1) { this.localFiles[0].markAsPrincipal = true; }
      }

      // create provider
      await this.providerService.create(data).then(
        async (provider) => {
          this.provider = provider;
        })
        .catch(error => {
          this.notification.ErrorMessage(error.message, '', 2500);
          this.loading = false;

          return;
        });

      this.uploadFiles();

    } else {
      this.msg = 'Provider edited';

      // updated provider attributes
      this.provider.name = this.form.name.value;
      this.provider.address = this.address;
      this.provider.phone = this.form.phone.value;
      // this.provider.schedule = this.form.schedule.value;
      this.provider.description = this.form.description.value;

      this.providerService.update(this.provider).then(() => {
        this.uploadFiles();
      })
      .catch(error => {
        this.notification.ErrorMessage(error.message, '', 2500);
        this.loading = false;

        return;
      });
    }
  }

  // scroll behavior
  goToTop() {
    
  }

  uploadFiles() {
    // filtering local files
    const filterFiles = this.localFiles.filter(file => file.file);

    // redirect to provider workspace if not upload images
    if (filterFiles.length === 0) {
      this.redirectToProviderWorkspace();
    } else {
      this.allPercentage = this.fileService.upload(filterFiles, this.provider);
      // complete operation
      this.allPercentage.subscribe(progress => {
        if (progress === 100) {
          this.redirectToProviderWorkspace();
        }
      });
    }
  }

  // receive files from gallery-component
  onSelectedFiles(files: FileInfo []) {
    this.localFiles = files.map(file => {
      file.modelType = 'providers';
      return file;
    });
  }
}
