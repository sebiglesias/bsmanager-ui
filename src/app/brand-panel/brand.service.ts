import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Brand} from '../models';

const brandUrl = environment.baseUrl + '/brand';

@Injectable()
export class BrandService {

  constructor(private http: HttpClient) { }

  public getAllBrands(): Observable<Brand[]> {
    return this.http
      .get<Brand[]>(brandUrl);
  }

  public createBrand(g: Brand): Observable<Brand> {
    return this.http
      .post<Brand>(brandUrl, g);
  }

  public getBrandByName(brandId: number): Observable<Brand> {
    return this.http
      .get(brandUrl + '/' + brandId)
      .catch(this.handleError);
  }

  public updateBrand(g: Brand): Observable<Brand> {
    return this.http
      .put(brandUrl, g)
      .catch(this.handleError);
  }

  public deleteBrandById(brandId: number) {
    return this.http
      .delete(brandUrl + '/' + brandId)
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('BrandService::handleError', error);
    return Observable.throw(error);
  }

  getBrandById(id: number): Observable<Brand> {
    return this.http
      .get(brandUrl + '/' + id)
      .catch(this.handleError);
  }
}
