import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechsupportComponent } from './techsupport.component';

describe('TechsupportComponent', () => {
  let component: TechsupportComponent;
  let fixture: ComponentFixture<TechsupportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechsupportComponent]
    });
    fixture = TestBed.createComponent(TechsupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
