import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Order, OrderDetail, ViewOrderDetail} from '../models';

const orderUrl = environment.baseUrl + '/order';
const orderDetailUrl = environment.baseUrl + '/orderDetail';

@Injectable()
export class SalesService {

  constructor(private http: HttpClient) { }

  public getAllOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(orderUrl);
  }

  public createOrder(g: Order): Observable<Order> {
    return this.http
      .post<Order>(orderUrl, g);
  }

  public getOrderByName(orderId: number): Observable<Order> {
    return this.http
      .get(orderUrl + '/' + orderId)
      .catch(this.handleError);
  }

  public updateOrder(g: Order): Observable<Order> {
    return this.http
      .put(orderUrl, g)
      .catch(this.handleError);
  }

  public deleteOrderById(orderId: number) {
    return this.http
      .delete(orderUrl + '/' + orderId)
      .catch(this.handleError);
  }

  public getAllOrderDetails(): Observable<OrderDetail[]> {
    return this.http
      .get<OrderDetail[]>(orderDetailUrl);
  }

  public createOrderDetail(g: OrderDetail): Observable<OrderDetail> {
    return this.http
      .post<OrderDetail>(orderDetailUrl, g);
  }

  public getOrderDetailByName(orderDetailId: number): Observable<OrderDetail> {
    return this.http
      .get(orderDetailUrl + '/' + orderDetailId)
      .catch(this.handleError);
  }

  public updateOrderDetail(g: OrderDetail): Observable<OrderDetail> {
    return this.http
      .put(orderDetailUrl, g)
      .catch(this.handleError);
  }

  public deleteOrderDetailById(orderDetailId: number) {
    return this.http
      .delete(orderDetailUrl + '/' + orderDetailId)
      .catch(this.handleError);
  }

  public getOrderOrderDetail(orderId: number): Observable<ViewOrderDetail>{
    return this.http
      .get(orderDetailUrl + '/order/' + orderId)
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('OrderService::handleError', error);
    return Observable.throw(error);
  }
}
