import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-issuetype',
  templateUrl: './manage-issuteytype.component.html',
  styleUrls: ['./manage-issuteytype.component.css']
})
export class ManageIssuteytypeComponent implements OnInit {
  isVisible=false;
  isVisible1=false;
  icon:any;
  default = '../../../assets/img/profile.png';
  selectedFile: any;
  imgSrc: any;
  ImageName:any;
  constructor() { }

  ngOnInit(): void {
  }
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.imgSrc='';
    this.ImageName='';
  }

  showModal1(): void {
    this.isVisible1 = true;
  }

  handleOk1(): void {
    this.isVisible1 = false;
  }

  handleCancel1(): void {
    this.isVisible1 = false;
    this.imgSrc='';
    this.ImageName='';
  }

  readURL(event: any) {
    console.log(event)
    this.ImageName=event.target.files[0].name
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.selectedFile = event.target.files[0];
      reader.onload = (event: any) => {
        this.imgSrc = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
