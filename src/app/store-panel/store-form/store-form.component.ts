import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {StoreService} from '../store.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '../../models';

@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.css']
})
export class StoreFormComponent implements OnInit {

  @Output() formSubmission = new EventEmitter<boolean>();

  store: Store = {
    name: '',
    address: ''
  };
  storeForm;

  constructor(private storeService: StoreService) {
    this.storeForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() { }

  onSubmit() {
    this.storeService
      .createStore(this.storeForm.value)
      .subscribe( (s: Store) =>
        this.formSubmission.emit(true)
      );
  }
}
