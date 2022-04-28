import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { throwError,of, catchError, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseURL:string = environment.apiHost 
  constructor(private http:HttpClient) { }

  public postTask(resource:any){
    return this.http.post(this.baseURL+'api/v1/task',resource,{headers:{
      'x-auth-token':String(localStorage.getItem('token'))
    }})
  }

 moveTaskToList(id:any,data:any){
    return this.http.patch(`${this.baseURL}api/v1/list/drag/${id}`,data,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      catchError(this.handleError)
    );
 }

 isTaskFlagged(id:any,data:any){
  return this.http.patch(`${this.baseURL}api/v1/task/${id}`,data,{
    headers: {
      'x-auth-token': String(localStorage.getItem('token'))
   }
  }).pipe(
    catchError(this.handleError)
  );
}



deleteTaskById(id:any){
  return this.http.delete(`${this.baseURL}api/v1/task/${id}`,{
    headers: {
      'x-auth-token': String(localStorage.getItem('token'))
   }
  }).pipe(
    catchError(this.handleError)
  );
}


 private handleError(error: HttpErrorResponse) {
  if (error.status === 0) {
    console.error('An error occurred:', error.error);
  } else {
    console.error(
      `Backend returned code ${error.status}, body was: `, error.error);
  }
  return throwError({status:`${error.status}`,msg:`${error.error.message}`});
}
}
