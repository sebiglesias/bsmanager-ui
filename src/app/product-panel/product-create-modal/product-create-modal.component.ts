import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Brand, Category, Measure, Product, User} from '../../models';
import {ProductService} from '../product.service';
import {UserService} from '../../user-panel/user.service';
import {CategoryService} from '../../category-panel/category.service';
import {BrandService} from '../../brand-panel/brand.service';
import {MeasureService} from '../../measure-panel/measure.service';

@Component({
  selector: 'app-product-create-modal',
  templateUrl: './product-create-modal.component.html',
  styleUrls: ['./product-create-modal.component.css']
})

export class ProductCreateModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;

  product: Product = {
    code: '',
    name: '',
    costAfterTax: 0,
    costBeforeTax: 0,
    infoUrl: '',
    longDescription: '',
    shortDescription: '',
    model: '',
    series: '',
    brand: {
      name: '',
      infoURL: '',
      observations: ''
    },
    categories: [{
      plural_name: '',
      singular_name: ''
    }],
    measure: {
      name: '',
      abbreviation: ''
    },
    quantity: 0
  };
  productForm;
  users: User[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  measures: Measure[] = [];
  selectedCategories: Category[] = [];
  selectedBrand: Brand;
  selectedMeasure: Measure;

  @Output() createdProductAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < ProductCreateModalComponent > = new EventEmitter < ProductCreateModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private brandService: BrandService,
              private measureService: MeasureService,
  ) {
    this.productForm = new FormGroup({
      code: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      costAfterTax: new FormControl(null, [Validators.required]),
      costBeforeTax: new FormControl(null, [Validators.required]),
      infoUrl: new FormControl(null, [Validators.required]),
      longDescription: new FormControl(null, [Validators.required]),
      shortDescription: new FormControl(null, [Validators.required]),
      model: new FormControl(null, [Validators.required]),
      series: new FormControl(null, [Validators.required]),
      brand: new FormControl(null, [Validators.required]),
      categories: new FormControl(null, [Validators.required]),
      measure: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this.getCategories();
    this.getBrands();
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

  setProduct(g: Product) {
    this.product = g;
  }

  createProduct() {
    const productToCreate: Product = this.productForm.value;
    productToCreate.categories = this.selectedCategories;
    productToCreate.brand = this.selectedBrand;
    productToCreate.measure = this.selectedMeasure;
    this.productService.createProduct(this.productForm.value).subscribe( () => this.throwAlert() );
    this.hide();
  }

  throwAlert() {
    this.createdProductAlert.emit(true);
  }

  getCategories() {
    this.categoryService
      .getAllCategories()
      .subscribe( category => {
        this.categories = category;
      });
  }

  getBrands(): void {
    this.brandService
      .getAllBrands()
      .subscribe(brands => {
        this.brands = brands;
      });
  }

  getMeasures(): void {
    this.measureService
      .getAllMeasures()
      .subscribe(measures => {
        this.measures = measures;
      });
  }

  addBrand(id: string) {
    this.brandService.getBrandById(Number(id)).subscribe( brand => {
      this.selectedBrand = brand;
    });
  }

  addMeasure(id: string) {
    this.measureService.getMeasureById(Number(id)).subscribe( brand => {
      this.selectedMeasure = brand;
    });
  }

  addCategory(id: number): boolean {
    let found = false;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      if (this.selectedCategories[i].id === Number(id)) {
        found = true;
        return !found;
      }
    }
    this.categoryService.getCategoryByName(id).subscribe(group => {
      this.selectedCategories.push(group);
    });
  }

  removeCategory(id: number) {
    this.selectedCategories = this.selectedCategories.filter( group => {
      return group.id !== Number(id);
    });
  }
}

export enum ModalAction { POSITIVE, CANCEL }

export interface ModalResult {
  action: ModalAction;
}
