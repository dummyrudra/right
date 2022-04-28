import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ProjectService } from '../../services/projects/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BacklogComponent } from '../backlog/backlog.component';
import { UtilityService } from 'src/app/services/utility.service';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit,OnDestroy{
  key: string = ''
  constructor(private util:UtilityService,
    private activeRoute:ActivatedRoute,
    private socket:SocketService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res:any)=>{
      this.util.projectActiveKey$.next(res.key)
      this.key = res.key
      this.socket.joinProject(res.key)
    })
    this.socket.refresh();
    this.util.refreshSideNavBar$.next(true);
  }

  ngOnDestroy():void{
    this.util.refreshSideNavBar$.next(false);
    this.util.projectActiveKey$.next('');
    this.util.openTaskModel$.next('')
    this.socket.leaveProject(this.key)
  }
}
