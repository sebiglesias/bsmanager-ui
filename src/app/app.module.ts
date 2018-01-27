import { MaterializeModule } from 'angular2-materialize';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProtectedComponent } from './protected/protected.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { StoreCollectionComponent } from './store-collection/store-collection.component';
import { StoreDetailComponent } from './store-detail/store-detail.component';
import { CategoryCollectionComponent } from './category-collection/category-collection.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { GroupComponent } from './group/group.component';
import {GroupService} from './group.service';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { GroupFormComponent } from './group-form/group-form.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'users', component: ProfileComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'groups', component: GroupComponent},
  {path: 'groups/new', component: GroupFormComponent},
  {path: 'groups/{:id}', component: GroupDetailComponent},
  {path: 'stores', component: StoreCollectionComponent},
  {path: 'categories', component: CategoryCollectionComponent},
  {path: 'sales', component: SalesReportComponent},
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
    StoreCollectionComponent,
    StoreDetailComponent,
    CategoryCollectionComponent,
    CategoryDetailComponent,
    SalesReportComponent,
    InventoryReportComponent,
    GroupComponent,
    GroupFormComponent,
    GroupDetailComponent
  ],
  imports: [
    MaterializeModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [GroupService],
  bootstrap: [AppComponent]
})
export class AppModule { }
