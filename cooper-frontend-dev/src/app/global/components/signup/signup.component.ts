import { Component, OnInit } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { Signup } from '../../interfaces/signup';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleLoginProvider,SocialAuthService } from 'angularx-social-login';  
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  form = new FormGroup({
    fullName: new FormControl('',Validators.required),
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#._-])([a-zA-Z0-9@$!%*?&#._-]{7,})$/)]),
    rePassword: new FormControl('',[Validators.required]),
    agree: new FormControl(null,[Validators.required]),
    
  })
  message:any = {
    showErrorMessage:'',
    successMessage:''
  }
  passwordStatus:any = {
    count:false,
    number:false,
    upercase:false,
    lowercase:false,
    symbol:false
  }
  constructor(
    private http:AuthService,
    private router:Router,
    private authService: SocialAuthService,
    private notify:NotifierService
    ) { }

  ngOnInit(): void {
    
  }
  checkPassword(){
    if(this.form.get('password')?.value !=this.form.get('rePassword')?.value) return this.form.get('rePassword')?.setErrors({matched:true})
    this.form.get('rePassword')?.setErrors(null)
  }

  validatePassword(){
    let value = this.form.get('password')?.value
    this.passwordStatus = {
      count:false,
      number:false,
      upercase:false,
      lowercase:false,
      symbol:false
    }
    if(value.match(/(?=.*[0-9])/)) this.passwordStatus.number = true
    if(value.match(/((?=.*[a-z]))/)) this.passwordStatus.lowercase = true
    if(value.match(/(?=.*[A-Z])/)) this.passwordStatus.uppercase = true
    if(value.match(/(?=.*[@$!%*?&#_.-])/)) this.passwordStatus.symbol = true
    if(value.length >= 7) this.passwordStatus.count = true
  }


  showToolPit(toolpit:any){
    if(this.form.get('agree')?.value) return toolpit.hide()
    toolpit.show()
  }
  async signInWithGoogle(){
    let data:any = await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
    console.log(data)
    this.form.get("fullName")?.setValue(data.name)
    this.form.get("email")?.setValue(data.email)
    this.form.get("password")?.setValue(data.authToken)
    this.form.get("rePassword")?.setValue(data.authToken)
    this.form.get("agree")?.setValue("true")
    console.log(this.form.get("password"))
    this.validatePassword()
    this.onSubmit()
  }


  onSubmit(){
    if(!this.form.get('agree')?.value) this.form.get('agree')?.setErrors({notAgree:true})
    if(!this.form.valid) return this.form.markAllAsTouched()
    this.message= {
      showErrorMessage:'',
      successMessage:''
    } 
    let signup:Signup = {
      fullName:this.form.get('fullName')?.value,
      email:this.form.get('email')?.value,
      password:this.form.get('password')?.value
    } 
    this.http.signup(signup)
    .pipe(
      catchError((err) => {
        //Handle the error here
        if(err.error.status) this.notify.notify('error',err.error.message);

        return throwError(err);    //Rethrow it back to component
      })
    )
    .subscribe((res:any)=>{
      if(res){
        this.router.navigate(['users/login'])
        this.notify.notify('success','Successfully registered');
        this.http.payload$.next({email:res.email})
      }
    })
  }

}
