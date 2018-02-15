import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDeleteModalComponent } from './store-delete-modal.component';

describe('StoreDeleteModalComponent', () => {
  let component: StoreDeleteModalComponent;
  let fixture: ComponentFixture<StoreDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
