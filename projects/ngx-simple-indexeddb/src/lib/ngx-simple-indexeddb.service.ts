import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IndexedDBStorage, IndexObj, ResponseStorageIndexedDB } from './indexdb-storage';
import { IndexedDBConfig } from './ngx-simple-indexeddb.module';

@Injectable({
  providedIn: 'root'
})
export class NgxSimpleIndexeddbService extends IndexedDBStorage {

  private subject = new Subject<ResponseStorageIndexedDB>();
  
  constructor(config: IndexedDBConfig) { 
    super(config.dbName, config.dbVersion);
  }

  get transactionsMessagesObs(): Observable<ResponseStorageIndexedDB> {
    return this.subject.asObservable();
  } 

  transactionsMessages(func: string, event: any, data: any) {
    this.subject.next({
      func: func,
			event: event,
			data: data
		});
    this.subject.complete();
  }

  addItems(storage: string, data: any, indexes: IndexObj[] = [], autoIncrement = true) {
    this.add(storage, data, {indexes: indexes, autoIncrement: autoIncrement});
  }

  getItem(storage: string, key: string | number, index?: string) {
    this.get(storage, key, index);
  }

  getItems(storage: string, withKeys: boolean = false) {
    this.getAll(storage, withKeys);
  }

  updateItem(storage: string, key: string | number, newValue: any) {
    this.update(storage, key, newValue);
  }

  deleteItem(storage: string, key: string | number) {
    this.delete(storage, key);
  }

  clearObjStorage(storage: string) {
    this.clearObjectStorage(storage);
  }

  removeDB() {
    this.deleteBD();
  }
}
