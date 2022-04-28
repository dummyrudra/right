import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';



export interface projectMembersState{
  projectMembers:any,
  isLoaded:boolean
}


export const getInitialState=()=>{
    return{
        projectMembers:[],
        isLoaded:false,
    }
}

@Injectable({
    providedIn: 'root'
  })
@StoreConfig({name:'projectMembers'})
export class projectMembersStore extends Store<projectMembersState>{
    constructor(){
        super(getInitialState())
    }
}