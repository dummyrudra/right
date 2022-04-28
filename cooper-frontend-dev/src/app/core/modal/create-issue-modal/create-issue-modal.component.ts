import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ProjectService } from '../../services/projects/project.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskService } from '../../services/tasks/task.service';
import { NotifierService } from 'angular-notifier';
import { catchError, map } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
import { environment } from '../../../../environments/environment.prod';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { quillConfiguration } from '../../control/config/editor';
@Component({
  selector: 'app-create-issue-modal',
  templateUrl: './create-issue-modal.component.html',
  styleUrls: ['./create-issue-modal.component.css']
})
export class CreateIssueModalComponent implements OnInit {
  @ViewChild('content') content: ElementRef | any
  editorOptions: any = quillConfiguration;
  baseUrl: string = environment.apiHost + 'upload/projectAvatar/'
  userAvatar: string = environment.apiHost + 'upload/users/'
  filename: string = 'Choose attachment'
  submited: boolean = false
  projectList: any = []
  lebals: any = []
  userList: any = []
  tempUserList: any = []
  tempProjectList: any = []
  tempSprintList: any = []
  existingTaskList: any = []
  sprintList: any = []
  files: any = []
  issueTypeList: any = [
    {
      issue: 'story',
      icon: 'a.svg'
    },
    {
      issue: 'bug',
      icon: 'bugs.svg'
    },
    {
      issue: 'epic',
      icon: 'b.svg'
    },
    {
      issue: 'task',
      icon: 'tick.svg'
    }]
  selectedProject = { name: '', id: '' }
  selectedSprint = { name: '', id: '' }
  selectedUser = { fullName: '', id: '' }
  selectedIssue = { issue: this.issueTypeList[0].issue, icon: this.issueTypeList[0].icon }

  form = new FormGroup({
    projectID: new FormControl('', [Validators.required]),
    issueType: new FormControl('', [Validators.required]),
    summary: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    assigneeID: new FormControl(''),
    labels: new FormControl([]),
    sprint: new FormControl(''),
    storyPointEstimate: new FormControl(''),
  })
  constructor(private http: HttpService,
    private project: ProjectService,
    private taskServices: TaskService,
    public notifierService: NotifierService,
    public util: UtilityService,
    private modalService: NgbModal) { }


  ngOnInit(): void {
    this.util.openCreateIssueModel$.subscribe((res: any) => {
      if (res._id) {
        this.selectedProject.name = res.projectName
        this.selectedProject.id = res._id
        this.form.get('projectID')?.setValue(res._id)
        this.userList = res.members.map((value:any)=>value.member)
        this.tempUserList = res.members.map((value: any) => {
          return value.member
        })
        this.selectedUser.fullName = res.members[0].member.fullName
        this.selectedUser.id = res.members[0].member._id
        this.http.getData('sprints/project/' + res._id)
          .subscribe((sprint: any) => {
            this.sprintList = sprint
            this.tempSprintList = sprint
            this.selectedSprint.id = sprint[0]._id
            this.selectedSprint.name = sprint[0].sprintName
            this.form.get('sprint')?.setValue(sprint[0]._id);
          })
        // this.setLabel()
        this.open(this.content)
        // this.http.getData('user').subscribe((res: any) => {
        //   this.userList = res
        //   this.tempUserList = res
        //   this.selectedUser.fullName = res[0].fullName
        //   this.selectedUser.id = res[0]._id
        //   this.form.get('assigneeID')?.setValue(res[0]._id);
        // })
        this.form.get('issueType')?.setValue(this.selectedIssue.issue);
      }
    })
  }
  addTagFn(name: any) {
    return name;
  }
  setLabel(event: any) {
    this.lebals = event
    // this.lebals = event.target.value.split(',')
    // // this.form.get('labels')?.setValue(array)
    // event.target.value = ''
    // this.lebals.forEach((value:any) => {
    //   event.target.value = event.target.value+value+','
    // });
  }
  editorCreated(editor: any) {
    if (editor && editor.focus) {
      editor.focus();
    }
  }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  }

  selectProject(item: any) {
    this.selectedProject.name = item.projectName
    this.selectedProject.id = item._id
    this.userList = item.memberes.map((value:any)=>value.member)
    this.tempUserList = item.memberes.map((value:any)=>value.member)
    this.selectedUser.fullName = item.members[0].member.fullName
    this.selectedUser.id = item.members[0].member._id
    this.form.get('projectID')?.setValue(item._id)
    this.http.getData('sprints/project/' + item._id)
      .subscribe((res: any) => {
        this.sprintList = res;
        this.tempSprintList = res
        if (res.length < 1) {
          this.selectedSprint.name = "No sprint available"
          // this.form.get('sprint')?.setValue('')
        }
        else {
          // this.selectedSprint.name = res[0].sprintName
          // this.form.get('sprint')?.setValue(res[0]._id)
        }
      })
    // this.setLabel()
  }

  selectSprint(item: any) {
    this.form.get('sprint')?.setValue(item._id)
    this.selectedSprint.id = item._id
    this.selectedSprint.name = item.sprintName
  }
  selectIssue(item: any) {
    this.selectedIssue.issue = item.issue
    this.selectedIssue.icon = item.icon
    this.form.get('issueType')?.setValue(item.issue);
  }

  selectUser(item: any) {
    this.selectedUser.fullName = item.fullName
    this.selectedUser.id = item._id
    this.form.get('assigneeID')?.setValue(item._id);
  }
  selectFile(event: any) {
    this.filename = ''
    this.files = event.target.files

    for (let item of this.files) {
      this.filename += item.name + ', '
    }
  }

  checkLabel(event: any) {
    for (let i of this.existingTaskList) {
      if (i.labels == event.target.value) this.form.get('labels')?.setErrors({ exist: true })
    }

  }


  search(event: any,type:string) {
    if(type=="user"){
      this.tempUserList = []
      this.userList.map((value: any) => {
        if (value?.fullName.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) this.tempUserList.push(value)
      })
    }
    else if(type=="project"){ 
      this.tempProjectList = []
      this.projectList.map((value: any) => {
        if (value.projectName.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) this.tempProjectList.push(value)
      })
    }
    else if(type=="sprint"){
      this.tempSprintList = []
      this.sprintList.map((value: any) => {
        if (value.sprintName.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) this.tempSprintList.push(value)
      })
    }
  }
  onSubmit() {
    //  console.log(this.files)
    let payload = this.form.getRawValue()
    let formData = new FormData()
    console.log(this.lebals)
    payload.labels = this.lebals
    // formData.append('attachment',this.files)
    for (let i of this.files) {
      formData.append('attachment', i);
    }
    for (let i in this.form.getRawValue()) {
      // if(payload[i].length==0 && i=='labels') continue
      if (i == 'labels' && payload[i].length > 0) {
        for (let item of payload[i]) {
          formData.append('labels[]', item)
        }
      }
      else if (i != 'labels' && payload[i]) formData.append(i, payload[i])
    }
    this.taskServices.postTask(formData)
      .pipe(
        catchError((err) => {
          //Handle the error here
          if (err.error.status) this.notifierService.notify('error', "Something went wrong")

          throw Error(err);    //Rethrow it back to component
        })
      )
      .subscribe(res => {
        if (res) {
          this.form.reset()
          this.submited = true
          this.notifierService.notify('success', "Issue created")
          this.files = []
          this.util.refreshBacklog$.next(true)
          this.modalService.dismissAll()
        }
      })
  }

  // cancelSprint() {
  //   this.selectedSprint.name = ''
  //   this.form.get('sprint')?.setValue('')
  // }
  deleteFile(name: string) {
    let temp = []
    for (let i of this.files) {
      if (i.name != name) temp.push(i)
    }
    this.files = temp
  }
}

