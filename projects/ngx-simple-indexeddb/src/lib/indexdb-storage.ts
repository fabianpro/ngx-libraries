import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';

export interface IndexObj {
  id?: string;
  name?: string;
  unique?: boolean;
}

export abstract class IndexedDBStorage {

  private nameDB!: string;
  private versionDB!: number;

  constructor(
    nameDB: string,
    version: number
  ) {
    this.nameDB = nameDB;
    this.versionDB = version;
  }

  protected abstract messagesDB(data: any, ...args: any[]): any;

  private handleSuccess(e: any) {
    this.messagesDB('onSuccess', e);
  }

  private handleError(e: any) {
    this.messagesDB('onError', e);
  }

  private getConnection() {
    const request = window.indexedDB.open(this.nameDB, this.versionDB);
    return request;
  }

  protected deleteBD(nameDB: string) {
    const request = window.indexedDB.deleteDatabase(nameDB);
    request.onsuccess = (e) => this.handleSuccess(e);
  }

  protected add(nameStore: string, data: any,
    { autoIncrement, indexes }: { autoIncrement: boolean, indexes: IndexObj[] } = { autoIncrement: true, indexes: [] }) {
    if (!nameStore || !data) {
      this.handleError('Parameters invalid');
      return;
    }

    const request = this.getConnection();
    request.onupgradeneeded = (event: any) => {
      const store = event.target.result.createObjectStore(nameStore, { autoIncrement: autoIncrement });
      if (indexes?.length)
        for (let item of indexes)
          store.createIndex(item.id, item.name, { unique: item.unique });

      let createRequest;
      if (Array.isArray(data))
        for (let item of data) createRequest = store.put(item);
      else createRequest = store.put(data);

      createRequest.onsuccess = (e: any) => this.handleSuccess(e.target.result);
      createRequest.onerror = (e: any) => this.handleError(e);
    }
    request.onerror = (e: any) => this.handleError(e);
  }

  protected get(nameStore: string, key: string | number, nameIndex?: string) {
    if (!key) {
      this.handleError('Parameters invalid');
      return;
    }

    const request = this.getConnection();
    request.onsuccess = (event: any) => {
      const tx = event.target.result.transaction(nameStore, 'readonly');
      const store = tx.objectStore(nameStore);
      let request;
      if (nameIndex) {
        const index = store.index(nameIndex);
        request = index.get(key);
      } else request = store.get(key);

      store.openCursor().onsuccess = (e: any) => {
        const data = e.target.result;
        this.handleSuccess({
          primaryKey: data.primaryKey,
          data: data.value
        });
      }
      request.onsuccess = (e: any) => this.handleSuccess(e.target.result);
      request.onerror = (e: any) => this.handleError(e);
    }
    request.onerror = (e: any) => this.handleError(e);
  }

  protected getAll(nameStore: string, strategyTransaction: string = 'readonly') {
    const request = this.getConnection();
    request.onsuccess = (event: any) => {
      const tx = event.target.result.transaction(nameStore, strategyTransaction);
      const store = tx.objectStore(nameStore);
      store.getAll().onsuccess = (e: any) => this.handleSuccess(e.target.result);
    };
  }

  protected update(nameStore: string, key: string | number, newValue: any) {
    if (!key || !newValue) {
      this.handleError('Parameters invalid');
      return;
    }

    const request = this.getConnection();
    request.onsuccess = (event: any) => {
      const tx = event.target.result.transaction(nameStore, 'readwrite');
      const store = tx.objectStore(nameStore);
      const updateRequest = store.put(newValue, key);
      updateRequest.onsuccess = (e: any) => this.handleSuccess(e.target.result);
      updateRequest.onerror = (e: any) => this.handleError(e);
    }
    request.onerror = (e: any) => this.handleError(e);
  }

  protected delete(nameStore: string, key: string | number) {
    if (!key) {
      this.handleError('Parameters invalid');
      return;
    }

    const request = this.getConnection();
    request.onsuccess = (event: any) => {
      const tx = event.target.result.transaction(nameStore, 'readwrite');
      const deleteRequest = tx.objectStore(nameStore).delete(key);
      deleteRequest.onsuccess = (e: any) => this.handleSuccess(e.target.result);
      deleteRequest.onerror = (e: any) => this.handleError(e);
    }
    request.onerror = (e: any) => this.handleError(e);
  }

}


