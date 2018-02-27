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
  measureForm: FormGroup;
  invalidForm = false;
  isNameTaken = false;
  isAbbreviationTaken = false;
  measures: Measure[] = [];

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
    this.getMeasures();
    this.loadedEmitter.next(this);
  }

  getMeasures() {
    this.measureService.getAllMeasures().
    subscribe( m => this.measures = m);
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
    if (this.measureForm.valid) {
      this.isNameTaken = false;
      this.isAbbreviationTaken = false;
      this.invalidForm = false;
      const a = this.measures.filter(c => {
        if ( c.name === updatedMeasure.name  && c.id !== updatedMeasure.id) {
          this.isNameTaken = true;
        }
        if (c.abbreviation === updatedMeasure.abbreviation && c.id !== updatedMeasure.id) {
          this.isAbbreviationTaken = true;
        }
        return this.isNameTaken || this.isAbbreviationTaken;
      });
      if (a.length > 0) {
        this.invalidForm = true;
        return;
      } else {
        this.isNameTaken = false;
        this.isAbbreviationTaken = false;
        this.measureService.updateMeasure(updatedMeasure).subscribe( () => this.throwAlert(true), err => {
          this.throwAlert(false);
        } );
        this.hide();
        this.getMeasures();
        return;
      }
    }
    this.invalidForm = true;
  }

  throwAlert(b: boolean) {
    this.updatedMeasureAlert.emit(b);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
