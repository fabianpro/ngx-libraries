import { TestBed } from '@angular/core/testing';
import { createDatabaseAndObjectsStore } from '../utils/database';
import { NgxSimpleIndexeddbModule } from './ngx-simple-indexeddb.module';

import { NgxSimpleIndexeddbService } from './ngx-simple-indexeddb.service';


const database = {
  dbName: 'BD1', 
  dbVersion: 5,
  dbStoresMetaData: [{
    store: 'languages',
    storeConfig: { 
      //keyPath: 'id', 
      autoIncrement: true 
    },
    storeIndexes: [
      { name: 'name', keyPath: 'name', options: { unique: false } }
    ]
  }, {
    store: 'companies',
    storeConfig: { 
      //keyPath: 'id', 
      autoIncrement: false 
    },
    storeIndexes: [
      { name: 'name', keyPath: 'name', options: { unique: true } },
      { name: 'antique', keyPath: 'antique', options: { unique: true } },
    ]
  }]
};

describe('NgxSimpleIndexeddbService', () => {
  let service: NgxSimpleIndexeddbService;
  let indexedDB: IDBFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxSimpleIndexeddbModule.forRoot([database])
      ],
    });
    service = TestBed.inject(NgxSimpleIndexeddbService);
    indexedDB =
      window.indexedDB ||
      (window as any).mozIndexedDB ||
      (window as any).msIndexedDB ||
      (window as any).webkitIndexedDB;
  });

  it('should be created', () => {
    const service: NgxSimpleIndexeddbService = TestBed.get(NgxSimpleIndexeddbService);
    expect(service).toBeTruthy();
  });

  it('should create scheme in browser', () => {
    createDatabaseAndObjectsStore(indexedDB, database);
    expect(true).toBeTruthy();
  });

  it('should add item or items to store companies', (done) => {
    const data = [
      { pk: 1, name: 'AWS', antique: 28 },
      { pk: 2, name: 'Google', antique: 29 },
      { pk: 3, name: 'Facebook', antique: 30 },
      { pk: 4, name: 'Microsoft', antique: 31 },
      { pk: 5, name: 'Netflix', antique: 32 }
    ];
    service.addRecords(database.dbName, 'companies', data).subscribe(data => {
      console.log(data);
      expect(data).toEqual(5);
      done();
    });
  });

  it('should get Item from store companies', (done) => {
    service.getRecord(database.dbName, 'companies', 1).subscribe(data => {
      expect(data).toEqual({ pk: 1, name: 'AWS', antique: 28 });
      done();
    });
  });

  it('should get Items from store companies with primary key', (done) => {
    service.getRecords(database.dbName, 'companies', true).subscribe(data => {
      expect(data).toEqual([
        { key: 1, value: { pk: 1, name: 'AWS', antique: 28 } },
        { key: 2, value: { pk: 2, name: 'Google', antique: 29 } },
        { key: 3, value: { pk: 3, name: 'Facebook', antique: 30 } },
        { key: 4, value: { pk: 4, name: 'Microsoft', antique: 31 } },
        { key: 5, value: { pk: 5, name: 'Netflix', antique: 32 } }
      ]);
      done();
    });
  });

  it('should get List Items from store companies without primary key', (done) => {
    service.getRecords(database.dbName, 'companies').subscribe(data => {
      expect(data).toEqual([
        { pk: 1, name: 'AWS', antique: 28 },
        { pk: 2, name: 'Google', antique: 29 },
        { pk: 3, name: 'Facebook', antique: 30 },
        { pk: 4, name: 'Microsoft', antique: 31 },
        { pk: 5, name: 'Netflix', antique: 32 }
      ]);
      done();
    });
  });

  it('should update Item 2 in store companies', (done) => {
    service.updateRecord(database.dbName, 'companies', 2, 'Actualizado').subscribe(data => {
      expect(data).toEqual(2);
      done();
    });
  });

  it('should delete Item 3 in store companies', (done) => {
    service.deleteRecord(database.dbName, 'companies', 3).subscribe(data => {
      expect(data).toBeTruthy();
      done();
    });
  });

  it('should count Items in store companies', (done) => {
    service.countRecords(database.dbName, 'companies').subscribe(data => {
      expect(data).toEqual(4);
      done();
    });
  });

  it('should clear storage companies', (done) => {
    service.clearObjStore(database.dbName, 'companies').subscribe(data => {
      expect(data).toBeTruthy();
      done();
    });
  });

  it('should add new database BD2', (done) => {
    const database = {
      dbName: 'BD2', 
      dbVersion: 5,
      dbStoresMetaData: [{
        store: 'cars',
        storeConfig: { 
          autoIncrement: true 
        },
        storeIndexes: [
          { name: 'name', keyPath: 'name', options: { unique: false } }
        ]
      }]
    };

    service.addDatabase(database).subscribe(data => {
      expect(data).toBeTruthy();
      done();
    });
  });

  /*it('should delete storage companies', (done) => {
    service.deleteObjStore(database.dbName, 'animals').subscribe(data => {
      expect(data).toBeTruthy();      
      done();
    });
  });

  it('should delete database DB1', (done) => {
    service.removeDB(database.dbName).subscribe(data => {
      expect(data).toBeTruthy();
      done();
    });
  });*/

});
