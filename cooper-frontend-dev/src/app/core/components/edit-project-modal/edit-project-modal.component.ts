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
@Component({
  selector: 'edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./edit-project-modal.component.css']
})
export class EditProjectModalComponent implements OnInit, OnChanges {
  @Input('projectDetails') projectDetails: any;
  @Output() editParentFunction: EventEmitter<any> = new EventEmitter();

  private notifier: NotifierService;
  keyError: any;
  EditForm: any = FormGroup;
  ProjectLead$ = new BehaviorSubject([{}]);
  errorMsg: any;
  keyMsg: any = false;
  fileName: any;
  fileDate: any;
  titleName = new BehaviorSubject('');
  allProjectType = [{ id: 1, name: 'scrum' }];
  initForm() {}
  constructor(
    private projectService: ProjectService,
    public notifierService: NotifierService
  ) {
    this.notifier = notifierService;

    this.EditForm = new FormGroup({
      projectName: new FormControl(null, [Validators.required]),
      key: new FormControl(null, [Validators.required]),
      url: new FormControl(null),
      projectLead: new FormControl(null, [Validators.required]),
      projectType: new FormControl(null),
      avatar: new FormControl(null),
      description: new FormControl(null)
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    let temp = changes['projectDetails']?.currentValue;
    this.EditForm.get('projectName').setValue(temp?.projectName);
    this.EditForm.get('key').setValue(temp?.key);
    this.EditForm.get('projectType').setValue(temp?.projectType);
    this.EditForm.get('description').setValue(temp?.description);
    this.EditForm.get('url').setValue(temp?.url);
    this.EditForm.get('projectLead').setValue(temp?.projectLead?._id);
  }

  ngOnInit(): void {
    this.EditForm.get('projectName').valueChanges.subscribe((value: any) => {
      // console.log(this.makeid(4,value));
      if (value) {
        this.EditForm.get('key').setValue(
          this.makeid(4, value) ? this.makeid(4, value) : null
        );
      }
    });

    this.projectService.getUserByOrg().subscribe((value: any) => {
      // console.log(value)
      this.ProjectLead$.next(value);
    });
    this.EditForm.get('key').valueChanges.subscribe((value: any) => {
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

  checkProjectKey(ev: any) {
    this.keyMsg = true;
    let pk = this.EditForm.get('key').value;
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
      this.EditForm.get('key').setValue(result.toLocaleUpperCase());
      return true;
    } else {
      return false;
    }
  }
  makeid(length: any, value: any) {
    let sp = value?.split(' ');
    console.log(sp);
    if (sp && sp.length > 1) {
      let matches = value.match(/\b(\w)/g);
      let acronym = matches.join(''); // JSON

      return acronym.toUpperCase();
    } else if (sp.length == 1) {
      return value.substring(0, 3);
    } else return;
  }

  //   makeid(length:any,value:any) {
  //     if(value){
  //     var result           = '';
  //     var characters       = `${value}0123456789`;
  //     var charactersLength = characters.length;
  //     for ( var i = 0; i < length; i++ ) {
  //       result += characters.charAt(Math.floor(Math.random() *
  //  charactersLength));
  //    }
  //    return value[0]+result;
  //   }
  //   else
  //   return;
  // }
  changeLeagueOwner(event: any) {}
  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileDate = file;
      this.fileName = file.name;
      // this.Form.get('avatar').setValue(file.name);
    }
  }

hideAvatar(){
  this.fileName = '';
}

  submit() {
    if (!this.EditForm.valid) return this.EditForm.markAllAsTouched();
    if (this.EditForm.valid) {
      const formData = new FormData();
      // console.log(this.fileDate)
      formData.append('avatar', this.fileDate);
      formData.append('projectName', this.EditForm.get('projectName').value);
      formData.append('key', this.EditForm.get('key').value);
      formData.append('projectType', this.EditForm.get('projectType').value);
      formData.append('projectLead', this.EditForm.get('projectLead').value);
      formData.append('description', this.EditForm.get('description').value);
      formData.append('url', this.EditForm.get('url').value);

      this.editParentFunction.emit(formData);

      this.EditForm.reset();
      this.fileName = '';
    }
  }
}
