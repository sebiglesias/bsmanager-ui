import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {User} from '../../models';
import {UserService} from '../user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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
    password: '',
    name: '',
    taxNum: '',
    address: '',
    birthday: new Date(),
    email: '',
    telephone: '',
    admin: false
  };
  userForm;
  users: User[] = [];

  @Output() updatedUserAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < UserEditModalComponent > = new EventEmitter < UserEditModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private userService: UserService) {
    this.userForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      taxNum: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      birthday: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      telephone: new FormControl(null, [Validators.required]),
      admin: new FormControl(null, [Validators.required])
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

  setUser(g: User) {
    this.user = g;
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
