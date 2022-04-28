import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../../../services/utility.service';
import { HttpService } from '../../../services/http.service';
import { environment } from 'src/environments/environment.prod';
import { catchError, filter, map, switchMap, take, throwError } from 'rxjs';
import { userQuery } from '../../state/query';
import { userStore } from '../../state/store';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../global/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loading = false;
  users: any;
  isScrollOrg:boolean = false
  organisationList:any = []
  user: any = { fullName: '', email: '', avatar: '', id: '' }
  organisation: string = String(localStorage.getItem('org_name'))
  organisationId:string = String(localStorage.getItem('organisation'))
  isHide: boolean = false
  hideToggle: boolean = false
  baseUrl = environment.apiHost + '/upload/users/';
  constructor(private router: Router, private util: UtilityService,
    private userService: UserService,
    private http: HttpService,
    private userQuery: userQuery,
    private userStore: userStore,
    private auth:AuthService
  ) { }

  ngOnInit(): void {
    this.getInitialState();
    this.util.refreshSideNavBar$.subscribe(res => {
      this.hideToggle = res
    })
    this.util.refreshHeader$.subscribe((res) => {
      if (res) {
        this.organisation = String(localStorage.getItem('org_name'))
        this.organisationId = String(localStorage.getItem('organisation'))
        let id = String(localStorage.getItem('id'))
        this.http.getData('user/' + id)
        .subscribe((res:any) => {
          this.user = res
          this.organisationList = res.organizations
          // res.organizations.map((value: any, index: number) => {
          //   if (value.organization._id == this.organisation) this.selectedOrganization = value.organization
          // })
          this.userStore.update(state => {
            let user = res
              return {
                ...state,
                user
              }

            })
            console.log('users', this.users)
          })
      }
      this.isHide = res
    })



  }

  scrollOrg(){
    this.isScrollOrg = true
  }
  getInitialState() {
    this.userQuery.getIsLoading().subscribe(res => this.loading = res);
    this.userQuery.getUser().subscribe(res => this.users = res);
    this.userQuery.getLoaded().pipe(
      take(1),
      filter(res => !res),
      switchMap(() => {
        this.userStore.setLoading(true)
        let id = String(localStorage.getItem('id'))
        return this.userService.getUserById1(id);
      })
    ).subscribe(res => {
      this.userStore.update(state => {
        return {
          user: res
        }
      })
      this.userStore.setLoading(false);
    }, error => {
      this.userStore.setLoading(false);
    })
  }
  signOut() {
    localStorage.clear()
    this.util.refreshHeader$.next(false)
    this.router.navigate(['/users/login']);
  }
  selectOrganisation(item:any){
    let temp = ''
    this.auth.switchOrganisation('login-with-organization/' + String(localStorage.getItem('id')), { organization: item._id})
    .pipe(
      map((res:any)=>{
        console.log(res.headers.keys())
          if (res) {
            localStorage.setItem('token',res.headers.get('x-auth-token'))
            localStorage.setItem('organisation', item._id)
            this.util.organisation$.next(item)
            const org = item.organizationName.split(' ')
            org.map((value: any) => {
              temp += value
            })
            localStorage.setItem('org_name',temp)
            this.util.refreshHeader$.next(true)
            this.util.refreshProjectList$.next(true)
            this.router.navigate(['/'+temp+'/project-list'])
          }
      })
    )  
    .subscribe(res => {
    })
  }
}
