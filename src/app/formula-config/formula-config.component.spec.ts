import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaConfigComponent } from './formula-config.component';

describe('FormulaConfigComponent', () => {
  let component: FormulaConfigComponent;
  let fixture: ComponentFixture<FormulaConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaConfigComponent]
    });
    fixture = TestBed.createComponent(FormulaConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
