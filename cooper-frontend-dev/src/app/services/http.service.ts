import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  baseUrl = environment.apiHost+'api/v1/'
  notify: any;
  constructor(private http:HttpClient) { }

  getData(url:string){
    return this.http.get(this.baseUrl+url,{headers:{
      'x-auth-token':String(localStorage.getItem('token'))
    }})
  }
  postData(url:string,payload:any){
    return this.http.post(this.baseUrl+url,payload,{headers:{
      'x-auth-token':String(localStorage.getItem('token'))
    }})
  }

  putData(url:string,payload:any){
    return this.http.put(this.baseUrl+url,payload,{headers:{
      'x-auth-token':String(localStorage.getItem('token'))
    }})
  }

  patchData(url:string,payload:any){
    return this.http.patch(this.baseUrl+url,payload,{headers:{
      'x-auth-token':String(localStorage.getItem('token')),
    }})
  }

  deleteData(url:string){
    return this.http.delete(this.baseUrl+url,{headers:{
      'x-auth-token':String(localStorage.getItem('token'))
    }})
  }


  public errorHandler(error: HttpErrorResponse){
    if(error.error.status =="401") this.notify.notify('error','UnAuthorize')
    else if(error.error.status =="404") this.notify.notify('error','Not Found')
    else if(error.error.status =="400") this.notify.notify('error','Bad request')
    return throwError(error);    //Rethrow it back to component
  }
}
