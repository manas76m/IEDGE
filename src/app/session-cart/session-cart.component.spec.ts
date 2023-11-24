import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCartComponent } from './session-cart.component';

describe('SessionCartComponent', () => {
  let component: SessionCartComponent;
  let fixture: ComponentFixture<SessionCartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionCartComponent]
    });
    fixture = TestBed.createComponent(SessionCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
