import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpService } from '../../../services/http.service';
import { UtilityService } from 'src/app/services/utility.service';
import { NotifierService } from 'angular-notifier';
import { ProjectService } from '../../services/projects/project.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SocketService } from '../../../services/socket.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  project: any = []
  lists: any = []
  deleteTaskValue: any = { id: '', SN: '' }
  issueImage: any = {
    story: 'a.svg',
    bug: 'bugs.svg',
    task: 'tick.svg',
    epic: 'b.svg'
  }
  baseUrl: string = environment.apiHost + 'upload/users/'
  count: number = 0
  isSearch: string = ''
  filter: any = { issueType: '', epic: '' }
  isSpinning: boolean = true
  sortID: string = ''
  taskCount: any = []
  constructor(
    private http: HttpService,
    private util: UtilityService,
    private Notify: NotifierService,
    private proj: ProjectService,
    private socket: SocketService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.util.refreshBacklog$
      .subscribe(respo => {
        this.util.projectActiveKey$
          .subscribe((param: any) => {
            this.proj.getProjectOfCurrentUserByOragnization()
              .pipe(
                catchError((err: any) => {
                  this.lists = false
                  this.isSpinning = false
                  throw Error(err)
                })
              )
              .subscribe((ress: any) => {
                for (let item of ress) {
                  if (item.key == param) {
                    this.project = item
                    this.http.getData('list/' + item._id)
                      .pipe(
                        catchError((err: any) => {
                          // this.Notify.notify('error', err.error.message)
                          this.lists = false
                          this.isSpinning = false
                          throw Error(err)
                        })
                      )
                      .subscribe((res: any) => {
                        if (this.lists.length != res.length) this.lists = res
                        else res.map((value: any, index: number) => {
                          this.lists[index].tasks = value.tasks
                        })
                        this.defaultTaskCount()
                        this.isSpinning = false
                      })
                  }
                }
              })
          })
      })
  }
  addFilter(value: string) {
    this.filter.issueType = value
    this.defaultTaskCount()
  }
  clearFilter() {
    this.filter.issueType = ''
    this.filter.epic = ''
    this.isSearch = ''
    this.defaultTaskCount()
  }
  search(event: any) {
    this.isSearch = event.target.value
    this.defaultTaskCount()
  }
  defaultTaskCount() {
    let count = 0
    this.taskCount = []
    if (this.isSearch) {
      this.lists.map((value: any) => {
        count = 0
        for (let item of value.tasks) {
          if (item.summary?.toLowerCase().indexOf(this.isSearch.toLowerCase()) > -1 && item.issueType == this.filter.issueType) count += 1
          else if (item.summary?.indexOf(this.isSearch) > -1 && this.filter.issueType == '') count += 1
        }
        this.taskCount.push(count)
      })
    }
    else if (this.filter.issueType) {
      this.lists.map((value: any) => {
        count = 0
        for (let item of value.tasks) {
          if (item.issueType == this.filter.issueType) count += 1
        }
        this.taskCount.push(count)
      })
    }
    else {
      this.lists.map((value: any) => {
        count = 0
        for (let item of value.tasks) {
          count += 1
        }
        this.taskCount.push(count)
      })
    }
  }
  openDeleteTaskModal(modal: any, value: any) {
    this.deleteTaskValue.id = value._id
    this.deleteTaskValue.SN = value.SN
    this.modalService.open(modal)
  }

  deleteTask(modal: any) {
    this.modalService.dismissAll()
    this.http.deleteData('task/' + this.deleteTaskValue.id)
      .subscribe(res => {
        this.util.refreshBacklog$.next(true)
        this.socket.refreshProjectPages(this.project.key)
      })
  }
  dynamicSort(property: string) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a: any, b: any) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }
  dynamicSortRev(property: string) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a: any, b: any) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  sort(item: any) {
    if (this.sortID == item._id) {
      item.tasks.sort(this.dynamicSortRev("SN"))
      this.sortID = ''
    }
    else {
      item.tasks.sort(this.dynamicSort("SN"))
      this.sortID = item._id
    }
  }

  openIssueModel() {
    this.util.openCreateIssueModel$.next(this.project)
  }


  dropOver(event: CdkDragDrop<string[]>) {
    if (event.item.element.nativeElement.id == 'divider') return
    let taskID: any = event.item.element.nativeElement.id
    let listID = event.container.id
    let prevousListID = event.previousContainer.id
    let previousIndex = event.previousIndex
    let task = {}
    this.lists.map((value: any, ind: number) => {
      if (value._id == prevousListID) {
        task = this.lists[ind].tasks[previousIndex]
        this.lists[ind].tasks.splice(previousIndex, 1)
      }
    })
    this.lists.map((value: any, ind: number) => {
      if (value._id == listID) {
        if (event.container)
          this.lists[ind].tasks.push(task)
      }
    })
    this.http.patchData('list/drag/' + listID, { task: taskID, previousList: prevousListID })
      .pipe(
        catchError((err: any) => {
          if (err.error.status) this.util.refreshBacklog$.next(true)
          this.Notify.notify('error', err.error.message)
          throw Error(err)
        })
      )
      .subscribe(res => {
        this.defaultTaskCount()
        this.socket.refreshProjectPages(this.project?.key)
      })
  }



  drop(event: CdkDragDrop<string[]>) {
    console.log(event)
    let taskID: any = []
    let listID = event.container.id
    let prevousListID = event.previousContainer.id
    let currentIndex = event.currentIndex
    let previousIndex = event.previousIndex
    taskID = event.item.element.nativeElement.id
    let task = {}
    this.lists.map((value: any, ind: number) => {
      if (value._id == prevousListID) {
        task = this.lists[ind].tasks[previousIndex]
        this.lists[ind].tasks.splice(previousIndex, 1)
      }
    })
    this.lists.map((value: any, ind: number) => {
      if (value._id == listID) {
        if (event.container)
          this.lists[ind].tasks.splice(currentIndex, 0, task)
      }
    })
    this.http.patchData('list/drag/' + listID, { task: taskID, previousList: prevousListID, position: currentIndex })
      .pipe(
        catchError((err: any) => {
          if (err.error.status) this.util.refreshBacklog$.next(true)
          this.Notify.notify('error', err.error.message)
          throw Error(err)
        })
      )
      .subscribe(res => {
        this.defaultTaskCount()
        this.socket.refreshProjectPages(this.project?.key)
        // this.taskEstimateCounter()
        // this.taskCounter()
      })
  }


  selectList(item2: any, listItem: any) {

  }
  openTaskModel(id: string) {
    this.util.openTaskModel$.next(id)
  }
  flag(item:any){
    this.http.patchData('task/'+item._id,{flag:!item.flag})
    .subscribe(res=>{
      item.flag = !item.flag
      this.socket.refreshProjectPages(this.project.key)
    })
  }

}
