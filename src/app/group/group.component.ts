import {Component, EventEmitter, OnInit} from '@angular/core';
import { GroupService} from '../group.service';
import {Group} from '../models';
import {MaterializeAction} from 'angular2-materialize';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  groups: Group[];

  modalActions = new EventEmitter<string|MaterializeAction>();

  constructor(private groupService: GroupService) { }

  ngOnInit() {
    this.getGroups();
  }

  getGroups(): void {
    this.groupService.getAllGroups().subscribe(g => this.groups = g);
  }
  openModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }
  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }
}
