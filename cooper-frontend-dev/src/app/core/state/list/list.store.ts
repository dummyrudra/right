import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';



export interface listState{
  list:any,
  isLoaded:boolean
}


export const getInitialState=()=>{
    return{
        list:[],
        isLoaded:false,
    }
}

@Injectable({
    providedIn: 'root'
  })
@StoreConfig({name:'list'})
export class listStore extends Store<listState>{
    constructor(){
        super(getInitialState())
    }
}