import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureDeleteModalComponent } from './measure-delete-modal.component';

describe('MeasureDeleteModalComponent', () => {
  let component: MeasureDeleteModalComponent;
  let fixture: ComponentFixture<MeasureDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
