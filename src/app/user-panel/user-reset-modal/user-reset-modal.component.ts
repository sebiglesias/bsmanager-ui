import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {User} from '../../models';
import {UserService} from '../user.service';


@Component({
  selector: 'app-user-reset-modal',
  templateUrl: './user-reset-modal.component.html',
  styleUrls: ['./user-reset-modal.component.css']
})

export class UserResetModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;
  user: User;

  @Output() deletedUserAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < UserResetModalComponent > = new EventEmitter < UserResetModalComponent > ();
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

  setUser(g: User) {
    this.user = g;
  }

  resetUser(id: number) {
    this.userService.getUserByName(id).subscribe( user => {
      user.password = this.randomPassword(20);
      this.userService.updateUser(user).subscribe( u => {
        const to = user.email;
        const subject = 'Reset password request';
        const content = 'Your new password is: ' + user.password;
        this.userService.sendMail(to, subject, content, '');
      });
    });
    this.hide();
  }

  throwAlert() {
    this.deletedUserAlert.emit(true);
  }

  randomPassword(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890';
    let pass = '';
    for (let x = 0; x < length; x++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
