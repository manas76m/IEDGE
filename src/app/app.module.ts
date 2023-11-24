import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SafePipe } from './safe.pipe';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { LOAD_WASM, NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';



import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { SalesummeryComponent } from './salesummery/salesummery.component';
import { StoclkistComponent } from './stoclkist/stoclkist.component';
import { StaffmgntComponent } from './staffmgnt/staffmgnt.component';
import { HomeComponent } from './home/home.component';
import { ForgotpassComponent } from './forgotpass/forgotpass.component';
import { TechsupportComponent } from './techsupport/techsupport.component';
import { CartComponent } from './cart/cart.component';
import { CartBucketComponent } from './cart-bucket/cart-bucket.component';
import { SessionCartComponent } from './session-cart/session-cart.component';
import { StocksummeryComponent } from './stocksummery/stocksummery.component';
import { ItemsummeryComponent } from './itemsummery/itemsummery.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgIf, JsonPipe} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';

LOAD_WASM().subscribe((res: any) => {
  console.log('LOAD_WASM',res)
})

const routes: Routes = [ 
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent,data: {animation: 'login'}  }, 
  { path: 'Registration', component: RegistrationComponent,data: {animation: 'Registration'} }, // About page route 
  { path: 'Salesummery', component: SalesummeryComponent,canActivate: [AuthGuard]}, // About page route 
  { path: 'Stoclist', component: StoclkistComponent,canActivate: [AuthGuard]},
  { path: 'stocksummery', component: StocksummeryComponent,canActivate: [AuthGuard]},
  { path: 'itemsummery', component: ItemsummeryComponent,canActivate: [AuthGuard]},
  { path: 'Staffmgnt', component: StaffmgntComponent,canActivate: [AuthGuard] },
  { path: 'Home', component: HomeComponent,canActivate: [AuthGuard] },
  { path: 'ses-cart', component: SessionCartComponent,canActivate: [AuthGuard] },
  { path: 'Forgotpass', component: ForgotpassComponent,data: {animation: 'Forgotpass'} },
  { path: 'Techsupport', component: TechsupportComponent },
  { path: 'cart', component: CartComponent,canActivate: [AuthGuard] },
]; 

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    LoginComponent,
    RegistrationComponent,
    SalesummeryComponent,
    StoclkistComponent,
    StaffmgntComponent,
    ForgotpassComponent,
    TechsupportComponent,
    CartComponent,
    CartBucketComponent,
    SessionCartComponent,
    StocksummeryComponent,
    ItemsummeryComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxScannerQrcodeModule,
    HttpClientModule,
    RouterModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    MatNativeDateModule,
    RouterModule.forRoot(routes)
  ],
  providers: [{provide : LocationStrategy , useClass: HashLocationStrategy},{
    provide : HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi   : true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
