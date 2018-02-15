import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCreateModalComponent } from './category-create-modal.component';

describe('CategoryCreateModalComponent', () => {
  let component: CategoryCreateModalComponent;
  let fixture: ComponentFixture<CategoryCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
