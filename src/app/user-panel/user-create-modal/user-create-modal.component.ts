import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../models';
import {UserService} from '../user.service';
import {IMyDpOptions} from 'mydatepicker/dist';
import * as generator from 'generate-password';
import * as cryptoRandomString from 'crypto-random-string';


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
    firstname: '',
    lastname: '',
    taxNum: '',
    address: '',
    birthday: new Date(),
    email: '',
    telephone: '',
    admin: false
  };
  userForm;
  users: User[] = [];
  invalidForm = false;
  isEmailTaken = false;

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
    this.setDate();
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
    const result = this.userForm.value;
    if (this.userForm.valid) {
      this.isEmailTaken = false;
      this.invalidForm = false;
      const a = this.users.filter(c => {
        if ( c.email === result.email) {
          this.isEmailTaken = true;
        }
        return this.isEmailTaken;
      });
      if (a.length > 0) {
        this.invalidForm = true;
        return;
      } else {
        this.isEmailTaken = false;
        const user = this.userForm.value;
        let birthday = this.userForm.value.birthday;
        birthday = JSON.parse(JSON.stringify(birthday));
        birthday = birthday.date.year + '-' + birthday.date.month + '-' + birthday.date.day;
        user.birthday = birthday;
        user.password = this.randomPassword(20);
        this.userService.createUser(user).subscribe( u => {
          this.throwAlert(true);
          this.sendLoginEmail(user);
        }, err => this.throwAlert(false));
        this.hide();
        this.getUsers();
        return;
      }
    }
    this.invalidForm = true;
  }

  throwAlert(b: boolean) {
    this.createdUserAlert.emit(b);
  }

  private sendLoginEmail(u: User) {
    const subject = 'Welcome to Business Manager ' + u.firstname + ' ' + u.lastname;
    const content = 'To login in Business Manager please use the following credentials: \n' +
      'Your username will be: ' + u.email + '\n' +
    'Your password will be: ' + u.password + '\n' +
      'Please login as soon as possible and change your password in the Profile Section \n Have a nice day!';
    this.userService.sendMail(u.email, subject, content, '');
  }

  getUsers() {
    this.userService.getAllUsers().subscribe(
      u => this.users = u
    );
  }

  randomPassword(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890';
    let pass = '';
    for (let x = 0; x < length; x++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
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
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
