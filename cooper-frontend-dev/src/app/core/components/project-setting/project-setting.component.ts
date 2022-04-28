import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ProjectService } from '../../services/projects/project.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-project-setting',
  templateUrl: './project-setting.component.html',
  styleUrls: ['./project-setting.component.css']
})
export class ProjectSettingComponent implements OnInit {
  people$ = new BehaviorSubject([{}]);
  organisation:string = String(localStorage.getItem('org_name'))
  projectId: any;
  isVisible = false;
  projectRoles:any=[]
  projectKey:string = ''
  constructor(
    private projectService: ProjectService,
    private util: UtilityService,
    private modalService: NzModalService,
    private activeRoute: ActivatedRoute
  ) {
    this.activeRoute.params.subscribe((res: any) => {
      this.projectService
        .getProjectOfCurrentUserByOragnization()
        .subscribe((result: any) => {
          for (let item of result) {
            if (item.key == res.key) {
              this.projectKey = res.key
              this.projectRoles=item.projectRoles;
              this.projectId = item._id;
            }
          }
        });
    });
  }
  form: any = FormGroup;

  ngOnInit(): void {
    this.organisation = String(localStorage.getItem('org_name'))
    this.getUsers();
  }

  initForm() {
    this.form = new FormGroup({
      users: new FormControl(null, [Validators.required]),
      role: new FormControl(null, [Validators.required])
    });
  }
  getUsers() {
    this.initForm();
    this.projectService.getUser().subscribe((value: any) => {
      this.people$.next(value);
    });
  }

  

  submit() {
    console.log(this.form);
    
  }
  changeLeagueOwner(event: any) {
   // console.log(event);
  }
}
