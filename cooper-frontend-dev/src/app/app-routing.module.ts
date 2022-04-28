import { RoadMapComponent } from './core/components/road-map/road-map.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsListComponent } from './core/components/projects-list/projects-list.component';
import { AuthGuard } from './guards/auth.guard';
import { BacklogComponent } from './core/components/backlog/backlog.component';
import { MyProfileComponent } from './core/components/my-profile/my-profile.component';
import { ProjectComponent } from './core/components/project/project.component';
import { ProfileSettingComponent } from './core/components/profile-setting/profile-setting.component';
import { ProjectSettingComponent } from './core/components/project-setting/project-setting.component';
import { BoardComponent } from './core/components/board/board/board.component';
import { ListComponent } from './core/components/list/list.component';
import { TaskPageComponent } from './core/components/task-page/task-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: `/${String(localStorage.getItem('org_name'))}/project-list`,
    pathMatch: 'full'

  },
  {
    path: ':name/project-list',
    component: ProjectsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':name/my-profile/:id',
    component: MyProfileComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path:'project',
  //   component:BacklogComponent,
  //   canActivate:[AuthGuard]
  // },
  // {
  //   path: String(localStorage.getItem('org_name'))+'/project/:key',
  //   component: ProjectComponent,
  //   children: [{
  //     path: '',
  //     component: BacklogComponent,
  //   },
  //   ],
  // },
  // {
  //   path: 'project',
  //   component: BacklogComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: ':name/project/:key',
    component: ProjectComponent,
    canActivate:[AuthGuard],
    children: [{
      path: 'backlog',
      component: BacklogComponent,
    },
    {

      path: 'board',
      component: BoardComponent,
    },
    {

      path: 'list',
      component: ListComponent,
    },
    {

      path: 'road-map',
      component: RoadMapComponent,
    }
    ],
  },
  {
    path: ':name/project/:key/settings',
    component: ProjectSettingComponent,
    canActivate: [AuthGuard]
  },
  {
    path:':name/project/:key/:SN',
    component:TaskPageComponent,
    canActivate:[AuthGuard]
  },
  {
    path: ':name/profile-setting/:id',
    component: ProfileSettingComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
