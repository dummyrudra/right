import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilityService } from '../services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private util: UtilityService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('token') && (!localStorage.getItem('organisation') || route.params['name'] == 'null')) {
      if (true){
        this.util.refreshHeader$.next(false)
        this.router.navigate(['/users/choose-company'])
      }
      return true
    }
    else if (localStorage.getItem('org_name') && route.params['name'] != localStorage.getItem('org_name')) {
      this.util.refreshHeader$.next(true)
      this.router.navigate(['/'])
      return false
    }
    else if (localStorage.getItem('token')) {
      if (route.url[0].path == 'users/login' || route.url[0].path == 'users/signup') this.router.navigate(['/project-list'])
      return true
    }
    else {
      if (route.url[0].path != 'users/signup') this.router.navigate(['/users/login'])
      return false
    }
  }

}
