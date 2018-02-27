import {Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Form, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr';

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
    firstname: '',
    lastname: '',
    password: '',
    taxNum: '',
    address: '',
    birthday: new Date(),
    email: '',
    telephone: '',
    admin: false
  };
  userForm: FormGroup;
  passwordForm: FormGroup;
  invalidForm = false;
  isEmailTaken = false;
  isPasswordDifferent = false;
  users: User[] = [];
  invalidPasswordForm = false;

  @Output() updatedUserAlert = new EventEmitter<boolean>();

  @Output() positiveLabelAction = new EventEmitter();

  constructor(private userService: UserService,
              private authService: AuthService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.userForm = new FormGroup({
      firstname: new FormControl(null, [Validators.required]),
      lastname: new FormControl(null, [Validators.required]),
      taxNum: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      birthday: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.email, Validators.required]),
      telephone: new FormControl(null, [Validators.required]),
    });
    this.passwordForm = new FormGroup({
      password: new FormControl(null, [Validators.required]),
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
    this.getUsers();
    this.user = this.authService.getCurrentUser();
    this.setDate();
  }

  positiveAction() {
    this.positiveLabelAction.next(this);
    return false;
  }

  throwToast(created: boolean) {
    if (created) {
      this.toastr.success('Success!', 'Your info has been updated.');
    } else {
      this.toastr.error('Couldn\'t update info!', 'There is something wrong with your connection.');
    }
  }

  changedPasswordToast(b: boolean) {
    if (b) {
      this.toastr.success('You password has been changed.', 'Success!');
    } else {
      this.toastr.error('Couldn\'t update info!', 'There is something wrong with your connection.');
    }
  }

  changePassword() {
    const formValue = this.passwordForm.value;
    this.isPasswordDifferent = false;
    this.invalidPasswordForm = false;
    if (formValue.password !== undefined && formValue.password !== null) {
      this.isPasswordDifferent = formValue.password !== formValue.confirmPassword;
      if (!this.isPasswordDifferent && !this.invalidForm) {
        this.user.password = formValue.password;
        this.userService.updateUser(this.user).subscribe( u => {
          this.changedPasswordToast(true);
          this.getUsers();
          this.authService.setUser(u);
          return;
        });
      }
    }
    this.invalidPasswordForm = true;
  }

  updateUser() {

    const formValue = this.userForm.value;
    const newUser = this.user;
    newUser.firstname = formValue.firstname;
    newUser.lastname = formValue.lastname;
    newUser.email = formValue.email;
    newUser.telephone = formValue.telephone;
    newUser.address = formValue.address;
    newUser.taxNum = formValue.taxNum;
    let birthday = this.userForm.value.birthday;
    birthday = new Date(birthday);
    birthday = birthday.getFullYear() + '-' + birthday.getMonth() + '-' + (birthday.getDay() + 1);
    newUser.birthday = birthday;
    if (this.userForm.valid) {
      this.isEmailTaken = false;
      this.invalidForm = false;
      const a = this.users.filter(c => {
        if ( c.email === newUser.email && c.id !== newUser.id) {
          this.isEmailTaken = true;
        }
        return this.isEmailTaken;
      });
      if (a.length > 0) {
        this.invalidForm = true;
        return;
      } else {
        this.isEmailTaken = false;
        this.userService.updateUser(newUser).subscribe( user => {
          this.throwToast(true);
          this.authService.setUser(user);
          }, err => this.throwToast(false)
        );
        this.getUsers();
        return;
      }
    }
    this.invalidForm = true;
  }

  getUsers() {
    this.userService.getAllUsers().subscribe( u => this.users = u);
  }
}
