import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Category, Group} from '../../models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoryService} from '../category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  @Output() formSubmission = new EventEmitter<boolean>();

  category: Category = {
    plural_name: '',
    singular_name: ''
  };
  categoryForm;

  constructor(private categoryService: CategoryService) {
    this.categoryForm = new FormGroup({
      plural_name: new FormControl(null, [Validators.required]),
      singular_name: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() { }

  onSubmit() {
    this.categoryService
      .createCategory(this.categoryForm.value)
      .subscribe( (c: Category) =>
        this.formSubmission.emit(true)
      );
  }
}
