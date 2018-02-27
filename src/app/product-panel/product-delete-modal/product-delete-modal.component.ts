import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Product} from '../../models';
import {ProductService} from '../product.service';


@Component({
  selector: 'app-product-delete-modal',
  templateUrl: './product-delete-modal.component.html',
  styleUrls: ['./product-delete-modal.component.css']
})

export class ProductDeleteModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;
  product: Product;

  @Output() deletedProductAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < ProductDeleteModalComponent > = new EventEmitter < ProductDeleteModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private productService: ProductService) {}

  ngOnInit() {
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

  deleteProduct(id: number) {
    this.productService.deleteProductById(id).subscribe( () => this.throwAlert(false), err => {
      this.throwAlert(false);
    } );
    this.hide();
  }

  throwAlert(b: boolean) {
    this.deletedProductAlert.emit(b);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
