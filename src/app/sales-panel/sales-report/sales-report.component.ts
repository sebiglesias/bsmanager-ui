import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {SalesService} from '../sales.service';
import {Order, OrderDetail, User} from '../../models';
import {UserService} from '../../user-panel/user.service';
import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';

// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';

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
  reverse = true;
  orderB = 'id';
  userFilter: any = {
    email: ''
  };
  payment = 'all';
  filteredOrders: Order[] = [];
  paymentMethods: string[] = ['CASH', 'DEBIT', 'CREDIT', 'BANK'];
  users: User[] = [];
  employee = 'all';

  constructor(
    private saleService: SalesService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getOrderDetails();
    this.getOrders();
    this.getUsers();
    this.reFilter();
  }

  setReverse() {
    this.reverse = !this.reverse;
  }

  getOrders() {
    this.saleService.getAllOrders().
      subscribe( orders => {
        this.orders = orders.filter( o => {
          return o.sale;
        });
    });
  }

  getUsers() {
    this.userService.getAllUsers().
    subscribe( users => {
      this.users = users;
    });
  }

  getOrderDetails() {
    this.saleService.getAllOrderDetails().
      subscribe( details => {
        this.details = details;
    });
  }

  getDetail(o: Order): OrderDetail[] {
    if (o !== undefined && this.details !== undefined) {
      return this.details.filter( d => {
        const bool = Number(d.order) === o.id;
        return Number(d.order) === o.id || d.order.id === o.id;
      });
    } else {
      return [];
    }
  }

  filterFrom(d: any) {
    if (d === undefined || d === null) {
      this.from = new Date(JSON.parse(JSON.stringify(d)));
      this.reFilter();
    } else {
      this.from = d;
      this.reFilter();
    }
  }

  filterTo(d: Date) {
    if (d === undefined || d === null) {
      this.from = undefined;
      this.reFilter();
    } else {
      this.from = d;
      this.reFilter();
    }
  }

  reFilter() {
    if (this.orders !== undefined) {
      this.filteredOrders = this.orders.filter( ord => {
        const afterFrom = (this.from === undefined) || (ord.date !== null && this.afterDate(ord.date, this.from));
        const beforeTo = (this.to === undefined) || (ord.date !== null && this.beforeDate(ord.date, this.to));
        const p = (this.payment === 'all') || (ord.payment === this.payment);
        const e = (this.employee === 'all') || (this.employee === ord.employee);
        return afterFrom && beforeTo && p && e;
      });
    }
  }

  afterDate(d: Date, from: Date) {
    return d.valueOf() > from['epoc'];
  }

  beforeDate(d: Date, to: Date) {
    return d.valueOf() < to.valueOf();
  }

  getDate(e: any): string {
    const d = new Date(JSON.parse(JSON.stringify(e)));
    return d.getFullYear() + '-' + d.getMonth() + '-' + (d.getDay() + 1);
  }

  filterPayment(s: string) {
    this.payment = s;
    this.reFilter();
  }

  filterEmployee(s: string) {
    this.employee = s;
    this.reFilter();
  }

  exportExcel() {
    const convertToCSV2 = this.convertToCSV(JSON.stringify(this.filteredOrders));
    const exportedFilenmae = 'SalesReport' + '.csv';
    const blob = new Blob([convertToCSV2], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, exportedFilenmae);
  }

  convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index in array[i]) {
        if (line !== '') {
          line += ',';
        }
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }
}
