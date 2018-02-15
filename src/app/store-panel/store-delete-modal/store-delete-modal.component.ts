import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Store} from '../../models';
import {StoreService} from '../store.service';

@Component({
  selector: 'app-store-delete-modal',
  templateUrl: './store-delete-modal.component.html',
  styleUrls: ['./store-delete-modal.component.css']
})

export class StoreDeleteModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;
  store: Store;

  @Output() deletedStoreAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < StoreDeleteModalComponent > = new EventEmitter < StoreDeleteModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private storeService: StoreService) {}

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

  deleteStore(id: number) {
    this.storeService.deleteStoreById(id).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.deletedStoreAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
