import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MaterialModule } from '../../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import {
  HomeAdminWorkspaceComponent,
  UsersWorkspaceComponent,
  StatsCard1Component,
  ChartsComponent
} from './index';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule,
    MDBBootstrapModule.forRoot()
  ],
  declarations: [
    HomeAdminWorkspaceComponent,
    StatsCard1Component,
    ChartsComponent,
    UsersWorkspaceComponent
  ],
  exports: [
    HomeAdminWorkspaceComponent,
    StatsCard1Component,
    ChartsComponent,
    UsersWorkspaceComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ViewsModule { }
