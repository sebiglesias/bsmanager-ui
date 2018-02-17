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
import { UserDetailComponent } from './user-panel/user-detail/user-detail.component';
import { SalesReportComponent } from './sales-panel/sales-report/sales-report.component';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { GroupComponent } from './group-panel/group/group.component';
import {GroupService} from './group-panel/group.service';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { GroupFormComponent } from './group-panel/group-form/group-form.component';
import { ProductComponent } from './product/product.component';
import { UserComponent } from './user-panel/user/user.component';
import { StoreComponent } from './store-panel/store/store.component';
import { CategoryComponent } from './category-panel/category/category.component';
import { PosComponent } from './sales-panel/pos/pos.component';
import { DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NavbarComponent } from './navbar/navbar.component';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { GroupDeleteModalComponent } from './group-panel/group-delete-modal/group-delete-modal.component';
import { GroupEditModalComponent } from './group-panel/group-edit-modal/group-edit-modal.component';
import { StoreDeleteModalComponent } from './store-panel/store-delete-modal/store-delete-modal.component';
import { StoreEditModalComponent } from './store-panel/store-edit-modal/store-edit-modal.component';
import { StoreFormComponent } from './store-panel/store-form/store-form.component';
import {StoreService} from './store-panel/store.service';
import { GroupCreateModalComponent } from './group-panel/group-create-modal/group-create-modal.component';
import { StoreCreateModalComponent } from './store-panel/store-create-modal/store-create-modal.component';
import { CategoryCreateModalComponent } from './category-panel/category-create-modal/category-create-modal.component';
import { CategoryDeleteModalComponent } from './category-panel/category-delete-modal/category-delete-modal.component';
import { CategoryEditModalComponent } from './category-panel/category-edit-modal/category-edit-modal.component';
import { CategoryFormComponent } from './category-panel/category-form/category-form.component';
import {CategoryService} from './category-panel/category.service';
import { UserCreateModalComponent } from './user-panel/user-create-modal/user-create-modal.component';
import { UserEditModalComponent } from './user-panel/user-edit-modal/user-edit-modal.component';
import { UserDeleteModalComponent } from './user-panel/user-delete-modal/user-delete-modal.component';
import {UserService} from './user-panel/user.service';
import { MyDatePickerModule } from 'mydatepicker';
import { SalesDetailComponent } from './sales-panel/sales-detail/sales-detail.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'users', component: UserComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'products', component: ProductComponent},
  {path: 'groups', component: GroupComponent},
  {path: 'stores', component: StoreComponent},
  {path: 'categories', component: CategoryComponent},
  {path: 'sales', component: SalesReportComponent},
  {path: 'pos', component: PosComponent},
  {path: 'stock', component: InventoryReportComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProtectedComponent,
    LoginComponent,
    ProfileComponent,
    UserDetailComponent,
    SalesReportComponent,
    InventoryReportComponent,
    GroupComponent,
    GroupFormComponent,
    ProductComponent,
    UserComponent,
    StoreComponent,
    CategoryComponent,
    PosComponent,
    NavbarComponent,
    GroupDeleteModalComponent,
    GroupEditModalComponent,
    StoreDeleteModalComponent,
    StoreEditModalComponent,
    StoreFormComponent,
    GroupCreateModalComponent,
    StoreCreateModalComponent,
    CategoryCreateModalComponent,
    CategoryDeleteModalComponent,
    CategoryEditModalComponent,
    CategoryFormComponent,
    UserCreateModalComponent,
    UserEditModalComponent,
    UserDeleteModalComponent,
    SalesDetailComponent
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
    MyDatePickerModule
  ],
  providers: [GroupService, StoreService, CategoryService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
