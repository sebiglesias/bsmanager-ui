import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Store} from '../../models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StoreService} from '../store.service';

@Component({
  selector: 'app-store-edit-modal',
  templateUrl: './store-edit-modal.component.html',
  styleUrls: ['./store-edit-modal.component.css']
})

export class StoreEditModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;

  store: Store = {
    name: '',
    address: ''
  };
  storeForm;

  @Output() updatedStoreAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < StoreEditModalComponent > = new EventEmitter < StoreEditModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private storeService: StoreService) {
    this.storeForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required])
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

  setStore(s: Store) {
    this.store = s;
  }

  editStore() {
    const updatedStore = this.storeForm.value;
    updatedStore.id = this.store.id;
    this.storeService.updateStore(updatedStore).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.updatedStoreAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
