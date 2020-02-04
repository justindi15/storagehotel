import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { SelectComponent } from './views/select/select.component';
import { BookComponent } from './views/book/book.component';
import { CheckoutComponent } from './views/checkout/checkout.component';
import { OrderCatalogComponent } from './components/order-catalog/order-catalog.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { LocationPickerComponent } from './components/location-picker/location-picker.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { SigninComponent } from './views/signin/signin.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ActivateComponent } from './views/activate/activate.component';
import { AuthGuardService } from './services/authguard/authguard.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    SelectComponent,
    BookComponent,
    CheckoutComponent,
    OrderCatalogComponent,
    ProductItemComponent,
    LocationPickerComponent,
    TimePickerComponent,
    SigninComponent,
    DashboardComponent,
    ActivateComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    GooglePlaceModule,
    MatSnackBarModule,
    MatTabsModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
