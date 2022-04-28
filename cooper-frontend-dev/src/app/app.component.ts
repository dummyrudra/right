import { AfterContentInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from './services/utility.service';
import { ProjectService } from './core/services/projects/project.service';
import { SocketService } from './services/socket.service';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterContentInit {
  title = 'cooper';
  isHide: boolean = false
  sideNav: boolean = false
  constructor(
    private router: Router,
    private util: UtilityService,
    private http: HttpService,
    private socket: SocketService
  ) {

  }

  ngOnInit(): void {
    this.util.refreshHeader$.subscribe((res: any) => {
      this.isHide = res
      if(localStorage.getItem('organisation')=='null'){
        this.router.navigate(['users/choose-company'])
      }
      this.http.getData('organization/' + String(localStorage.getItem('organisation')))
        .subscribe((res: any) => {
          // console.log(res)
          this.util.organisation$.next(res)
          const org = res.organizationName.split(' ')
          let temp = ''
          org.map((value: any) => {
            temp += value
          })
          localStorage.setItem('org_name', temp)
        })
        this.socket.joinOrganization()
    })
    this.util.refreshSideNavBar$.subscribe((res:any)=>{
      this.sideNav = res
    })
    // this.proj.getProjectOfCurrentUserByOragnization().subscribe((res:any) => this.proj.projectList$.next(res))
  }
  ngAfterContentInit(): void {
  }
  openXl(){
    this.util.openTaskModel$.next('1213')
  }
  

  
}
