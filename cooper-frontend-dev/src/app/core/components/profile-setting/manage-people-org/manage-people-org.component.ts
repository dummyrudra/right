import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/core/services/projects/project.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, pluck, tap } from 'rxjs';
import { projectMembersStore } from 'src/app/core/state/members/member.store';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
import { projectMembersQuery } from 'src/app/core/state/members/member.query';
import { OrderPipe } from 'ngx-order-pipe';
import { ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';
import { HttpService } from '../../../../services/http.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { map } from 'jquery';


@Component({
  selector: 'app-manage-people-org',
  templateUrl: './manage-people-org.component.html',
  styleUrls: ['./manage-people-org.component.css']
})
export class ManagePeopleOrgComponent implements OnInit {


  @Input() projectId: any;
  @Input() projectRoles: any;
  orgID = String(localStorage.getItem('organisation'))
  userId = String(localStorage.getItem('id'))
  confirmModal?: NzModalRef;
  orgUsers: any = [];
  tempOrg: any = []
  config: any;
  cloneAllMembers: any
  page: number = 1;
  loading: boolean = false;
  people$ = new BehaviorSubject([{}]);
  allMembers: any;

  members = [{
    id: 1, label: "Admin"
  }, {
    id: 2, label: "Member"
  }]
  order: string = 'fullName';
  reverse: boolean = false;
  caseInsensitive: boolean = false;
  sortedCollection: any = [];
  form = new FormGroup({
    members: new FormControl(null, [Validators.required,Validators.email]),
    role: new FormControl(null, [Validators.required]),
    searchItem: new FormControl(null)
  });
  roles:any = []
  constructor(private projectService: ProjectService,
    private orderPipe: OrderPipe,
    private util: UtilityService,
    private http: HttpService,
    private activeRoute: ActivatedRoute,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private projectMembersStore: projectMembersStore, private projectMembersQuery: projectMembersQuery) {
    this.config = {
      itemsPerPage: 2,
      currentPage: 1,
      totalItems: this.allMembers?.length
    };

  }


  // ngOnChanges() {
  //   this.loading = true;
  //   if (this.projectId) {
  //     this.getInitialState();
  //   }

  // }

  initForm() {
    this.form = new FormGroup({
      members: new FormControl(null, [Validators.required,Validators.email]),
      role: new FormControl(null, [Validators.required]),
      searchItem: new FormControl(null)
    })
  }

  ngOnInit(): void {
    this.http.getData('organization/'+this.orgID)
    .subscribe((res:any)=>{
      this.roles = res?.organizationRoles
      console.log(this.roles,res)
    })
    this.getUsers();
  }


  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }

  getUsers() {
    this.orgID = String(localStorage.getItem('organisation'))
    this.userId = String(localStorage.getItem('id'))
    this.projectService.getUserByOrg().subscribe((value: any) => {
      this.orgUsers = value;
      value.map((data:any,index:number)=>{
        for(let item of data.organizations){
          if(item.organization._id==this.orgID) this.orgUsers[index].roles = item.role
        }
      })
    });
    console.log(this.orgUsers)
  }



  getInitialState() {
    this.projectMembersStore.setLoading(true)
    this.projectMembersQuery.getIsLoading().subscribe(res => this.loading = res);
    this.projectMembersStore.setLoading(true)
    this.projectMembersQuery.getOrgUser().subscribe(res => this.allMembers = res);
    this.projectMembersQuery.getLoaded().pipe(
      take(1),
      filter(res => !res),
      switchMap(() => {
        this.projectMembersStore.setLoading(true)
        return this.projectService.getMembersByProjectId(this.projectId);
      })
    ).subscribe((res: any) => {
      // console.log('data',res)
      this.cloneAllMembers = res;
      this.config = {
        itemsPerPage: 5,
        currentPage: 1,
        totalItems: res?.length
      };
      this.projectMembersStore.update(state => {
        return {
          projectMembers: res
        }
      })

      this.userNotInvited(res);

      // this.orgUsers=this.orgUsers?.filter((value:any)=> res?.includes(value));
      this.sortedCollection = this.orderPipe.transform(this.allMembers, 'fullName');
      this.projectMembersStore.setLoading(false);
    }, error => {
      this.projectMembersStore.setLoading(false);
    })
  }
  addTagFn(name: any) {
    let re = /\S+@\S+\.\S+/
    if(re.test(name)) return name
    return;
  }
  userNotInvited(res: any) {
    let tempOrg = []
    tempOrg = this.orgUsers.filter((value: any) => {
      let flag = false
      for (let item of res) {
        if (value._id == item.member._id) flag = true
      }
      if (!flag) {
        return true
      }
      else return false
    })
    this.tempOrg = tempOrg
  }

  stringToHslColor(str: any) {
    var hash = 0;
    if (str) {
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }

      var h = hash % 360;
      return 'hsl(' + h + ', ' + 50 + '%, ' + 40 + '%)';
    }
    else {
      return;
    }
  }
  submit(){
    if(this.form.invalid) return
    let payload = this.form.getRawValue()
    delete payload.searchItem
    this.http.patchData('organization/add-members/'+this.orgID,payload)
    .subscribe(res=>{
      this.getUsers()
    })
  }
  // submit() {
  //   let data = {
  //     members: this.form.get('members')?.value,
  //     role: this.form.get('role')?.value
  //   }
  //   if (this.form.valid) {
  //     this.projectService.addNewMembersInProject(this.projectId, data).subscribe((res) => {
  //       this.projectMembersStore.setLoading(true);
  //       this.form.reset();

  //       this.projectMembersStore.update(state => {
  //         let ab = [
  //           ...state.projectMembers,
  //           ...res
  //         ]
  //         this.cloneAllMembers = ab;
  //         return {
  //           projectMembers: [
  //             ...state.projectMembers,
  //             ...res
  //           ]
  //         }

  //       });
  //       this.projectMembersStore.setLoading(false);
  //       this.userNotInvited(this.allMembers);

  //     }, (error) => {
  //       this.notification.create(
  //         'error',
  //         'Member',
  //         error.msg,
  //         { nzPlacement: 'topRight' }
  //       );
  //     })
  //   }
  // }

  changeLeagueOwner(event: any) {
    // console.log(event)
  }
  showConfirm(item: any): void {
    this.DeleteList(item);
  }


  DeleteList(item: any) {
    //console.log(item)
    let title = `${item?.member?.fullName}`;
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Remove ' + title,
      nzContent: `<div>
       <p class="">You're about to remove this user from this project,all of his/her permission will be removed.
       </p>
     </div>`,
      nzOkText: 'Remove',
      nzCancelText: 'Cancel',
      nzOkDanger: true,

      nzOnOk: () =>
        new Promise(resolve => {

          this.http.patchData('organization/remove-member/'+this.orgID, { member: item?._id })
          .subscribe(
            res => {
            this.getUsers()
            }
          );

          setTimeout(resolve, 100);
        })
    });
  }


  filterByNameOrEmail() {
    let val = this.form.get('searchItem')?.value
    if (val) {
      let res = this.cloneAllMembers.filter((u: any) => u.fullName.toLowerCase().match(val.toLowerCase().trim()))
      this.projectMembersStore.setLoading(true);
      this.projectMembersStore.update(state => {
        return {
          projectMembers: res
        }
      })

      this.projectMembersStore.setLoading(false);
    }
    else {

      this.projectMembersStore.setLoading(true);
      this.projectMembersStore.update(state => {

        return {
          projectMembers: this.cloneAllMembers
        }
      })

      this.projectMembersStore.setLoading(false);
    }

  }


  ngAfterViewInit() {
    this.form.valueChanges
      .pipe(
        tap(() => {
          // this.isSpinning = true;
          // this.isSelected=[];
        }),
        pluck('searchItem'),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(

          async data => this.filterByNameOrEmail()
          // this.projectService.getTaskBySummary(data)
        )
      )
      .subscribe((value: any) => {
        //console.log('v',value)

        // this.isSpinning = false;
      });
  }

}
