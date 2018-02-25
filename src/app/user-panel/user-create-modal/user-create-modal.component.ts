import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../models';
import {UserService} from '../user.service';
import {IMyDpOptions} from 'mydatepicker/dist';
import * as generator from 'generate-password';

@Component({
  selector: 'app-user-create-modal',
  templateUrl: './user-create-modal.component.html',
  styleUrls: ['./user-create-modal.component.css']
})

export class UserCreateModalComponent implements OnInit {
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

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd'
  };

  @Output() createdUserAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < UserCreateModalComponent > = new EventEmitter < UserCreateModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(
    private userService: UserService
  ) {
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

  createUser() {
    const user = this.userForm.value;
    let birthday = this.userForm.value.birthday;
    birthday = JSON.parse(JSON.stringify(birthday));
    birthday = birthday.date.year + '-' + birthday.date.month + '-' + birthday.date.day;
    user.birthday = birthday;
    user.password = generator.generate({
      length: 12,
      numbers: true
    });
    this.userService.createUser(user).subscribe( () => {
      this.throwAlert();
    });
    this.hide();
  }

  throwAlert() {
    this.createdUserAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
