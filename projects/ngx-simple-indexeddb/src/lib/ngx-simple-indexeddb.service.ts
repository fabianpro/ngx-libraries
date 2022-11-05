import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IndexedDBStorage, IndexObj } from './indexdb-storage';

export interface ResponseStorageIndexedDB {
  event: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class NgxSimpleIndexeddbService extends IndexedDBStorage {

  private subject = new Subject<any>();
  
  constructor() { 
    super('TEST', 3);
  }

  get messagesData(): Observable<ResponseStorageIndexedDB> {
    return this.subject;
  } 

  messagesDB(data: any, args: any) {
    this.subject.next({
			event: data,
			args: args
		});
  }

  addItems(storage: string, data: any, indexes: IndexObj[] = [], autoIncrement = true) {
    this.add(storage, data, {indexes: indexes, autoIncrement: autoIncrement});
  }

  getItem(storage: string, key: string | number, index?: string) {
    this.get(storage, key, index);
  }

  getItems(storage: string) {
    this.getAll(storage);
  }

  updateItem(storage: string, key: string | number, newValue: any) {
    this.update(storage, key, newValue);
  }

  deleteItem(storage: string, key: string | number) {
    this.delete(storage, key);
  }

  removeDB(nameDB: string) {
    this.deleteBD(nameDB);
  }
}
