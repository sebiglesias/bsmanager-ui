import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Product, StockXls} from '../../models';
import {ProductService} from '../product.service';
import * as XLSX from 'ts-xlsx';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


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
  product: Product;
  arrayBuffer: any;
  file: File;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  uploadedProducts: StockXls[] = [];
  validProducts: StockXls[] = [];
  @Output() importedProductAlert = new EventEmitter<StockXls>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < ProductImportModalComponent > = new EventEmitter < ProductImportModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(
    private productService: ProductService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      email: ['', Validators.required],
      payment: ['', Validators.required]
    });
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

  throwAlert(p: StockXls) {
    this.importedProductAlert.emit(p);
  }

  uploadData(event) {
    this.file = event.target.files[0];
    this.uploadedProducts = [];
  }

  uploadStock() {
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
      console.log(XLSX.utils.sheet_to_json(worksheet, {
        raw: true
      }));
      const xlsToJson: StockXls[] = XLSX.utils.sheet_to_json(worksheet, {raw: true});
      xlsToJson.forEach( s => {
        this.productService.getProductById(s.code).subscribe( p => {
          s.product = p;
          this.uploadedProducts.push(s);
        }, err => {
          this.uploadedProducts.push(s);
        });
      });
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  sendUploadedProducts() {
    this.validProducts.forEach( p => {
      p.product.quantity += p.units;
      this.productService.updateProduct(p.product).subscribe( r => {
          this.throwAlert(p);
        });
    });
    this.validProducts = [];
  }

  validateProducts() {
    this.validProducts = this.uploadedProducts.filter( p => {
      return p.product !== null;
    }).filter( p => {
      return p !== undefined;
    });
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
