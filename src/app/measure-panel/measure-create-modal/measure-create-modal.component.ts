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
  measureForm;

  @Output() createdMeasureAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < MeasureCreateModalComponent > = new EventEmitter < MeasureCreateModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private measureService: MeasureService, private userService: UserService) {
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

  createMeasure() {
    this.measureService.createMeasure(this.measureForm.value).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.createdMeasureAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
