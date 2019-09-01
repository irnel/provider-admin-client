/// <reference types="@types/googlemaps" />

import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, NgZone, Inject } from '@angular/core';
import { startWith, map } from 'rxjs/operators';

import { MapsAPILoader } from '@agm/core';
import { Observable, interval } from 'rxjs';
import { ProviderService, AuthService, NotificationService, FileService } from './../../../../../services';
import { Config } from '../../../../../infrastructure';
import { DayOfWeek } from '../../../../../helpers';
import { Address, Provider, FileInfo, Schedule } from '../../../../../models';


@Component({
  selector: 'app-edit-provider-workspace',
  templateUrl: './edit-provider-workspace.component.html',
  styleUrls: ['./edit-provider-workspace.component.scss']
})
export class EditProviderWorkspaceComponent implements OnInit {
  editForm: FormGroup;
  zoom: number;
  provider: Provider;
  address: Address;
  availableHours: Schedule[] = [];

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

  // Time Values
  mondayOtValue: any;
  mondayCtValue: any;
  tuesdayOtValue: any;
  tuesdayCtValue: any;
  wednesdayOtValue: any;
  wednesdayCtValue: any;
  thursdayOtValue: any;
  thursdayCtValue: any;
  fridayOtValue: any;
  fridayCtValue: any;
  saturdayOtValue: any;
  saturdayCtValue: any;
  sundayOtValue: any;
  sundayCtValue: any;

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
      mondayOT: ['', Validators.nullValidator],
      mondayCT: ['', Validators.nullValidator],
      tuesdayOT: ['', Validators.nullValidator],
      tuesdayCT: ['', Validators.nullValidator],
      wednesdayOT: ['', Validators.nullValidator],
      wednesdayCT: ['', Validators.nullValidator],
      thursdayOT: ['', Validators.nullValidator],
      thursdayCT: ['', Validators.nullValidator],
      fridayOT: ['', Validators.nullValidator],
      fridayCT: ['', Validators.nullValidator],
      saturdayOT: ['', Validators.nullValidator],
      saturdayCT: ['', Validators.nullValidator],
      sundayOT: ['', Validators.nullValidator],
      sundayCT: ['', Validators.nullValidator],
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

            // time values
            this.provider.availableHours.forEach(schedule => {
              switch (schedule.dayOfWeek) {
                case DayOfWeek.Monday:
                  this.mondayOtValue = schedule.opening;
                  this.mondayCtValue = schedule.closing;
                  break;

                case DayOfWeek.Tuesday:
                    this.tuesdayOtValue = schedule.opening;
                    this.tuesdayCtValue = schedule.closing;
                    break;

                case DayOfWeek.Wednesday:
                    this.wednesdayOtValue = schedule.opening;
                    this.wednesdayCtValue = schedule.closing;
                    break;

                case DayOfWeek.Thursday:
                    this.thursdayOtValue = schedule.opening;
                    this.thursdayCtValue = schedule.closing;
                    break;

                case DayOfWeek.Friday:
                    this.fridayOtValue = schedule.opening;
                    this.fridayCtValue = schedule.closing;
                    break;

                case DayOfWeek.Saturday:
                    this.saturdayOtValue = schedule.opening;
                    this.saturdayCtValue = schedule.closing;
                    break;

                case DayOfWeek.Sunday:
                    this.sundayOtValue = schedule.opening;
                    this.sundayCtValue = schedule.closing;
                    break;

                default:
                  break;
              }
            });

            // updated Form Control values
            this.editForm.patchValue({
              name: this.provider.name,
              address: this.provider.address.formattedAddress,
              phone: this.provider.phone,
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
      this.notification.ErrorMessage('select a valid address from the list.', '');
      this.loading = false;
      this.goToTop();

      return;
    }

    // Validate Schedule
    this.setAvailableHours();
    if (this.availableHours.length === 0) {
      this.notification.ErrorMessage('You must select at least one day of the week', '');
      this.loading = false;
    }

    // create
    if (!this.edit) {
      this.msg = 'Provider created';
      const data: Provider = {
        name:  this.form.name.value,
        address: this.address,
        phone: this.form.phone.value,
        availableHours: this.availableHours,
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
          this.notification.ErrorMessage(error.message, '');
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
      this.provider.availableHours = this.availableHours;
      this.provider.description = this.form.description.value;

      this.providerService.update(this.provider).then(() => {
        this.uploadFiles();
      })
      .catch(error => {
        this.notification.ErrorMessage(error.message, '');
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

  setAvailableHours() {
    // Monday
    if (this.form.mondayOT.value !== null &&  this.form.mondayCT.value !== null) {
      this.availableHours.push({
        dayOfWeek: DayOfWeek.Monday,
        opening: this.form.mondayOT.value,
        closing: this.form.mondayCT.value,
      });
    }

    // Tuesday
    if (this.form.tuesdayOT.value !== null &&  this.form.tuesdayCT.value !== null) {
      this.availableHours.push({
        dayOfWeek: DayOfWeek.Tuesday,
        opening: this.form.tuesdayOT.value,
        closing: this.form.tuesdayCT.value,
      });
    }

    // Wednesday
    if (this.form.wednesdayOT.value !== null &&  this.form.wednesdayCT.value !== null) {
      this.availableHours.push({
        dayOfWeek: DayOfWeek.Wednesday,
        opening: this.form.wednesdayOT.value,
        closing: this.form.wednesdayCT.value
      });
    }

    // Thursday
    if (this.form.thursdayOT.value !== null &&  this.form.thursdayCT.value !== null) {
      this.availableHours.push({
        dayOfWeek: DayOfWeek.Thursday,
        opening: this.form.thursdayOT.value,
        closing: this.form.thursdayCT.value
      });
    }

    // Friday
    if (this.form.fridayOT.value !== null &&  this.form.fridayCT.value !== null) {
      this.availableHours.push({
        dayOfWeek: DayOfWeek.Friday,
        opening: this.form.fridayOT.value,
        closing: this.form.fridayCT.value
      });
    }

    // Saturday
    if (this.form.saturdayOT.value !== null &&  this.form.saturdayCT.value !== null) {
      this.availableHours.push({
        dayOfWeek: DayOfWeek.Saturday,
        opening: this.form.saturdayOT.value,
        closing: this.form.saturdayCT.value
      });
    }

    // Sunday
    if (this.form.sundayOT.value !== null &&  this.form.sundayCT.value !== null) {
      this.availableHours.push({
        dayOfWeek: DayOfWeek.Sunday,
        opening: this.form.sundayOT.value,
        closing: this.form.sundayCT.value
      });
    }
  }
}
