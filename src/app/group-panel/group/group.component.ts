import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { GroupService} from '../group.service';
import {Group} from '../../models';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {GroupDeleteModalComponent} from '../group-delete-modal/group-delete-modal.component';
import {GroupEditModalComponent} from '../group-edit-modal/group-edit-modal.component';
import {GroupCreateModalComponent} from '../group-create-modal/group-create-modal.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  groups: Group[] = [];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild('editGroupModal') editModal: GroupEditModalComponent;
  @ViewChild('deleteGroupModal') deleteModal: GroupDeleteModalComponent;
  @ViewChild('createGroupModal') createModal: GroupCreateModalComponent;

  constructor(private groupService: GroupService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public ngOnInit(): void {
    this.getGroups();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2
    };
  }

  getGroups(): void {
    this.groupService
      .getAllGroups()
        .subscribe(groups => {
          this.groups = groups;
          this.dtTrigger.next();
        });
  }

  editRowOpenModal(group: Group) {
    this.editModal.setGroup(group);
    this.editModal.show();
  }

  deleteRowOpenModal(group: Group) {
    this.deleteModal.setGroup(group);
    this.deleteModal.show();
  }

  createGroupOpenModal() {
    this.createModal.show();
  }

  formSubmission(submitted: boolean) {
    this.groupService
      .getAllGroups()
      .subscribe(
        groups => {
          this.groups = groups;
          this.reRender();
          this.submittedToast(submitted);
        },
        error => this.submittedToast(false),
        () => console.log('completed SubmitGroup'));
  }

  deletedGroupAlert(deleted: boolean) {
    this.groupService
      .getAllGroups()
      .subscribe(
        groups => {
          this.groups = groups;
          this.reRender();
          this.deleteToast(deleted);
        },
      error => this.deleteToast(false),
        () => console.log('completed DeleteGroup'));
  }

  updatedGroupAlert(deleted: boolean) {
    this.groupService
      .getAllGroups()
      .subscribe(
        groups => {
          this.groups = groups;
          this.reRender();
          this.updatedToast(deleted);
        },
        error => this.updatedToast(false),
        () => console.log('completed UpdatedGroup'));
  }

  createdGroupAlert(created: boolean) {
    this.groupService
      .getAllGroups()
      .subscribe(
        groups => {
          this.groups = groups;
          this.reRender();
          this.createdToast(created);
        },
        error => this.updatedToast(false),
        () => console.log('completed CreatedGroup'));
  }

  reRender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  deleteToast(deleted: boolean) {
    console.log('entre a deletedToast');
    if (deleted) {
      this.toastr.success('Success!', 'The group was deleted correctly.');
    } else {
      this.toastr.error('Couldn\'t delete group!', 'There is something wrong with your connection.');
    }
  }

  submittedToast(submitted: boolean) {
    console.log('entre a submittedToast');
    if (submitted) {
      this.toastr.success('Success!', 'The group was added correctly.');
    } else {
      this.toastr.error('Couldn\'t add group!', 'There is something wrong with your connection.');
    }
  }

  updatedToast(updated: boolean) {
    console.log('entre a updateToast');
    if (updated) {
      this.toastr.success('Success!', 'The group was updated correctly.');
    } else {
      this.toastr.error('Couldn\'t update group!', 'There is something wrong with your connection.');
    }
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