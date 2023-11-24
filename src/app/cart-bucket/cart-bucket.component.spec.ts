import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartBucketComponent } from './cart-bucket.component';

describe('CartBucketComponent', () => {
  let component: CartBucketComponent;
  let fixture: ComponentFixture<CartBucketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartBucketComponent]
    });
    fixture = TestBed.createComponent(CartBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
