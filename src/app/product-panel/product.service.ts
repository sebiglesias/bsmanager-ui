import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Product} from '../models';

const productUrl = environment.baseUrl + '/product';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  public getAllProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(productUrl);
  }

  public createProduct(g: Product): Observable<Product> {
    return this.http
      .post<Product>(productUrl, g);
  }

  public getProductByName(productId: number): Observable<Product> {
    return this.http
      .get(productUrl + '/' + productId)
      .catch(this.handleError);
  }

  public updateProduct(g: Product): Observable<Product> {
    return this.http
      .put(productUrl, g)
      .catch(this.handleError);
  }

  public deleteProductById(productId: number) {
    return this.http
      .delete(productUrl + '/' + productId)
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('ProductService::handleError', error);
    return Observable.throw(error);
  }

  getProductById(id: number): Observable<Product> {
    return this.http
      .get(productUrl + '/' + id)
      .catch(this.handleError);
  }

  addStock(id: number, units: number) {
    this.getProductById(id).subscribe( p => {
      p.quantity += units;
      this.updateProduct(p);
    });
  }

  getProductByCode(code: string): Observable<Product> {
    return this.http
      .get(productUrl + '/code/' + code)
      .catch(this.handleError);
  }
}
