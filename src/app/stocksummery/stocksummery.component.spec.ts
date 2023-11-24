import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksummeryComponent } from './stocksummery.component';

describe('StocksummeryComponent', () => {
  let component: StocksummeryComponent;
  let fixture: ComponentFixture<StocksummeryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StocksummeryComponent]
    });
    fixture = TestBed.createComponent(StocksummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
