import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandCreateModalComponent } from './brand-create-modal.component';

describe('BrandCreateModalComponent', () => {
  let component: BrandCreateModalComponent;
  let fixture: ComponentFixture<BrandCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
