import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { Observable } from "rxjs";
import { listState, listStore} from "./list.store";


@Injectable({
    providedIn: 'root'
  })
export class listQuery extends Query<listState>{
  constructor(ListStore:listStore){
     super(ListStore);
  }


getList():Observable<[]>{
    return this.select(state=>state.list)
}
getLoaded():Observable<boolean>{
    return this.select(state=>state.isLoaded);
}
getIsLoading():Observable<boolean>{
    return this.selectLoading();
}
}
