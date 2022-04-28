import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';
import { HttpService } from '../../../services/http.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SocketService } from '../../../services/socket.service';
import { catchError } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import {  NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements OnInit {
  model: NgbDateStruct | any;
  sprint: any = {}
  data: any = {}
  organisation: string = String(localStorage.getItem('org_name'))
  projectKey: string = ''
  duration: any = [
    {
      name: "1 Week",
      week: 1
    },
    {
      name: "2 Week",
      week: 2
    },
    {
      name: "3 Week",
      week: 3
    },
    {
      name: "4 Week",
      week: 4
    },
    {
      name: "Custom",
      week: 4
    },
  ]
  isCustom: boolean = false
  form = new FormGroup({
    sprintName: new FormControl(''),
    duration: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    sprintGoal: new FormControl(''),
    sprintStatus: new FormControl('')
  })
  constructor(
    private util: UtilityService,
    private http: HttpService,
    private socket: SocketService,
    private Notify: NotifierService,
    private router: Router,
    public formatter: NgbDateParserFormatter,
  ) { }

  ngOnInit(): void {
    this.util.refreshBacklog$.subscribe(res => {
      if (res) {
        this.organisation = String(localStorage.getItem('org_name'))
        this.isCustom = false
        this.util.sprintModel$.subscribe((res: any) => {
          // this.data=res
          this.projectKey = res.project?.key
          this.sprint = res
          if (res?.startDate) {
            // let startDate = (new Date(res.startDate).toLocaleDateString()).split('/')
            let startDate = new Date(res?.startDate)
            let endDate = new Date(res?.endDate)
            this.form.setValue({
              startDate: {
                year: startDate.getFullYear() || null,
                month: startDate.getMonth() + 1 || null,
                day: startDate.getDate() || null
              },
              endDate: {
                year: endDate.getFullYear() || null,
                month: endDate.getMonth() + 1 || null,
                day: endDate.getDate() || null
              },
              // endDate:this.formatter.format(endDate),
              sprintName: res?.sprintName || '',
              duration: res?.duration || this.duration[0].week,
              sprintGoal: res?.sprintGoal || '',
              sprintStatus: res.sprintStatus
            })
          }
          else {
            this.form.get('sprintName')?.setValue(res.sprintName)
            this.form.get('duration')?.setValue(res.duration)
            this.form.get('sprintGoal')?.setValue(res.sprintGoal)
            this.form.get('sprintStatus')?.setValue(res.sprintStatus)
            this.form.get('startDate')?.setValue('')
            this.form.get('endDate')?.setValue('')
          }
          // this.form.setValue({
          //   sprintName:res?.sprintName || '',
          //   duration:res?.duration || this.duration[0].week,
          //   sprintGoal:res?.sprintGoal|| ''
          // })
          // console.log(this.form.getRawValue())
        })
      }
    })
  }


  selectDuration(item?: any) {
    if(item.week=='' || item.week==0) return
    if (item.name == "Custom") {
      this.isCustom = true
    }
    else {
      this.form.get('duration')?.setValue(Number(item.week))
    }
    let startDate = this.form.get('startDate')?.value
    this.selectStartDate(`${startDate.year}-${startDate.month}-${startDate.day}`)
  }

  selectStartDate(value: any) {
    console.log(value)
    let temp = value.split('-')
    // console.log(`${temp[1]}-${temp[2]}-${temp[0]}`)
    let startDate = new Date(`${temp[1]}-${temp[2]}-${temp[0]}`)
    let duration = (Number(this.form.get('duration')?.value))
    let endDate = new Date(startDate.getTime() + ((duration ? 1 : 0) * 6 * 24 * 60 * 60 * 1000) + ((duration > 1 ? duration - 1 : 0) * 7 * 24 * 60 * 60 * 1000))
    // this.form.get('endDate')?.setValue(`${endDate.getFullYear()}-${endDate.getMonth() < 10 ? '0' : ''}${endDate.getMonth() + 1}-${endDate.getDate() < 10 ? '0' : ''}${endDate.getDate()}`)
    this.form.get('endDate')?.setValue({
      year: endDate.getFullYear(),
      month: endDate.getMonth() + 1,
      day: endDate.getDate()
    })

  }

  selectEndDate(value: any) {
    console.log(value)
    let temp = value.split('-')
    let endDate = new Date(`${temp[1]}-${temp[2]}-${temp[0]}`)
    let duration = (Number(this.form.get('duration')?.value))
    let startDate = new Date(endDate.getTime() - ((duration ? 1 : 0) * 6 * 24 * 60 * 60 * 1000) + ((duration > 1 ? duration - 1 : 0) * 7 * 24 * 60 * 60 * 1000))
    // this.form.get('startDate')?.setValue(`${startDate.getFullYear()}-${startDate.getMonth() < 10 ? '0' : ''}${startDate.getMonth() + 1}-${startDate.getDate() < 10 ? '0' : ''}${startDate.getDate()}`)
    this.form.get('startDate')?.setValue({
      year: startDate.getFullYear(),
      month: startDate.getMonth() + 1,
      day: startDate.getDate()
    })
  }

  editSprint() {
    let payload = this.form.getRawValue()
    // if (!payload.startDate) return
    for (let item in payload) {
      if (payload[item] == '' || payload[item] == null) delete payload[item]
    }
    payload.startDate = `${payload.startDate.year}-${payload.startDate.month}-${payload.startDate.day}`
    payload.endDate = `${payload.endDate.year}-${payload.endDate.month}-${payload.endDate.day}`
    this.http.putData('sprints/' + this.sprint._id, payload)
      .pipe(
        catchError((err: any) => {
          // this.util.refreshBacklog$.next(true)
          if (err.error.status) this.Notify.notify('error', "Something Went Wrong")
          else if (err.error) this.Notify.notify('error', "Something went wrong")
          throw Error(err)
        })
      )
      .subscribe(res => {
        this.util.refreshBacklog$.next(true)
        this.socket.refreshProjectPages(this.projectKey)
      });
  }
  startSprint() {
    let payload = this.form.getRawValue()
    payload.startDate = `${payload.startDate.year}-${payload.startDate.month}-${payload.startDate.day}`
    payload.endDate = `${payload.endDate.year}-${payload.endDate.month}-${payload.endDate.day}`
    this.http.putData('sprints/' + this.sprint._id, payload)
      .pipe(
        catchError((err: any) => {
          this.util.refreshBacklog$.next(true)
          if (err.error.status) this.Notify.notify('error', "Something Went Wrong")
          else if (err.error) this.Notify.notify('error', "Something went wrong")
          throw Error(err)
        })
      )
      .subscribe(res => {
        this.socket.refreshProjectPages(this.sprint.project.key)
        this.util.refreshBacklog$.next(true)
        console.log(this.organisation + '/project/' + this.sprint.project.key + '/board')
        this.router.navigate([this.organisation + '/project/' + this.sprint.project.key + '/board'])
      })
  }

}
