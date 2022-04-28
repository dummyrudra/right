import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment.prod';
import { NotifierService } from 'angular-notifier';
import "quill-mention";
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  pluck,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs';
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import "quill-mention";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { UtilityService } from 'src/app/services/utility.service';
import { ProjectService } from 'src/app/core/services/projects/project.service';
import { projectQuery } from 'src/app/core/state/project.query';
import { projectStore } from 'src/app/core/state/project.store';
import { map } from 'jquery';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit,OnChanges {
  @Output() activityEvent: EventEmitter<any> = new EventEmitter();
@Input() history:any;
@Input() comments:any;
@Input() allData:any=[];
@Input() task:any;

members:any;
public notifier: NotifierService;
form2:any=FormGroup;
modules:any;
loading=false;
projects:any;
isComment:boolean=false;
baseUrl=environment.apiHost+'upload/users/'
  tabs = ['all','comment', 'history'];

  constructor(private utilService:UtilityService,
     private projectQuery:projectQuery,
     private projectStore:projectStore,
    private projectService:ProjectService ,private http: HttpService,public notifierService: NotifierService) {this.notifier = notifierService; }

ngOnChanges(){
 // console.log(this.comments)

}

  ngOnInit(): void {
    //this.getInitialState();
    
    this.utilService.projectActiveKey$.getValue();
 this.getProjects()
    this.form2=new FormGroup({
      comment:new FormControl(null)
    })

    this.modules={
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ['emoji']
      ],
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        mentionDenotationChars: ['@','#'],
        // dataAttributes:['id', 'value', 'denotationChar', 'link', 'target','disabled'],
        onSelect: (item:any, insertItem:any) => {
          console.log(item)
          insertItem(item);
          // necessary because quill-mention triggers changes as 'api' instead of 'user'
        },
        source: async (searchTerm:any, renderList:any) => {
          const matchedPeople = await this.getFilteredUsers(searchTerm);
          console.log(matchedPeople)
          renderList(matchedPeople,searchTerm);
        }
      
    },
  
     }
  
  }

  // getInitialState(){
  //   this.projectQuery.getIsLoading().subscribe(res=>this.loading=res);
  //   this.projectQuery.getproject().subscribe(res=>this.projects=res);
  //   this.projectQuery.getLoaded().pipe(
  //     take(1),
  //     filter(res=>!res),
  //     switchMap(()=>{
  //       this.projectStore.setLoading(true)
  //       return this.projectService.getProject();
  //     })
  //   ).subscribe(res=>{
  //     this.projectStore.update(state=>{
  //       return {
  //         projects:res
  //       }
  //     })
  //     console.log('projects',this.projects)
  //     this.projectStore.setLoading(false);
  //   },error=>{
  //     this.projectStore.setLoading(false);
  //   })
  // }

  getProjects(){
    let count = 0;
    this.projectService.getProjectOfCurrentUserByOragnization().subscribe(
      (ress: any) => {
        for (let item of ress) {
          if (item.key == this.utilService.projectActiveKey$.getValue()) {
                this.members=item.members;
           } 
        }
        
      }
    );
  }


  async getFilteredUsers(searchTerm:any): Promise<any> {
   const users:any=[];
    this.members?.map((u:any)=>{
        users.push({
       id:u?.member._id,
       value:u?.member.fullName
        })
    })
    // const users = [
    //   { id: 1, value: 'Test 1'},
    //   { id: 2, value: 'Test 2'},
    //   { id: 3, value: 'Test 3'},
    //   { id: 4, value: 'Test 4'},
    //   { id: 5, value: 'Test 5'},
    // ]
    return users.map((x:any) => {
      if(x.value.toLowerCase().indexOf(searchTerm.toLowerCase())>-1) return x
      });

  }

  setEditModeComment(){
    this.isComment=true;
  }

  editorCreated1(editor: any){
    if (editor && editor.focus) {
      editor.focus();
    }
  }

  saveComment(){
  this.http.patchData('task/' + this.task._id, { message: this.form2.get('comment').value })
  .subscribe(res => {
    console.log('patchTask',res)
    //this.getTask();
    this.isComment=false;
    this.form2.get('comment').setValue('')
     this.activityEvent.emit();
   // this.util.refreshBacklog$.next(true)
  }, (error) =>{ 
  //  this.form2.get('description').setValue(this.descriptionData);
    this.notifier.notify('error', 'Something Went Wrong');
    console.log(error)})
  }
cancelComment(){
  this.isComment=false;
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

}
