import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Order, OrderDetail, Product, StockXls} from '../../models';
import {ProductService} from '../product.service';
import * as XLSX from 'ts-xlsx';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {SalesService} from '../../sales-panel/sales.service';


@Component({
  selector: 'app-product-import-modal',
  templateUrl: './product-import-modal.component.html',
  styleUrls: ['./product-import-modal.component.css']
})

export class ProductImportModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;
  order: Order;
  orderDetails: OrderDetail[] = [];
  product: Product;
  arrayBuffer: any;
  file: File;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  uploadedProducts: StockXls[] = [];
  validProducts: StockXls[] = [];
  currentUserMail: string;
  external: string;
  paymentMethod: string;
  paymentOptions: string[]= ['DEBIT', 'CREDIT', 'BANK'];
  totalPrice: number;
  totalItems: number;
  invalidFirstForm = false;
  invalidSecondForm = false;
  invalidThirdForm = false;
  isFileInvalid = false;

  @Output() importedProductAlert = new EventEmitter<StockXls>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < ProductImportModalComponent > = new EventEmitter < ProductImportModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private salesService: SalesService
  ) {}

  ngOnInit() {
    this.currentUserMail = this.authService.getCurrentUser().email;
    this.firstFormGroup = new FormGroup({
      external: new FormControl('', [Validators.required, Validators.email]),
      payment: new FormControl('', Validators.required)
    });
    this.secondFormGroup = new FormGroup({
      approved: new FormControl('', Validators.requiredTrue)
    });
    this.loadedEmitter.next(this);
  }

  show() {
    this.showModal = true;
    this.validProducts = [];
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

  throwAlert(p: StockXls) {
    this.importedProductAlert.emit(p);
  }

  private makeNewOrderDetail(p: Product): OrderDetail {
    return {
      order: this.order,
      product: p,
      price: p.price,
      quantity: 1
    };
  }

  private makeNewOrder(): Order {
    return {
      date: new Date(),
      employee: this.currentUserMail,
      external: '',
      sale: true,
      payment: '',
      items: 0,
      price: 0
    };
  }

  calculateTotal() {
    let auxTotal = 0;
    this.orderDetails.forEach( oDetail => {
      auxTotal += oDetail.product.price * oDetail.quantity;
    });
    this.totalPrice = auxTotal;
  }

  calculateItems() {
    let auxQ = 0;
    this.orderDetails.forEach( oDetail => {
      auxQ += oDetail.quantity;
    });
    this.totalItems = auxQ;
  }

  private calculateResults() {
    this.calculateItems();
    this.calculateTotal();
  }

  uploadData(event) {
    this.file = event.target.files[0];
    this.isFileInvalid = false;
    this.uploadedProducts = [];
  }

  uploadStock() {
    if (this.file === undefined) {
      this.isFileInvalid = true;
    }
    if (this.firstFormGroup.valid) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        const data = new Uint8Array(this.arrayBuffer);
        const arr = new Array();
        for (let i = 0; i !== data.length; ++i) {
          arr[i] = String.fromCharCode(data[i]);
        }
        const bstr = arr.join('');
        const workbook = XLSX.read(bstr, {type: 'binary'});
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        const xlsToJson: StockXls[] = XLSX.utils.sheet_to_json(worksheet, {raw: true});
        xlsToJson.forEach(s => {
          this.productService.getProductByCode(s.code).subscribe(p => {
            s.product = p;
            this.uploadedProducts.push(s);
          }, err => {
            this.uploadedProducts.push(s);
          });
        });
      };
      if (this.file !== undefined) {
        this.isFileInvalid = false;
        this.invalidFirstForm = false;
        fileReader.readAsArrayBuffer(this.file);
      } else {
        this.invalidFirstForm = true;
        this.isFileInvalid = true;
      }
    }else {
      this.invalidFirstForm = true;
    }
  }

  sendUploadedProducts() {
    this.calculateResults();
    this.order = this.makeNewOrder();
    this.order.price = this.totalPrice;
    this.order.items = this.totalItems;
    this.order.employee = this.currentUserMail;
    this.order.sale = false;
    this.order.external = this.firstFormGroup.value.external;
    this.order.payment = this.firstFormGroup.value.payment;
    this.salesService.createOrder(this.order).subscribe( o => {
      this.validProducts.forEach( p => {
        const oDetail: OrderDetail = {
          order: o,
          product: p.product,
          quantity: p.units,
          price: p.product.price
        };
        delete oDetail['product']['@product'];
        this.salesService.createOrderDetail(oDetail).subscribe( () => {
          p.product.quantity += p.units;
          this.productService.updateProduct(p.product).subscribe( r => {
            this.throwAlert(p);
          }, err => console.log(err));
        }, err => console.log(err));
      });
    }, err => console.log(err));
    this.uploadedProducts = [];
    this.external = '';
    this.paymentMethod = '';
  }

  validateProducts() {
    if (this.secondFormGroup.valid) {
      this.invalidSecondForm = false;
      this.validProducts = this.uploadedProducts.filter( p => {
        return p.product !== null;
      }).filter( p => {
        return p !== undefined;
      });
    } else {
      this.invalidSecondForm = true;
    }
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
