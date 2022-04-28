import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import * as moment from 'moment';
import { filter } from 'rxjs';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
userID:string = ''
notifications:any = []
dirrect:any = []
watching:any = []
  constructor(
    private http:HttpService
  ) { }

  ngOnInit(): void {
    this.http.getData('notification/'+localStorage.getItem('id'))
    .subscribe((res:any)=>{
      res.map((value:any)=>{
        value.createdAt = moment(value.createdAt).fromNow()
      })
      this.notifications = res
      this.filterNotification(res)
    })
  }

  filterNotification(list:any){
    let dirrect = false
    let id = String(localStorage.getItem('id'))
    list.map((value:any)=>{
      for(let item of value.tagged){
        dirrect = false
        if(item._id == id ) dirrect = true
      }
      if(dirrect) this.dirrect.push(value)
      else this.watching.push(value)
    })
    console.log(this.dirrect,this.watching)
  }

}
