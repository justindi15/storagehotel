import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectComponent } from './views/select/select.component';
import { BookComponent } from './views/book/book.component';
import { PaymentComponent } from './views/payment/payment.component';
import { ConfirmComponent } from './views/confirm/confirm.component';
import { LoginViewComponent } from './views/login-view/login-view.component';
import { RegisterViewComponent } from './views/register-view/register-view.component';


const routes: Routes = [
  { path: 'select', component: SelectComponent},
  { path: 'login', component: LoginViewComponent},
  { path: 'register', component: RegisterViewComponent},
  { path: 'book', component: BookComponent},
  { path: 'payment', component: PaymentComponent},
  { path: 'confirm', component: ConfirmComponent},
  { path: '', redirectTo: '/select',pathMatch:  'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
