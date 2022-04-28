import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.css']
})
export class GlobalComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // console.log('sd',this.router.url)
    if(localStorage.getItem('organisation')==null && localStorage.getItem('token')){
      this.router.navigate(['/users/choose-company'])}
    else if(localStorage.getItem('token') && localStorage.getItem('organisation')) this.router.navigate(['/'])
    else if (this.router.url != '/users/signup' && this.router.url != '/users/forgot') this.router.navigate(['/users/login'])
  }

}
