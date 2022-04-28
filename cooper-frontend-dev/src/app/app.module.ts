import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AppComponent } from './app.component';
import { GlobalModule } from './global/global.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateProjectModalComponent } from './core/modal/create-project-modal/create-project-modal.component';
import { HeaderComponent } from './core/components/header/header.component';
import { ProjectsListComponent } from './core/components/projects-list/projects-list.component';
import { NotifierModule } from 'angular-notifier';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MyProfileComponent } from './core/components/my-profile/my-profile.component';
import { IssueComponent } from './core/modal/issue/issue.component';
import { EditProjectModalComponent } from './core/components/edit-project-modal/edit-project-modal.component';
import { SideNavbarComponent } from './core/components/side-navbar/side-navbar.component';
import { BacklogComponent } from './core/components/backlog/backlog.component';
import { TaskCardComponent } from './core/modal/task-card/task-card.component';
import { SprintComponent } from './core/modal/sprint/sprint.component';
import { ProjectComponent } from './core/components/project/project.component';
import { ProfileSettingComponent } from './core/components/profile-setting/profile-setting.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgbAccordionModule} from '@ng-bootstrap/ng-bootstrap';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzSpinModule} from 'ng-zorro-antd/spin'
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ProjectSettingComponent } from './core/components/project-setting/project-setting.component';
import { BoardDndComponent } from './core/components/board/board-dnd/board-dnd.component';
import { BoardComponent } from './core/components/board/board/board.component';
import { AddPeopleModalComponent } from './core/components/board/add-people-modal/add-people-modal.component';
import { BoardModalComponent } from './core/components/board/board-modal/board-modal.component';
import { TaskComponent } from './core/modal/task/task.component';
import { ListComponent } from './core/components/list/list.component';
import { CreateIssueModalComponent } from './core/modal/create-issue-modal/create-issue-modal.component';
import { AvatarComponent } from './core/control/avatar/avatar.component';
import { UserComponent } from './core/components/user/user.component';
import { QuillModule } from 'ngx-quill'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ActivityComponent } from './core/modal/task/activity/activity/activity.component';
import { DescriptionComponent } from './core/modal/task/activity/description/description.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NamePipePipe } from './core/pipes/name-pipe.pipe';
import { ManagePeopleComponent } from './core/components/project-setting/manage-people/manage-people.component';
import { OrderModule } from 'ngx-order-pipe';
import { WorkComponent } from './core/components/work/work.component';
import { RoadMapComponent } from './core/components/road-map/road-map.component';
import { NotificationComponent } from './core/components/notification/notification.component'
import { ManageListComponent } from './core/components/project-setting/manage-list/manage-list.component'
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { TaskPageComponent } from './core/components/task-page/task-page.component';
import { ManageIssuteytypeComponent } from './core/components/project-setting/manage-issuteytype/manage-issuteytype.component'
import {MatTooltipModule} from '@angular/material/tooltip';
import { ManagePeopleOrgComponent } from './core/components/profile-setting/manage-people-org/manage-people-org.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateProjectModalComponent,
    HeaderComponent,
    ProjectsListComponent,
    MyProfileComponent,
    IssueComponent,
    EditProjectModalComponent,
    SideNavbarComponent,
    BacklogComponent,
    TaskCardComponent,
    SprintComponent,
    ProjectComponent,
    ProfileSettingComponent,
    ProjectSettingComponent,
    BoardDndComponent,
    BoardComponent,
    AddPeopleModalComponent,
    BoardModalComponent,
    TaskComponent,
    ListComponent,
    CreateIssueModalComponent,
    AvatarComponent,
    UserComponent,
    ActivityComponent,
    DescriptionComponent,
    NamePipePipe,
    ManagePeopleComponent,
    WorkComponent,
    RoadMapComponent,
    ManageListComponent,
    NotificationComponent,
    TaskPageComponent,
    ManageIssuteytypeComponent,
    ManagePeopleOrgComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NzToolTipModule,
    OrderModule,
    FormsModule,
    NgxPageScrollModule,
    NzSelectModule ,
    NzIconModule,
    NzTabsModule,
    GlobalModule,
    NzNotificationModule,
    NzModalModule,
    NzTreeModule,
    HttpClientModule,
    NzResultModule,
    NgxPageScrollCoreModule,
    NzUploadModule,
    NzButtonModule,
    NzMessageModule ,
    BrowserAnimationsModule,
    NzSpinModule,
    NgxDatatableModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    DragDropModule,
    NgbAccordionModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    ClipboardModule,
    MatTooltipModule,
    QuillModule.forRoot(),
    NotifierModule.withConfig({
      // Custom options in here
      position: {
        horizontal: {
          position: 'left',
          distance: 12,
        },
        vertical: {
          position: 'top',
          distance: 12,
          gap: 10,
        },
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
