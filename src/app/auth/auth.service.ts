import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {User} from '../models';
import {Observable} from 'rxjs/rx';

@Injectable()
export class AuthService {

  userKey = 'user';

  constructor( ) {}


  ngOnInit() {

  }

  isLoggedIn(): Observable<boolean> {
    return Observable.from([this.getCurrentUser() !== null]);
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem(this.userKey));
  }

  isAdmin(): boolean {
    return this.getCurrentUser() !== null && this.getCurrentUser().admin;
  }

  setUser(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(this.userKey);
  }
}
