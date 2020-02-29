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
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatStepperModule} from '@angular/material/stepper';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './components/register/register.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { OrderCatalogComponent } from './components/order-catalog/order-catalog.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { LocationPickerComponent } from './components/location-picker/location-picker.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { SigninComponent } from './views/signin/signin.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ActivateComponent } from './views/activate/activate.component';
import { AuthGuardService } from './services/authguard/authguard.service';
import { StoredItemsComponent } from './components/stored-items/stored-items.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { RetrieveModalComponent } from './components/retrieve-modal/retrieve-modal.component';
import { CheckoutComponent } from './views/checkout/checkout.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { CustomItemComponent } from './components/custom-item/custom-item.component';
import { CreditcardComponent } from './components/creditcard/creditcard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    OrderSummaryComponent,
    OrderCatalogComponent,
    ProductItemComponent,
    LocationPickerComponent,
    TimePickerComponent,
    SigninComponent,
    DashboardComponent,
    ActivateComponent,
    StoredItemsComponent,
    AppointmentsComponent,
    RetrieveModalComponent,
    CheckoutComponent,
    AutofocusDirective,
    CustomItemComponent,
    CreditcardComponent,
  ],
  entryComponents: [
    RetrieveModalComponent,
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
    MatProgressSpinnerModule,
    GooglePlaceModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatStepperModule,
    MatNativeDateModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
