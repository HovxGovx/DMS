import { TestBed } from '@angular/core/testing';

import { ValidationStateService } from './validation-state.service';

describe('ValidationService', () => {
  let service: ValidationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
