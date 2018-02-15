import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCreateModalComponent } from './store-create-modal.component';

describe('StoreCreateModalComponent', () => {
  let component: StoreCreateModalComponent;
  let fixture: ComponentFixture<StoreCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
