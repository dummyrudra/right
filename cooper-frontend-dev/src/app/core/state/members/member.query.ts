import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { Observable } from "rxjs";
import { projectMembersState, projectMembersStore} from "./member.store";


@Injectable({
    providedIn: 'root'
  })
export class projectMembersQuery extends Query<projectMembersState>{
  constructor(UserStore:projectMembersStore){
     super(UserStore);
  }


getOrgUser():Observable<[]>{
    return this.select(state=>state.projectMembers)
}
getLoaded():Observable<boolean>{
    return this.select(state=>state.isLoaded);
}
getIsLoading():Observable<boolean>{
    return this.selectLoading();
}
}
