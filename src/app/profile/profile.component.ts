import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker/dist';
import {Group, Store, User} from '../models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };

  myGroups: Group[] = [];
  myStores: Store[] = [];

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

  constructor() { }

  ngOnInit() {
  }

}
