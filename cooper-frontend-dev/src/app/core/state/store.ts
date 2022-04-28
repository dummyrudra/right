import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';



export interface userState{
  user:{},
  isLoaded:boolean
}


export const getInitialState=()=>{
    return{
        user:{},
        isLoaded:false,
    }
}

@Injectable({
    providedIn: 'root'
  })
@StoreConfig({name:'user'})
export class userStore extends Store<userState>{
    constructor(){
        super(getInitialState())
    }
}