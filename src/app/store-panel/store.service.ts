import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Store} from '../models';

const storeUrl = environment.baseUrl + '/store';

@Injectable()
export class StoreService {

  constructor(private http: HttpClient) { }

  public getAllStores(): Observable<Store[]> {
    return this.http
      .get<Store[]>(storeUrl);
  }

  public createStore(g: Store): Observable<Store> {
    console.log(g);
    return this.http
      .post<Store>(storeUrl, g);
  }

  public getStoreByName(groupId: number): Observable<Store> {
    return this.http
      .get(storeUrl + '/' + groupId)
      .catch(this.handleError);
  }

  public updateStore(g: Store): Observable<Store> {
    return this.http
      .put(storeUrl, g)
      .catch(this.handleError);
  }

  public deleteStoreById(groupId: number) {
    return this.http
      .delete(storeUrl + '/' + groupId)
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('StoreService::handleError', error);
    return Observable.throw(error);
  }
}
