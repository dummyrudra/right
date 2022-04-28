import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UtilityService } from '../../../services/utility.service';
import { NotifierService } from 'angular-notifier';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpService } from '../../../services/http.service';

const helper = new JwtHelperService();
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message: any = {
    showErrorMessage: '',
    successMessage: ''
  }
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{7,})$/)]),
  })
  constructor(
    private http: AuthService,
    private authService: SocialAuthService,
    private router: Router,
    private util: UtilityService,
    private notify: NotifierService,
    private https: HttpService) { }



  ngOnInit(): void {
    this.http.payload$.subscribe((res: any) => {
      if (res) {
        this.form.get('email')?.setValue(res.email)
        this.message.successMessage = res.message
      }
    })
  }


  onSubmit() {
    if (!this.form.valid) return this.form.markAllAsTouched()
    this.message = {
      showErrorMessage: '',
      successMessage: ''
    }
    let temp = ''
    this.http.login(this.form.getRawValue())
      .pipe(
        catchError((err) => {
          //Handle the error here
          if (err.error.status) this.notify.notify('error', err.error.message)
          if (err.error.message == '\"Email Address\" must be a valid email') this.form.get('email')?.setErrors({ email: true })
          return throwError(err);    //Rethrow it back to component
        })
      )
      .subscribe((res: any) => {
        if (res) {
          localStorage.setItem('token', res.token)
          let payload = helper.decodeToken(res.token);
          // this.https.getData('user/'+payload._id)
          if (payload.organizationId) {
            localStorage.setItem('organisation', payload.organizationId);
            this.https.getData('organization/' + payload.organizationId)
              .subscribe((res: any) => {
                console.log(res)
                this.util.organisation$.next(res)
                const org = res.organizationName.split(' ')
                org.map((value: any) => {
                  temp += value
                })
                localStorage.setItem('org_name', temp)
              })
          }
          localStorage.setItem('id', payload._id);
          this.http.currentUser$.next(res);
          // .subscribe( (res:any)=>{
          // })
          this.notify.notify('success', 'Successfully logged In')
          setTimeout(() => {
            if(temp){
              this.router.navigate(['/'+String(localStorage.getItem('org_name'))+'/project-list'])
              this.util.refreshHeader$.next(true)}
            else {this.router.navigate(['users/choose-company'])}
            // if(temp) this.router.navigate(['/'+temp+'/project-list'])
          }, 1000)
        }
      })
  }


  async signInWithGoogle() {
    this.message = {
      showErrorMessage: '',
      successMessage: ''
    }
    let data: any = await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
    this.http.loginWithGoogle({ token_id: data?.idToken })
      .pipe(
        catchError((err) => {
          //Handle the error here
          if (err.error.status) this.notify.notify('error', err.error.message)
          throw Error(err);    //Rethrow it back to component
        })
      )
      .subscribe((res: any) => {
        let temp=""
        if (res) {
          localStorage.setItem('token', res.token)
          let payload = helper.decodeToken(res.token);
          if (payload.organizationId) {
            localStorage.setItem('organisation', payload.organizationId);
            this.https.getData('organization/' + payload.organizationId)
              .subscribe((res: any) => {
                this.util.organisation$.next(res)
                const org = res.organizationName.split(' ')
                org.map((value: any) => {
                  temp += value
                })
                localStorage.setItem('org_name', temp)
              })
          }
          localStorage.setItem('id', payload._id);
          this.http.currentUser$.next(res);
          this.notify.notify('success', 'Successfully logged In')
          setTimeout(() => {
            if(temp){
              this.router.navigate(['/'+String(localStorage.getItem('org_name'))+'/project-list'])
              this.util.refreshHeader$.next(true)}
            else {this.router.navigate(['users/choose-company'])}
          }, 1000)
        }
      })
  }
}

