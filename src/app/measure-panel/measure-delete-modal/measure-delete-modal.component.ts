import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Measure} from '../../models';
import {MeasureService} from '../measure.service';


@Component({
  selector: 'app-measure-delete-modal',
  templateUrl: './measure-delete-modal.component.html',
  styleUrls: ['./measure-delete-modal.component.css']
})

export class MeasureDeleteModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;
  measure: Measure;

  @Output() deletedMeasureAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < MeasureDeleteModalComponent > = new EventEmitter < MeasureDeleteModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private measureService: MeasureService) {}

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

  deleteMeasure(id: number) {
    this.measureService.deleteMeasureById(id).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.deletedMeasureAlert.emit(true);
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
