import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Group, Store, User} from '../models';

const userUrl = environment.baseUrl + '/user';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  public getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(userUrl);
  }

  public createUser(u: User): Observable<User> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json; charset=utf-8');
    return this.http
      .post<User>(userUrl, u);
  }

  public getUserByName(userId: number): Observable<User> {
    return this.http
      .get(userUrl + '/' + userId)
      .catch(this.handleError);
  }

  public updateUser(u: User): Observable<User> {
    return this.http
      .put(userUrl, u)
      .catch(this.handleError);
  }

  public deleteUserById(userId: number) {
    return this.http
      .delete(userUrl + '/' + userId)
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('UserService::handleError', error);
    return Observable.throw(error);
  }
}
