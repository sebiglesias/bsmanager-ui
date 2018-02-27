import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {Order, OrderDetail, Product} from '../../models';
import {
   ModalResult
} from '../../product-panel/product-delete-modal/product-delete-modal.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SalesService} from '../sales.service';
import {ToastsManager} from 'ng2-toastr';
import {ProductService} from '../../product-panel/product.service';
import {UserService} from '../../user-panel/user.service';

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
  @Output() productModifiedAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < SalesCheckoutModalComponent > = new EventEmitter < SalesCheckoutModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  order: Order;
  orderDetails: OrderDetail[] = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  totalItems = 0;
  totalPrice = 0;
  external: string;
  paymentMethod: string;
  paymentOptions: string[]= ['CASH', 'DEBIT', 'CREDIT', 'BANK'];
  invalidForm = false;
  invalidSecondForm = false;
  constructor(
    private _formBuilder: FormBuilder,
    private saleService: SalesService,
    private productService: ProductService,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private userService: UserService
  ) {
    toastr.setRootViewContainerRef(vcr);
  }


  ngOnInit() {
    this.firstFormGroup = new FormGroup({
      firstCtrl: new FormControl('', Validators.requiredTrue)
    });
    this.secondFormGroup = new FormGroup({
      external: new FormControl('', [Validators.required, Validators.email]),
      payment: new FormControl('', Validators.required)
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

  throwAlert(b: boolean) {
    this.checkoutSalesAlert.emit(b);
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
    this.order.payment = this.secondFormGroup.value.payment;
    this.order.external = this.secondFormGroup.value.external;
    this.saleService.createOrder(this.order).subscribe(
      smt => {
        this.orderDetails.forEach( oDetail => {
          oDetail.order = smt;
          delete oDetail['product']['@product'];
          this.saleService.createOrderDetail(oDetail).subscribe( () => {
            const p: Product = oDetail.product;
            p.quantity = p.quantity - oDetail.quantity;
            this.productService.updateProduct(p).subscribe( pro => {
              this.throwProdAlert(true);
            }, error2 => this.throwProdAlert(false));
          });
        });
        this.throwAlert(true);
        this.hide();
        this.sendTicketMail(smt);
    }, err =>
        this.throwAlert(false));
  }

  addPayment(s: string) {
    this.paymentMethod = s;
  }

  throwProdAlert(b: boolean) {
    this.productModifiedAlert.emit(b);
  }

  sendTicketMail(o: Order) {
    const to = o.external;
    const subject = 'Your ticket';
    let s = '';
    this.orderDetails.filter( od => {
      return od.order.id === o.id;
    }).forEach( orderDetail => {
      s = s + '\n ' +
        'Product: ' + orderDetail.product.name +
        ' Quantity: ' + orderDetail.quantity +
        ' Price: ' + orderDetail.price;
    });
    const content = 'Your order #' + o.id +
      '\n' +
      'You bought the following: \n \n \n' + s;
    this.userService.sendMail(to, subject, content, '');
  }
}
export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
