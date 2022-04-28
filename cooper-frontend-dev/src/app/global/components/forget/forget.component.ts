import { Component, ElementRef, OnInit, ViewChild, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {
  @ViewChild('one')one:ElementRef<any> | null | undefined
  @ViewChild('two')two:ElementRef<any> | null | undefined
  @ViewChild('three')three:ElementRef<any> | null | undefined
  @ViewChild('four')four:ElementRef<any> | null | undefined
  message= {
    showErrorMessage:'',
    successMessage:''
  }
  otpMessage={
    showErrorMessage:'',
    successMessage:''
  }
  isEmailSubmit = false
  form = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
  })
  constructor(private http:AuthService,private router:Router,private notify:NotifierService) { }

  ngOnInit(): void {
  }

  OnChanges(value:any){
    if(value.name=='one' && value.value) return this.two?.nativeElement.focus()
    if(value.name=='two' && value.value) return this.three?.nativeElement.focus()
    if(value.name=='three' && value.value) return this.four?.nativeElement.focus()
    if(value.name=='four' && value.value=='') return this.three?.nativeElement.focus()
    if(value.name=='three' && value.value=='') return this.two?.nativeElement.focus()
    if(value.name=='two' && value.value=='') return this.one?.nativeElement.focus()
  }


  onSubmitEmail(){
    this.message= {
      showErrorMessage:'',
      successMessage:''
    } 
    this.http.generateOtp({email:this.form.get('email')?.value})
    .pipe(
      catchError((err) => {
        //Handle the error here
        if(err.error.status) this.notify.notify('error',err.error.message)

        return throwError(err);    //Rethrow it back to component
      })
    )
    .subscribe((res:any)=>{
      if(res){
        console.log(res)
        this.isEmailSubmit = true
        this.message.successMessage = res.message
      }
    })
  }
  onSubmitOTP(){
    this.otpMessage={
      showErrorMessage:'',
      successMessage:''
    }
    let otp = this.one?.nativeElement.value+this.two?.nativeElement.value+this.three?.nativeElement.value+this.four?.nativeElement.value
    if(otp.length!=4) return console.log("invalid otp")
    console.log(otp)
    this.http.verifyOtp({email:this.form.get('email')?.value,otp:otp})
    .pipe(
      catchError((err) => {
        //Handle the error here
        if(err.error.status) this.notify.notify('error',err.error.message)

        return throwError(err);    //Rethrow it back to component
      })
    )
    .subscribe((res:any)=>{
      if(res){
        this.isEmailSubmit = true
        this.otpMessage.successMessage = res.message
        this.router.navigate(['/users/reset-password/'+res.url])
      }
    })
  }

}
