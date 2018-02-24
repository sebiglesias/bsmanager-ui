import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Measure, User} from '../../models';
import {MeasureService} from '../measure.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-measure-edit-modal',
  templateUrl: './measure-edit-modal.component.html',
  styleUrls: ['./measure-edit-modal.component.css']
})

export class MeasureEditModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;

  measure: Measure = {
    name: '',
    abbreviation: ''
  };
  measureForm;
  users: User[] = [];

  @Output() updatedMeasureAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < MeasureEditModalComponent > = new EventEmitter < MeasureEditModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private measureService: MeasureService) {
    this.measureForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      abbreviation: new FormControl(null, [Validators.required])
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

  setMeasure(g: Measure) {
    this.measure = g;
  }

  editMeasure() {
    const updatedMeasure = this.measureForm.value;
    updatedMeasure.id = this.measure.id;
    this.measureService.updateMeasure(updatedMeasure).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.updatedMeasureAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
