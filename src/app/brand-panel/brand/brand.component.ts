import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Brand} from '../../models';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {BrandService} from '../brand.service';
import {BrandCreateModalComponent} from '../brand-create-modal/brand-create-modal.component';
import {BrandDeleteModalComponent} from '../brand-delete-modal/brand-delete-modal.component';
import {BrandEditModalComponent} from '../brand-edit-modal/brand-edit-modal.component';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {

  brands: Brand[] = [];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild('editBrandModal') editModal: BrandEditModalComponent;
  @ViewChild('deleteBrandModal') deleteModal: BrandDeleteModalComponent;
  @ViewChild('createBrandModal') createModal: BrandCreateModalComponent;

  constructor(private brandService: BrandService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public ngOnInit(): void {
    this.getBrands();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  getBrands(): void {
    this.brandService
      .getAllBrands()
      .subscribe(brands => {
        this.brands = brands;
        this.dtTrigger.next();
      });
  }

  editRowOpenModal(group: Brand) {
    this.editModal.setBrand(group);
    this.editModal.show();
  }

  deleteRowOpenModal(group: Brand) {
    this.deleteModal.setBrand(group);
    this.deleteModal.show();
  }

  createBrandOpenModal() {
    this.createModal.show();
  }

  formSubmission(submitted: boolean) {
    this.brandService
      .getAllBrands()
      .subscribe(
        brands => {
          this.brands = brands;
          this.reRender();
          this.submittedToast(submitted);
        },
        error => this.submittedToast(false),
        () => console.log('completed SubmitBrand'));
  }

  deletedBrandAlert(deleted: boolean) {
    this.brandService
      .getAllBrands()
      .subscribe(
        brands => {
          this.brands = brands;
          this.reRender();
          this.deleteToast(deleted);
        },
        error => this.deleteToast(false),
        () => console.log('completed DeleteBrand'));
  }

  updatedBrandAlert(deleted: boolean) {
    this.brandService
      .getAllBrands()
      .subscribe(
        brands => {
          this.brands = brands;
          this.reRender();
          this.updatedToast(deleted);
        },
        error => this.updatedToast(false),
        () => console.log('completed UpdatedBrand'));
  }

  createdBrandAlert(created: boolean) {
    this.brandService
      .getAllBrands()
      .subscribe(
        brands => {
          this.brands = brands;
          this.reRender();
          this.createdToast(created);
        },
        error => this.updatedToast(false),
        () => console.log('completed CreatedBrand'));
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
      this.toastr.success('Success!', 'The brand was deleted correctly.');
    } else {
      this.toastr.error('Couldn\'t delete brand!', 'There is something wrong with your connection.');
    }
  }

  submittedToast(submitted: boolean) {
    console.log('entre a submittedToast');
    if (submitted) {
      this.toastr.success('Success!', 'The brand was added correctly.');
    } else {
      this.toastr.error('Couldn\'t add brand!', 'There is something wrong with your connection.');
    }
  }

  updatedToast(updated: boolean) {
    console.log('entre a updateToast');
    if (updated) {
      this.toastr.success('Success!', 'The brand was updated correctly.');
    } else {
      this.toastr.error('Couldn\'t update brand!', 'There is something wrong with your connection.');
    }
  }

  createdToast(created: boolean) {
    console.log('entre a createdToast');
    if (created) {
      this.toastr.success('Success!', 'The brand was created correctly.');
    } else {
      this.toastr.error('Couldn\'t created brand!', 'There is something wrong with your connection.');
    }
  }
}
