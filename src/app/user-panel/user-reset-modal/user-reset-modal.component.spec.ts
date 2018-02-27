import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResetModalComponent } from './user-reset-modal.component';

describe('UserResetModalComponent', () => {
  let component: UserResetModalComponent;
  let fixture: ComponentFixture<UserResetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserResetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
