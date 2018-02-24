import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStockModalComponent } from './product-stock-modal.component';

describe('ProductStockModalComponent', () => {
  let component: ProductStockModalComponent;
  let fixture: ComponentFixture<ProductStockModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductStockModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
