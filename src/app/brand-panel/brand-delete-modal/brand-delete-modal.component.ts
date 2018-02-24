import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Brand} from '../../models';
import {BrandService} from '../brand.service';


@Component({
  selector: 'app-brand-delete-modal',
  templateUrl: './brand-delete-modal.component.html',
  styleUrls: ['./brand-delete-modal.component.css']
})

export class BrandDeleteModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;
  brand: Brand;

  @Output() deletedBrandAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < BrandDeleteModalComponent > = new EventEmitter < BrandDeleteModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private brandService: BrandService) {}

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

  setBrand(g: Brand) {
    this.brand = g;
  }

  deleteBrand(id: number) {
    this.brandService.deleteBrandById(id).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.deletedBrandAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
