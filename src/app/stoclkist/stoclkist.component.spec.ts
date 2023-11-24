import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoclkistComponent } from './stoclkist.component';

describe('StoclkistComponent', () => {
  let component: StoclkistComponent;
  let fixture: ComponentFixture<StoclkistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoclkistComponent]
    });
    fixture = TestBed.createComponent(StoclkistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
