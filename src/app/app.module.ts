import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { OrderListComponent } from './order-list/order-list.component';
import { PaymentComponent } from './payment/payment.component';
import { TableManagementComponent } from './table-management/table-management.component';
import { MenuComponent } from './menu/menu.component';
import { QRCodeModule } from 'angularx-qrcode';
import { CustomerMenusComponent } from './customer-menus/customer-menus.component';
import { FoodListComponent } from './food-list/food-list.component';
import { CartComponent } from './cart/cart.component';
import { ListsComponent } from './lists/lists.component';
import { InfoComponent } from './info/info.component';
import { PayforComponent } from './payfor/payfor.component';
import { BillComponent } from './bill/bill.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddkitchenComponent } from './addkitchen/addkitchen.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth.interceptor';

const routes: Routes = [
  { path: '', component: RegisterComponent },
  // { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'main', component: MainComponent, children: [
      { path: 'order-list', component: OrderListComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'table-management', component: TableManagementComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'info', component: InfoComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'addkitchen', component: AddkitchenComponent }
    ]
  },
  {
    path: 'customer/:store/:table', component: CustomerMenusComponent, pathMatch: 'prefix', children: [
      { path: 'food', component: FoodListComponent },
      { path: 'cart', component: CartComponent },
      { path: 'list', component: ListsComponent },
      { path: 'payfor', component: PayforComponent },
      { path: 'bill', component: BillComponent }
    ]
  },

];


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    MainComponent,
    OrderListComponent,
    PaymentComponent,
    TableManagementComponent,
    MenuComponent,
    CustomerMenusComponent,
    FoodListComponent,
    CartComponent,
    ListsComponent,
    InfoComponent,
    PayforComponent,
    BillComponent,
    DashboardComponent,
    AddkitchenComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(routes),
    QRCodeModule,
    ReactiveFormsModule



  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
