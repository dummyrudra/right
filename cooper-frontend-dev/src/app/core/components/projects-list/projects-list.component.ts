import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { ProjectService } from '../../services/projects/project.service';
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
import { NotifierService } from 'angular-notifier';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProjectList } from '../../Interface/project-list';
import { environment } from '../../../../environments/environment.prod';
import { projectQuery } from '../../state/project.query';
import { projectStore } from '../../state/project.store';
import { UtilityService } from 'src/app/services/utility.service';
@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  private notifier: NotifierService;
  loading=false;
  projects=[];

  Form1: any = FormGroup;
  projectDetails: any;
  page: number = 1;
  isSpinning = false;
  config: any;
  deleteProjectId: any;
  organisation:string = String(localStorage.getItem('org_name'))
  errorTitle:number=0;
  errorMsg='';
  isError=false;
  heroes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  colors: any = '#000000';
  projectList: any = [];
  
  baseUrl = environment.apiHost +'upload/projectAvatar/';
  setId: any;
  optionsWithFeatures = {
    rowClickEvent: true,
    rowPerPageMenu: [5, 10, 20, 30],
    rowPerPage: 5
  };

  ProjectLead = [
    {
      label: 'Product Discovery',
      id: 1
    },
    {
      label: 'Software',
      id: 2
    },
    {
      label: 'Business',
      id: 3
    }
  ];

  constructor(
    private projectService: ProjectService,
    private changeDetector: ChangeDetectorRef,
    public notifierService: NotifierService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private projectQuery:projectQuery,
    private projectStore:projectStore,
    private util:UtilityService
  ) {
    this.notifier = notifierService;
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.projectList.length
    };
    this.projectList = this.projectService.projectList$.getValue();
    this.Form1 = new FormGroup({
      searchItem: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.util.refreshProjectList$.subscribe(res=>{
      if(res) {
        this.getProject();
        this.organisation = String(localStorage.getItem('org_name'))
      }
    })
    this.getProject();
  }

  stringToHslColor(str: any) {
    var hash = 0;
    if(str){
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + 30 + '%, ' + 40 + '%)';
  }
  else{
    return ;
  }
  }

  ngAfterViewInit() {
    this.Form1.valueChanges
      .pipe(
        tap(()=>{
          this.isSpinning = true;
        }),
        pluck('searchItem'),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(async data =>
          this.projectService.getProjectListBySearch(data)
        )
      )
      .subscribe((value: any) => {
        // value.subscribe((data:any)=>{
        //   console.log(data)
        // })
        this.projectList = value;
        this.config = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: this.projectList.length
        };
        this.isSpinning = false;
      });
  }

  editProject(id: any) {
    this.setId = id;
    this.projectService.getProjectByUserId(id).subscribe(
      data => {
        this.projectDetails = data;
      },
      error => {}
    );
  }

  DeleteProject() {
    this.projectService.deleteProject(this.deleteProjectId).subscribe(
      data => {
        this.util.refreshIssueModal$.next(true)
        this.getProject();
        this.projectStore.setLoading(true);
        this.projectStore.update(state=>{
          return{
              ...state,
              projects:state.projects.filter((t:any)=>t._id!==this.deleteProjectId)
           
          }
        })
        this.notification.create(
          'success',
          'Project',
          'Project Deleted Successfully !',
          { nzPlacement: 'topRight'}
        );
        this.projectStore.setLoading(false);
      },
      error => {
        this.projectStore.setLoading(false);
        this.notification.create(
          'error',
          'Project',
          'Something Went Wrong!',
          { nzPlacement: 'topRight'}
        );
      }
    );
  }

  delete(id: any) {
    this.deleteProjectId = id;
  }

  onSort(ev: any) {}
  onPage(event: any) {}
  changeLeagueOwner(event: any) {}

  // getRandomColor() {
  //   var color = Math.floor(0x1000000 * Math.random()).toString(16);
  //   this.colors = '#' + ('000000' + color).slice(-6);
  //   return '#' + ('000000' + color).slice(-6);
  // }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }



  getProject() {
    this.isSpinning = true;
    this.projectService.getProjectOfCurrentUserByOragnization().subscribe(
      (data: any) => {
       // console.log('data',data)
        this.projectService.projectList$.next(data);
        this.projectList = data;
      
        this.config = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: this.projectList.length
        };
      
        this.isSpinning = false;
      },
      error => {
        this.isSpinning = false;
        this.isError=true;
        this.errorTitle=Number(error.status);
      //  console.log(this.errorTitle)
       
        //console.log(error.status,error.msg);
      }
    );
  }

  editParentFunction(data: any) {
    this.projectService
      .editProjectByUserId(this.setId, data)
      .pipe(
        tap(response => {
          this.notification.create(
            'success',
            'Project',
            'Project  Updated Successfully !',
            { nzPlacement: 'topRight'}
          );
          this.getProject();
        })
      )
      .subscribe(() => {},(error)=>{
       // console.log(error)
       
        this.notification.create('error','Project' ,error.msg, { nzPlacement: 'topRight'});
      });
  }

  parentFunction(data: ProjectList) {
    this.projectService
      .addNewProject(data)
      .pipe(
        tap(response => {
          this.projectStore.setLoading(true);
          this.notifier.notify('success', 'Project Successfully Added!');
          this.projectStore.update(state=>{
            return{
              projects:[
                ...state.projects,
               response
              ]
            }
          })
          this.projectStore.setLoading(false);
          this.getProject();
        }),
        catchError(({ error }) => {
          this.notifier.notify('error', 'Something Went Wrong');
          this.projectStore.setLoading(false);
          return of(error);
        })
      )
      .subscribe((res) => {
        this.util.refreshIssueModal$.next(true);
      });
  }


}
