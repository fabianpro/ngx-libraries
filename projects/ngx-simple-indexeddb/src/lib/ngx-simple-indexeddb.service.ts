import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { exportDatabaseToJSON } from '../utils/database';
import { IDBSchema, ResponseStoreIndexedDB, SCHEMA_TOKEN } from './indexdb-meta-models';
import { IndexedDBStorage } from './indexdb-storage';

@Injectable({
  providedIn: 'root'
})
export class NgxSimpleIndexeddbService extends IndexedDBStorage {

  private subject = new Subject<ResponseStoreIndexedDB>();

  constructor(
    @Inject(SCHEMA_TOKEN) databases: IDBSchema[]
  ) {
    if (!databases.length)
      throw new Error('Please, provide databases schema');

    const map = new Map<string, IDBSchema>();
    for (let item of databases)
      map.set(item.dbName, item);
    super(map);
  }

  get eventsIndexedObs(): Observable<ResponseStoreIndexedDB> {
    return this.subject.asObservable();
  }

  eventsIndexedDB(event: string, dbName: string, storeName?: string, data?: any): void {
    if (!this.subject) return;
    this.subject.next({
      event: event,
      dbName: dbName,
      storeName: storeName,
      data: data
    });
    this.subject.complete();
  }

  /**
   * Method to add records in database
   * @param database 
   * @param storeName 
   * @param data 
   * @returns 
   */
  addRecords(database: string, storeName: string, data: any): Observable<any> {
    return new Observable<any>((obs) => {
      this.addItems(database, storeName, data)
        .then(data => {
          obs.next(data);
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
          obs.complete();
        });
    });
  }

  /**
   * Add records in store
   * @param database 
   * @param storeName 
   * @param key 
   * @param indexName 
   * @returns 
   */
  getRecord(database: string, storeName: string, key: string | number, indexName?: string): Observable<any> {
    return new Observable<any>((obs) => {
      this.getItem(database, storeName, key, indexName)
        .then(data => {
          obs.next(data);
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
          obs.complete();
        });
    });
  }

  /**
   * Get list records of store
   * @param database 
   * @param storeName 
   * @param withKeys 
   * @returns 
   */
  getRecords(database: string, storeName: string, withKeys: boolean = false): Observable<any> {
    return new Observable<any>((obs) => {
      this.getAllItems(database, storeName, withKeys)
        .then(data => {
          obs.next(data);
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
          obs.complete();
        });
    });
  }

  /**
   * Update record of store
   * @param database 
   * @param storeName 
   * @param key 
   * @param newValue 
   * @returns 
   */
  updateRecord(database: string, storeName: string, key: string | number, newValue: any): Observable<any> {
    return new Observable<any>((obs) => {
      this.updateItem(database, storeName, key, newValue)
        .then(data => {
          obs.next(data);
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
          obs.complete();
        });
    });
  }

  /**
   * Delete record of store
   * @param database 
   * @param storeName 
   * @param key 
   * @returns 
   */
  deleteRecord(database: string, storeName: string, key: string | number): Observable<any> {
    return new Observable<any>((obs) => {
      this.deleteItem(database, storeName, key)
        .then(data => {
          obs.next(data);
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
          obs.complete();
        });
    });
  }

  /**
   * Count records of store
   * @param database 
   * @param storeName 
   * @returns 
   */
  countRecords(database: string, storeName: string): Observable<number> {
    return new Observable<any>((obs) => {
      this.countItems(database, storeName)
        .then(data => {
          obs.next(data);
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
          obs.complete();
        });
    });
  }

  /**
   * Clear all data of store
   * @param database 
   * @param storeName 
   * @returns 
   */
  clearObjStore(database: string, storeName: string) {
    return new Observable<any>((obs) => {
      this.clearStore(database, storeName)
        .then(data => {
          obs.next(data);
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
          obs.complete();
        });
    });
  }

  /**
   * Delete object store
   * @param database 
   * @param storeName 
   * @returns 
   */
  deleteObjStore(database: string, storeName: string) {
    return new Observable<any>((obs) => {
      this.deleteObjectStore(database, storeName)
        .then(data => {
          obs.next(data);
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
          obs.complete();
        });
    });
  }

  /**
   * Delete or remove database
   * @param database 
   * @returns 
   */
  removeDB(database: string) {
    return new Observable<any>((obs) => {
      this.deleteBD(database)
        .then(data => {
          obs.next(data);
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
          obs.complete();
        });
    });
  }

  /**
   * Create new database
   * @param database
   */
  addDatabase(database: IDBSchema): Observable<boolean> {
    return new Observable<any>((obs) => {
      this.createDatabase(database)
        .then(data => {
          obs.next(data);
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
          obs.complete();
        });
    });
  }

  /**
   * Export database or table
   * @param database 
   * @param storeName 
   * @param withKeys 
   * @returns 
   */
  exportToJSON(database: string, storeName?: string, withKeys: boolean = false): Observable<boolean> {
    return new Observable<any>((obs) => {
      this.exportDatabase(database, storeName, withKeys)
        .then(data => {
          exportDatabaseToJSON(data);
          obs.next(data);
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
          obs.complete();
        });
    });
  }
}
