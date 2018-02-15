import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Group} from '../../models';
import {GroupService} from '../group.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-group-create-modal',
  templateUrl: './group-create-modal.component.html',
  styleUrls: ['./group-create-modal.component.css']
})

export class GroupCreateModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;

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

  @Output() createdGroupAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < GroupCreateModalComponent > = new EventEmitter < GroupCreateModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private groupService: GroupService) {
    this.groupForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      isEmployee: new FormControl(),
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

  setGroup(g: Group) {
    this.group = g;
  }

  createGroup() {
    this.groupService.createGroup(this.groupForm.value).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.createdGroupAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
