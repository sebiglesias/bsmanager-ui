import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { StoreService } from '../store.service';
import {Store} from '../../models';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {StoreDeleteModalComponent} from '../store-delete-modal/store-delete-modal.component';
import {StoreEditModalComponent} from '../store-edit-modal/store-edit-modal.component';
import {StoreCreateModalComponent} from '../store-create-modal/store-create-modal.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {

  stores: Store[] = [];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild('editStoreModal') editModal: StoreEditModalComponent;
  @ViewChild('deleteStoreModal') deleteModal: StoreDeleteModalComponent;
  @ViewChild('createStoreModal') createStoreModal: StoreCreateModalComponent;

  constructor(private storeService: StoreService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public ngOnInit(): void {
    this.getStores();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2
    };
  }

  getStores(): void {
    this.storeService
      .getAllStores()
      .subscribe(stores => {
        this.stores = stores;
        this.dtTrigger.next();
      });
  }

  createStoreOpenModal() {
    this.createStoreModal.show();
  }

  editRowOpenModal(store: Store) {
    this.editModal.setStore(store);
    this.editModal.show();
  }

  deleteRowOpenModal(store: Store) {
    this.deleteModal.setStore(store);
    this.deleteModal.show();
  }

  formSubmission(submitted: boolean) {
    this.storeService
      .getAllStores()
      .subscribe(
        stores => {
          this.stores = stores;
          this.reRender();
          this.submittedToast(submitted);
        },
        error => this.submittedToast(false),
        () => console.log('completed SubmitStore'));
  }

  deletedStoreAlert(deleted: boolean) {
    this.storeService
      .getAllStores()
      .subscribe(
        stores => {
          this.stores = stores;
          this.reRender();
          this.deleteToast(deleted);
        },
        error => this.deleteToast(false),
        () => console.log('completed DeleteStore'));
  }

  updatedStoreAlert(deleted: boolean) {
    this.storeService
      .getAllStores()
      .subscribe(
        stores => {
          this.stores = stores;
          this.reRender();
          this.updatedToast(deleted);
        },
        error => this.updatedToast(false),
        () => console.log('completed UpdatedStores'));
  }

  createdStoreAlert(created: boolean) {
    this.storeService
      .getAllStores()
      .subscribe(
        stores => {
          this.stores = stores;
          this.reRender();
          this.createdToast(created);
        },
        error => this.createdToast(false),
        () => console.log('completed CreatedStore')
      );
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
      this.toastr.success('Success!', 'The store was deleted correctly.');
    } else {
      this.toastr.error('Couldn\'t delete store!', 'There is something wrong with your connection.');
    }
  }

  submittedToast(submitted: boolean) {
    console.log('entre a submittedToast');
    if (submitted) {
      this.toastr.success('Success!', 'The store was added correctly.');
    } else {
      this.toastr.error('Couldn\'t add store!', 'There is something wrong with your connection.');
    }
  }

  updatedToast(updated: boolean) {
    console.log('entre a updateToast');
    if (updated) {
      this.toastr.success('Success!', 'The store was updated correctly.');
    } else {
      this.toastr.error('Couldn\'t update store!', 'There is something wrong with your connection.');
    }
  }

  createdToast(created: boolean) {
    console.log('entre a createToast');
    if (created) {
      this.toastr.success('Success!', 'The store was created correctly.');
    } else {
      this.toastr.error('Couldn\'t created store!', 'There is something wrong with your connection.');
    }
  }
}
