import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { IndexedDBConfig } from './ngx-simple-indexeddb.module';

import { NgxSimpleIndexeddbService } from './ngx-simple-indexeddb.service';

describe('NgxSimpleIndexeddbService', () => {
  let service: NgxSimpleIndexeddbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: IndexedDBConfig,
          useFactory: () => {
            return {
              dbName: 'NGX-SIMPLE-INDEXEDDB',
              dbVersion: 4
            }
          }
        }
      ]
    });
    service = TestBed.inject(NgxSimpleIndexeddbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //it('#getObservable messages', (done: DoneFn) => {
    //Not implemented
  //});

  it('should add Items to IndexedDB', () => {
    const indexes = [
      { id: 'by_name', name: 'name', unique: true },
      { id: 'by_age', name: 'age', unique: true }
    ];
    const data = [
      { name: 'Person 1', age: 12 },
      { name: 'Person 2', age: 15 },
      { name: 'Person 3', age: 25 },
      { name: 'Person 4', age: 35 },
      { name: 'Person 5', age: 42 },
      { name: 'Person 6', age: 17 }
    ];
    service.addItems('TEST_INDEXED', data, indexes, true);
  });

  it('should get Items from IndexedDB without index', () => {
    service.getItem('TEST_INDEXED', 1);
  });

  it('should get Items from IndexedDB with index', () => {
    service.getItem('TEST_INDEXED', 'Person 1', 'by_name');
  });

  it('should get List Items from IndexedDB with primary key', () => {
    service.getItems('TEST_INDEXED', true);
  });

  it('should update Item in IndexedDB', () => {
    service.updateItem('TEST_INDEXED', 'Person 2', 'Actualizado');
  });

  it('should delete Item in IndexedDB', () => {
    service.deleteItem('TEST_INDEXED', 4);
  });

  it('should clear object storage in IndexedDB', () => {
    service.addItems('TEST_INDEXED_2', 'Test delete');
    service.clearObjStorage('TEST_INDEXED_2');
  });

  it('should delete database in IndexedDB', () => {
    service.removeDB();
  });

});
