import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { ProjectService } from '../../services/projects/project.service';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import * as $ from 'jquery';
import { UtilityService } from 'src/app/services/utility.service';
@Component({
  selector: 'create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.css']
})
export class CreateProjectModalComponent implements OnInit {
  @Output() parentFunction: EventEmitter<any> = new EventEmitter();
  private notifier: NotifierService;
  Form: any = FormGroup;
  ProjectLead$ = new BehaviorSubject([{}]);
  errorMsg: any;
  fileName: any;
  fileDate: any;
  keyError: any;
  keyMsg: any = false;
  projectList = [];
  allProjectType = [{ id: 1, name: 'scrum' }];
  initForm() {}
  constructor(
    private projectService: ProjectService,
    public notifierService: NotifierService,
    private util:UtilityService
  ) {
    this.notifier = notifierService;

    this.Form = new FormGroup({
      projectName: new FormControl(null, [Validators.required]),
      key: new FormControl(null, [Validators.required]),
      url: new FormControl(null),
      projectLead: new FormControl(null, [Validators.required]),
      projectType: new FormControl(null),
      avatar: new FormControl(null),
      description: new FormControl(null)
    });
    this.projectList = this.projectService.projectList$.getValue();
  }

  ngOnInit(): void {
    this.Form.reset();
    this.Form.get('projectName').valueChanges.subscribe((value: any) => {
      // console.log(this.makeid(4,value));

      this.Form.get('key').setValue(
        this.makeid(4, value) ? this.makeid(4, value) : null
      );
    });

    this.projectService.getUserByOrg().subscribe((value: any) => {
      // console.log(value)
      this.ProjectLead$.next(value);
    });
    this.Form.get('key').valueChanges.subscribe((value: any) => {
      let len = this.projectService.projectList$
        .getValue()
        .filter((u: any) => u.key == value);
      if (len.length > 0) {
        this.keyError = 'Project key already exists';
      } else {
        this.keyError = '';
      }
    });
  }

  //   validateUniqueKey(pk:any){
  //      var result           = '';
  //   var characters       = `${pk}`;
  //   var charactersLength = characters.length;
  //   for ( var i = 0; i < 1; i++ ) {
  //     result += characters.charAt(Math.floor(Math.random() *
  // charactersLength));
  //  }
  //  result=pk[0]+pk[1]+result;
  // let len1=this.projectService.projectList$.getValue().filter((u:any)=>u.key==result)
  //  this.Form.get('key').setValue(result.toLocaleUpperCase());
  // }

  checkProjectKey(ev: any) {
    this.keyMsg = true;
    let pk = this.Form.get('key').value;
    let len = this.projectService.projectList$
      .getValue()
      .filter((u: any) => u.key == pk);
    console.log(this.projectService.projectList$.getValue(), len);
    if (len.length > 0) {
      var result = '';
      var characters = `${pk}`;
      var charactersLength = characters.length;
      for (var i = 0; i < 1; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      result = pk[0] + pk[1] + result;
      this.Form.get('key').setValue(result.toLocaleUpperCase());
      return true;
    } else {
      return false;
    }
  }

  makeid(length: any, value: any) {
    let sp = value?.split(' ');
   // console.log(sp);
    if (sp && sp?.length > 1) {
      let matches = value.match(/\b(\w)/g);
      let acronym = matches.join(''); // JSON

      //console.log('key',acronym.toUpperCase())
      return acronym.toUpperCase();
    } else if (sp &&sp?.length == 1) {
      return value.substring(0, 3).toUpperCase();
    } else return;
  }
  changeLeagueOwner(event: any) {}
  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileDate = file;
      this.fileName = file.name;
      // this.Form.get('avatar').setValue(file.name);
    }
  }

  submit() {
    if (!this.Form.valid) return this.Form.markAllAsTouched();

    this.fileName = null;
    if (this.Form.valid) {
      const formData = new FormData();
      formData.append('avatar', this.fileDate);
      formData.append('projectName', this.Form.get('projectName').value);
      formData.append('key', this.Form.get('key').value);
      formData.append('projectType', this.Form.get('projectType').value);
      formData.append('projectLead', this.Form.get('projectLead').value);
      formData.append('description', this.Form.get('description').value);
      formData.append('url', this.Form.get('url').value);
      this.parentFunction.emit(formData);
      this.Form.reset();
    }
  }
cancel(){
  this.Form.reset();
  this.fileName=''
}

}
