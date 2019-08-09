import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../../shared/shared.module';
import { ViewsModule } from '../../admin/views/views.module';
import { MaterialModule } from '../../../material/material.module';
import { NavigationModule } from '../main-layout/navigation/navigation.module';

import { HomeAdminComponent } from './home-admin.component';
import { AdminHeaderComponent } from '../main-layout/admin-header/admin-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavigationModule,
    ViewsModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
    MDBBootstrapModule.forRoot(),
  ],
  declarations: [
    HomeAdminComponent,
    AdminHeaderComponent
  ],
  exports: [
    HomeAdminComponent,
    AdminHeaderComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class HomeAdminModule { }
