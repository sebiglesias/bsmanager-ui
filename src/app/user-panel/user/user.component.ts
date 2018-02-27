import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {User} from '../../models';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {UserService} from '../user.service';
import {UserCreateModalComponent} from '../user-create-modal/user-create-modal.component';
import {UserDeleteModalComponent} from '../user-delete-modal/user-delete-modal.component';
import {UserEditModalComponent} from '../user-edit-modal/user-edit-modal.component';
import {UserResetModalComponent} from '../user-reset-modal/user-reset-modal.component';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: User[] = [];
  currentUser: User;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild('editUserModal') editModal: UserEditModalComponent;
  @ViewChild('resetUserModal') resetUserModal: UserResetModalComponent;
  @ViewChild('deleteUserModal') deleteModal: UserDeleteModalComponent;
  @ViewChild('createUserModal') createModal: UserCreateModalComponent;

  constructor(private userService: UserService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef,
              private authService: AuthService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public ngOnInit(): void {
    this.getUsers();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.currentUser = this.authService.getCurrentUser();
  }

  getUsers(): void {
    this.userService
      .getAllUsers()
      .subscribe(users => {
        this.users = users;
        this.dtTrigger.next();
      });
  }

  editRowOpenModal(group: User) {
    this.editModal.setUser(group);
    this.editModal.show();
  }

  deleteRowOpenModal(group: User) {
    this.deleteModal.setUser(group);
    this.deleteModal.show();
  }

  resetRowOpenModal(group: User) {
    this.resetUserModal.setUser(group);
    this.resetUserModal.show();
  }

  createUserOpenModal() {
    this.createModal.show();
  }

  formSubmission(submitted: boolean) {
    this.userService
      .getAllUsers()
      .subscribe(
        users => {
          this.users = users;
          this.reRender();
          this.submittedToast(submitted);
        },
        error => this.submittedToast(false),
        () => console.log('completed SubmitUser'));
  }

  deletedUserAlert(deleted: boolean) {
    this.userService
      .getAllUsers()
      .subscribe(
        users => {
          this.users = users;
          this.reRender();
          this.deleteToast(deleted);
        },
        error => this.deleteToast(false),
        () => console.log('completed DeleteUser'));
  }

  updatedUserAlert(deleted: boolean) {
    this.userService
      .getAllUsers()
      .subscribe(
        users => {
          this.users = users;
          this.reRender();
          this.updatedToast(deleted);
        },
        error => this.updatedToast(false),
        () => console.log('completed UpdatedUser'));
  }

  createdUserAlert(created: boolean) {
    this.userService
      .getAllUsers()
      .subscribe(
        users => {
          this.users = users;
          this.reRender();
          this.createdToast(created);
        },
        error => this.updatedToast(false),
        () => console.log('completed CreatedUser'));
  }

  reRender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  getDate(a: any): string {
    let birthday = JSON.parse(JSON.stringify(a));
    birthday = new Date(birthday);
    return birthday.getFullYear() + '-' + birthday.getMonth() + '-' + (birthday.getDay() + 1);
  }

  deleteToast(deleted: boolean) {
    console.log('entre a deletedToast');
    if (deleted) {
      this.toastr.success('Success!', 'The user was deleted correctly.');
    } else {
      this.toastr.error('Couldn\'t delete user!', 'There is something wrong with your connection.');
    }
  }

  submittedToast(submitted: boolean) {
    console.log('entre a submittedToast');
    if (submitted) {
      this.toastr.success('Success!', 'The user was added correctly.');
    } else {
      this.toastr.error('Couldn\'t add user!', 'There is something wrong with your connection.');
    }
  }

  updatedToast(updated: boolean) {
    console.log('entre a updateToast');
    if (updated) {
      this.toastr.success('Success!', 'The user was updated correctly.');
    } else {
      this.toastr.error('Couldn\'t update user!', 'There is something wrong with your connection.');
    }
  }

  userResettedToast(updated: boolean) {
    if (updated) {
      this.toastr.success('The user should look in his email for steps on how to reset user\'s password',
        'The user password was resetted correctly.');
    } else {
      this.toastr.error('Couldn\'t reset user\'s password!', 'There is something wrong with your connection.');
    }
  }

  createdToast(created: boolean) {
    console.log('entre a createdToast');
    if (created) {
      this.toastr.success('Success!', 'The user was created correctly.');
    } else {
      this.toastr.error('Couldn\'t created user!', 'There is something wrong with your connection.');
    }
  }
}
