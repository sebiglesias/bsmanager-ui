import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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
    infoURL: '',
    observations: ''
  };
  brandForm;
  users: User[] = [];

  @Output() createdBrandAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < BrandCreateModalComponent > = new EventEmitter < BrandCreateModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private brandService: BrandService, private userService: UserService) {
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

  createBrand() {
    this.brandService.createBrand(this.brandForm.value).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.createdBrandAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
