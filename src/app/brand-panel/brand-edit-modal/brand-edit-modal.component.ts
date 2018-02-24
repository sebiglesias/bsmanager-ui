import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Brand, User} from '../../models';
import {BrandService} from '../brand.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-brand-edit-modal',
  templateUrl: './brand-edit-modal.component.html',
  styleUrls: ['./brand-edit-modal.component.css']
})

export class BrandEditModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;

  brand: Brand = {
    name: '',
    infoURL: '',
    observations: ''
  };
  brandForm;
  users: User[] = [];

  @Output() updatedBrandAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < BrandEditModalComponent > = new EventEmitter < BrandEditModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private brandService: BrandService) {
    this.brandForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      infoURL: new FormControl(null, [Validators.required]),
      observations: new FormControl(null, [Validators.required])
    });
  }

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

  editBrand() {
    const updatedBrand = this.brandForm.value;
    updatedBrand.id = this.brand.id;
    this.brandService.updateBrand(updatedBrand).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.updatedBrandAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
