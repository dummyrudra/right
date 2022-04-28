import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { Observable } from "rxjs";
import { userState, userStore} from "./store";


@Injectable({
    providedIn: 'root'
  })
export class userQuery extends Query<userState>{
  constructor(UserStore:userStore){
     super(UserStore);
  }


getUser():Observable<{}>{
    return this.select(state=>state.user)
}
getLoaded():Observable<boolean>{
    return this.select(state=>state.isLoaded);
}
getIsLoading():Observable<boolean>{
    return this.selectLoading();
}
}
