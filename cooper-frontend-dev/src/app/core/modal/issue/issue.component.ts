import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ProjectService } from '../../services/projects/project.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskService } from '../../services/tasks/task.service';
import { NotifierService } from 'angular-notifier';
import { catchError } from 'rxjs';
import { UtilityService } from 'src/app/services/utility.service';
import { environment } from '../../../../environments/environment.prod';
import { quillConfiguration } from '../../control/config/editor';
import { map } from 'jquery';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {
  editorOptions:any= quillConfiguration;
  baseUrl:string = environment.apiHost+'upload/projectAvatar/'
  userAvatar:string = environment.apiHost+'upload/users/'
  filename:string = 'Choose attachment'
  submited:boolean = false
  projectList: any = []
  lebals:any = []
  userList: any = []
  tempUserList: any = []
  tempProjectList: any = []
  tempSprintList: any = []
  existingTaskList: any = []
  sprintList: any = []
  files:any = []
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
    projectID: new FormControl('',[Validators.required]),
    issueType: new FormControl('',[Validators.required]),
    summary: new FormControl('',[Validators.required]),
    description: new FormControl(''),
    assigneeID: new FormControl('',[Validators.required]),
    labels: new FormControl(''),
    sprint: new FormControl(''),
    storyPointEstimate: new FormControl(''),
  })
  constructor(private http: HttpService,
    private project: ProjectService,
    private taskServices: TaskService,
    public notifierService: NotifierService,
    public util:UtilityService) { }

  ngOnInit(): void {
    this.util.refreshIssueModal$.subscribe(res=>{
      if(res){
        this.project.getProjectOfCurrentUserByOragnization().subscribe((res: any) => {
          this.projectList = res
          this.tempProjectList = res
          this.selectedProject.name = res[0].projectName
          this.selectedProject.id = res[0]._id
          this.form.get('projectID')?.setValue(res[0]._id)
          this.userList = res[0].members
          this.tempUserList = res[0].members.map((value:any)=>value.member)
          this.selectedUser.fullName = res[0].members[0].member.fullName
          this.selectedUser.id = res[0].members[0].member._id
          this.form.get('assigneeID')?.setValue(res[0].members[0].member._id);
          this.http.getData('sprints/project/' + res[0]._id)
            .subscribe((sprint: any) => {
              this.sprintList = sprint
              this.tempSprintList = sprint
              this.selectedSprint.id = sprint[0]._id
              this.selectedSprint.name = sprint[0].sprintName
              this.form.get('sprint')?.setValue(sprint[0]._id);
            })
        })
        this.form.get('issueType')?.setValue(this.selectedIssue.issue);
      }
    })
  }
  addTagFn(name: any) {
    return name;
  }
  setLabel(event:any) {
    this.lebals = event
  }
  editorCreated(editor: any){
    if (editor && editor.focus) {
      editor.focus();
    }
  }
  selectProject(item: any) {
    this.selectedProject.name = item.projectName
    this.selectedProject.id = item._id
    this.userList = item.members.map((value:any)=>value.member)
    this.tempUserList = item.members.map((value:any)=>value.member)
    this.selectedUser.fullName = item.members[0].member.fullName
    this.selectedUser.id = item.members[0].member._id
    this.form.get('projectID')?.setValue(item._id)
    this.http.getData('sprints/project/' + item._id)
      .subscribe((sprint: any) => {
        this.sprintList = sprint;
        this.tempSprintList = sprint
        if (sprint  .length < 1) {
          this.selectedSprint.name = "No sprint available"
          // this.form.get('sprint')?.setValue('')
        }
        else {
          this.sprintList = sprint
          this.tempSprintList = sprint
          this.selectedSprint.id = sprint[0]._id
          this.selectedSprint.name = sprint[0].sprintName
          this.form.get('sprint')?.setValue(sprint[0]._id);
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
  selectFile(event:any){
    this.filename = ''
    this.files = event.target.files

    for(let item of this.files){
      this.filename += item.name+ ', '
    }
  }

  checkLabel(event:any){
    for(let i of this.existingTaskList){
      if(i.labels == event.target.value) this.form.get('labels')?.setErrors({exist:true})
    }

  }

  
  search(event: any,type:string) {
    if(type=="user"){
      this.tempUserList = []
      this.userList.map((value: any) => {
        if (value?.member?.fullName.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) this.tempUserList.push(value.member)
      })
    }
    else if(type=="project"){ 
      this.tempProjectList = []
      this.projectList.map((value: any) => {
        if (value.projectName.indexOf(event.target.value) > -1) this.tempProjectList.push(value)
      })
    }
    else if(type=="sprint"){
      this.tempSprintList = []
      this.sprintList.map((value: any) => {
        if (value.sprintName.indexOf(event.target.value) > -1) this.tempSprintList.push(value)
      })
    }
  }

  onSubmit() :void{
    let payload = this.form.getRawValue()
    let formData = new FormData()
    for(let i of this.files){
      formData.append('attachment',i);
    }
    for (let i in this.form.getRawValue()) {
      // if(payload[i].length==0 && i=='labels') continue
      if (i=='labels'&& payload[i]?.length>0){
        for(let item of payload[i]){
          formData.append('labels[]',item)
        }
      }
      else if(i!='labels' && payload[i]) formData.append(i, payload[i])
    }
    this.taskServices.postTask(formData)
    .pipe(
      catchError((err) => {
        //Handle the error here
        if(err.error.status) this.notifierService.notify('error',"Something went wrong")

        throw Error(err);    //Rethrow it back to component
      })
    )
    .subscribe(res => {
      if(res){
          this.form.reset()
          this.submited = true
          this.notifierService.notify('success',"Issue created")
          this.files = []
          this.util.refreshBacklog$.next(true)
          this.ngOnInit()
      }
    })
  }

  cancelSprint(){
    this.selectedSprint.name = ''
    this.form.get('sprint')?.setValue('')
  }
  deleteFile(name:string){
    let temp = []
    for(let i of this.files){
      if(i.name!=name) temp.push(i)
    }
    this.files = temp
  }
}
