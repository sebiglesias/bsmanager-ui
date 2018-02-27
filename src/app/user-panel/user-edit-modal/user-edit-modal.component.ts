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
    firstname: '',
    lastname: '',
    taxNum: '',
    address: '',
    birthday: new Date(),
    email: '',
    telephone: '',
    admin: false
  };
  userForm: FormGroup;
  users: User[] = [];
  invalidForm = false;
  isEmailTaken = false;

  @Output() updatedUserAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < UserEditModalComponent > = new EventEmitter < UserEditModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private userService: UserService) {
    this.userForm = new FormGroup({
      firstname: new FormControl(null, [Validators.required]),
      lastname: new FormControl(null, [Validators.required]),
      taxNum: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      birthday: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      telephone: new FormControl(null, [Validators.required]),
      admin: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.getUsers();
    this.loadedEmitter.next(this);
    this.setDate();
  }

  setDate(): void {
    // Set today date using the patchValue function
    const date = new Date(this.user.birthday);
    this.userForm.patchValue({birthday: {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()}
      }});
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
    const result = this.userForm.value;
    result.id = this.user.id;
    if (this.userForm.valid) {
      this.isEmailTaken = false;
      this.invalidForm = false;
      const a = this.users.filter(c => {
        if ( c.email === result.email && c.id !== result.id) {
          this.isEmailTaken = true;
        }
        return this.isEmailTaken;
      });
      if (a.length > 0) {
        this.invalidForm = true;
        return;
      } else {
        this.isEmailTaken = false;
        this.userService.updateUser(result).subscribe( () => this.throwAlert(true), err => this.throwAlert(false) );
        this.hide();
        this.getUsers();
        return;
      }
    }
    this.invalidForm = true;
  }

  throwAlert(b: boolean) {
    this.updatedUserAlert.emit(b);
  }

  getUsers() {
    this.userService.getAllUsers().subscribe( u => this.users=u);
  }
  getDate(a: any): string {
    let birthday = JSON.parse(JSON.stringify(a));
    birthday = new Date(birthday);
    return birthday.getFullYear() + '-' + birthday.getMonth() + '-' + (birthday.getDay() + 1);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
