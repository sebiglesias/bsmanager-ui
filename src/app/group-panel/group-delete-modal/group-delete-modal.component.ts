import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Group} from '../../models';
import {GroupService} from '../group.service';

@Component({
  selector: 'app-group-delete-modal',
  templateUrl: './group-delete-modal.component.html',
  styleUrls: ['./group-delete-modal.component.css']
})

export class GroupDeleteModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;
  group: Group;

  @Output() deletedGroupAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < GroupDeleteModalComponent > = new EventEmitter < GroupDeleteModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private groupService: GroupService) {}

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

  deleteGroup(id: number) {
    this.groupService.deleteGroupById(id).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.deletedGroupAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
