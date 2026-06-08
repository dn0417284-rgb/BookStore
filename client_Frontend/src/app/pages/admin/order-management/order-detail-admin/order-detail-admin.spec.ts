import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailAdmin } from './order-detail-admin';

describe('OrderDetailAdmin', () => {
  let component: OrderDetailAdmin;
  let fixture: ComponentFixture<OrderDetailAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
