import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/core/services/projects/project.service';
import { listQuery } from 'src/app/core/state/list/list.query';
import { listStore } from 'src/app/core/state/list/list.store';
import { filter, switchMap, take , map } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpService } from '../../../../services/http.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
@Component({
  selector: 'app-manage-list',
  templateUrl: './manage-list.component.html',
  styleUrls: ['./manage-list.component.css']
})
export class ManageListComponent implements OnInit, OnChanges {
  @Input() projectId: any;
 
  loading = false;
  inputField: any = []
  board: any;
  list: any;
  isListOkLoading = false;
  Form: any = FormGroup;
  isVisible = false;
  confirmModal?: NzModalRef;
  constructor(
    private listQuery: listQuery,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private listStore: listStore,
    private projectService: ProjectService,
    private http: HttpService
  ) { }

  ngOnInit(): void {
    //console.log('jji')
    this.Form = new FormGroup({
      listName: new FormControl(null, [Validators.required])
    });
  }

  ngOnChanges() {
    this.getInitialState();
  }

  getInitialState() {
    this.listStore.setLoading(true);
    this.listQuery.getIsLoading().subscribe(res => (this.loading = res));
    this.listStore.setLoading(true);
    this.listQuery.getList().subscribe(res => (this.list = res));
    this.listQuery
      .getLoaded()
      .pipe(
        take(1),
        filter(res => !res),
        switchMap(() => {
          this.listStore.setLoading(true);
          return this.projectService.getListOfProject(this.projectId);
        })
      )
      .subscribe(
        (res: any) => {
          this.listStore.update(state => {
            return {
              list: res
            };
          });
          this.listStore.setLoading(false);
          this.list.map((value: any) => {
            this.inputField.push(false)
          })
        },
        error => {
          this.listStore.setLoading(false);
        }
      );
  }

  DeleteList(item: any) {
    let title = `${item?.listName}`;
    let load = false;
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Delete ' + title,
      nzContent: `<div>
       <p class="">You're about to permanently delete this list,all of its issue will shift to previous list its data.
       </p>
       <p> If you're not sure, you can resolve or close this list instead</p>
     </div>`,
      nzOkText: 'Delete',
      nzCancelText: 'Cancel',
      nzOkDanger: true,

      nzOnOk: () =>
        new Promise(resolve => {
          if (this.list?.length > 1) {
            this.projectService.deleteList(item?._id).subscribe(
              res => {
                this.inputField.pop()
                this.listStore.setLoading(true);
                this.listStore.update(state => {
                  return {
                    ...state,
                    list: state.list.filter((t: any) => t._id !== item?._id)
                  };
                });
              },
              error => {
                this.notification.create('error', 'Task', error.msg, {
                  nzPlacement: 'topRight'
                });
              }
            );
          } else {
            this.showConfirm1();
          }
          setTimeout(resolve, 500);
        })
    });
  }
  showConfirm1(): void {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Warning',
      nzContent:
        'Can not delete,There must be more than one list required ,then only you can delete',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 100);
        }).catch(() => console.log('Oops errors!'))
    });
  }

  showConfirm(item: any): void {
    this.DeleteList(item);
  }

  handleListCancel() {
    this.isVisible = false;
  }
  handleListOk() {
    this.isVisible = false;
    let obj=this.Form.value;
    //console.log('id',this.projectId)
    this.projectService.addNewList(this.projectId, obj).subscribe(
      (res) => {
        this.inputField.push(false)
      //  this.getAllList1(this.pId);
    this.listStore.setLoading(true);
     // console.log(res,this.list);
      this.listStore.update(state => {
       return{
        list:[
          ...state.list,
         res
        ]
       }
      });
      this.listStore.setLoading(false);
      },
      error => {
        this.notification.create(
          'error',
          'Task',
          error.msg,
          { nzPlacement: 'topRight'}
        );
      }
    );
  }

  openModal() {
    this.isVisible = true;
  }

  changeField(i: number) {
    // this.inputField[index] = !this.inputField[index]
    this.inputField.map((value: any, index: any) => {
      if (index == i) this.inputField[index] = !this.inputField[index]
      else this.inputField[index] = false
    })
  }
  changeListName(event: any, i: number) {
    if (!event.value) return
    this.inputField.map((value: any, index: any) => {
      if (index == i) this.inputField[index] = !this.inputField[index]
      else this.inputField[index] = false
    })
    this.http.patchData('list/' + this.list[i]._id, { listName: event.value.toLowerCase() })
      .pipe(
        map((response: any) => {
          console.log(response)
        })
      ).subscribe(
        res => {
         
          this.listStore.setLoading(true);
          //  this.list[i].listName = event.value
          //  console.log(this.list[i])
          this.listStore.update(state => {

            let lists = [...state.list]
            let ind = lists.findIndex(t => t._id == this.list[i]._id)
            lists[ind] = {
              ...lists[ind],
              listName: event.value.toLowerCase()
            }
           
            return {
              ...state,
              list: lists
            }
          });
          
          this.listStore.setLoading(false);
        }

      )

  }
}
