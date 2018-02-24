import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Measure} from '../../models';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {MeasureService} from '../measure.service';
import {MeasureCreateModalComponent} from '../measure-create-modal/measure-create-modal.component';
import {MeasureDeleteModalComponent} from '../measure-delete-modal/measure-delete-modal.component';
import {MeasureEditModalComponent} from '../measure-edit-modal/measure-edit-modal.component';

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.css']
})
export class MeasureComponent implements OnInit {

  measures: Measure[] = [];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild('editMeasureModal') editModal: MeasureEditModalComponent;
  @ViewChild('deleteMeasureModal') deleteModal: MeasureDeleteModalComponent;
  @ViewChild('createMeasureModal') createModal: MeasureCreateModalComponent;

  constructor(private measureService: MeasureService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public ngOnInit(): void {
    this.getMeasures();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  getMeasures(): void {
    this.measureService
      .getAllMeasures()
      .subscribe(measures => {
        this.measures = measures;
        this.dtTrigger.next();
      });
  }

  editRowOpenModal(group: Measure) {
    this.editModal.setMeasure(group);
    this.editModal.show();
  }

  deleteRowOpenModal(group: Measure) {
    this.deleteModal.setMeasure(group);
    this.deleteModal.show();
  }

  createMeasureOpenModal() {
    this.createModal.show();
  }

  formSubmission(submitted: boolean) {
    this.measureService
      .getAllMeasures()
      .subscribe(
        measures => {
          this.measures = measures;
          this.reRender();
          this.submittedToast(submitted);
        },
        error => this.submittedToast(false),
        () => console.log('completed SubmitMeasure'));
  }

  deletedMeasureAlert(deleted: boolean) {
    this.measureService
      .getAllMeasures()
      .subscribe(
        measures => {
          this.measures = measures;
          this.reRender();
          this.deleteToast(deleted);
        },
        error => this.deleteToast(false),
        () => console.log('completed DeleteMeasure'));
  }

  updatedMeasureAlert(deleted: boolean) {
    this.measureService
      .getAllMeasures()
      .subscribe(
        measures => {
          this.measures = measures;
          this.reRender();
          this.updatedToast(deleted);
        },
        error => this.updatedToast(false),
        () => console.log('completed UpdatedMeasure'));
  }

  createdMeasureAlert(created: boolean) {
    this.measureService
      .getAllMeasures()
      .subscribe(
        measures => {
          this.measures = measures;
          this.reRender();
          this.createdToast(created);
        },
        error => this.updatedToast(false),
        () => console.log('completed CreatedMeasure'));
  }

  reRender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  deleteToast(deleted: boolean) {
    console.log('entre a deletedToast');
    if (deleted) {
      this.toastr.success('Success!', 'The measure was deleted correctly.');
    } else {
      this.toastr.error('Couldn\'t delete measure!', 'There is something wrong with your connection.');
    }
  }

  submittedToast(submitted: boolean) {
    console.log('entre a submittedToast');
    if (submitted) {
      this.toastr.success('Success!', 'The measure was added correctly.');
    } else {
      this.toastr.error('Couldn\'t add measure!', 'There is something wrong with your connection.');
    }
  }

  updatedToast(updated: boolean) {
    console.log('entre a updateToast');
    if (updated) {
      this.toastr.success('Success!', 'The measure was updated correctly.');
    } else {
      this.toastr.error('Couldn\'t update measure!', 'There is something wrong with your connection.');
    }
  }

  createdToast(created: boolean) {
    console.log('entre a createdToast');
    if (created) {
      this.toastr.success('Success!', 'The measure was created correctly.');
    } else {
      this.toastr.error('Couldn\'t created measure!', 'There is something wrong with your connection.');
    }
  }
}
