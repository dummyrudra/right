import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
import { environment } from 'src/environments/environment.prod';
import { UtilityService } from 'src/app/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socketUrl:string = environment.socketUrl
  socket:any 
  constructor(private util:UtilityService) {
    this.socket = io(this.socketUrl)
   }

   public joinOrganization(){
      this.socket.emit('joinRoom',"620b3072d2976226fdd6a81a")
   }
   public joinProject(projectKey:string){
     this.socket.emit('joinRoom',projectKey)
   }
   public leaveProject(projectKey:string){
    this.socket.emit('leaveRoom',projectKey)
  }
  public refreshProjectPages(projectKey:string){
    this.socket.emit('refreshProjectPages',projectKey)
  }
   public refresh(){
     this.socket.on('refreshProjectPage',(data:any)=>{
        console.log('dssd',data)
        this.util.refreshBacklog$.next(true)
     })
   }
}
