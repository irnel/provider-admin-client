import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MaterialModule } from './../../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AgmCoreModule } from '@agm/core';


import {
  StatsCardComponent,
  StatsCard1Component,
  ChartsComponent,
  BasicTableComponent,
  HomeWorkspaceComponent,
  OrderWorkspaceComponent,
  EditProviderWorkspaceComponent,
  EditCategoryWorkspaceComponent,
  EditProductWorkspaceComponent,
  EditCashierWorkspaceComponent,
  GalleryComponent
} from './index';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    NgxMaterialTimepickerModule,
    MDBBootstrapModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD_TkIqjNZTh2o0KmV10tQ7G1tIPCrdEU4'
    })
  ],
  declarations: [
    StatsCardComponent,
    StatsCard1Component,
    ChartsComponent,
    BasicTableComponent,
    HomeWorkspaceComponent,
    OrderWorkspaceComponent,
    EditProviderWorkspaceComponent,
    EditCategoryWorkspaceComponent,
    EditProductWorkspaceComponent,
    EditCashierWorkspaceComponent,
    GalleryComponent
  ],
  exports: [
    StatsCardComponent,
    StatsCard1Component,
    ChartsComponent,
    BasicTableComponent,
    HomeWorkspaceComponent,
    OrderWorkspaceComponent,
    EditProviderWorkspaceComponent,
    EditProductWorkspaceComponent,
    EditCashierWorkspaceComponent,
    GalleryComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ViewsModule { }
