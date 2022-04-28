import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  initialheader = false
  initialNav = false
  refreshProjectList$ = new BehaviorSubject(false)
  refreshHeader$ = new BehaviorSubject(localStorage.getItem('token') && localStorage.getItem('organisation')?true:false);
  sprintModel$ = new BehaviorSubject({});
  refreshBacklog$ = new BehaviorSubject(true);
  refreshSideNavBar$ = new BehaviorSubject(false);
  projectActiveKey$ = new BehaviorSubject("");
  projectActiveID$ = new BehaviorSubject("");
  openTaskModel$ = new BehaviorSubject('');
  organisation$ = new BehaviorSubject({});
  refreshIssueModal$ = new BehaviorSubject(true)
  openCreateIssueModel$ = new BehaviorSubject({_id:'',projectName:"",avatar:''})
  sprints$ = new BehaviorSubject([])
  constructor(private router:Router) {  
    this.initialheader = this.refreshHeader$.getValue()
    this.initialNav  = this.refreshSideNavBar$.getValue()
   }
}
