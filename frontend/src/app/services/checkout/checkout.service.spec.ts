import { TestBed } from '@angular/core/testing';

import { CheckoutService } from './checkout.service';

describe('checkoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckoutService = TestBed.get(CheckoutService);
    expect(service).toBeTruthy();
  });
});
