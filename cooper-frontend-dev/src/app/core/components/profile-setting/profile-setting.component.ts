import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment.prod';
import { UserService } from '../../services/user.service';
import { NotifierService } from 'angular-notifier';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { userQuery } from '../../state/query';
import { userStore } from '../../state/store';
import { map } from 'rxjs';
import { UtilityService } from '../../../services/utility.service';



@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent implements OnInit {
  public notifier: NotifierService;
  organisation:string = String(localStorage.getItem('organisation'))
  userId: any;
  default = '../../../assets/img/profile.png';
  isLoading = false;
  userData: any;
  userForm: any = FormGroup;
  tab2Form: any = FormGroup;
  passwordForm:any=FormGroup;
  uploadId:any;
  organisationList:any = []
  selectedOrganization:any = {}
  isSpinning=false;
  editFullName = false;
  editJobName = false;
  editDepartment = false;
  showPasswordMessage=false;
  load = {
    name: '',
    value: false
  };
  FormData = {
    fullName: ''
  };
  passwordStatus:any = {
    count:false,
    number:false,
    upercase:false,
    lowercase:false,
    symbol:false
  }
  imgSrc: any;
  selectedFile: any;
  baseUrl = environment.imageBaseUrl;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public notifierService: NotifierService,
    private authService: AuthService,
    private message: NzMessageService,
    private https: HttpService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private userQuery:userQuery,
    private userStore:userStore,
    private auth:AuthService,
    private notification: NzNotificationService,
    private util:UtilityService
  ) {
    this.notifier = notifierService;
    this.route.params.subscribe(p => {
      this.userId = p['id'];
    });
  }


  initForm(){
    this.passwordForm=this.formBuilder.group({
      password:new FormControl(null,[Validators.required,Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#._-])([a-zA-Z0-9@$!%*?&#._-]{7,})$/)]),
      confirmPassword:new FormControl(null,Validators.required),
      currentPassword:new FormControl(null,Validators.required),
    },
    {validators: [this.matchPassword.bind(this)]}
    )
  }
  ngOnInit(): void {
    this.userForm = new FormGroup({
      fullName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      jobTitle: new FormControl(null),
      department: new FormControl(null),
      avatar: new FormControl(null)
    });

    this.tab2Form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
    this.getUserById1();
    this.initForm();
  }

  validateOnChange(){
    this.showPasswordMessage=true;
  }
  hideMessage(){
    this.showPasswordMessage=false;
  }

  submitPasswordChange(){
    console.log(this.passwordForm)
  }

  validatePassword(){
    let value = this.passwordForm.get('password')?.value
    this.passwordStatus = {
      count:false,
      number:false,
      upercase:false,
      lowercase:false,
      symbol:false
    }
    if(value.match(/(?=.*[0-9])/)) this.passwordStatus.number = true
    if(value.match(/((?=.*[a-z]))/)) this.passwordStatus.lowercase = true
    if(value.match(/(?=.*[A-Z])/)) this.passwordStatus.uppercase = true
    if(value.match(/[!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/)) this.passwordStatus.symbol = true
    if(value.length >= 7) this.passwordStatus.count = true
  }

  onSelectFile(event: any) {
    this.selectedFile = event;
  }

  readURL(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.selectedFile = event.target.files[0];
      reader.onload = (event: any) => {
        this.imgSrc = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  uploadImage() {
    this.uploadId= this.message.loading('Image uploding in progress..', { nzDuration: 0 }).messageId;
    let data = new FormData();
    data.append('avatar', this.selectedFile);
    this.userService.updateProfileImageById(this.userId, data).subscribe(
      data => {
        this.notification.create(
          'success',
          'Profile',
          'Profile Image Updated Successfully !',
          { nzPlacement: 'topRight'}
        );
        this.getUserById();
      //  this.userStore.setLoading(true);
        this.selectedFile = null;
        this.imgSrc = null;
        
      },
      error => {
        //console.log(error);
        this.notification.create(
          'error',
          'Profile',
          'Something went wrong !',
          { nzPlacement: 'topRight'}
        );
        this.message.remove(this.uploadId)
        this.selectedFile = null;
        this.imgSrc = null;
      }
    );
  }

  cancelImageUpload() {
    this.selectedFile = null;
    this.imgSrc = null;
  }

  getUserById1() {
    this.isSpinning=true;
    this.https.getData('user/' + this.userId).subscribe((res: any) => {
      this.authService.currentUser$.next(res);
      this.userData = res;
      this.userForm.get('fullName').setValue(res.fullName);
      this.userForm.get('email').setValue(res.email);
      this.userForm.get('jobTitle').setValue(res.jobTitle);
      this.userForm.get('department').setValue(res.department);
      this.organisationList = res.organizations
      res.organizations.map((value:any,index:number)=>{
        if(value.organization._id==this.organisation) this.selectedOrganization = value.organization
      })
      this.isSpinning=false;
      if(this.uploadId){
        this.message.remove(this.uploadId)
      }
    },(error)=>{
      this.isSpinning=false;
    });
  }
  getUserById() {
   
    this.https.getData('user/' + this.userId).subscribe((res: any) => {
      this.authService.currentUser$.next(res);
      this.userData = res;
      this.userStore.update(state=>{
        let user=res
        return{
          ...state,
          user
        }
         
      })
      this.userForm.get('fullName').setValue(res.fullName);
      this.userForm.get('email').setValue(res.email);
      this.userForm.get('jobTitle').setValue(res.jobTitle);
      this.userForm.get('department').setValue(res.department);
     
      if(this.uploadId){
        this.message.remove(this.uploadId)
      }
    },(error)=>{
      if(this.uploadId){
        this.message.remove(this.uploadId)
      }
      this.isSpinning=false;
    });
  }

  updateUserField(data: any) {
    this.userService.updateUserById(this.userId, data).subscribe(
      data => {
        this.getUserById();
        this.load.name = '';
        this.load.value = false;
      },
      error => {
        this.load.name = '';
        this.load.value = false;
      }
    );
  }

  changeEmail() {
    this.isLoading = true;
    if (this.tab2Form.valid)
      this.userService
        .updateUserById(this.userId, this.tab2Form.value)
        .subscribe(
          data => {
            this.getUserById();
            this.notifier.notify('success', 'Email updated successfully');
            this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            this.notifier.notify('error', error);
          }
        );
  }

  matchPassword(formGroup: FormGroup) {
    let password=formGroup.get('password')?.value;
    let confirmPassword=formGroup.get('confirmPassword')?.value
    return password === confirmPassword ? null : {passwordNotMatch: true};
  }
  //fullName

  // changeFullName(data:any){
  //     this.userForm.get('fullName').setValue(data.target.value);
  // }

  //  update(){
  //    this.load.name="fullName"
  //    this.load.value=true

  //    let data={
  //      fullName:this.userForm.get('fullName').value
  //    }
  //   this.updateUserField(data)
  //  }

  editable() {
    this.editFullName = true;
  }

  cancelFullNameOnBlur() {
    setTimeout(() => {
      this.editFullName = false;
    }, 200);
  }

  //  cancelEdit(){
  //   this.userForm.get('fullName').setValue(this.userData?.fullName)
  //  }

  //job Title

  //  changeJobTitle(event:any){
  //   this.userForm.get('jobTitle').setValue(event.target.value)
  //  }

  editableJobField() {
    this.editJobName = true;
  }

  onBlurEditJob() {
    setTimeout(() => {
      this.editJobName = false;
    }, 200);
  }

  // cancelEditJob(){
  //   this.userForm.get('jobTitle').setValue(this.userData?.jobTitle)
  // }

  //  updateJob(){
  //   this.load.name="jobName"
  //   this.load.value=true
  //   let data={
  //     jobTitle:this.userForm.get('jobTitle').value
  //   }
  //   this.updateUserField(data)
  //  }

  onChangeField(event: any, name: any) {
    this.userForm.get(name).setValue(event.target.value);
  }
  cancel(name: any) {
    this.userForm.get(name).setValue(this.userData?.[name]);
  }

  updateFields(name: any) {
    let data = {};
    if (name == 'fullName') {
      data = {
        fullName: this.userForm.get(name).value
      };
    } else if (name == 'email') {
      data = {
        email: this.userForm.get(name).value
      };
    } else if (name == 'department') {
      data = {
        department: this.userForm.get(name).value
      };
    } else if (name == 'jobTitle') {
      data = {
        jobTitle: this.userForm.get(name).value
      };
    }
    if (name == 'fullName' || name == 'email') {
      if (this.userForm.get(name).value) {
        this.load.name = name;
        this.load.value = true;
        this.updateUserField(data);
      } else {
        this.userForm.controls[name].markAsTouched();
      }
    } else {
      this.load.name = name;
      this.load.value = true;
      this.updateUserField(data);
    }
  }

  //department

  editDepartmentField() {
    this.editDepartment = true;
  }

  onBlur() {
    setTimeout(() => {
      this.editDepartment = false;
    }, 200);
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
            this.router.navigate(['/' + temp + '/project-list'])
          }
      })
    )  
    .subscribe(res => {
    })
  }
}
