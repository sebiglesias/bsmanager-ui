import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {Order, OrderDetail} from '../../models';
import {
   ModalResult
} from '../../product-panel/product-delete-modal/product-delete-modal.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SalesService} from '../sales.service';
import {ToastsManager} from 'ng2-toastr';

@Component({
  selector: 'app-sales-checkout-modal',
  templateUrl: './sales-checkout-modal.component.html',
  styleUrls: ['./sales-checkout-modal.component.css']
})
export class SalesCheckoutModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;

  @Output() checkoutSalesAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < SalesCheckoutModalComponent > = new EventEmitter < SalesCheckoutModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  order: Order;
  orderDetails: OrderDetail[] = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  totalItems = 0;
  totalPrice = 0;
  paymentOptions: string[]= ['CASH', 'DEBIT', 'CREDIT'];
  constructor(
    private _formBuilder: FormBuilder,
    private saleService: SalesService,
    public toastr: ToastsManager,
    vcr: ViewContainerRef
  ) { }


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

  throwAlert() {
    this.checkoutSalesAlert.emit(true);
  }

  setOrder(order: Order) {
    this.order = order;
  }

  setDetails(details: OrderDetail[]) {
    this.orderDetails = details;
  }

  setItems(i: number) {
    this.totalItems = i;
  }

  setPrice(p: number) {
    this.totalPrice = p;
  }

  createOrder() {
    this.saleService.createOrder(this.order).subscribe(
      smt => {
        this.orderDetails.forEach( oDetail => {
          oDetail.order = smt;
          this.saleService.createOrderDetail(oDetail);
        });
        this.throwAlert();
    }, err =>
        console.log(err),
      () =>
        console.log('finished'));
  }
}
export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
