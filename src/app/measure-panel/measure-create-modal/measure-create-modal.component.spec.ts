import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureCreateModalComponent } from './measure-create-modal.component';

describe('MeasureCreateModalComponent', () => {
  let component: MeasureCreateModalComponent;
  let fixture: ComponentFixture<MeasureCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
