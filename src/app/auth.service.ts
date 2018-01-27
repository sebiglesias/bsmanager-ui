import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Http, Headers, RequestOptions} from '@angular/http';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class AuthService {

  private baseUrl =  environment.baseUrl;
  currentUser = new Subject();

  public isLoggedIn(): Observable<boolean> {
    if (localStorage.getItem('currentUser') == null) {
      return Observable.from([false]);
    } else {
      return Observable.from([true]);
    }
  }

  constructor(
    private router: Router,
    private http: Http
  ) {}

  getUserByUsernameAndPassword(username, password): Observable<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers});
    return this.http.get(this.baseUrl + '/user/' + username + '/' + password , options).map(this.extractData);
  }

  set setUser(user) {
    this.currentUser.next(user);
    localStorage.setItem('currentUser', user);
  }

  get getUser() {
    return localStorage.getItem('currentUser');
  }

  saveUser(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl + '/saveUser' , formData)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  logout() {
    this.currentUser.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }

  private extractData(res) {
    const body = res.json();
    console.log(body);
    return body || {};
  }

  private extractDataB(res: Response) {
    console.log('res resp;' , res);
    const jsonRes = JSON.stringify(res);
    const body = JSON.parse(jsonRes);
    console.log('Body resp;' , body);
    return   body['_body'] || {};
  }

  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

}
