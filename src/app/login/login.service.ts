import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from '../../../node_modules/rxjs/Rx';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class LoginService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn().first().map(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/']);
        return false;
      } else {
        return true;
      }
    });
  }

}
