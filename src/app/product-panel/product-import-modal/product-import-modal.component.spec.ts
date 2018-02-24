import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImportModalComponent } from './product-import-modal.component';

describe('ProductImportModalComponent', () => {
  let component: ProductImportModalComponent;
  let fixture: ComponentFixture<ProductImportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductImportModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
