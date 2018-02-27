import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Category} from '../../models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoryService} from '../category.service';

@Component({
  selector: 'app-category-create-modal',
  templateUrl: './category-create-modal.component.html',
  styleUrls: ['./category-create-modal.component.css']
})

export class CategoryCreateModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;

  category: Category= {
    plural_name: '',
    singular_name: ''
  };
  categoryForm: FormGroup;
  invalidForm = false;
  categories: Category[] = [];
  isPluralNameTaken = false;
  isSingularNameTaken = false;

  @Output() createdCategoryAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < CategoryCreateModalComponent > = new EventEmitter < CategoryCreateModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private categoryService: CategoryService) {
    this.categoryForm = new FormGroup({
      plural_name: new FormControl(null, [Validators.required]),
      singular_name: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.getCategories();
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

  getCategories() {
    this.categoryService.getAllCategories().
    subscribe( b => {
      this.categories = b;
    });
  }

  createCategory() {
    const result = this.categoryForm.value;
    if (this.categoryForm.valid) {
      this.isSingularNameTaken = false;
      this.isPluralNameTaken = false;
      this.invalidForm = false;
      const a = this.categories.filter(c => {
        if ( c.plural_name === result.plural_name) {
          this.isPluralNameTaken = true;
        }
        if (c.singular_name === result.singular_name) {
          this.isSingularNameTaken = true;
        }
        return this.isPluralNameTaken || this.isSingularNameTaken;
      });
      if (a.length > 0) {
        this.invalidForm = true;
        return;
      } else {
        this.isPluralNameTaken = false;
        this.isSingularNameTaken = false;
        this.categoryService.createCategory(result).subscribe(
          () => this.throwAlert(true),
          err => this.throwAlert(false));
        this.hide();
        this.getCategories();
        return;
      }
    }
    this.invalidForm = true;
  }

  throwAlert(b: boolean) {
    this.createdCategoryAlert.emit(b);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
