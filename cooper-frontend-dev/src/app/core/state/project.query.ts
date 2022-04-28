import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { Observable } from "rxjs";
import { projectState, projectStore} from "./project.store";


@Injectable({
    providedIn: 'root'
  })
export class projectQuery extends Query<projectState>{
  constructor(projectStore:projectStore){
     super(projectStore);
  }


getproject():Observable<[]>{
    return this.select(state=>state.projects)
}
getLoaded():Observable<boolean>{
    return this.select(state=>state.isLoaded);
}
getIsLoading():Observable<boolean>{
    return this.selectLoading();
}
}
