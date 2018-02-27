import {Component, EventEmitter, OnInit, Output, ViewContainerRef} from '@angular/core';
import {User} from '../models';
import {UserService} from '../user-panel/user.service';
import {AuthService} from '../auth/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
  loginForm: FormGroup;
  invalidForm = false;

  @Output() updatedUserAlert = new EventEmitter<boolean>();
  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  login() {
    this.invalidForm = true;
    if (this.loginForm.valid) {
      this.invalidForm = false;
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.userService.getAllUsers().subscribe(users => {
        users.filter(user => {
          if (user.email === email) {
            if (user.password === password) {
              this.authService.setUser(user);
              this.throwToast(true);
              this.router.navigate(['/']).then();
              return;
            }
          }
          this.invalidForm = true;
        });
      }, err => this.throwToast(err));
    }
  }

  throwToast(created: boolean): boolean {
    console.log('entre a createdToast');
    if (created) {
      this.toastr.success('Success!', 'You are now logged in.');
    } else {
      this.toastr.error('Couldn\'t log in!', 'Are you typing your password correctly?');
    }
    return created;
  }
}
