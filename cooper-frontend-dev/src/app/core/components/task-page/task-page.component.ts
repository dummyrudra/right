import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/services/http.service';
import { UtilityService } from 'src/app/services/utility.service';
import * as moment from 'moment';
import { quillConfiguration } from '../../control/config/editor';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotifierService } from 'angular-notifier';
import { catchError, Observable, Observer } from "rxjs";
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { map } from 'jquery';
import { SocketService } from '../../../services/socket.service';
import { ProjectService } from '../../services/projects/project.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent implements OnInit {

  @ViewChild('content') content: ElementRef | any;
  task: any = {}
  url: any = {
    taskUrl: "dsfdsfadf"
  }
  projectList: any = []
  selectedMoveProjectID:any
  base64Image: any;
  baseUrl = environment.apiHost + 'upload/users/'
  baseUrl1 = environment.apiHost + 'upload/attachment/'
  baseUrl2 = '/upload/attachment/'
  tabs = ['all', 'comment', 'history'];
  form: any = FormGroup;
  Image: boolean = false;
  form1: any = FormGroup;
  listForm: any = FormGroup;
  html: any;
  history: any;
  allData: any;
  atClone: any;
  comments: any;
  currentUserImage: any;
  modules: any;
  editorOptions: any = quillConfiguration;
  selectedlabels: any;
  issueImage: any = {
    story: 'a.svg',
    bug: 'bugs.svg',
    task: 'tick.svg',
    epic: 'b.svg'
  }
  id: string = ''
  sprints: any = []
  Labels: any;
  users: any = []
  descriptionData: any;
  isEditing = false;
  selectedAssignee: any;
  list: any = []
  listOfSelectedValue: String[] = [];
  params:any = {}
  isValid:boolean = true
  isLoading:boolean = false

  constructor(
    private modal: NgbModal,
    private http: HttpService,
    private util: UtilityService,
    private httpClient: HttpClient,
    private message: NzMessageService,
    public notifierService: NotifierService,
    private notification: NzNotificationService,
    private socket: SocketService,
    private project: ProjectService,
    private _snackBar: MatSnackBar,
    private activeRoute:ActivatedRoute,
    private router:Router
  ) { }

  initForm() {
    this.form = new FormGroup({
      assignee: new FormControl(null),
      sprintId: new FormControl(null),
      labels: new FormControl(null),
    })
  }


  ngOnInit(): void {
    this.activeRoute.params
    .subscribe((res:any)=>{
      this.params = res
    })
    //this.currentUserImage=localStorage.getItem('avatar')
    this.initForm()
    this.form1 = new FormGroup({
      description: new FormControl(null)
    })
    this.initForm()
    this.isEditing = false;
    this.getTask()
    this.http.getData('user')
      .subscribe(resp => {
        //  this.users = resp
        // this.openXl(this.content)
        //console.log("yes")
      })
      this.listForm = new FormGroup({
        listID: new FormControl(null)
      })

    // this.util.openTaskModel$.subscribe((data) => {
    //   if (data) {
    //     this.id = data


    //   }
    //   //   this.form.get('labels').valueChanges.subscribe((value: any) => {
    //   // })
    // })

  }

  changeLabel(ev: any) {

    this.patchLabel(ev)
  }

  patchLabel(value: any) {
    this.http.patchData('task/' + this.task._id, { labels: value })
      .subscribe(res => {
        this.getTask()
        this.util.refreshBacklog$.next(true)
      }, error => console.log(error))
  }

  addTagFn(name: any) {
    return name;
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

  getTask() {
    this.Labels = []
    this.http.getData(`task/project-key/${this.params.key}?SN=${this.params.SN}`)
    .pipe(
      catchError((err: any) => {
        if (err.error) this.util.refreshBacklog$.next(true)
        this.isValid = false
        this.isLoading = true
        throw Error(err)
      })
    )  
    .subscribe((res: any) => {
        console.log(res)
        if (res) {
          this.isLoading = true
          this.task = res[0]
          this.listForm.get('listID').setValue(res[0]?.listID?._id)
          this.project.getProjectOfCurrentUserByOragnization()
            .subscribe((res: any) => {
              res.map((value: any) => {
                if (this.task.projectID._id != value._id)
                  this.projectList.push(value)
              })
            })
          this.users = res[0]?.projectID?.members.map((value: any) => {
            return value.member
          })
          this.Labels = res[0]?.projectID?.labels;
          // this.Labels = res?.labels;
          this.descriptionData = res[0]?.description;
          this.history = res[0]?.activity.filter((u: any) => u.activityType == 'history')
          this.allData = res[0]?.activity.filter((u: any) => u.activityType == 'history' || u.activityType == 'comment')
          this.comments = res[0]?.activity.filter((u: any) => u.activityType == 'comment')
          this.atClone = res[0]?.attachment;
          //  console.log('com',this.task,this.task?.listID?._id)
          this.form1.get('description').setValue(this.descriptionData);
          this.form.get('labels').setValue(res[0]?.labels)
          this.task.updatedAt = moment(res[0]?.updatedAt).fromNow()
          this.form.get('assignee').setValue(res[0]?.assigneeID?._id);
          this.form.get('sprintId').setValue(res[0]?.sprint?._id);
          // this.selectedAssignee=res?.assigneeID?._id
          this.http.getData('list/' + res[0]?.projectID._id)
            .subscribe(resp => {
              this.list = resp
              //console.log('list',this.list)
            })
          this.http.getData('sprints/project/' + res[0]?.projectID._id)
            .subscribe(resp => {
              this.sprints = resp
              // console.log(resp)
            })
        }
      })
  }
  generateTaskUrl(item: any, modal: any) {
    
    this.url.taskUrl = 'http://192.168.1.29:4200'+this.router.url
    this.modal.open(modal)
  }
  openXl(content: any) {
    this.modal.open(content, { size: 'xl' });
  }

  //   handleFocus(): void {
  //     setTimeout(() => {
  //        const myCustomClass: string ="custom-class"
  //        const panel = document.querySelector('.rahul.ng-has-value');
  //        panel?.classList.add(myCustomClass);
  //        console.log('panel', panel);
  //      }, 0);
  //  }

  updateData(event: any, key: string) {

    let value;
    if (key == 'assigneeID' || key == 'listID' || key == "sprint") value = { [key]: event._id }
    else if (key == "attachment") {
      value = new FormData()
      let files: any = [];
      for (var i = 0; i < event.target.files.length; i++) {
        files.push(event.target.files[i]);
      }
      for (var i = 0; i < event.target.files.length; i++) {
        value.append('attachment', files[i])
      }
      //console.log(value)
      this.http.patchData('task/' + this.task._id, value)
        .subscribe(res => {
          //this.task[key] = event.target.value
          this.getTask()
          this.util.refreshBacklog$.next(true)
        })
      return
    }
    else if (key == 'listID') {
      value = {
        listID: this.listForm.get('listID').value
      }
    }
    else {
      value = { [key]: event.target.value }
      this.task[key] = event.target.value
    }
    this.http.patchData('task/' + this.task._id, value)
      .subscribe(res => {
        this.getTask()
        this.util.refreshBacklog$.next(true)
        this.util.openTaskModel$.next('')
      }, (error) => {
        this.getTask();
        // this.notifier.notify('error', "you don't have a permission");
        //console.log('er',error)

      })
    return
  }

  isFlag(value: boolean) {
    this.http.patchData('task/' + this.task._id, { flag: value })
      .subscribe(res => {
        this.getTask()
        this.util.refreshBacklog$.next(true)
        this.util.openTaskModel$.next('')
      }, (error) => {
        this.getTask();
        // this.notifier.notify('error', "you don't have a permission");
        //console.log('er',error)

      })
  }


  saveChange(event: any) {
    //  console.log(event.html)
  }

  editorCreated(editor: any) {
    console.log(editor.editor?.delta)
    if (editor && editor.focus) {
      editor.focus();
    }
  }
  logChange(event: any) {
    this.task.attachment = this.atClone;
    this.Image = false;
    for (let i = 0; i < event.content?.ops.length; i++) {
      console.log(event.content?.ops[i]?.insert?.image)

      if (event.content?.ops[i]?.insert?.image) {
        //  this.task.attachment=clone
        this.Image = true;
        if (!this.task.attachment.includes(event.content?.ops[i]?.insert?.image)) {


          this.task.attachment = this.task?.attachment.concat(event.content?.ops[i]?.insert?.image)
          // clone=this.task.attachment
        }
      }
      else if (!this.Image) {
        this.task.attachment = this.atClone
      }

    }
    // console.log(event.content?.ops,event)
  }
  save() {
    // console.log('des',this.form1.get('description').value)
    this.http.patchData('task/' + this.task._id, { description: this.form1.get('description').value })
      .subscribe(res => {
        this.getTask();
        this.isEditing = false;
        this.util.refreshBacklog$.next(true)
      },(error) => {
        this.form1.get('description').setValue(this.descriptionData);
        // this.notifier.notify('error', 'Something Went Wrong');
        console.log(error)
      })
  }
  cancel() {
    this.isEditing = false;
  }
  setEditMode() {
    this.isEditing = true;
  }



  activityEvent() {
    this.getTask();
    this.util.refreshBacklog$.next(true);
  }
  openMove(moveModal: any) {
    this.modal.dismissAll()
    this.modal.open(moveModal, { centered: true, size: 'md' });
  }

  downloadImage(img: any) {
    const imgUrl = img
    // console.log(imgUrl);
    const imgName = imgUrl.substr(imgUrl.lastIndexOf('/') + 1);
    this.httpClient.get(imgUrl, { responseType: 'blob' as 'json' })
      .subscribe((res: any) => {
        const file = new Blob([res], { type: res.type });

        // IE
        // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //   window.navigator.msSaveOrOpenBlob(file);
        //   return;
        // }

        const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = imgName;

        // Version link.click() to work at firefox
        link.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));

        setTimeout(() => { // firefox
          window.URL.revokeObjectURL(blob);
          link.remove();
        }, 100);
      });
  }

  cloneTask(task: any) {
    this.http.postData('task/clone', { taskId: task._id })
      .pipe(
        catchError((err: any) => {
          if (err.error) this.util.refreshBacklog$.next(true)
          // this.Notify.notify('error', err?.error?.message)
          throw Error(err)
        })
      )
      .subscribe(res => {
        this._snackBar.open(`${this.task.projectID.key.toUpperCase()}-${this.task.SN} clone successfully !`,'Ok',{
          duration: 3000
        });
        this.socket.refreshProjectPages(this.task?.projectID?.key)
        this.util.refreshBacklog$.next(true)
        this.modal.dismissAll()
      })
  }
  dismiss(moveTask?:any){
    this.modal.dismissAll()
  }
  copied(){
    this.modal.dismissAll()
    this._snackBar.open(`copied !`, 'Ok', {
      duration: 3000
    });
  }

  moveTaskToAnotherProject(){
    console.log(this.selectedMoveProjectID)
    this.http.patchData('task/move/'+this.task._id,{projectID:this.selectedMoveProjectID})
    .pipe(
      catchError((err: any) => {
        this._snackBar.open(`Something went wrong`, 'Ok', {
          duration: 3000
        });
        throw Error(err)
      })
    )
    .subscribe(res => {
      this._snackBar.open(`${this.task.projectID.key.toUpperCase()}-${this.task.SN} Moved !`,'Ok',{
        duration: 3000
      });
      this.socket.refreshProjectPages(this.task?.projectID?.key)
      this.modal.dismissAll()
    })
  }

}
