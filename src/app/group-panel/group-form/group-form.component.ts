import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GroupService} from '../group.service';
import {Group} from '../../models';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.css']
})
export class GroupFormComponent implements OnInit {

  @Output() formSubmission = new EventEmitter<boolean>();

  group: Group = {
    name: '',
    isEmployee: false,
    users: false,
    brands: false,
    units: false,
    stores: false,
    categories: false,
    groups: false,
    products: false,
  };
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

  ngOnInit() { }

  onSubmit() {
    this.groupService
      .createGroup(this.groupForm.value)
        .subscribe( (g: Group) =>
          this.formSubmission.emit(true)
        );
  }
}
