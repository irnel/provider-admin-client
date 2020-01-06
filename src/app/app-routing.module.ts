import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DefaultComponent } from './components/default/default.component';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';
import { HomeProviderComponent } from './components/dashboards/provider/home-provider/home-provider.component';
import { HomeAdminComponent } from './components/dashboards/admin/home-admin/home-admin.component';
import { HomeCashierComponent } from './components/dashboards/cashier/home-cashier/home-cashier.component';

import {
  HomeAdminWorkspaceComponent,
  UsersWorkspaceComponent
} from './components/dashboards/admin/views';

import {
   HomeWorkspaceComponent,
   EditProviderWorkspaceComponent,
   EditProductWorkspaceComponent,
   EditCategoryWorkspaceComponent,
   EditCashierWorkspaceComponent,
   OrderWorkspaceComponent
} from './components/dashboards/provider/views';

import {
  ProviderWorkspaceComponent,
  ProviderDetailsWorkspaceComponent,
  CashierWorkspaceComponent,
  CategoryWorkspaceComponent,
  CategoryDetailsWorkspaceComponent,
  ProductWorkspaceComponent,
  ProductDetailsWorkspaceComponent,
  OrderDetailsWorkspaceComponent
} from './components/dashboards/shared';

import { HomeCashierWorkspaceComponent } from './components/dashboards/cashier/views';

import { AuthGuard, AccessGuard, SecureInnerPagesGuard } from './guards';

const routes: Routes = [
  // Auth routing
  { path: 'auth', canActivate: [SecureInnerPagesGuard], children: [
      { path: 'sign-in', component: LoginComponent },
      { path: 'register-user', component: RegisterComponent },
      { path: 'email/action', component: EmailConfirmationComponent },
    ]
  },

  { path: 'not-found', component: NotFoundComponent },
  { path: 'redirecting', component: DefaultComponent },

  // Admin Dashboard
  {
    path: 'admin-dashboard/workspace',
    component: HomeAdminComponent,
    canActivate: [AuthGuard, AccessGuard],
    data: { role: 'admin' },
    children: [
      { path: 'home', component: HomeAdminWorkspaceComponent },
      { path: 'users', component: UsersWorkspaceComponent },
      { path: 'users/:userId/providers', component: ProviderWorkspaceComponent },
      {
        path: 'users/:userId/providers/:providerId/details',
        component: ProviderDetailsWorkspaceComponent
      },
      {
        path: 'users/:userId/providers/:providerId/cashiers',
        component: CashierWorkspaceComponent
      },
      {
        path: 'users/:userId/providers/:providerId/categories',
        component: CategoryWorkspaceComponent
      },
      {
        path: 'users/:userId/providers/:providerId/categories/:catId/details',
        component: CategoryDetailsWorkspaceComponent
      },
      {
        path: 'users/:userId/providers/:providerId/categories/:catId/products',
        component: ProductWorkspaceComponent
      },
      {
        path: 'users/:userId/providers/:providerId/categories/:catId/products/:prodId/details',
        component: ProductDetailsWorkspaceComponent
      },
      {
        path: 'users/:userId/providers/:providerId/orders',
        component: OrderWorkspaceComponent
      },
      {
        path: 'users/:userId/providers/:providerId/orders/:orderId/date/:day/:month/:year/details',
        component: OrderDetailsWorkspaceComponent
      },

      // redirect to workspace home by default
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // Provider Dashboard
  {
    path: 'provider-dashboard/workspace',
    component: HomeProviderComponent,
    canActivate: [AuthGuard, AccessGuard],
    data: { role: 'provider' },
    children: [
      { path: 'home', component: HomeWorkspaceComponent },
      { path: 'providers', component: ProviderWorkspaceComponent },
      {
        path: 'providers/create',
        component: EditProviderWorkspaceComponent, data: { mode: 'create' }
      },
      {
        path: 'providers/:providerId/edit',
        component: EditProviderWorkspaceComponent, data: { mode: 'edit'}
      },
      {
        path: 'providers/:providerId/details',
        component: ProviderDetailsWorkspaceComponent
      },
      { path: 'providers/:providerId/categories', component: CategoryWorkspaceComponent },
      {
        path: 'providers/:providerId/categories/create',
        component: EditCategoryWorkspaceComponent, data: { mode: 'create'}
      },
      {
        path: 'providers/:providerId/categories/:catId/edit',
        component: EditCategoryWorkspaceComponent, data: {mode: 'edit'}
      },
      {
        path: 'providers/:providerId/categories/:catId/details',
        component: CategoryDetailsWorkspaceComponent
      },
      { path: 'providers/:providerId/cashiers', component: CashierWorkspaceComponent },
      {
        path: 'providers/:providerId/cashiers/create',
        component: EditCashierWorkspaceComponent, data: {mode: 'create'}
      },
      {
        path: 'providers/:providerId/cashiers/:cashierId/edit',
        component: EditCashierWorkspaceComponent, data: {mode: 'edit'}
      },
      {
        path: 'providers/:providerId/categories/:catId/products',
        component: ProductWorkspaceComponent
      },
      {
        path: 'providers/:providerId/categories/:catId/products/create',
        component: EditProductWorkspaceComponent, data: {mode: 'create'}
      },
      {
        path: 'providers/:providerId/categories/:catId/products/:prodId/edit',
        component: EditProductWorkspaceComponent, data: { mode: 'edit' }
      },
      {
        path: 'providers/:providerId/categories/:catId/products/:prodId/details',
        component: ProductDetailsWorkspaceComponent
      },
      {
        path: 'providers/:providerId/orders',
        component: OrderWorkspaceComponent
      },
      {
        path: 'providers/:providerId/orders/:orderId/date/:day/:month/:year/details',
        component: OrderDetailsWorkspaceComponent
      },

      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // Cashier Dashboard
  {
    path: 'cashier-dashboard/workspace',
    component: HomeCashierComponent,
    canActivate: [AuthGuard, AccessGuard],
    data: { role: 'cashier' },
    children: [
      { path: 'home', component: HomeCashierWorkspaceComponent },
      {
        path: 'cashiers/:cashierId/providers/:providerId/orders/:orderId/date/:day/:month/:year/details',
        component: OrderDetailsWorkspaceComponent
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  },

  //  Default redirect
  { path: '', redirectTo: 'redirecting', pathMatch: 'full' },

  // otherwise NOT FOUND
  { path: '**', redirectTo: 'not-found' }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
