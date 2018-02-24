import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Measure} from '../models';

const measureUrl = environment.baseUrl + '/measure';

@Injectable()
export class MeasureService {

  constructor(private http: HttpClient) { }

  public getAllMeasures(): Observable<Measure[]> {
    return this.http
      .get<Measure[]>(measureUrl);
  }

  public createMeasure(g: Measure): Observable<Measure> {
    return this.http
      .post<Measure>(measureUrl, g);
  }

  public getMeasureByName(measureId: number): Observable<Measure> {
    return this.http
      .get(measureUrl + '/' + measureId)
      .catch(this.handleError);
  }

  public updateMeasure(g: Measure): Observable<Measure> {
    return this.http
      .put(measureUrl, g)
      .catch(this.handleError);
  }

  public deleteMeasureById(measureId: number) {
    return this.http
      .delete(measureUrl + '/' + measureId)
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('MeasureService::handleError', error);
    return Observable.throw(error);
  }

  getMeasureById(id: number): Observable<Measure> {
    return this.http
      .get(measureUrl + '/' + id)
      .catch(this.handleError);
  }
}
