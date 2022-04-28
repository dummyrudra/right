import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ProjectService } from '../../services/projects/project.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Router } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { catchError, filter } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { SocketService } from '../../../services/socket.service';
import { environment } from 'src/environments/environment.prod';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'jquery';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit {
  isCollapsed: any = []
  completeSprintData: any = {}
  selectedSprint = new FormGroup({
    selectedSprintId: new FormControl('', [Validators.required])
  })
  url: any = {
    taskUrl: "dsfdsfadf"
  }
  selectSprintList: any = []
  organisation: string = String(localStorage.getItem('org_name'))
  isOpenEpicPanel: boolean = false
  taskCount: any = []
  deleteTaskValue: any = { id: '', SN: '' }
  baseUrl: string = environment.apiHost + 'upload/users/'
  isSearch: string = ''
  isSpinning: boolean = true
  tempSprint: any = []
  filter: any = { issueType: '', epic: '' }
  project: any = {}
  deleteSprintItem: any = {}
  task: any = []
  sprint: any = []
  counter: any = []
  list: any = []
  payload = {
    projectID: '',
    summary: '',
    issueType: 'story',
    sprint: ''
  }
  issueImage: any = {
    story: 'a.svg',
    bug: 'bugs.svg',
    task: 'tick.svg',
    epic: 'b.svg'
  }

  taskEstimateCount: any = []
  sprintStatus: string = 'start'
  backlogCount = 0
  constructor(
    private http: HttpService,
    private proj: ProjectService,
    private util: UtilityService,
    private router: Router,
    private Notify: NotifierService,
    private socket: SocketService,
    private modalService: NgbModal,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    let param = this.util.projectActiveKey$.getValue()
    // this.util.projectActiveKey$.subscribe((param: any) => {
    // })
    this.util.refreshBacklog$.subscribe(respo => {
      this.counter = []
      this.proj.getProjectOfCurrentUserByOragnization()
        .pipe(
          catchError((err: any) => {
            if (err?.error?.status) this.Notify.notify('error', err?.error?.message)
            if (err.error) this.Notify.notify('error', err?.error?.message)
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
                    this.Notify.notify('error', err?.error?.message)
                    throw Error(err)
                  })
                )
                .subscribe(res => {
                  this.list = res
                })
              this.http.getData('sprints/project/' + item._id)
                .pipe(
                  catchError((err: any) => {
                    // this.Notify.notify('error', err?.error?.message)
                    this.isSpinning = false
                    this.sprint = false
                    throw Error(err)
                  })
                )
                .subscribe((res: any) => {
                  if (this.sprint.length != res.length) {
                    res.map((value: any, index: number) => {
                      this.isCollapsed.push(true)
                    })
                    this.sprint = [...res]
                    this.util.sprints$.next(res)
                  }
                  else res.map((value: any, index: number) => {
                    for (let i in value) {
                      if (this.sprint[index][i] != value[i]) {
                        this.sprint[index][i] = value[i]
                      }
                    }
                  })
                  this.isSpinning = false
                  this.defaultTaskCount()
                  this.taskEstimateCounter()
                })
            }
          }
        })
    })
  }

  openDeleteTaskModal(modal: any, value: any) {
    this.deleteTaskValue.id = value._id
    this.deleteTaskValue.SN = value.SN
    this.modalService.open(modal)
  }
  addFilter(value: string) {
    this.filter.issueType = value
    this.defaultTaskCount()
  }
  generateTaskUrl(item: any, modal: any) {
    this.url.taskUrl = `http://192.168.1.29:4200/${this.organisation}/project/${this.project.key}/${item.SN}`
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
  defaultTaskCount() {
    let count = 0
    this.taskCount = []
    if (this.isSearch) {
      this.sprint.map((value: any) => {
        count = 0
        for (let item of value.tasks) {
          if (item.summary?.toLowerCase().indexOf(this.isSearch.toLowerCase()) > -1 && item.issueType == this.filter.issueType) count += 1
          else if (item.summary?.indexOf(this.isSearch) > -1 && this.filter.issueType == '') count += 1
        }
        this.taskCount.push(count)
      })
    }
    else if (this.filter.issueType) {
      this.sprint.map((value: any) => {
        count = 0
        for (let item of value.tasks) {
          if (item.issueType == this.filter.issueType) count += 1
        }
        this.taskCount.push(count)
      })
    }
    else {
      this.sprint.map((value: any) => {
        count = 0
        for (let item of value.tasks) {
          count += 1
        }
        this.taskCount.push(count)
      })
    }
  }


  clearFilter() {
    this.filter.issueType = ''
    this.filter.epic = ''
    this.defaultTaskCount()
  }
  search(event: any) {
    this.isSearch = event.target.value
    this.defaultTaskCount()
  }


  taskEstimateCounter() {
    this.taskEstimateCount = []
    let estimate = { todo: 0, inprogress: 0, done: 0, sprint: '' }
    this.sprint.map((value: any) => {
      estimate.sprint = value.SprintName
      for (let item of value.tasks) {
        if (item.listID.listName == 'todo') estimate.todo += item.storyPointEstimate
        else if (item.listID.listName == 'in progress') estimate.inprogress += item.storyPointEstimate
        else if (item.listID.listName == 'done') estimate.done += item.storyPointEstimate
      }
      this.taskEstimateCount.push(estimate)
      estimate = { todo: 0, inprogress: 0, done: 0, sprint: '' }
    })
  }

  selectIssueType(type: string) {
    this.payload.issueType = type
    this.defaultTaskCount()
  }

  openDeleteModel(item: any) {
    this.deleteSprintItem = item
  }

  openTaskModel(id: string) {
    this.util.openTaskModel$.next(id)
  }

  addSprint() {
    let sprintNumber = 1
    this.sprint.map((value: any) => {
      if (value.sprintName != 'backlog' && Number(value.sprintName.split('-')[1]) >= sprintNumber) {
        sprintNumber = Number(value.sprintName.split('-')[1]) + 1
      }
    })
    this.http.postData('sprints/', { sprintName: 'sprint-' + sprintNumber, project: this.project._id, duration: this.sprint[this.sprint.length - 1].duration })
      .pipe(
        catchError((err: any) => {
          if (err.error) this.util.refreshBacklog$.next(true)
          this.Notify.notify('error', err?.error?.message)
          throw Error(err)
        })
      )
      .subscribe(res => {
        this.util.refreshIssueModal$.next(true)
        this.socket.refreshProjectPages(this.project.key)
        this.util.refreshBacklog$.next(true)
      })
  }

  openSprintModel(item: any) {
    this.util.sprintModel$.next(item)
  }


  deleteSprint(id: string) {
    this.http.deleteData('sprints/' + id)
      .pipe(
        catchError((err: any) => {
          if (err.error) this.util.refreshBacklog$.next(true)
          this.Notify.notify('error', err?.error?.message)
          throw Error(err)
        })
      )
      .subscribe(res => {
        this.util.refreshBacklog$.next(true)
        this.socket.refreshProjectPages(this.project.key)
        this.util.refreshIssueModal$.next(true)
      })
  }

  dropOver(event: CdkDragDrop<string[]>) {
    if (event.item.element.nativeElement.id == 'divider') return
    let taskID: any = [event.item.element.nativeElement.id]
    let sprintID = event.container.id
    let prevousSprintID = event.previousContainer.id
    let previousIndex = event.previousIndex
    let task = {}
    this.sprint.map((value: any, ind: number) => {
      if (value._id == prevousSprintID) {
        task = this.sprint[ind].tasks[previousIndex]
        this.sprint[ind].tasks.splice(previousIndex, 1)
      }
    })
    this.sprint.map((value: any, ind: number) => {
      if (value._id == sprintID) {
        if (event.container)
          this.sprint[ind].tasks.push(task)
      }
    })
    this.defaultTaskCount()
    this.taskEstimateCounter()
    this.http.patchData('sprints/drag-task/' + sprintID, { tasks: taskID, previousSprint: prevousSprintID })
      .pipe(
        catchError((err: any) => {
          if (err.error) this.util.refreshBacklog$.next(true)
          this.Notify.notify('error', err?.error?.message)
          throw Error(err)
        })
      )
      .subscribe(res => {
        this.socket.refreshProjectPages(this.project.key)
      })
  }


  drop(event: CdkDragDrop<string[]>) {
    let taskID: any = []
    let sprintID = event.container.id
    let prevousSprintID = event.previousContainer.id
    let currentIndex = event.currentIndex
    let previousIndex = event.previousIndex
    if (event.item.element.nativeElement.id == 'divider') {
      let data: any = []
      this.sprint.map((value: any) => {
        if (value._id == event.container.id) {
          data = value.tasks.splice(0, event.currentIndex)
        }
      })
      this.sprint.map((value: any) => {
        if (value._id == event.previousContainer.id) {
          value.tasks = value.tasks.concat(data)
        }
      })
      data.map((value: any) => {
        taskID.push(value._id)
      })
      this.defaultTaskCount()
      this.taskEstimateCounter()
      if (taskID.length == 0) return
      this.http.patchData('sprints/drag-task/' + prevousSprintID, { tasks: taskID, previousSprint: sprintID })
        .pipe(
          catchError((err: any) => {
            if (err.error) this.util.refreshBacklog$.next(true)
            this.Notify.notify('error', err?.error?.message)
            throw Error(err)
          })
        )
        .subscribe(res => {
          this.socket.refreshProjectPages(this.project.key)
          // this.util.refreshBacklog$.next(true)
        })
      return
    }
    taskID = [event.item.element.nativeElement.id]
    let task = {}
    this.sprint.map((value: any, ind: number) => {
      if (value._id == prevousSprintID) {
        task = this.sprint[ind].tasks[previousIndex]
        this.sprint[ind].tasks.splice(previousIndex, 1)
      }
    })
    this.sprint.map((value: any, ind: number) => {
      if (value._id == sprintID) {
        if (event.container)
          this.sprint[ind].tasks.splice(currentIndex, 0, task)
      }
    })
    this.defaultTaskCount()
    this.taskEstimateCounter()
    this.http.patchData('sprints/drag-task/' + sprintID, { tasks: taskID, previousSprint: prevousSprintID, position: currentIndex })
      .pipe(
        catchError((err: any) => {
          this.util.refreshBacklog$.next(true)
          if (err.error.status) this.Notify.notify('error', err?.error?.message)
          else if (err.error) this.Notify.notify('error', err?.error?.message)
          throw Error(err)
        })
      )
      .subscribe(res => {
        this.socket.refreshProjectPages(this.project.key)
        // this.util.refreshBacklog$.next(true)
      })
  }

  startSprint(type: string, item: any, complete?: any) {
    if (type == 'start') {
      let newStartDate = new Date(Date.now())
      let newEndDate = new Date(newStartDate.getTime() + ((item.duration ? 1 : 0) * 6 * 24 * 60 * 60 * 1000) + ((item.duration > 1 ? item.duration - 1 : 0) * 7 * 24 * 60 * 60 * 1000))
      let data = {
        _id: item._id,
        duration: item.duration,
        sprintName: item.sprintName,
        startDate: newStartDate,
        endDate: `${newEndDate.getFullYear()}-${newEndDate.getMonth() < 10 ? '0' : ''}${newEndDate.getMonth() + 1}-${newEndDate.getDate() < 10 ? '0' : ''}${newEndDate.getDate()}`,
        sprintStatus: 'complete',
        project: this.project,
        isStart: true
      }
      this.util.sprintModel$.next(data)
      // this.http.putData('sprints/' + item._id, data)
      //   .pipe(
      //     catchError((err: any) => {
      //       this.util.refreshBacklog$.next(true)
      //       if (err.error.status) this.Notify.notify('error', err?.error?.message)
      //       else if (err.error) this.Notify.notify('error', err?.error?.message)
      //       throw Error(err)
      //     })
      //   )
      //   .subscribe(res => {
      //     item.startDate = data.startDate
      //     item.endDate = data.endDate
      //     item.sprintStatus = data.sprintStatus
      //     this.socket.refreshProjectPages(this.project.key)
      //     this.router.navigate(['project/' + this.project.key + '/board'])
      //   })
    }
    else {
      this.completeSprintData = item
      this.selectSprintList = this.sprint.filter((value: any) => {
        if (value._id != item._id) return true
        else return false
      })
      this.modalService.open(complete)
    }
  }

  completeSprint(selectedSprint: any) {
    if (this.selectedSprint.get('selectedSprintId')?.invalid) return
    this.http.patchData('sprints/complete-sprint/' + this.completeSprintData._id, { moveSprint: this.selectedSprint.get('selectedSprintId')?.value })
      .pipe(
        catchError((err: any) => {
          this.util.refreshBacklog$.next(true)
          if (err.error.status) this.Notify.notify('error', err?.error?.message)
          else if (err.error) this.Notify.notify('error', err?.error?.message)
          throw Error(err)
        })
      )
      .subscribe(res => {
        this.modalService.dismissAll()
        this.socket.refreshProjectPages(this.project.key)
        this.taskEstimateCounter()
        this.util.refreshBacklog$.next(true)
      })
  }

  addIssue(event: any, sprint: string) {
    if (event.target.value == '') return
    this.payload.summary = event.target.value
    this.payload.sprint = sprint
    this.payload.projectID = this.project._id
    let ind = 0
    let taskCounter = 0
    this.sprint.map((value: any, index: number) => {
      taskCounter += value.tasks.length
      if (value._id == sprint) {
        ind = index
        this.sprint[ind].tasks.splice(this.sprint[ind].tasks.length, 0, this.payload)
        event.target.value = ''
      }
    })
    this.http.postData('task', this.payload)
      .pipe(
        catchError((err: any) => {
          if (err.error) this.util.refreshBacklog$.next(true)
          this.Notify.notify('error', err?.error?.message)
          throw Error(err)
        })
      )
      .subscribe(res => {
        this.sprint[ind].tasks.splice(this.sprint[ind].tasks.length - 1, 1, res)
        this.socket.refreshProjectPages(this.project.key)
        this.util.refreshBacklog$.next(true)
        this.taskEstimateCounter()
        this.defaultTaskCount()
      })
  }

  selectList(task: any, list: any) {
    this.http.patchData('task/' + task._id, { listID: list._id })
      .pipe(
        catchError((err: any) => {
          if (err.error) this.util.refreshBacklog$.next(true)
          this.Notify.notify('error', err?.error?.message)
          throw Error(err)
        })
      )
      .subscribe(res => {
        this.socket.refreshProjectPages(this.project.key)
        task.listID = list
        this.taskEstimateCounter()
      })

  }

  flag(item: any) {
    this.http.patchData('task/' + item._id, { flag: !item.flag })
      .subscribe(res => {
        item.flag = !item.flag
        this.socket.refreshProjectPages(this.project.key)
      })
  }
  shareTask(modal: any) {
    this.modalService.open(modal)
  }

  stringToHslColor(str: any) {
    var hash = 0;
    if (str) {
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }

      var h = hash % 360;
      return 'hsl(' + h + ', ' + 30 + '%, ' + 40 + '%)';
    }
    else {
      return;
    }
  }
  copied(){
    this.modalService.dismissAll()
    this._snackBar.open(`copied !`, 'Ok', {
      duration: 3000
    });
  }

  cloneTask(task: any) {
    this.http.postData('task/clone', { taskId: task._id })
      .pipe(
        catchError((err: any) => {
          if (err.error) this.util.refreshBacklog$.next(true)
          this.Notify.notify('error', err?.error?.message)
          throw Error(err)
        })
      )
      .subscribe(res => {
        this._snackBar.open(`${this.project?.key.toUpperCase()}-${task.SN} clone successfully !`, 'Ok', {
          duration: 3000
        });
        this.socket.refreshProjectPages(this.project.key)
        this.util.refreshBacklog$.next(true)
        this.taskEstimateCounter()
        this.defaultTaskCount()
      })
  }
}


