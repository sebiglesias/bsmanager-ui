import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Brand, Category, Measure, Order, OrderDetail, Product, User} from '../../models';
import {ProductService} from '../product.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoryService} from '../../category-panel/category.service';
import {BrandService} from '../../brand-panel/brand.service';
import {MeasureService} from '../../measure-panel/measure.service';
import {AuthService} from '../../auth/auth.service';
import {SalesService} from '../../sales-panel/sales.service';

@Component({
  selector: 'app-product-stock-modal',
  templateUrl: './product-stock-modal.component.html',
  styleUrls: ['./product-stock-modal.component.css']
})

export class ProductStockModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;

  product: Product = {
    code: '',
    name: '',
    cost: 0,
    price: 0,
    infoUrl: '',
    longDescription: '',
    shortDescription: '',
    model: '',
    series: '',
    brand: {
      name: '',
      infoUrl: '',
      observations: ''
    },
    categories: [{
      plural_name: '',
      singular_name: ''
    }],
    measure: {
      name: '',
      abbreviation: ''
    },
    quantity: 0
  };
  productForm;
  users: User[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  measures: Measure[] = [];
  selectedCategories: Category[];
  selectedMeasure: Measure;
  selectedBrand: Brand;
  paymentOptions: string[] = ['CASH', 'DEBIT', 'CREDIT', 'BANK'];
  payment: string;
  external: string;
  currentUserEmail: string;
  order: Order;
  invalidForm = false;
  @Output() stockProductAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < ProductStockModalComponent > = new EventEmitter < ProductStockModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private measureService: MeasureService,
    private authService: AuthService,
    private salesService: SalesService,
  ) {
    this.productForm = new FormGroup({
      stock: new FormControl(null, [Validators.required, Validators.min(1)]),
      external: new FormControl(null, [Validators.required]),
      payment: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.currentUserEmail = this.authService.getCurrentUser().email;
    this.getBrands();
    this.getCategories();
    this.getMeasures();
    this.loadedEmitter.next(this);
  }

  show() {
    this.showModal = true;
  }

  hide() {
    this.showModal = false;
    this.closeEmitter.next({
      action: ModalAction.POSITIVE
    });
  }

  positiveAction() {
    this.positiveLabelAction.next(this);
    return false;
  }

  cancelAction() {
    this.showModal = false;
    this.closeEmitter.next({
      action: ModalAction.CANCEL
    });
    return false;
  }

  setProduct(g: Product) {
    this.product = g;
  }

  addStock() {
    if (this.productForm.valid) {
      const updatedProduct = this.product;
      updatedProduct.quantity = this.product.quantity + this.productForm.value.stock;
      this.order = {
        sale: false,
        employee: this.currentUserEmail,
        external: this.productForm.value.email,
        payment: this.productForm.value.payment,
        items: this.productForm.value.stock,
        date: new Date(),
        price: this.product.cost
      };
      this.salesService.createOrder(this.order).subscribe(o => {
        const oDetail: OrderDetail = {
          order: o,
          product: this.product,
          quantity: this.productForm.value.stock,
          price: this.product.cost
        };
        delete oDetail['product']['@product'];
        this.salesService.createOrderDetail(oDetail).subscribe(c => {
          this.productService.updateProduct(updatedProduct).subscribe(() => this.throwAlert(true), err => this.throwAlert(false));
          this.hide();
          return;
        });
      });
    }
    this.invalidForm = true;
  }

  throwAlert(b: boolean) {
    this.stockProductAlert.emit(true);
  }

  getCategories() {
    this.categoryService
      .getAllCategories()
      .subscribe( category => {
        this.categories = category;
      });
  }

  getBrands(): void {
    this.brandService
      .getAllBrands()
      .subscribe(brands => {
        this.brands = brands;
      });
  }

  getMeasures(): void {
    this.measureService
      .getAllMeasures()
      .subscribe(measures => {
        this.measures = measures;
      });
  }

  addBrand(id: string) {
    this.brandService.getBrandById(Number(id)).subscribe( brand => {
      this.selectedBrand = brand;
    });
  }

  addMeasure(id: string) {
    this.measureService.getMeasureById(Number(id)).subscribe( brand => {
      this.selectedMeasure = brand;
    });
  }

  addCategory(id: number): boolean {
    let found = false;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      if (this.selectedCategories[i].id === Number(id)) {
        found = true;
        return !found;
      }
    }
    this.categoryService.getCategoryByName(id).subscribe(group => {
      this.selectedCategories.push(group);
    });
  }

  removeCategory(id: number) {
    this.selectedCategories = this.selectedCategories.filter( group => {
      return group.id !== Number(id);
    });
  }

  addPayment(s: string) {
    this.payment = s;
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
