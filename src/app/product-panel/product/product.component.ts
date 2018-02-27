import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Brand, Category, Product, StockXls} from '../../models';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {ProductService} from '../product.service';
import {ProductCreateModalComponent} from '../product-create-modal/product-create-modal.component';
import {ProductDeleteModalComponent} from '../product-delete-modal/product-delete-modal.component';
import {ProductEditModalComponent} from '../product-edit-modal/product-edit-modal.component';
import {BrandService} from '../../brand-panel/brand.service';
import {CategoryService} from '../../category-panel/category.service';
import {ProductDetailModalComponent} from '../product-detail-modal/product-detail-modal.component';
import {ProductStockModalComponent} from '../product-stock-modal/product-stock-modal.component';
import {PageEvent} from '@angular/material';
import {ProductImportModalComponent} from '../product-import-modal/product-import-modal.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  numbers = [5, 10, 25, 50];
  brands: Brand[] = [];
  categories: Category[] = [];
  list = true;
  filteredProducts: Product[] = [];
  fBrand: Brand = undefined;
  fCategory: Category = undefined;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild('editProductModal') editModal: ProductEditModalComponent;
  @ViewChild('detailProductModal') detailModal: ProductDetailModalComponent;
  @ViewChild('deleteProductModal') deleteModal: ProductDeleteModalComponent;
  @ViewChild('createProductModal') createModal: ProductCreateModalComponent;
  @ViewChild('importProductModal') importModal: ProductImportModalComponent;
  @ViewChild('stockProductModal') stockModal: ProductStockModalComponent;
  pageEvent: PageEvent;
  page = 1;
  itemsPerPage = 10;
  productFilter: any = {
    name: ''
  };
  order: 'name';
  reverse = true;

  constructor(private productService: ProductService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef,
              private brandService: BrandService,
              private categoryService: CategoryService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getCategories();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  getProducts(): void {
    this.productService
      .getAllProducts()
      .subscribe(products => {
        this.products = products;
        this.reFilter();
      });
  }

  getBrands(): void {
    this.brandService
      .getAllBrands()
      .subscribe( brands => {
        this.brands = brands;
      });
  }

  getCategories(): void {
    this.categoryService
      .getAllCategories()
      .subscribe( c => {
        this.categories = c;
      });
  }

  editRowOpenModal(group: Product) {
    this.editModal.setProduct(group);
    this.editModal.show();
  }

  deleteRowOpenModal(group: Product) {
    this.deleteModal.setProduct(group);
    this.deleteModal.show();
  }

  createProductOpenModal() {
    this.createModal.show();
  }

  importProductOpenModal() {
    this.importModal.show();
  }

  detailProductOpenModal(prod: Product) {
    this.detailModal.setProduct(prod);
    this.detailModal.show();
  }

  stockProductOpenModal(prod: Product) {
    this.stockModal.setProduct(prod);
    this.stockModal.show();
  }


  formSubmission(submitted: boolean) {
    this.productService
      .getAllProducts()
      .subscribe(
        products => {
          this.products = products;
          this.submittedToast(submitted);
        },
        error => this.submittedToast(false),
        () => console.log('completed SubmitProduct'));
  }

  deletedProductAlert(deleted: boolean) {
    this.productService
      .getAllProducts()
      .subscribe(
        products => {
          this.products = products;
          this.deleteToast(deleted);
        },
        error => this.deleteToast(false),
        () => console.log('completed DeleteProduct'));
  }

  updatedProductAlert(deleted: boolean) {
    this.productService
      .getAllProducts()
      .subscribe(
        products => {
          this.products = products;
          this.updatedToast(deleted);
        },
        error => this.updatedToast(false),
        () => console.log('completed UpdatedProduct'));
  }

  createdProductAlert(created: boolean) {
    this.productService
      .getAllProducts()
      .subscribe(
        products => {
          this.products = products;
          this.createdToast(created);
          this.reFilter();
        },
        error => this.updatedToast(false),
        () => console.log('completed CreatedProduct'));
  }

  stockProductAlert(added: boolean) {
    this.productService
      .getAllProducts()
      .subscribe(
        products => {
          this.products = products;
          this.stockAddedToast(added);
          this.reFilter();
        },
        error => this.stockAddedToast(false),
        () => console.log('completed CreatedProduct'));
  }


  importProductAlert(p: StockXls) {
    this.productService
      .getAllProducts()
      .subscribe(
        products => {
          this.products = products;
          this.indivStock(p.product.name, p.units, true);
          this.reFilter();
        },
        error => this.stockAddedToast(false),
        () => console.log('completed CreatedProduct'));
  }

  deleteToast(deleted: boolean) {
    console.log('entre a deletedToast');
    if (deleted) {
      this.toastr.success('Success!', 'The product was deleted correctly.');
    } else {
      this.toastr.error('The product is involved in a sale and cannot be deleted', 'Couldn\'t delete product!');
    }
  }

  submittedToast(submitted: boolean) {
    console.log('entre a submittedToast');
    if (submitted) {
      this.toastr.success('Success!', 'The product was added correctly.');
    } else {
      this.toastr.error('Couldn\'t add product!', 'There is something wrong with your connection.');
    }
  }

  updatedToast(updated: boolean) {
    console.log('entre a updateToast');
    if (updated) {
      this.toastr.success('Success!', 'The product was updated correctly.');
    } else {
      this.toastr.error('Couldn\'t update product!', 'There is something wrong with your connection.');
    }
  }

  createdToast(created: boolean) {
    console.log('entre a createdToast');
    if (created) {
      this.toastr.success('Success!', 'The product was created correctly.');
    } else {
      this.toastr.error('Couldn\'t created product!', 'There is something wrong with your connection.');
    }
  }

  stockAddedToast(added: boolean) {
    if (added) {
      this.toastr.success('Success!', 'The stock was added correctly.');
    } else {
      this.toastr.error('Couldn\'t add stock!', 'There is something wrong with your connection.');
    }
  }

  indivStock(name: string, units: number, added: boolean) {
    if (added) {
      this.toastr.success(name + ' was added ' + units + ' units!', 'Success!');
    } else {
      this.toastr.error('Couldn\'t add stock!', 'There is something wrong with your connection.');
    }
  }

  setList(l: boolean) {
    this.list = l;
  }

  filterBrand(b: number) {
    if (b === undefined || b === null || Number(b) === -1) {
      this.fBrand = undefined;
      this.reFilter();
    } else {
      this.brandService.getBrandById(b).subscribe( br => {
        this.fBrand = br;
        this.reFilter();
      });
    }
  }

  reFilter() {
    this.filteredProducts = this.products.filter( prod => {
      const matchesBrand = (this.fBrand === undefined) || (prod.brand !== null && (prod.brand.id === this.fBrand.id));
      const matchesCategory = (this.fCategory === undefined) || (prod.categories !== null && (prod.categories.filter( cat => {
        return cat.id === this.fCategory.id;
      }).length > 0));
      return matchesBrand && matchesCategory;
    });
  }

  filterCategory(c: number) {
    if ( c === undefined || c === null || Number(c) === -1) {
      this.fCategory = undefined;
      this.reFilter();
    } else {
      this.categoryService.getCategoryByName(c).subscribe( cat => {
        this.fCategory = cat;
        this.reFilter();
      });
    }
  }

  showProducts(lth: number, pageSize: number, pageIndex: number) {

  }

  setReverse() {
    this.reverse = !this.reverse;
  }
}
