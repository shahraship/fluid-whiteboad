import { TestBed } from '@angular/core/testing';

import { FluidLoaderService } from './fluid-loader.service';

describe('FluidLoaderService', () => {
  let service: FluidLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FluidLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
