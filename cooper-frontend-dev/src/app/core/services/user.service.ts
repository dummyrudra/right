import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError,of, catchError, BehaviorSubject, Observable } from 'rxjs';
import {map, tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  token=String(localStorage.getItem('token'))
  baseUrl=environment.apiHost;
  constructor(private http:HttpClient) { }


  updateUserById(id:any,data:any){
    return this.http.patch(`${this.baseUrl}api/v1/user/${id}`,data,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      catchError(this.handleError)
    );
   }

   updateProfileImageById(id:any,data:any){
    return this.http.patch(`${this.baseUrl}api/v1/user/avatar/${id}`,data,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      catchError(this.handleError)
    );
   }

   getUserById(id:any){
    return this.http.get(`${this.baseUrl}api/v1/user/${id}`,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      catchError(this.handleError)
    );
  }
   updatePassWord(id:any,data:any){
    return this.http.patch(`${this.baseUrl}api/v1/auth/change-password/${id}`,data,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      catchError(this.handleError)
    );
   }


   getUserById1(id:any):Observable<{}>{
     return this.http.get<{}>(`${this.baseUrl}api/v1/user/${id}`,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      map(res=>res),
     // catchError(this.handleError)
    );
   }

   private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
