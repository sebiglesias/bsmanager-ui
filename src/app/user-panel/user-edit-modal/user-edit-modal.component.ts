import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User} from '../../models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../user.service';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.css']
})

export class UserEditModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;

  user: User = {
    name: '',
    password: '',
    cuit: '',
    address: '',
    birthday: new Date(),
    email: '',
    telephone: '',
    groups: [],
    stores: []
  };
  userForm;

  @Output() updatedUserAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < UserEditModalComponent > = new EventEmitter < UserEditModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private userService: UserService) {
    this.userForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      cuit: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      birthday: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      telephone: new FormControl(null, [Validators.required]),
      groups: new FormControl(null, [Validators.required]),
      stores: new FormControl(null, [Validators.required])
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

  setUser(u: User) {
    this.user = u;
  }

  editUser() {
    const updatedUser = this.userForm.value;
    updatedUser.id = this.user.id;
    this.userService.updateUser(updatedUser).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.updatedUserAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
