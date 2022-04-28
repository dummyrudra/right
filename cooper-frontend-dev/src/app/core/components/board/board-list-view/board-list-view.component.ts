import { Component, OnInit } from '@angular/core';
import { Board } from '../../../modal/board.model';
import { Column } from '../../../modal/column.model';

import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-board-list-view',
  templateUrl: './board-list-view.component.html',
  styleUrls: ['./board-list-view.component.css']
})
export class BoardListViewComponent implements OnInit {
  board: Board = new Board('Test Board', [
    new Column('Todo', [
      'Get to work',
      'Pick up groceries',
      'Go home',
      'Fall asleep'
    ]),
    new Column('Query', [
      "Some random idea",
      "This is another random idea",
      "build an awesome application"
    ]),
    new Column('InProgress', [
      "Lorem ipsum",
      "foo",
      "This was in the 'Research' column"
    ]),
    
    new Column('Done', [
      'Get up',
      'Brush teeth',
      'Take a shower',
      'Check e-mail',
      'Walk dog'
    ])
  ]);
  constructor() { }

  ngOnInit(): void {
    console.log(this.board)
  }


  

  drop(event:any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    console.log("event",event.container.id,event.previousContainer.id,event.item.element.nativeElement.id)
 
  }
  stringToHslColor(str: any) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + 30 + '%, ' + 40 + '%)';
  }
 
}
