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
    infoUrl: '',
    observations: ''
  };
  brandForm: FormGroup;
  users: User[] = [];
  brands: Brand[];

  invalidForm = false;
  isNameTaken = false;

  @Output() updatedBrandAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < BrandEditModalComponent > = new EventEmitter < BrandEditModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private brandService: BrandService) {
    this.brandForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      infoUrl: new FormControl(null, [Validators.required]),
      observations: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.getBrands();
    this.loadedEmitter.next(this);
  }

  getBrands() {
    this.brandService.getAllBrands().
    subscribe( b => {
      this.brands = b;
    });
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
    if (this.brandForm.valid) {
      this.invalidForm = false;
      const a = this.brands.filter(b => {
        return b.name === this.brandForm.value.name && updatedBrand.id !== b.id;
      });
      if (a.length > 0) {
        this.invalidForm = true;
        this.isNameTaken = true;
        return;
      } else {
        this.isNameTaken = false;
        this.brandService.updateBrand(updatedBrand).subscribe( () => this.throwAlert(true),
          err => this.throwAlert(false));
        this.getBrands();
        this.hide();
        return;
      }
    }
    this.invalidForm = true;
  }

  throwAlert(b: boolean) {
    this.updatedBrandAlert.emit(b);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
