import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError,of, catchError, BehaviorSubject, Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { ProjectList } from '../../Interface/project-list';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  organisationId = String(localStorage.getItem('organisation'))
  baseUrl=environment.apiHost;
  constructor(private http:HttpClient) { 

  }
public projectList$=new BehaviorSubject([]);
public TaskData$=new BehaviorSubject([]);
public currentProject$=new BehaviorSubject({});
public projectId$=new BehaviorSubject('');
public isLoading$=new BehaviorSubject(false);


  addNewProject(data:ProjectList){ 
    return this.http.post(`${this.baseUrl}api/v1/project`,data,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      map((response:any) => response),
      catchError(this.handleError)
    );
  }

  addNewList(id:any,data:any){ 
    return this.http.post(`${this.baseUrl}api/v1/list/${id}`,data,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      map((response:any) => response),
      catchError(this.handleError)
    );
  }

  addNewMembers(id:any,data:any){ 
    return this.http.patch(`${this.baseUrl}api/v1/project/add-members/${id}`,data,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      map((response:any) => response),
      catchError(this.handleError)
    );
  }
  removeMembersInProject(id:any,data:any){
    return this.http.patch(`${this.baseUrl}api/v1/project/remove-member/${id}`,data,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      catchError(this.handleError)
    );
  }

  addNewMembersInProject(id:any,data:any){ 
    return this.http.patch(`${this.baseUrl}api/v1/project/add-members/${id}`,data,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      map((response:any) => response),
      catchError(this.handleError)
    );
  }



  editListById(id:any,data:any){
    return this.http.patch(`${this.baseUrl}api/v1/list/${id}`,data,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      catchError(this.handleError)
    );
   }

getListOfProject(id:any){
  return this.http.get(`${this.baseUrl}api/v1/list/${id}`,{
    headers: {
      'x-auth-token': String(localStorage.getItem('token'))
   }
  }).pipe(
    catchError(this.handleError)
  );
}

getProject():Observable<[]>{
  let id="620b3072d2976226fdd6a81a"
  return this.http.get(`${this.baseUrl}api/v1/project/organization/${id}`,{
    headers: {
      'x-auth-token': String(localStorage.getItem('token'))
   }
  }).pipe(
    map((response:any) => response),
   // catchError(this.handleError)
  );
}





  getProjectOfCurrentUserByOragnization(){
    let id=String(localStorage.getItem('organisation'))
  //  console.log('org',id)
    return this.http.get(`${this.baseUrl}api/v1/project/organization/${id}`,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      catchError(this.handleError)
    );
  }

 getProjectByUserId(id:any){
  return this.http.get(`${this.baseUrl}api/v1/project/${id}`,{
    headers: {
      'x-auth-token': String(localStorage.getItem('token'))
   }
  }).pipe(
    catchError(this.handleError)
  );
 }

 deleteProject(id:any){
    return this.http.delete(`${this.baseUrl}api/v1/project/${id}`,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      catchError(this.handleError)
    );
 }
 deleteList(id:any){
  return this.http.delete(`${this.baseUrl}api/v1/list/${id}`,{
    headers: {
      'x-auth-token': String(localStorage.getItem('token'))
   }
  }).pipe(
    catchError(this.handleError)
  );
}

 editProjectByUserId(id:any,data:any){
  return this.http.put(`${this.baseUrl}api/v1/project/${id}`,data,{
    headers: {
      'x-auth-token': String(localStorage.getItem('token'))
   }
  }).pipe(
    catchError(this.handleError)
  );
 }

  getUser(){
    return this.http.get(`${this.baseUrl}api/v1/user`,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      catchError(this.handleError)
    );
  }


  getUserByOrg(){
    let id=String(localStorage.getItem('organisation'))
    return this.http.get(`${this.baseUrl}api/v1/user/organization/${id}`,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      catchError(this.handleError)
    );
  }


  getMembersByProjectId(id:any):Observable<[]>{
   
    return this.http.get(`${this.baseUrl}api/v1/project/${id}`,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      map((response:any) => response?.members),
      //catchError(this.handleError)
    );
  }


  getUserByOrg1():Observable<[]>{
    let id=String(localStorage.getItem('organisation'))
    return this.http.get(`${this.baseUrl}api/v1/user/organization/${id}`,{
      headers: {
        'x-auth-token': String(localStorage.getItem('token'))
     }
    }).pipe(
      map((response:any) => response),
      //catchError(this.handleError)
    );
  }




  getProjectListBySearch(searchItem:any){
    let id=this.organisationId
    let filters;
this.projectList$.subscribe((data)=>{
   filters=data.filter((u:any)=>u?.projectName.toLowerCase().includes(searchItem))
})
return filters;
    // return this.http.get(`${this.baseUrl}/api/v1/project/organization/${id}/?projectName=${searchItem}`,{
    //   headers: {
    //     'x-auth-token': this.token
    //  }
    // }).pipe(
    //   catchError(this.handleError)
    // );
  }



  getTaskBySummary(searchItem:any){
    let id=this.organisationId
    let filters;
    let arr:any=[];
    let d:any;
    if(searchItem!=''){
this.TaskData$.subscribe((data:any)=>{
   d=data.map((element:any) => {
    return {...element, tasks: element.tasks.filter((subElement:any) => subElement.summary.toLowerCase().match(searchItem?.trim()))}
  })
})

return d;
}
else{
 // console.log('else',this.TaskData$.getValue())
 // arr.push(this.TaskData$.getValue())
 let board:any=[];
 let res:any=this.TaskData$.getValue()
 
  return res;
}

  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      // console.error(
      //   `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError({status:`${error.status}`,msg:`${error.error.message}`});
  }
}
