import { Component, Inject, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from 'src/app/core/services/tasks/task.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DOCUMENT } from '@angular/common';
import { PageScrollService } from 'ngx-page-scroll-core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { ProjectService } from 'src/app/core/services/projects/project.service';
import { HttpService } from 'src/app/services/http.service';
import { map } from 'jquery';
import { __values } from 'tslib';
@Component({
  selector: 'app-board-dnd',
  templateUrl: './board-dnd.component.html',
  styleUrls: ['./board-dnd.component.css']
})
export class BoardDndComponent implements OnInit, OnChanges {

  constructor(private notification: NzNotificationService,
    private http: HttpService,
    private taskService: TaskService, private projectService: ProjectService, private utilService: UtilityService, private modalService: NzModalService, private pageScrollService: PageScrollService,
    @Inject(DOCUMENT) private document: any) { }
  isVisible = false;
  @Input() board: any;
  Form: any = FormGroup;
  labelForm: any = FormGroup;
  @Input() Labels: any;
  showboard: boolean = false;
  baseUrl = environment.apiHost + 'upload/users/'
  @Input() Key: any;
  @Output() parentFunction: EventEmitter<any> = new EventEmitter();
  @Output() DeleteTask: EventEmitter<any> = new EventEmitter();
  @Output() AddList: EventEmitter<any> = new EventEmitter();
  @Output() AddList1: EventEmitter<any> = new EventEmitter();
  @Output() EditLabel: EventEmitter<any> = new EventEmitter();
  title = 'Delete'
  isLabelVisible = false;
  isLabelOkLoading = false;
  isFlagged: boolean = false;
  isLoading = false;
  isDisabled = true;
  isToggled: any = [false];
  showAdd = true;
  taskId: any;
  listName = ""
  isStart: boolean = false
  confirmModal?: NzModalRef;
  ngOnInit(): void {
    this.board.map((value:any)=>{
      if(value.tasks.length>0) this.isStart = true
    })
    this.Form = new FormGroup({
      listName: new FormControl(null, [Validators.required])
    });
    this.labelForm = new FormGroup({
      labels: new FormControl(null, [Validators.required])
    });
    // for(let it of this.board){
    //   console.log('gi',it)
    // }
    //console.log('gi',this.board)
    this.Form.valueChanges.subscribe(() => {
      if (this.Form.valid) {
        this.isDisabled = false;
      }
    })
  }

  ngOnChanges() {
    if (this.board.length > 0) {
      this.showboard = true;
    }
    else this.showboard = false
  }

  drop(event: CdkDragDrop<string[]>) {
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
    // console.log("event", event.currentIndex,event.container.id,event.previousContainer.id,event.item.element.nativeElement.id)
    this.parentFunction.emit(event);
  }
  // public dropGrid(event: CdkDragDrop<string[]>): void {
  //   console.log('list',event)
  //   moveItemInArray(this.board, event.previousIndex, event.currentIndex);
  // }
  stringToHslColor(str: any) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + 30 + '%, ' + 40 + '%)';
  }


  openModal(id: any) {
    this.utilService.openTaskModel$.next(id);
  }

  showModal() {
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
    this.Form.get('listName').setValue(null);
  }
  cancel(i: any) {
    // console.log('cancel',i)
    this.listName = ''
    this.isToggled[i] = false;
    this.showAdd = true;
    this.Form.get('listName').setValue(null)
    let data = {
      cancel: 'cancel',
      ind: i
    }
    this.AddList1.emit(data)
  }

  handleOk() {

    let data = {
      cancel: 'ok',
      ind: 1
    }
    this.AddList1.emit(data)
    this.showAdd = false;
    setTimeout(() => {
      this.showAdd = true;
    }, 1500)

    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: '#latest'
    })




  }
  handleKey(event: any, i: any, column: any) {
    //console.log(event)
    if (event.keyCode === 27 && this.listName != '') {
      this.cancelOk(i)
    }
    else if (event.keyCode === 13) {
      this.handleSave(i, column)
    }
    else if (event.keyCode === 27 && this.listName == '') {
      this.cancel(i);
    }
  }

  Toggle(column: any, i: any) {
    this.Form.get('listName').setValue(column)
    for (let i = 0; i < this.isToggled.length; i++) {
      this.isToggled[i] = false;
    }
    this.isToggled[i] = true;
    this.listName = column;


    //console.log(column)
  }

  cancelOk(i: any) {
    //console.log('cancelOk',i)
    this.listName = ''
    this.isToggled[i] = false;
    this.showAdd = true;
    this.Form.get('listName').setValue(null)
    let data = {
      cancel: 'cancel',
      ind: i
    }
    // this.AddList1.emit(data)
  }


  handleSave(i: any, column: any) {
    this.listName = ''
    this.isToggled[i] = false;
    let obj = {
      column: column?.listName,
      listName: this.Form.get('listName').value,
      id: column?._id
    }
    if (this.Form.valid) {
      this.AddList.emit(obj)
      // setTimeout(()=>{
      //   this.Form.get('listName').setValue(null)
      // },2000)
    }
    // console.log(this.Form.get('listName').value)
  }

  forTask(item: any) {
    let title = `${this.Key}-${item?.SN}`;
    let load = false;
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Delete ' + title,
      nzContent: `<div>
    <p class="">You're about to permanently delete this issue, its comments and attachments, and all of its data.
    </p>
    <p> If you're not sure, you can resolve or close this issue instead</p>
  </div>`,
      nzOkText: 'Delete',
      nzCancelText: 'Cancel',
      nzOkDanger: true,

      nzOnOk: () => new Promise((resolve) => {
        this.delete(item._id);
        setTimeout(resolve, 2200)
      })
    });
  }

  forList(item: any) {
    // console.log(item)
    let title = `${item?.listName}`;
    let load = false;
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Delete ' + title,
      nzContent: `<div>
    <p class="">You're about to permanently delete this list,all of its issue will shift to previous list its data.
    </p>
    <p> If you're not sure, you can resolve or close this list instead</p>
  </div>`,
      nzOkText: 'Delete',
      nzCancelText: 'Cancel',
      nzOkDanger: true,

      nzOnOk: () => new Promise((resolve) => {
        //  console.log(this.board)
        if (this.board?.length > 1) {
          this.projectService.deleteList(item?._id).subscribe(() => {
            this.DeleteTask.emit();
          }, (error) => {
            this.notification.create(
              'error',
              'Task',
              error.msg,
              { nzPlacement: 'topRight' }
            );
          })
        }
        else {
          this.showConfirm1();

        }

        setTimeout(resolve, 2200)
      })
    });
  }

  showConfirm1(): void {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Warning',
      nzContent: 'Can not delete,There must be more than one list required ,then only you can delete',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 100);
        }).catch(() => console.log('Oops errors!'))
    });
  }

  showConfirm(item: any, name: any): void {
    if (name == 'task') {
      this.forTask(item);
    }
    else {
      this.forList(item)
    }
  }
  delete(id: any) {
    this.taskService.deleteTaskById(id).subscribe((res) => {
      this.DeleteTask.emit();

    }, (error) => {
      // console.log('error',error.msg)
      this.notification.create(
        'error',
        'Task',
        error.msg,
        { nzPlacement: 'topRight' }
      );
    })
  }


  isFlag(id: any) {
    this.isFlagged = !this.isFlagged
    let data = {
      flag: this.isFlagged
    }
    this.taskService.isTaskFlagged(id, data).subscribe(() => {
      this.DeleteTask.emit();
    }, error => {
      this.notification.create(
        'error',
        'Task',
        error.msg,
        { nzPlacement: 'topRight' }
      );
    })
  }


  showLabelModal(item: any): void {
    //console.log(item)
    this.taskId = item?._id;
    this.isLabelVisible = true;
    this.labelForm.get('labels').setValue(item?.labels)


  }

  handleLabelOk(): void {
    this.isLabelOkLoading = true;
    this.patchLabel();

    setTimeout(() => {
      this.isLabelVisible = false;
      this.isLabelOkLoading = false;
    }, 1500);
  }

  handleLabelCancel(): void {
    this.isLabelVisible = false;
    this.labelForm.reset();
  }
  addTagFn(name: any) {
    return name;
  }


  patchLabel() {
    this.http.patchData('task/' + this.taskId, this.labelForm.value)
      .subscribe(res => {
        // this.DeleteTask.emit();
        this.EditLabel.emit();

      }, error => console.log(error))
  }

}
