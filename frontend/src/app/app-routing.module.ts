import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectComponent } from './views/select/select.component';
import { BookComponent } from './views/book/book.component';
import { CheckoutComponent } from './views/checkout/checkout.component';
import { SigninComponent } from './views/signin/signin.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ActivateComponent } from './views/activate/activate.component';
import { AuthGuardService } from './services/authguard/authguard.service';


const routes: Routes = [
  { path: 'select', component: SelectComponent},
  { path: 'book', component: BookComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'activate/:email/:token', component: ActivateComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  { path: '', redirectTo: '/select',pathMatch:  'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
