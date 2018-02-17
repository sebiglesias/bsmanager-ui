import {Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Group, Store, User} from '../../models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../user.service';
import {IMyDpOptions} from 'mydatepicker/dist';
import {GroupService} from '../../group-panel/group.service';
import {StoreService} from '../../store-panel/store.service';
import {GroupCreateModalComponent} from '../../group-panel/group-create-modal/group-create-modal.component';
import {ToastsManager} from 'ng2-toastr';

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

  @ViewChild('createGroupModal') createModal: GroupCreateModalComponent;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };

  groups: Group[] = [];
  stores: Store[] = [];
  selectedGroups: Group[] = [];
  selectedStores: Store[]= [];

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

  @Output() createdUserAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < UserCreateModalComponent > = new EventEmitter < UserCreateModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private userService: UserService,
              private groupService: GroupService,
              private storeService: StoreService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
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
    this.getGroups();
    this.getStores();
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

  createUser() {
    const userToCreate: User = this.userForm.value;
    userToCreate.groups = this.selectedGroups;
    userToCreate.stores = this.selectedStores;
    this.userService.createUser(userToCreate).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.createdUserAlert.emit(true);
  }

  getGroups(): void {
    this.groupService
      .getAllGroups()
      .subscribe(groups => {
        this.groups = groups;
      });
  }

  getStores(): void {
    this.storeService
      .getAllStores()
      .subscribe( stores => {
        this.stores = stores;
      });
  }

  addGroup(id: number): boolean {
    let found = false;
    for (let i = 0; i < this.selectedGroups.length; i++) {
      if (this.selectedGroups[i].id === Number(id)) {
        found = true;
        return !found;
      }
    }
    this.groupService.getGroupById(id).subscribe(group => {
      this.selectedGroups.push(group);
    });
  }

  removeGroup(id: number) {
    this.selectedGroups = this.selectedGroups.filter( group => {
      return group.id !== Number(id);
    });
  }

  addStore(id: number): boolean {
    let found = false;
    for (let i = 0; i < this.selectedStores.length; i++) {
      if (this.selectedStores[i].id === Number(id)) {
        found = true;
        return !found;
      }
    }
    this.storeService.getStoreById(id).subscribe(store => {
      this.selectedStores.push(store);
    });
  }

  removeStore(id: number) {
    this.selectedStores = this.selectedStores.filter( store => {
      return store.id !== Number(id);
    });
  }

  createGroupOpenModal() {
    this.createModal.show();
  }

  createdGroupAlert(created: boolean) {
    this.groupService
      .getAllGroups()
      .subscribe(
        groups => {
          this.groups = groups;
          this.createdToast(created);
        },
        error => console.log(error),
        () => console.log('completed CreatedGroup'));
  }

  createdToast(created: boolean) {
    console.log('entre a createdToast');
    if (created) {
      this.toastr.success('Success!', 'The group was created correctly.');
    } else {
      this.toastr.error('Couldn\'t created group!', 'There is something wrong with your connection.');
    }
  }

}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
