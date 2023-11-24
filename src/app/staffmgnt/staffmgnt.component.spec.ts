import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffmgntComponent } from './staffmgnt.component';

describe('StaffmgntComponent', () => {
  let component: StaffmgntComponent;
  let fixture: ComponentFixture<StaffmgntComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffmgntComponent]
    });
    fixture = TestBed.createComponent(StaffmgntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
