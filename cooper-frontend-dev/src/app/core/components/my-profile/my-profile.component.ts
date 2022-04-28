import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
 Id:any;
 user:any;
 isSpinning=false;
  constructor(private router:ActivatedRoute,private userService:UserService) {
    this.router.params.subscribe((path)=>{
     console.log(path)
      this.Id=path?.['id'];
      this.getUserById();
    })
   }

  ngOnInit(): void {
    this.getUserById();
  }

  getUserById() {
    this.isSpinning=true;
    this.userService.getUserById(this.Id).subscribe((res: any) => {
      this.user=res;
      this.isSpinning=false;
    },(error)=>{
      this.isSpinning=false;
    });
  }

  stringToHslColor(str: any) {
    var hash = 0;
    for (var i = 0; i < str?.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + 30 + '%, ' + 40 + '%)';
  }
}
