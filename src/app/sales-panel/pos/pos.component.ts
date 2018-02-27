import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ProductService} from '../../product-panel/product.service';
import {OrderDetail, Product, Order, Brand, Category} from '../../models';
import {ProductDetailModalComponent} from '../../product-panel/product-detail-modal/product-detail-modal.component';
import {AuthService} from '../../auth/auth.service';
import {SalesCheckoutModalComponent} from '../sales-checkout-modal/sales-checkout-modal.component';
import {ToastsManager} from 'ng2-toastr';
import {BrandService} from '../../brand-panel/brand.service';
import {CategoryService} from '../../category-panel/category.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {

  order: Order;
  orderDetails: OrderDetail[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentUserMail: string;
  list = true;
  totalPrice = 0;
  totalItems = 0;
  fBrand: Brand;
  fCategory: Category;
  reverse = false;
  itemsPerPage = 10;
  productFilter: any = {
    name: ''
  };
  @ViewChild('detailProductModal') detailModal: ProductDetailModalComponent;
  @ViewChild('checkoutSalesModal') checkoutModal: SalesCheckoutModalComponent;
  brands: Brand[] = [];
  categories: Category[] = [];
  page = 1;
  orderBy: 'name';

  constructor(private productService: ProductService,
              private authService: AuthService,
              private brandService: BrandService,
              private categoryService: CategoryService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.order = this.makeNewOrder();
  }

  ngOnInit() {
    this.currentUserMail = this.authService.getCurrentUser().email;
    this.getProducts();
    this.getBrands();
    this.getCategories();
  }


  setList(l: boolean) {
    this.list = l;
  }

  filterBrand(b: number) {
    if (b === undefined || b === null || Number(b) === -1) {
      this.fBrand = undefined;
      this.reFilter();
    } else {
      this.brandService.getBrandById(b).subscribe( b => {
        this.fBrand = b;
        this.reFilter();
      });
    }
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

  reFilter() {
    this.filteredProducts = this.products.filter( prod => {
      const matchesBrand = (this.fBrand === undefined) || (prod.brand !== null && (prod.brand.id === this.fBrand.id));
      const matchesCategory = (this.fCategory === undefined) || (prod.categories !== null && (prod.categories.filter( cat => {
        return cat.id === this.fCategory.id;
      }).length > 0));
      return matchesBrand && matchesCategory;
    });
  }

  detailProductOpenModal(prod: Product) {
    this.detailModal.setProduct(prod);
    this.detailModal.show();
  }

  getProducts(): void {
    this.productService
      .getAllProducts()
      .subscribe(products => {
        this.products = products;
        this.reFilter();
      });
  }

  addToCart(id: number): boolean {
    let found = false;
    for (let i = 0; i < this.orderDetails.length; i++) {
      if (this.orderDetails[i].product.id === Number(id)) {
        found = true;
        return !found;
      }
    }
    this.getProductFromClient(id);
  }

  private makeNewOrderDetail(p: Product): OrderDetail {
    return {
      order: this.order,
      product: p,
      price: p.price,
      quantity: 1
    };
  }

  getProductFromClient(id: number): boolean {
    let found = false;
    for (let i = 0; i < this.orderDetails.length; i++) {
      if (this.orderDetails[i].product.id === Number(id)) {
        found = true;
        return !found;
      }
    }
    this.productService.getProductById(id).subscribe(product => {
      this.orderDetails.push(this.makeNewOrderDetail(product));
      this.calculateResults();
    });
  }

  removeFromCart(id: number) {
    this.orderDetails = this.orderDetails.filter( oDetail => {
      return oDetail.product.id !== Number(id);
    });
    this.calculateResults();
  }

  cancelOrder() {
    this.orderDetails = [];
    this.order = this.makeNewOrder();
    this.totalItems = this.totalPrice = 0;
  }

  private makeNewOrder(): Order {
    return {
      date: new Date(),
      employee: this.currentUserMail,
      external: '',
      sale: true,
      payment: '',
      items: 0,
      price: 0
    };
  }

  calculateTotal() {
    let auxTotal = 0;
    this.orderDetails.forEach( oDetail => {
      auxTotal += oDetail.product.price * oDetail.quantity;
    });
    this.totalPrice = auxTotal;
  }

  calculateItems() {
    let auxQ = 0;
    this.orderDetails.forEach( oDetail => {
      auxQ += oDetail.quantity;
    });
    this.totalItems = auxQ;
  }

  removeItem(p: Product) {
    this.orderDetails = this.orderDetails.map( orderD => {
      if (orderD.product.id === p.id) {
        if (orderD.quantity === 1) {
          this.removeFromCart(p.id);
          return;
        } else {
          orderD.quantity--;
          this.calculateResults();
          return orderD;
        }
      } else {
        return orderD;
      }
    }).filter( o => {
      return o !== undefined;
    });
  }

  addItem(p: Product) {
    this.orderDetails = this.orderDetails.map( orderD => {
      if (orderD.product.id === p.id && orderD.product.quantity > orderD.quantity) {
        orderD.quantity = orderD.quantity + 1;
        this.calculateResults();
        return orderD;
      } else {
        return orderD;
      }
    });
  }

  private calculateResults() {
    this.calculateItems();
    this.calculateTotal();
  }

  openCheckout(order: Order, orderDetails: OrderDetail[], items: number, price: number) {
    this.calculateResults();
    order.price = price;
    order.items = items;
    this.checkoutModal.setOrder(order);
    this.checkoutModal.setDetails(orderDetails);
    this.checkoutModal.setItems(items);
    this.checkoutModal.setPrice(price);
    this.checkoutModal.show();
  }

  checkoutSalesAlert(b: boolean) {
    if (b) {
      this.cancelOrder();
    }
    this.checkoutToast(b);
  }

  productModifiedAlert(b: boolean) {
    if (b) {
      this.getProducts();
    }
  }

  checkoutToast(created: boolean) {
    if (created) {
      this.toastr.success('Success!', 'The order was created correctly.');
    } else {
      this.toastr.error('Couldn\'t created order!', 'There is something wrong with your connection.');
    }
  }

  setReverse() {
    this.reverse = !this.reverse;
  }

  getBrands() {
    this.brandService.getAllBrands().subscribe(
      b => this.brands = b
    );
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe(
      c => this.categories = c
    );
  }
}
