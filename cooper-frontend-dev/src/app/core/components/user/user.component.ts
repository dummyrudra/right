import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'j-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @Input() user: any;
  @Input() classDetails:any;
  color='black'
  text='black'
  avatarUrl=environment.apiHost+'upload/users/'
  fn:any;
  ln:any='';
  full:any;
  constructor() {}

  ngOnInit(){
 // console.log('userIn user',this.user)

    }
  

  filterEvent(id:any){
   // console.log('click',id)
  }

}