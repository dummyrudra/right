import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { SocialAuthService } from 'angularx-social-login';
import { map } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AuthService } from 'src/app/global/services/auth.service';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})
export class OrganisationComponent implements OnInit {
  message: any = {
    showErrorMessage: '',
    successMessage: ''
  }
  selectedOrganisation: any = {}
  isCreate: boolean = false
  organisationList: any = []
  organisation: string = ''
  form = new FormGroup({
    organisation: new FormControl('', [Validators.required]),
  })
  form2 = new FormGroup({
    organizationName: new FormControl('', [Validators.required]),
    organizationUrl: new FormControl('', [Validators.required]),
    organizationType: new FormControl('IT service'),
  })
  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private util: UtilityService,
    private auth: AuthService,
    private notify: NotifierService,
    private http: HttpService) { }

  ngOnInit(): void {
    if (localStorage.getItem('organisation') != 'null' && localStorage.getItem('organisation')) this.router.navigate(['/' + String(localStorage.getItem('org_name')) + '/project-list'])
    if (!localStorage.getItem('token')) this.router.navigate(['/users/login'])
    this.http.getData('organization')
      .subscribe((res: any) => {
        this.organisationList = res
        // console.log(typeof(this.organisationList))
      })
  }

  setOrganisation() {
    let temp = ''
    this.auth.selectOrganisation('organization/join/' + (this.form.get('organisation')?.value)._id, { user: String(localStorage.getItem('id')) })
      .pipe(
        map((res: any) => {
          console.log(res.headers.keys())
          if (res) {
            localStorage.setItem('token', res.headers.get('x-auth-token'))
            localStorage.setItem('organisation', this.form.get('organisation')?.value._id)
            this.util.organisation$.next((this.form.get('organisation')?.value))
            const org = (this.form.get('organisation')?.value).organizationName.split(' ')
            org.map((value: any) => {
              temp += value
            })
          }
        })
      )
      .subscribe(res => {
        localStorage.setItem('org_name', temp)
        this.util.refreshHeader$.next(true)
        this.router.navigate(['/' + temp + '/project-list'])
      })
  }

  createOrganisation() {
    let temp = ''
    if(this.form2.invalid) return 
    let payload = this.form2.getRawValue()
    this.auth.createOrganisation('organization', payload)
      .pipe(
        map((res: any) => {
          if (res) {
            localStorage.setItem('token', res.headers.get('x-auth-token'))
            localStorage.setItem('organisation', res.body._id)
            this.util.organisation$.next(res.body)
            const org = res.body.organizationName.split(' ')
            org.map((value: any) => {
              temp += value
            })
          }

        })
      )
      .subscribe((res: any) => {
        localStorage.setItem('org_name', temp)
        this.util.refreshHeader$.next(true)
        this.router.navigate(['/' + temp + '/project-list'])
      })
  }
}