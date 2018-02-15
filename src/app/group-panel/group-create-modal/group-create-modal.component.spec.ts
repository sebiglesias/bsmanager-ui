import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCreateModalComponent } from './group-create-modal.component';

describe('GroupCreateModalComponent', () => {
  let component: GroupCreateModalComponent;
  let fixture: ComponentFixture<GroupCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
