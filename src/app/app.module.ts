// import {MaterializeModule} from 'angular2-materialize';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProtectedComponent } from './protected/protected.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SalesReportComponent } from './sales-panel/sales-report/sales-report.component';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { CategoryComponent } from './category-panel/category/category.component';
import { PosComponent } from './sales-panel/pos/pos.component';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NavbarComponent } from './navbar/navbar.component';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CategoryCreateModalComponent } from './category-panel/category-create-modal/category-create-modal.component';
import { CategoryDeleteModalComponent } from './category-panel/category-delete-modal/category-delete-modal.component';
import { CategoryEditModalComponent } from './category-panel/category-edit-modal/category-edit-modal.component';
import {CategoryService} from './category-panel/category.service';
import { MyDatePickerModule } from 'mydatepicker';
import { SalesDetailComponent } from './sales-panel/sales-detail/sales-detail.component';
import { SalesCheckoutModalComponent } from './sales-panel/sales-checkout-modal/sales-checkout-modal.component';
import {AuthService} from './auth/auth.service';
import {AuthGuard} from './auth/auth.guard';
import {LoginService} from './login/login.service';
import { BrandComponent } from './brand-panel/brand/brand.component';
import { BrandCreateModalComponent } from './brand-panel/brand-create-modal/brand-create-modal.component';
import { BrandDeleteModalComponent } from './brand-panel/brand-delete-modal/brand-delete-modal.component';
import { BrandEditModalComponent } from './brand-panel/brand-edit-modal/brand-edit-modal.component';
import {BrandService} from './brand-panel/brand.service';
import { MeasureComponent } from './measure-panel/measure/measure.component';
import { MeasureCreateModalComponent } from './measure-panel/measure-create-modal/measure-create-modal.component';
import { MeasureDeleteModalComponent } from './measure-panel/measure-delete-modal/measure-delete-modal.component';
import { MeasureEditModalComponent } from './measure-panel/measure-edit-modal/measure-edit-modal.component';
import {MeasureService} from './measure-panel/measure.service';
import {UserComponent} from './user-panel/user/user.component';
import {UserDeleteModalComponent} from './user-panel/user-delete-modal/user-delete-modal.component';
import {UserEditModalComponent} from './user-panel/user-edit-modal/user-edit-modal.component';
import {UserCreateModalComponent} from './user-panel/user-create-modal/user-create-modal.component';
import {UserService} from './user-panel/user.service';
import {ProductComponent} from './product-panel/product/product.component';
import {ProductCreateModalComponent} from './product-panel/product-create-modal/product-create-modal.component';
import {ProductService} from './product-panel/product.service';
import {ProductDeleteModalComponent} from './product-panel/product-delete-modal/product-delete-modal.component';
import {ProductEditModalComponent} from './product-panel/product-edit-modal/product-edit-modal.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { ShowErrorComponent } from './show-error/show-error.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ProductDetailModalComponent } from './product-panel/product-detail-modal/product-detail-modal.component';
import { ProductStockModalComponent } from './product-panel/product-stock-modal/product-stock-modal.component';
import {MatStepperModule} from '@angular/material/stepper';
import {SalesService} from './sales-panel/sales.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { ProductImportModalComponent } from './product-panel/product-import-modal/product-import-modal.component';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { Ng2OrderModule } from 'ng2-order-pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { FileUploadModule } from 'ng2-file-upload';


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent, canActivate: [LoginService]},
  {path: 'users', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'categories', component: CategoryComponent, canActivate: [AuthGuard]},
  {path: 'brands', component: BrandComponent, canActivate: [AuthGuard]},
  {path: 'sales', component: SalesReportComponent, canActivate: [AuthGuard]},
  {path: 'pos', component: PosComponent, canActivate: [AuthGuard]},
  {path: 'products', component: ProductComponent, canActivate: [AuthGuard]},
  {path: 'measures', component: MeasureComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProtectedComponent,
    LoginComponent,
    ProfileComponent,
    SalesReportComponent,
    ProductComponent,
    UserComponent,
    CategoryComponent,
    PosComponent,
    NavbarComponent,
    CategoryCreateModalComponent,
    CategoryDeleteModalComponent,
    CategoryEditModalComponent,
    UserCreateModalComponent,
    UserEditModalComponent,
    UserDeleteModalComponent,
    SalesDetailComponent,
    SalesCheckoutModalComponent,
    BrandComponent,
    BrandCreateModalComponent,
    BrandDeleteModalComponent,
    BrandEditModalComponent,
    MeasureComponent,
    MeasureCreateModalComponent,
    MeasureDeleteModalComponent,
    MeasureEditModalComponent,
    ProductCreateModalComponent,
    ProductEditModalComponent,
    ProductDeleteModalComponent,
    ShowErrorComponent,
    ProductDetailModalComponent,
    ProductStockModalComponent,
    ProductImportModalComponent,
  ],
  imports: [
    // MaterializeModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    DataTablesModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    MyDatePickerModule,
    MatGridListModule,
    MatPaginatorModule,
    MatStepperModule,
    MatExpansionModule,
    Ng2FilterPipeModule,
    Ng2OrderModule,
    NgxPaginationModule,
    FileUploadModule
],
  providers: [
    CategoryService,
    UserService,
    AuthService,
    AuthGuard,
    LoginService,
    BrandService,
    MeasureService,
    ProductService,
    SalesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
