import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {User} from '../models';

const userUrl = environment.baseUrl + '/user';
const mailUrl = environment.expressUrl;
@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  public getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(userUrl);
  }

  public createUser(g: User): Observable<User> {
    return this.http
      .post<User>(userUrl, g);
  }

  public getUserByName(userId: number): Observable<User> {
    return this.http
      .get(userUrl + '/' + userId)
      .catch(this.handleError);
  }

  public updateUser(g: User): Observable<User> {
    return this.http
      .put(userUrl, g)
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

  getUserById(id: number): Observable<User> {
    return this.http
      .get(userUrl + '/' + id)
      .catch(this.handleError);
  }

  sendMail(to: string, subject: string, content: string, html: string) {
    const body = {
      to: to,
      subject: subject,
      content: content,
      html: html
    };
    this.http
      .post(mailUrl, body).subscribe( a => console.log(a), err => this.handleError);
  }
}
