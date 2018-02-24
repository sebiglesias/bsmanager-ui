import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCheckoutModalComponent } from './sales-checkout-modal.component';

describe('SalesCheckoutModalComponent', () => {
  let component: SalesCheckoutModalComponent;
  let fixture: ComponentFixture<SalesCheckoutModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesCheckoutModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCheckoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
