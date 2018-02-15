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
  categoryForm;

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

  createCategory() {
    console.log(this.categoryForm.value);
    this.categoryService.createCategory(this.categoryForm.value).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.createdCategoryAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
