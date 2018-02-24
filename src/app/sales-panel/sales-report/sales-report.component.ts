import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {SalesService} from '../sales.service';
import {Order, OrderDetail} from '../../models';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit {

  from: Date;
  to: Date;
  orders: Order[];
  details: OrderDetail[];

  constructor(private saleService: SalesService) { }

  ngOnInit(): void {
    this.getOrderDetails();
    this.getOrders();
  }

  getOrders() {
    this.saleService.getAllOrders().
      subscribe( orders => {
        this.orders = orders;
    });
  }

  getOrderDetails() {
    this.saleService.getAllOrderDetails().
      subscribe( details => {
        this.details = details;
    });
  }

  getDetail(o: Order): OrderDetail[] {
    return this.details.filter( d => {
      return d.order.id === o.id;
    });
  }

  filterOrders(d: Date) {

  }
}
