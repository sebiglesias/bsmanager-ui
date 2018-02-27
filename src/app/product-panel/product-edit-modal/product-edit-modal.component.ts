import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Brand, Category, Measure, Product, User} from '../../models';
import {ProductService} from '../product.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoryService} from '../../category-panel/category.service';
import {BrandService} from '../../brand-panel/brand.service';
import {MeasureService} from '../../measure-panel/measure.service';

@Component({
  selector: 'app-product-edit-modal',
  templateUrl: './product-edit-modal.component.html',
  styleUrls: ['./product-edit-modal.component.css']
})

export class ProductEditModalComponent implements OnInit {
  @Input('showModal') showModal: boolean;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string;
  @Input('cancelLabel') cancelLabel: string;
  @Input('positiveLabel') positiveLabel: string;

  product: Product = {
    code: '',
    name: '',
    cost: 0,
    price: 0,
    infoUrl: '',
    longDescription: '',
    shortDescription: '',
    model: '',
    series: '',
    brand: {
      name: '',
      infoUrl: '',
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
  selectedCategories: Category[];
  selectedMeasure: Measure;
  selectedBrand: Brand;
  invalidForm = false;
  isCodeTaken = false;
  products: Product[] = [];

  @Output() updatedProductAlert = new EventEmitter<boolean>();

  @Output('closed') closeEmitter: EventEmitter < ModalResult > = new EventEmitter < ModalResult > ();
  @Output('loaded') loadedEmitter: EventEmitter < ProductEditModalComponent > = new EventEmitter < ProductEditModalComponent > ();
  @Output() positiveLabelAction = new EventEmitter();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private measureService: MeasureService,
              ) {
    this.productForm = new FormGroup({
      code: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      infoUrl: new FormControl(null, Validators.required),
      longDescription: new FormControl(null, Validators.required),
      shortDescription: new FormControl(null, Validators.required),
      model: new FormControl(null, Validators.required),
      series: new FormControl(null, Validators.required),
      brand: new FormControl(null, Validators.required),
      measure: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
    this.getBrands();
    this.getCategories();
    this.getMeasures();
    this.getProducts();
    this.loadedEmitter.next(this);
  }

  getProducts() {
    this.productService.getAllProducts().subscribe( p => {
      this.products = p;
    });
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
    if (this.product.categories !== undefined) {
      this.selectedCategories = this.product.categories;
    }
    if (this.product.brand !== undefined) {
      this.selectedBrand = this.product.brand;
      this.productForm.value.brand = this.selectedBrand.id;
    }
    if (this.product.measure !== undefined) {
      this.selectedMeasure = this.product.measure;
      this.productForm.value.measure = this.selectedMeasure.id;
    }
  }

  editProduct() {
    const updatedProduct = this.productForm.value;
    updatedProduct.id = this.product.id;
    updatedProduct.categories = this.selectedCategories;
    updatedProduct.brand = this.selectedBrand;
    updatedProduct.measure = this.selectedMeasure;

    if (this.productForm.valid) {
      this.isCodeTaken = false;
      this.invalidForm = false;
      const a = this.products.filter(c => {
        if ( c.code === updatedProduct.code && c.code !== this.product.code) {
          this.isCodeTaken = true;
        }
        return this.isCodeTaken;
      });
      if (a.length > 0 || this.isCodeTaken) {
        this.invalidForm = true;
        return;
      } else {
        this.isCodeTaken = false;
        delete updatedProduct['categories']['@category'];
        this.productService.updateProduct(updatedProduct).subscribe(
          () => this.throwAlert(true),
          err => this.throwAlert(false)
        );
        this.hide();
        this.getProducts();
        return;
      }
    }
    this.invalidForm = true;
  }

  throwAlert(b: boolean) {
    this.updatedProductAlert.emit(b);
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
