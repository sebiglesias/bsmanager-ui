import { Component, OnInit } from '@angular/core';
import {GroupService} from '../group.service';
import {Group} from '../models';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.css']
})
export class GroupFormComponent implements OnInit {

  groupForm;

  constructor(private groupService: GroupService) {
    this.groupForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      users: new FormControl(),
      brands: new FormControl(),
      units: new FormControl(),
      stores: new FormControl(),
      categories: new FormControl(),
      groups: new FormControl(),
      products: new FormControl()
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    const formGroup: Group = {
      name: this.groupForm.name,
      users: this.groupForm.users,
      brands: this.groupForm.brands,
      units: this.groupForm.units,
      stores: this.groupForm.stores,
      categories: this.groupForm.categories,
      groups: this.groupForm.groups,
      products: this.groupForm.products
    };
    this.groupService.createGroup(formGroup);
  }

  reset() {

  }
}
