import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Group} from './models';

const groupUrl = environment.baseUrl + '/group';

@Injectable()
export class GroupService {

  constructor(
    private http: HttpClient
  ) {
  }

  public getAllGroups(): Observable<Group[]> {
    return this.http
      .get<Group[]>(groupUrl);
  }

  public createGroup(g: Group): Observable<Group> {
    console.log(g);
    return this.http
      .post<Group>(groupUrl, g);
  }

  public getGroupByName(groupId: number): Observable<Group> {
    return this.http
      .get(groupUrl + '/' + groupId)
      .catch(this.handleError);
  }
  public updateGroup(g: Group): Observable<Group> {
    return this.http
      .put(groupUrl + '/' + g.id, g)
      .catch(this.handleError);
  }

  public deleteGroupById(groupId: number) {
    return this.http
      .delete(groupUrl + '/' + groupId)
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('GroupService::handleError', error);
    return Observable.throw(error);
  }
}
