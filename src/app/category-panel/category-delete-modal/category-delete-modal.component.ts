import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Category} from '../../models';
import {CategoryService} from '../category.service';

@Component({
  selector: 'app-category-delete-modal',
  templateUrl: './category-delete-modal.component.html',
  styleUrls: ['./category-delete-modal.component.css']
})

export class CategoryDeleteModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;
  category: Category;

  @Output() deletedCategoryAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < CategoryDeleteModalComponent > = new EventEmitter < CategoryDeleteModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private categoryService: CategoryService) {}

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

  setCategory(c: Category) {
    this.category = c;
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategoryById(id).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.deletedCategoryAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
