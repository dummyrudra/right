import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalRoutingModule } from './global-routing.module';
import { LoginComponent } from './components/login/login.component';
import { GlobalComponent } from './global.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgetComponent } from './components/forget/forget.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NgOtpInputModule } from  'ng-otp-input';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { OrganisationComponent } from './components/organisation/organisation.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import {NotifierModule} from 'angular-notifier'
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    LoginComponent,
    GlobalComponent,
    SignupComponent,
    ForgetComponent,
    ResetpasswordComponent,
    OrganisationComponent
  ],
  imports: [
    CommonModule,
    GlobalRoutingModule,
    MatTooltipModule,
    NgOtpInputModule,
    SocialLoginModule, 
    NgSelectModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NotifierModule.withConfig({
      // Custom options in here
      position: {
        horizontal: {
          position: 'left',
          distance: 12,
        },
        vertical: {
          position: 'bottom',
          distance: 2,
          gap: 0,
        },
      },
    })
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '339713964407-65dl6mfb0veiro9dl7d4757gbfsk9e58.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('275598801362810')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
})
export class GlobalModule { }
