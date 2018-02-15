import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Category} from '../models';

const categoryUrl = environment.baseUrl + '/category';

@Injectable()
export class CategoryService {

  constructor(private http: HttpClient) { }

  public getAllCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(categoryUrl);
  }

  public createCategory(category: Category): Observable<Category> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json; charset=utf-8');
    return this.http
      .post<Category>(categoryUrl, category, {headers})
      .catch(this.handleError);
  }

  public getCategoryByName(categoryId: number): Observable<Category> {
    return this.http
      .get(categoryUrl + '/' + categoryId)
      .catch(this.handleError);
  }

  public updateCategory(c: Category): Observable<Category> {
    return this.http
      .put(categoryUrl, c)
      .catch(this.handleError);
  }

  public deleteCategoryById(categoryId: number) {
    return this.http
      .delete(categoryUrl + '/' + categoryId)
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('CategoryService::handleError', error);
    return Observable.throw(error);
  }
}
