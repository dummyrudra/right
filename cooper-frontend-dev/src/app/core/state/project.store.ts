import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';



export interface projectState{
  projects:any,
  isLoaded:boolean
}


export const getInitialStateOfProject=()=>{
    return{
        projects:[],
        isLoaded:false,
    }
}

@Injectable({
    providedIn: 'root'
  })
@StoreConfig({name:'project'})
export class projectStore extends Store<projectState>{
    constructor(){
        super(getInitialStateOfProject())
    }
}