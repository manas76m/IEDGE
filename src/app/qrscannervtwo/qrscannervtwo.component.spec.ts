import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrscannervtwoComponent } from './qrscannervtwo.component';

describe('QrscannervtwoComponent', () => {
  let component: QrscannervtwoComponent;
  let fixture: ComponentFixture<QrscannervtwoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrscannervtwoComponent]
    });
    fixture = TestBed.createComponent(QrscannervtwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
