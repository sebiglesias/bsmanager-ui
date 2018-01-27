import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCollectionComponent } from './store-collection.component';

describe('StoreCollectionComponent', () => {
  let component: StoreCollectionComponent;
  let fixture: ComponentFixture<StoreCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
