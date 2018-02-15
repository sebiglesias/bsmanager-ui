import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreEditModalComponent } from './store-edit-modal.component';

describe('StoreEditModalComponent', () => {
  let component: StoreEditModalComponent;
  let fixture: ComponentFixture<StoreEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
