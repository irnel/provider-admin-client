import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { NavigationModule } from '../provider/main-layout/navigation/navigation.module';
import { MaterialModule } from './../../material/material.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import {
  FooterComponent,
  LayoutComponent,
  CircleProgressComponent,
  ProviderWorkspaceComponent,
  ProviderDetailsWorkspaceComponent,
  CashierWorkspaceComponent,
  CategoryWorkspaceComponent,
  CategoryDetailsWorkspaceComponent,
  ProductWorkspaceComponent,
  ProductDetailsWorkspaceComponent,
  OrderDetailsWorkspaceComponent
} from './index';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavigationModule,
    MaterialModule,
    MDBBootstrapModule.forRoot(),
  ],
  declarations: [
    LayoutComponent,
    FooterComponent,
    CircleProgressComponent,
    ProviderWorkspaceComponent,
    ProviderDetailsWorkspaceComponent,
    CashierWorkspaceComponent,
    CategoryWorkspaceComponent,
    CategoryDetailsWorkspaceComponent,
    ProductWorkspaceComponent,
    ProductDetailsWorkspaceComponent,
    OrderDetailsWorkspaceComponent
  ],
  exports: [
    LayoutComponent,
    FooterComponent,
    CircleProgressComponent,
    ProviderWorkspaceComponent,
    CashierWorkspaceComponent,
    CategoryWorkspaceComponent,
    CategoryDetailsWorkspaceComponent,
    ProductWorkspaceComponent,
    ProductDetailsWorkspaceComponent,
    OrderDetailsWorkspaceComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SharedModule { }
