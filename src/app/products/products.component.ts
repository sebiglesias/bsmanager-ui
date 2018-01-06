import { Component, OnInit } from '@angular/core';
import {Product} from '../product';
import {PRODUCTS} from '../mock-products';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  selectedProduct: Product;
  products = PRODUCTS;

  constructor() { }

  ngOnInit() {
  }

  onSelect(product) {
    this.selectedProduct = product;
  }

}
