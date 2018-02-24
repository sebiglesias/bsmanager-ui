import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandDeleteModalComponent } from './brand-delete-modal.component';

describe('BrandDeleteModalComponent', () => {
  let component: BrandDeleteModalComponent;
  let fixture: ComponentFixture<BrandDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
