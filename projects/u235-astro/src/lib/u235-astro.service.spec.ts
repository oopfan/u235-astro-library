import { TestBed } from '@angular/core/testing';

import { U235AstroService } from './u235-astro.service';

describe('U235AstroService', () => {
  let service: U235AstroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(U235AstroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
