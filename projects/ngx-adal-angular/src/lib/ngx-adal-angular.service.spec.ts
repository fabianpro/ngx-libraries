import { TestBed } from '@angular/core/testing';

import { NgxAdalAngularService } from './ngx-adal-angular.service';

describe('NgxAdalAngularService', () => {
  let service: NgxAdalAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxAdalAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
