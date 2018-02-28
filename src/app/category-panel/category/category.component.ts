import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Category} from '../../models';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {CategoryEditModalComponent} from '../category-edit-modal/category-edit-modal.component';
import {CategoryDeleteModalComponent} from '../category-delete-modal/category-delete-modal.component';
import {CategoryCreateModalComponent} from '../category-create-modal/category-create-modal.component';
import {CategoryService} from '../category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild('editCategoryModal') editModal: CategoryEditModalComponent;
  @ViewChild('deleteCategoryModal') deleteModal: CategoryDeleteModalComponent;
  @ViewChild('createCategoryModal') createModal: CategoryCreateModalComponent;

  constructor(private categoryService: CategoryService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public ngOnInit(): void {
    this.getCategories();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  getCategories(): void {
    this.categoryService
      .getAllCategories()
      .subscribe(categories => {
        this.categories = categories;
        this.dtTrigger.next();
      });
  }

  editRowOpenModal(category: Category) {
    this.editModal.setCategory(category);
    this.editModal.show();
  }

  deleteRowOpenModal(category: Category) {
    this.deleteModal.setCategory(category);
    this.deleteModal.setCategory(category);
    this.deleteModal.show();
  }

  createCategoryOpenModal() {
    this.createModal.show();
  }

  deletedCategoryAlert(deleted: boolean) {
    this.categoryService
      .getAllCategories()
      .subscribe(
        categories => {
          this.categories = categories;
          this.reRender();
          this.deleteToast(deleted);
        },
        error => this.deleteToast(false));
  }

  updatedCategoryAlert(deleted: boolean) {
    this.categoryService
      .getAllCategories()
      .subscribe(
        categories => {
          this.categories = categories;
          this.reRender();
          this.updatedToast(deleted);
        },
        error => this.updatedToast(false));
  }

  createdCategoryAlert(created: boolean) {
    this.categoryService
      .getAllCategories()
      .subscribe(
        categories => {
          this.categories = categories;
          this.reRender();
          this.createdToast(created);
        },
        error => this.updatedToast(false));
  }

  reRender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  deleteToast(deleted: boolean) {
    if (deleted) {
      this.toastr.success('Success!', 'The category was deleted correctly.');
    } else {
      this.toastr.error('Couldn\'t delete category!', 'There is something wrong with your connection.');
    }
  }

  submittedToast(submitted: boolean) {
    if (submitted) {
      this.toastr.success('Success!', 'The category was added correctly.');
    } else {
      this.toastr.error('Couldn\'t add category!', 'There is something wrong with your connection.');
    }
  }

  updatedToast(updated: boolean) {
    if (updated) {
      this.toastr.success('Success!', 'The category was updated correctly.');
    } else {
      this.toastr.error('Couldn\'t update category!', 'There is something wrong with your connection.');
    }
  }

  createdToast(created: boolean) {
    if (created) {
      this.toastr.success('Success!', 'The category was created correctly.');
    } else {
      this.toastr.error('Couldn\'t created category!', 'There is something wrong with your connection.');
    }
  }
}
