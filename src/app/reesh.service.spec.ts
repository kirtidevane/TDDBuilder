import { TestBed, inject } from '@angular/core/testing';

import { ReeshService } from './reesh.service';

describe('ReeshService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReeshService]
    });
  });

  it('should be created', inject([ReeshService], (service: ReeshService) => {
    expect(service).toBeTruthy();
  }));
});
