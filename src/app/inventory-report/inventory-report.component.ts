import { Component, OnInit } from '@angular/core';
import {Product} from '../models';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.css']
})
export class InventoryReportComponent implements OnInit {

  products: Product[];
  constructor() { }

  ngOnInit() {
  }

}
