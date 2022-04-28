import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { GlobalComponent } from './global.component';
import { ForgetComponent } from './components/forget/forget.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { OrganisationComponent } from './components/organisation/organisation.component';

const globalRoutes: Routes = [
  {
    path: 'users',
    component: GlobalComponent,
    children: [
      {
        path: 'login', component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'forgot',
        component: ForgetComponent
      },
      {
        path: 'reset-password/:url',
        component: ResetpasswordComponent,
      },
      {
        path: 'choose-company',
        component: OrganisationComponent,
      },
    ],
  },
  // {
  //   path:"**",
  //   redirectTo:'users/login',
  //   pathMatch:'full',
  // }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(globalRoutes)
  ],
  exports: [RouterModule]
})
export class GlobalRoutingModule { }


