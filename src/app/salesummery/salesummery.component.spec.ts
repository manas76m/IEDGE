import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesummeryComponent } from './salesummery.component';

describe('SalesummeryComponent', () => {
  let component: SalesummeryComponent;
  let fixture: ComponentFixture<SalesummeryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesummeryComponent]
    });
    fixture = TestBed.createComponent(SalesummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
