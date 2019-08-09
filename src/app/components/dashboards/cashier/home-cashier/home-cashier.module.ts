import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../../shared/shared.module';
import { ViewsModule } from '../../cashier/views/views.module';
import { MaterialModule } from '../../../material/material.module';
import { NavigationModule } from '../main-layout/navigation/navigation.module';

import { HomeCashierComponent } from './home-cashier.component';
import { CashierHeaderComponent } from '../main-layout/cashier-header/cashier-header.component';

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
    HomeCashierComponent,
    CashierHeaderComponent
  ],
  exports: [
    HomeCashierComponent,
    CashierHeaderComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class HomeCashierModule { }
