import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board-modal',
  templateUrl: './board-modal.component.html',
  styleUrls: ['./board-modal.component.css']
})
export class BoardModalComponent implements OnInit {
  selectedList=1
  List=[{
    name:"Todo",
    _id:1
  },{
    name:'InProgress',
    id:2
  }]
  listOfOption = [{
    fullName:'Rahul',
    _id:1
  },{
    fullName:'Amit',
    id:2
  }];
  listOfSelectedValue:String[]= [];
  constructor() { }

  ngOnInit(): void {
  }
  
  changeLeagueOwner(event:any){
    console.log(event)
  }
}
