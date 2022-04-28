import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { Signup } from '../interfaces/signup';
// import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl2 = environment.apiHost+'api/v1/'
  baseUrl = environment.apiHost+'api/v1/auth/'
  payload$ = new BehaviorSubject({})
  currentUser$ = new BehaviorSubject({})
  constructor(private http: HttpClient) { }

  public signup(resource:Signup){
    return this.http.post(environment.apiHost+'api/v1/user/signup',resource)
  }
  public login(resource:any){
    return this.http.post(this.baseUrl+'login',resource)
  }
  public generateOtp(resource:any){
    return this.http.patch(this.baseUrl+'generate-otp',resource)
  }
  public verifyOtp(resource:any){
    return this.http.patch(this.baseUrl+'verify-otp',resource)
  }
  public passwordReset(resource:any,token:string){
    return this.http.patch(this.baseUrl+'reset-password/'+token,resource)
  }
  public loginWithGoogle(resource:any){
    return this.http.post(this.baseUrl+'login-google',resource)
  }
  public selectOrganisation(url:string,resource:any){
    return this.http.patch(this.baseUrl2+url,resource,{headers:{
      'x-auth-token':String(localStorage.getItem('token'))
    },observe:"response"})
  }
  public createOrganisation(url:string,resource:any){
    return this.http.post(this.baseUrl2+url,resource,{headers:{
      'x-auth-token':String(localStorage.getItem('token'))
    },observe:"response"})
  }
  public switchOrganisation(url:string,resource:any){
    return this.http.patch(this.baseUrl+url,resource,{headers:{
      'x-auth-token':String(localStorage.getItem('token'))
    },observe:"response"})
  }

  errorHandler(){

  }
}
