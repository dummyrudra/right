import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {
  organisation:string = String(localStorage.getItem('org_name'))
  isHide:boolean = true
  activeKey:string = ''
  showFiller:boolean = false
  constructor(private util:UtilityService,private router:Router) { }

  ngOnInit(): void {
    this.util.refreshSideNavBar$.subscribe(res=>{
      this.organisation = String(localStorage.getItem('org_name'))
      this.isHide = res
    })
    this.util.projectActiveKey$.subscribe(res=>{
      this.activeKey = res
    })
  }
  signOut(){
    localStorage.clear()
    this.util.refreshHeader$.next(false)
    this.router.navigate(['/users/login']);
  }


}
