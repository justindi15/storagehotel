import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectComponent } from './views/select/select.component';
import { BookComponent } from './views/book/book.component';
import { CheckoutComponent } from './views/checkout/checkout.component';


const routes: Routes = [
  { path: 'select', component: SelectComponent},
  { path: 'book', component: BookComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: '', redirectTo: '/select',pathMatch:  'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
