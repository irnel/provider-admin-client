import { TestBed } from '@angular/core/testing';

import { CashierService } from './cashier.service';

describe('CashierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashierService = TestBed.get(CashierService);
    expect(service).toBeTruthy();
  });
});
