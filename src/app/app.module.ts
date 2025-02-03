import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

import { RouterModule,Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { OrderListComponent } from './order-list/order-list.component';
import { PaymentComponent } from './payment/payment.component';
import { TableManagementComponent } from './table-management/table-management.component';
import { MenuComponent } from './menu/menu.component';
import { QRCodeModule } from 'angularx-qrcode';
import { CustomerMenusComponent } from './customer-menus/customer-menus.component';
const routes: Routes = [
  
  { path: '', component: RegisterComponent },
  // { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent, children: [
    { path: 'order-list', component: OrderListComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'table-management', component: TableManagementComponent },
  { path: 'menu', component: MenuComponent }
  ]},
  { path: 'customer-menus', component: CustomerMenusComponent },
  
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
    CustomerMenusComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(routes),
    QRCodeModule


    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
