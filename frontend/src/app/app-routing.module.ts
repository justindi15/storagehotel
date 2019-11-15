import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectComponent } from './views/select/select.component';
import { BookComponent } from './views/book/book.component';
import { PaymentComponent } from './views/payment/payment.component';
import { ConfirmComponent } from './views/confirm/confirm.component';


const routes: Routes = [
  { path: 'select', component: SelectComponent},
  { path: 'book', component: BookComponent},
  { path: 'payment', component: PaymentComponent},
  { path: 'confirm', component: ConfirmComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
