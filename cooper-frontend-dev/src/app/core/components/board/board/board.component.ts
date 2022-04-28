import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Board } from '../../../modal/board.model';
import { Column } from '../../../modal/column.model';
import { ProjectService } from 'src/app/core/services/projects/project.service';
import { UtilityService } from 'src/app/services/utility.service';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/core/services/tasks/task.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  pluck,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import { listStore } from 'src/app/core/state/list/list.store';
import { listQuery } from 'src/app/core/state/list/list.query';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  isSpinning = false;
  color = 'blue';
  toolTitle = 'Add people';
  isVisible = false;
  Form1: any = FormGroup;
  isError = false;
  key: any;
  isSelected: any = [];
  users: any = [];
  Label:any;
  pId: any;
  listOfOption = [
    {
      fullName: 'Rahul',
      _id: 1
    },
    {
      fullName: 'Amit',
      id: 2
    }
  ];
  board: any = [];
  boardClone: any = [{}];
  boardClone1: any = [{}];
  constructor(
    private ref: ChangeDetectorRef,
    private taskService: TaskService,
    private projectService: ProjectService,
    private utilService: UtilityService,
    private activeRoute: ActivatedRoute,
    private listStore:listStore,
    private listQuery:listQuery,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.isSpinning = true;
    this.key = this.utilService.projectActiveKey$.getValue();
    this.utilService.refreshBacklog$.subscribe(
      respo => {
        this.getProjects();
  
        this.Form1 = new FormGroup({
          searchItem: new FormControl(null)
        });
      },
      error => {
        this.isSpinning = false;
      }
    );
  }

  changeSelected(data: any) {
    //console.log(data)
    var Index = this.isSelected?.indexOf(data?.member?._id);
    if (Index > -1) {
      this.isSelected?.splice(Index, 1);
      this.FilterListAndTask();
    } else {
      this.isSelected.push(data?.member?._id);
      this.FilterListAndTask();
    }
  }

  clearFilter() {
    this.isSelected = [];
    this.Form1.get('searchItem').setValue(null);
  }

  boardFilter() {
    let b = this.boardClone;
    let searchItem = this.Form1.get('searchItem').value;
    let boardClone = [...b];
    let arr = boardClone.map(bClone => {
      let bClone2 = { ...bClone };
      bClone2.tasks = bClone.tasks.filter((task: any) => {
        if (searchItem && this.isSelected.length > 0) {
          if (
            (this.isSelected.includes(task?.assigneeID?._id.toString()) ||
              this.isSelected.includes(task?.reporter?._id.toString())) &&
            task?.summary?.toLowerCase().match(searchItem?.trim())
          )
            return task;
        } else if (searchItem && this.isSelected.length == 0) {
          if (task?.summary.toLowerCase().match(searchItem?.trim()))
            return task;
        } else if (!searchItem && this.isSelected.length == 0) {
          return task;
        } else {
          if (
            this.isSelected.includes(task?.assigneeID?._id.toString()) ||
            this.isSelected.includes(task?.reporter?._id.toString())
          )
            return task;
        }
      });
  
      return bClone2;
    });
   //console.log('aar',arr)
    this.board = arr;
  }

  FilterListAndTask() {
    this.boardFilter();
  }

  getAllList1(id: any) {
    this.projectService.getListOfProject(id).subscribe(
      (res: any) => {
        this.board = res;
         // console.log('board',res)
        this.boardClone = res;
        this.boardClone1 = res;
        this.projectService.TaskData$.next(res);
        this.isSpinning = false;
      },
      error => {
        this.isSpinning = false;
        this.isError = true;
      }
    );
  }

  getAllList(id: any) {
    this.projectService.getListOfProject(id).subscribe(
      (res: any) => {
        
        this.projectService.TaskData$.next(res);
        this.isSpinning = false;
      },
      error => {
        this.board = this.boardClone;
        this.isSpinning = false;
        this.isError = true;
      }
    );
  }

  changeLeagueOwner(event: any) {}

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  DeleteTask() {
    this.getAllList1(this.pId);
  }

  parentFunction(event: any) {
    let res = {
      task: event.item.element.nativeElement.id,
      position: event.currentIndex,
      previousList: event.previousContainer.id
    };
    this.moveTask(event.container.id, res);
  }

  moveTask(id: any, result: any) {
    this.taskService.moveTaskToList(id, result).subscribe(
      data => {
        this.getAllList(this.pId);
      },
      error => {
        this.getAllList1(this.pId);
        this.notification.create(
          'error',
          'Task',
          error.msg,
          { nzPlacement: 'topRight'}
        );
       // console.log(error);
      }
    );
  }
  ngAfterViewInit() {
    this.Form1.valueChanges
      .pipe(
        tap(() => {
          this.isSpinning = true;
          // this.isSelected=[];
        }),
        pluck('searchItem'),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(
          async data => this.FilterListAndTask()
          // this.projectService.getTaskBySummary(data)
        )
      )
      .subscribe((value: any) => {

        this.isSpinning = false;
      });
  }
  AddList1(data: any) {
    // console.log(data)
    if (data.cancel == 'ok') {
      this.board.push({});
    } else if (data.cancel == 'cancel') {
      this.board.pop();
    }
  }

  AddList(data: any) {
    let obj = {
      listName: data?.listName
    };
    if (data.column == undefined) {
      this.projectService.addNewList(this.pId, obj).subscribe(
        () => {
          this.getAllList1(this.pId);
        },
        error => {
          this.notification.create(
            'error',
            'Task',
            error.msg,
            { nzPlacement: 'topRight'}
          );
        }
      );
    } else {
      this.projectService.editListById(data?.id, obj).subscribe(
        () => {
          this.getAllList1(this.pId);
        },
        error => {
          this.notification.create(
            'error',
            'Task',
            error.msg,
            { nzPlacement: 'topRight'}
          );
        }
      );
    }
  }

  EditLabel(){
   // console.log('called')
    this.getProjects();
  }


  getProjects(){
    let count = 0;
    this.projectService.getProjectOfCurrentUserByOragnization().subscribe(
      (ress: any) => {
        for (let item of ress) {
          if (item.key == this.utilService.projectActiveKey$.getValue()) {
            this.pId = item._id;
           //console.log('item',item)
            this.users = item.members;
            this.Label=item.labels;
            this.getAllList1(item._id); 
          } else {
            count++;
          }
        }
        if (count === ress?.length) {
          this.getAllList1('1233');
        }
      },
      error => {
        this.isSpinning = false;
        this.isError = true;
      }
    );
  }


addMemberEvent(){
  this.getProjects();
}





}
