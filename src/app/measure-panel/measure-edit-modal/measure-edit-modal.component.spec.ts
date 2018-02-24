import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureEditModalComponent } from './measure-edit-modal.component';

describe('MeasureEditModalComponent', () => {
  let component: MeasureEditModalComponent;
  let fixture: ComponentFixture<MeasureEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
