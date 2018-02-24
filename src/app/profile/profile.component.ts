import {Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr';

import * as Generator from 'random-password-generator';
import * as Encryptor from 'bcryptjs';
import {AuthService} from '../auth/auth.service';
import { User} from '../models';
import {UserService} from '../user-panel/user.service';
import {IMyDpOptions} from 'mydatepicker/dist';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {


  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd'
  };
  user: User = {
    name: '',
    password: '',
    CUIT: '',
    address: '',
    birthday: new Date(),
    email: '',
    telephone: '',
    admin: false
  };
  userForm;

  @Output() updatedUserAlert = new EventEmitter<boolean>();

  @Output() positiveLabelAction = new EventEmitter();

  constructor(private userService: UserService,
              private authService: AuthService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.userForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      CUIT: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      birthday: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.email]),
      telephone: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required])
    });
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

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.setDate();
  }

  positiveAction() {
    this.positiveLabelAction.next(this);
    return false;
  }

  throwAlert() {
    this.updatedUserAlert.emit(true);
  }

  throwToast(created: boolean) {
    console.log('entre a createdToast');
    if (created) {
      this.toastr.success('Success!', 'Your info has been updated.');
    } else {
      this.toastr.error('Couldn\'t update info!', 'There is something wrong with your connection.');
    }
  }

  updateUser() {
    const formValue = this.userForm.value;
    const newUser = this.user;
    newUser.name = formValue.name;
    newUser.email = formValue.email;
    newUser.telephone = formValue.telephone;
    newUser.address = formValue.address;
    newUser.CUIT = formValue.CUIT;
    const birthday = this.userForm.value.birthday;
    newUser.birthday = new Date(birthday.date.year + '/' + birthday.date.month + '/' + birthday.date.day);
    if (formValue.password !== undefined && formValue.password !== null) {
      newUser.password = formValue.password;
    }
    this.userService.updateUser(newUser).subscribe( user => {
      this.throwToast(true);
      this.authService.setUser(user);
    });

  }

}
