import { TestBed } from '@angular/core/testing';

import { U235AstroUtilityService } from './u235-astro-utility.service';

describe('U235AstroUtilityService', () => {
  let service: U235AstroUtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(U235AstroUtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
