import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {User} from '../../models';
import {UserService} from '../user.service';

@Component({
  selector: 'app-user-delete-modal',
  templateUrl: './user-delete-modal.component.html',
  styleUrls: ['./user-delete-modal.component.css']
})

export class UserDeleteModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;
  user: User;

  @Output() deletedUserAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < UserDeleteModalComponent > = new EventEmitter < UserDeleteModalComponent> ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private userService: UserService) {}

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

  setUser(u: User) {
    this.user = u;
  }

  deleteUser(id: number) {
    this.userService.deleteUserById(id).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.deletedUserAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
