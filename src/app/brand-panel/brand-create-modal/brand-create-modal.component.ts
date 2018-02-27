import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Brand, User} from '../../models';
import {BrandService} from '../brand.service';
import {UserService} from '../../user-panel/user.service';

@Component({
  selector: 'app-brand-create-modal',
  templateUrl: './brand-create-modal.component.html',
  styleUrls: ['./brand-create-modal.component.css']
})

export class BrandCreateModalComponent implements OnInit {
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

  @Output() createdBrandAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < BrandCreateModalComponent > = new EventEmitter < BrandCreateModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private brandService: BrandService, private userService: UserService) {
    this.brandForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      infoUrl: new FormControl('', Validators.required),
      observations: new FormControl('', Validators.required)
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

  createBrand() {
    if (this.brandForm.valid) {
      this.invalidForm = false;
      const a = this.brands.filter(b => {
        return b.name === this.brandForm.value.name;
      });
      if (a.length > 0) {
        this.invalidForm = true;
        this.isNameTaken = true;
        return;
      } else {
        this.isNameTaken = false;
        this.brandService.createBrand(this.brandForm.value).subscribe(
          () => this.throwAlert(true),
          err => this.throwAlert(false));
        this.hide();
        this.getBrands();
        return;
      }
    }
    this.invalidForm = true;
  }

  throwAlert(b: boolean) {
    this.createdBrandAlert.emit(true);
  }

  private reloadBrands() {
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
