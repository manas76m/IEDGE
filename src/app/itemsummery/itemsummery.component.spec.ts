import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsummeryComponent } from './itemsummery.component';

describe('ItemsummeryComponent', () => {
  let component: ItemsummeryComponent;
  let fixture: ComponentFixture<ItemsummeryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsummeryComponent]
    });
    fixture = TestBed.createComponent(ItemsummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
