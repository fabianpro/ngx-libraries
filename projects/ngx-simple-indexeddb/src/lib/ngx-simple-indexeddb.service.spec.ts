import { TestBed } from '@angular/core/testing';

import { NgxSimpleIndexeddbService } from './ngx-simple-indexeddb.service';

describe('NgxSimpleIndexeddbService', () => {
  let service: NgxSimpleIndexeddbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSimpleIndexeddbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
