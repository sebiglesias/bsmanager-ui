import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Measure, User} from '../../models';
import {MeasureService} from '../measure.service';
import {UserService} from '../../user-panel/user.service';

@Component({
  selector: 'app-measure-create-modal',
  templateUrl: './measure-create-modal.component.html',
  styleUrls: ['./measure-create-modal.component.css']
})

export class MeasureCreateModalComponent implements OnInit {
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

  @Output() createdMeasureAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < MeasureCreateModalComponent > = new EventEmitter < MeasureCreateModalComponent > ();
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

  createMeasure() {
    const result = this.measureForm.value;
    if (this.measureForm.valid) {
      this.isNameTaken = false;
      this.isAbbreviationTaken = false;
      this.invalidForm = false;
      const a = this.measures.filter(c => {
        if ( c.name === result.name) {
          this.isNameTaken = true;
        }
        if (c.abbreviation === result.abbreviation) {
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
        this.measureService.createMeasure(result).subscribe(
          () => this.throwAlert(true),
          err => {
            console.log(err);
            this.throwAlert(false);
          });
        this.hide();
        this.getMeasures();
        return;
      }
    }
    this.invalidForm = true;
  }

  throwAlert(b: boolean) {
    this.createdMeasureAlert.emit(b);
  }

  getMeasures() {
    this.measureService.getAllMeasures().
      subscribe( m => this.measures = m);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
