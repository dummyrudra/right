import { Component, Input,  EventEmitter,OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { ProjectService } from 'src/app/core/services/projects/project.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UtilityService } from 'src/app/services/utility.service';
@Component({
  selector: 'app-add-people-modal',
  templateUrl: './add-people-modal.component.html',
  styleUrls: ['./add-people-modal.component.css']
})
export class AddPeopleModalComponent implements OnInit {
  @Input() pId:any;
  @Output() addMemberEvent: EventEmitter<any> = new EventEmitter()
isVisible=false;
isLoading=false;
isDisabled=true;
users:any;
peopleForm:any=FormGroup;
  constructor(private projectService:ProjectService,
    private notification: NzNotificationService,
    private util:UtilityService) { }

  ngOnInit(): void {
    this.peopleForm=new FormGroup({
      members:new FormControl(null,[Validators.required])
    })
    this.getUser();
  }

  
  addTagFn(name: any) {
    return name;
  }
  getUser(){
    this.projectService.getUserByOrg().subscribe((value)=>{
      this.users=value;
     // console.log('user',value)
    },(err)=>{
      console.log(err)
    })
  }
submit(){
  if(this.peopleForm.valid){
    this.projectService.addNewMembers(this.pId,this.peopleForm.value).subscribe(()=>{
      this.util.refreshIssueModal$.next(true)
       this.addMemberEvent.emit();
       this.peopleForm.reset();
    },(error)=>{
      this.notification.create(
        'error',
        'Task',
        error.msg,
        { nzPlacement: 'topRight'}
      );
    })
  }
}


}
