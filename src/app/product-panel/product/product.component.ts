import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Brand, Category, Product} from '../../models';
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
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild('editProductModal') editModal: ProductEditModalComponent;
  @ViewChild('detailProductModal') detailModal: ProductDetailModalComponent;
  @ViewChild('deleteProductModal') deleteModal: ProductDeleteModalComponent;
  @ViewChild('createProductModal') createModal: ProductCreateModalComponent;
  @ViewChild('stockProductModal') stockModal: ProductStockModalComponent;

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
      pageLength: 5
    };
  }

  getProducts(): void {
    this.productService
      .getAllProducts()
      .subscribe(products => {
        this.products = products;
        this.dtTrigger.next();
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
          this.reRender();
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
          this.reRender();
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
          this.reRender();
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
          this.reRender();
          this.createdToast(created);
        },
        error => this.updatedToast(false),
        () => console.log('completed CreatedProduct'));
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
      this.toastr.success('Success!', 'The product was deleted correctly.');
    } else {
      this.toastr.error('Couldn\'t delete product!', 'There is something wrong with your connection.');
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

  setList(l: boolean) {
    this.list = l;
  }
}
