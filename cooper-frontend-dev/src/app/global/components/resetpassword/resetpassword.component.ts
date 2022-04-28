import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { catchError, throwError } from 'rxjs';
import { NotifierService } from 'angular-notifier';
const helper = new JwtHelperService();
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
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
  form = new FormGroup({
    password: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{7,})$/)]),
    confirmPassword: new FormControl('',[Validators.required]),

  })
  constructor(private http:AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notify:NotifierService
    ) { }
  url = ''
  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe((res:any)=>{
      this.url = res.url
      try{
        helper.decodeToken(this.url)
      }
      catch(err:any){
        this.router.navigate(['/users/login'])
      }

    })
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
    if(value.match(/(?=.*[@$!%*?&])/)) this.passwordStatus.symbol = true
    if(value.length >= 7) this.passwordStatus.count = true
    console.log(this.passwordStatus)
  }
  checkPassword(){
    if(this.form.get('password')?.value !=this.form.get('confirmPassword')?.value) return this.form.get('confirmPassword')?.setErrors({matched:true})
    this.form.get('confirmPassword')?.setErrors(null)
  }

  onSubmit(){
    this.message = {
      showErrorMessage:'',
      successMessage:''
    }
    if(!this.form.valid) return
    this.http.passwordReset({password:this.form.get('password')?.value},this.url)
    .pipe(
      catchError((err) => {
        //Handle the error here
        if(err.error.status) this.notify.notify('error',err.error.message)
        this.notify.notify('error',err.error.message)
        return throwError(err);    //Rethrow it back to component
      })
    )
    .subscribe((res:any)=>{
      if(res){
        this.router.navigate(['/users/login'])
      }
    })
  }

}
