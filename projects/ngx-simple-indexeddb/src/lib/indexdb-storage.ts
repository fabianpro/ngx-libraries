const NOT_AVAILABLE_DB = 'IndexedDB not available';
const INVALID_PARAMETERS = 'Invalid parameters';

export interface ResponseStorageIndexedDB {
  func: string,
  event: string;
  data: any;
}

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

  protected abstract transactionsMessages(func: string, event: string, data: any): void;

  private handleSuccess(func: string, data: any) {
    this.transactionsMessages(func, 'onSuccess', data);
  }

  private handleError(func: string, data: any) {
    this.transactionsMessages(func, 'onError', data);
  }

  private getConnection() {
    const NAME_METHOD = this.getConnection.name;
    const indexedDB = window.hasOwnProperty('indexedDB') && window.indexedDB ? window.indexedDB : null;
    if (!indexedDB) {
      this.handleError(NAME_METHOD, NOT_AVAILABLE_DB);
      return;
    };

    const request = indexedDB.open(this.nameDB, this.versionDB);
    request.onblocked = (e: any) => this.handleSuccess(NAME_METHOD, e);
    request.onerror = (e: any) => this.handleError(NAME_METHOD, e);
    return request;
  }

  protected deleteBD() {
    const NAME_METHOD = this.deleteBD.name;
    const request = window.indexedDB.deleteDatabase(this.nameDB);
    request.onsuccess = (e: any) => this.handleSuccess(NAME_METHOD, e);
  }

  protected add(nameStore: string, data: any, { autoIncrement, indexes }: { autoIncrement: boolean, indexes: IndexObj[] } = { autoIncrement: true, indexes: [] }) {
    const NAME_METHOD = this.add.name;
    if (!nameStore || !data) {
      this.handleError(NAME_METHOD, INVALID_PARAMETERS);
      return;
    }

    const request = this.getConnection();
    request!.onsuccess = (event: any) => {
      const db = event.target.result;
      
      if (db.objectStoreNames.contains(nameStore)) {
        const tx = db.transaction(nameStore, 'readwrite');
        const store = tx.objectStore(nameStore);      

        let createRequest;
        if (Array.isArray(data))
          for (let item of data) createRequest = store.put(item);
        else createRequest = store.put(data);

        createRequest.onsuccess = (e: any) => this.handleSuccess(NAME_METHOD, e.target.result);
        createRequest.onerror = (e: any) => this.handleError(NAME_METHOD, e);
      }
    }

    request!.onupgradeneeded = (event: any) => {
      const db = event.target.result;
            
      if (!db.objectStoreNames.contains(nameStore)) {
        const store = db.createObjectStore(nameStore, { autoIncrement: autoIncrement });      

        if (indexes?.length)
          for (let item of indexes)
            store.createIndex(item.id, item.name, { unique: item.unique });

        let createRequest;
        if (Array.isArray(data))
          for (let item of data) createRequest = store.put(item);
        else createRequest = store.put(data);

        createRequest.onsuccess = (e: any) => this.handleSuccess(NAME_METHOD, e.target.result);
        createRequest.onerror = (e: any) => this.handleError(NAME_METHOD, e);
      }
    }
  }

  protected get(nameStore: string, key: string | number, nameIndex?: string) {
    const NAME_METHOD = this.get.name;
    if (!nameStore || !key) {
      this.handleError(NAME_METHOD, INVALID_PARAMETERS);
      return;
    }

    const request = this.getConnection();
    request!.onsuccess = (event: any) => {
      const tx = event.target.result.transaction(nameStore, 'readonly');
      const store = tx.objectStore(nameStore);
      let request;
      if (nameIndex) {
        const index = store.index(nameIndex);
        request = index.get(key);
      } else request = store.get(key);
      request.onsuccess = (e: any) => this.handleSuccess(NAME_METHOD, e.target.result);
    }
  }

  protected getAll(nameStore: string, withKeys: boolean = false) {
    const NAME_METHOD = this.getAll.name;
    if (!nameStore) {
      this.handleError(NAME_METHOD, INVALID_PARAMETERS);
      return;
    }

    const request = this.getConnection();
    request!.onsuccess = (event: any) => {
      const data: any = [];
      const tx = event.target.result.transaction(nameStore, 'readonly');
      const store = tx.objectStore(nameStore);

      if (withKeys) {
        store.openCursor().onsuccess = (e: any) => {
          const cursor = e.target.result;
          if (cursor) {
            data.push({ id: cursor.key, value: cursor.value });
            cursor.continue();
          } else
            this.handleSuccess(NAME_METHOD, data);
        };
      } else
        store.getAll().onsuccess = (e: any) => this.handleSuccess(NAME_METHOD, e.target.result);
      store.getAll().onerror = (e: any) => this.handleError(NAME_METHOD, e);
    };
  }

  protected update(nameStore: string, key: string | number, newValue: any) {
    const NAME_METHOD = this.update.name;
    if (!nameStore || !key || !newValue) {
      this.handleError(NAME_METHOD, INVALID_PARAMETERS);
      return;
    }

    const request = this.getConnection();
    request!.onsuccess = (event: any) => {
      const tx = event.target.result.transaction(nameStore, 'readwrite');
      const store = tx.objectStore(nameStore);
      const updateRequest = store.put(newValue, key);
      updateRequest.onsuccess = (e: any) => this.handleSuccess(NAME_METHOD, e.target.result);
      updateRequest.onerror = (e: any) => this.handleError(NAME_METHOD, e);
    }
  }

  protected delete(nameStore: string, key: string | number) {
    const NAME_METHOD = this.delete.name;
    if (!nameStore || !key) {
      this.handleError(NAME_METHOD, INVALID_PARAMETERS);
      return;
    }

    const request = this.getConnection();
    request!.onsuccess = (event: any) => {
      const tx = event.target.result.transaction(nameStore, 'readwrite');
      const deleteRequest = tx.objectStore(nameStore).delete(key);
      deleteRequest.onsuccess = (e: any) => this.handleSuccess(NAME_METHOD, e.target.result);
      deleteRequest.onerror = (e: any) => this.handleError(NAME_METHOD, e);
    }
  }

  protected clearObjectStorage(nameStore: string) {
    const NAME_METHOD = this.clearObjectStorage.name;
    if (!nameStore) {
      this.handleError(NAME_METHOD, INVALID_PARAMETERS);
      return;
    }

    const request = this.getConnection();
    request!.onsuccess = (event: any) => {
      const tx = event.target.result.transaction(nameStore, 'readwrite');
      const deleteRequest = tx.objectStore(nameStore).clear();
      deleteRequest.onsuccess = (e: any) => this.handleSuccess(NAME_METHOD, e.target.result);
      deleteRequest.onerror = (e: any)=> this.handleError(NAME_METHOD, e);
    }    
  }
}
