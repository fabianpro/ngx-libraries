import { connectDatabase, createDatabaseAndObjectsStore, deleteObjectStore } from "../utils/database";
import { createTx, TXMode, getPK, existStore } from "../utils/transactions";
import { IDBSchema } from "./indexdb-meta-models";

const NOT_AVAILABLE_DB = 'IndexedDB not available';
const DATABASE_NOT_EXIST = 'Database not exist';
const STORENAME_NOT_EXIST = 'Not exist object store';
const REQUEST_UNAVAILABLE = 'Request unavailable';

export abstract class IndexedDBStorage {

  private indexedDB!: IDBFactory;
  private databases!: Map<string, IDBSchema>;

  constructor(databases: Map<string, IDBSchema>) {
    this.databases = databases;
    this.initialize();
  }

  protected abstract eventsIndexedDB(event: string, dbName: string, storeName?: string, data?: any): void;

  /**
   * Initialize factory indexedDB
   */
  private initialize() {
    this.indexedDB =
      window.indexedDB ||
      (window as any).mozIndexedDB ||
      (window as any).msIndexedDB ||
      (window as any).webkitIndexedDB;

    if (!indexedDB) throw new Error(NOT_AVAILABLE_DB);
    this.createDatabases(this.databases);
  }

  /**
  * Function to create databases
  * @param databases 
  */
  private createDatabases(databases: Map<string, IDBSchema>) {
    if (!databases.size) throw new Error('Please, provide databases schema');
    databases.forEach(item => {
      this.eventsIndexedDB('createdDatabase', item.dbName);
      createDatabaseAndObjectsStore(this.indexedDB, item);
    });
  }

  /**
   * Function to get connection from Map
   * @param dbName 
   * @returns IDBSchema
   */
  private getDatabase(dbName: string): IDBSchema {
    return <IDBSchema>this.databases.get(dbName);
  }

  /**
   * Function to delete connection
   * @param dbName 
   * @returns
   */
  protected deleteBD(dbName: string): Promise<any> {
    const promise = new Promise<boolean>((resolve, reject) => {
      const connection = <IDBSchema>this.getDatabase(dbName);
      if (!connection) reject(`${DATABASE_NOT_EXIST} ${dbName}`);

      const request = this.indexedDB.deleteDatabase(connection.dbName);
      this.databases.delete(connection.dbName);
      request.onsuccess = (e: any) => {
        this.eventsIndexedDB('deleteBD', dbName);
        resolve(true);
      }
    });
    return promise;
  }

  /**
   * Function to add records to database
   * @param dbName 
   * @param storeName 
   * @param data 
   * @returns Promise
   */
  protected addItems(dbName: string, storeName: string, data: any): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      const database = <IDBSchema>this.getDatabase(dbName);
      if (!database) reject(`${DATABASE_NOT_EXIST} ${dbName}`);

      connectDatabase(this.indexedDB, database)
        .then((db: IDBDatabase) => {
          if (!existStore(db, storeName)) reject(`${STORENAME_NOT_EXIST} ${storeName}`);
          const tx = createTx(db, storeName, TXMode.readwrite);
          const store = tx.objectStore(storeName);

          let request;
          const arr = Array.isArray(data) ? data : [data];
          for (let item of arr) {
            const pk = getPK(item);
            if (pk) request = store.put(item, pk);
            else request = store.put(item);
          }

          if (!request) {
            reject(REQUEST_UNAVAILABLE);
            return;
          }
          request.onsuccess = (e: any) => {
            this.eventsIndexedDB('addedItem', dbName, storeName, data);
            resolve(e.target.result);
          }
          request.onerror = (e: any) => reject(e);
        })
        .catch((error: any) => reject(error));
    });
    return promise;
  }

  /**
   * Function to get data from database
   * @param dbName 
   * @param storeName 
   * @param key 
   * @param indexName 
   * @returns Promise
   */
  protected getItem(dbName: string, storeName: string, key: string | number, indexName?: string): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      const database = <IDBSchema>this.getDatabase(dbName);
      if (!database) reject(`${DATABASE_NOT_EXIST} ${dbName}`);

      connectDatabase(this.indexedDB, database)
        .then((db: IDBDatabase) => {
          if (!existStore(db, storeName)) reject(`${STORENAME_NOT_EXIST} ${storeName}`);
          const tx = createTx(db, storeName, TXMode.readonly);
          const store = tx.objectStore(storeName);

          let request;
          if (indexName) {
            const index = store.index(indexName);
            request = index.get(key);
          } else request = store.get(key);

          request.onsuccess = (e: any) => resolve(e.target.result);
          request.onerror = (e: any) => reject(e);
        })
        .catch((error: any) => reject(error));
    });
    return promise;
  }

  /**
   * Function to get all data from store
   * @param dbName 
   * @param storeName 
   * @param withKeys 
   * @returns 
   */
  protected getAllItems(dbName: string, storeName: string, withKeys: boolean = false, withStoreName: boolean = false): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      const database = <IDBSchema>this.getDatabase(dbName);
      if (!database) reject([]);

      connectDatabase(this.indexedDB, database)
        .then((db: IDBDatabase) => {
          if (!existStore(db, storeName)) reject(`${STORENAME_NOT_EXIST} ${storeName}`);
          const tx = createTx(db, storeName, TXMode.readonly);
          const store = tx.objectStore(storeName);
          const data: any = [];

          if (withKeys) {
            store.openCursor().onsuccess = (e: any) => {
              const cursor = e.target.result;
              if (cursor) {
                data.push({ key: cursor.key, value: cursor.value });
                cursor.continue();
              } else {
                if (withStoreName) resolve({ store: storeName, data: data });
                else resolve(data);
              }
            };
          } else
            store.getAll().onsuccess = (e: any) => {
              if (withStoreName) resolve({ store: storeName, data: e.target.result });
              else resolve(e.target.result);
            }
          store.getAll().onerror = (e: any) => reject(e);
        })
        .catch((error: any) => reject(error));
    });
    return promise;
  }

  /**
   * Function to update record in store from database
   * @param dbName 
   * @param storeName 
   * @param key 
   * @param newValue 
   * @returns 
   */
  protected updateItem(dbName: string, storeName: string, key: string | number, newValue: any): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      const database = <IDBSchema>this.getDatabase(dbName);
      if (!database) reject(`${DATABASE_NOT_EXIST} ${dbName}`);

      connectDatabase(this.indexedDB, database)
        .then((db: IDBDatabase) => {
          if (!existStore(db, storeName)) reject(`${STORENAME_NOT_EXIST} ${storeName}`);
          const tx = createTx(db, storeName, TXMode.readwrite);
          const store = tx.objectStore(storeName);
          const request = store.put(newValue, key);
          request.onsuccess = (e: any) => {
            this.eventsIndexedDB('updatedItem', dbName, storeName, { key: key, newValue: newValue });
            resolve(e.target.result);
          }
          request.onerror = (e: any) => reject(e);
        })
        .catch((error: any) => reject(error))
    });
    return promise;
  }

  /**
   * Function to delete record of store from database
   * @param dbName 
   * @param storeName 
   * @param key 
   * @returns 
   */
  protected deleteItem(dbName: string, storeName: string, key: string | number): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      const database = <IDBSchema>this.getDatabase(dbName);
      if (!database) reject(`${DATABASE_NOT_EXIST} ${dbName}`);

      connectDatabase(this.indexedDB, database)
        .then((db: IDBDatabase) => {
          if (!existStore(db, storeName)) reject(`${STORENAME_NOT_EXIST} ${storeName}`);
          const tx = createTx(db, storeName, TXMode.readwrite);
          const store = tx.objectStore(storeName);
          const request = store.delete(key);
          request.onsuccess = (e: any) => {
            this.eventsIndexedDB('deletedItem', dbName, storeName, key);
            resolve(true);
          }
          request.onerror = (e: any) => reject(e);
        })
        .catch((error: any) => reject(error))
    });
    return promise;
  }

  /**
   * Function to count items of store
   * @param dbName 
   * @param storeName 
   */
  protected countItems(dbName: string, storeName: string): Promise<any> {
    return new Promise<number>((resolve, reject) => {
      const database = <IDBSchema>this.getDatabase(dbName);
      if (!database) reject(`${DATABASE_NOT_EXIST} ${dbName}`);

      connectDatabase(this.indexedDB, database)
        .then((db: IDBDatabase) => {
          if (!existStore(db, storeName)) reject(`${STORENAME_NOT_EXIST} ${storeName}`);
          const tx = createTx(db, storeName, TXMode.readonly);
          const store = tx.objectStore(storeName);
          const request: IDBRequest = store.count();
          request.onsuccess = (e: any) => resolve(e.target.result);
          request.onerror = (e: any) => reject(e);
        })
        .catch((error: any) => reject(error))
    });
  }

  /**
   * Function to clear object storage
   * @param dbName 
   * @param storeName 
   * @returns 
   */
  protected clearStore(dbName: string, storeName: string): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      const database = <IDBSchema>this.getDatabase(dbName);
      if (!database) reject(`${DATABASE_NOT_EXIST} ${dbName}`);

      connectDatabase(this.indexedDB, database)
        .then((db: IDBDatabase) => {
          if (!existStore(db, storeName)) reject(`${STORENAME_NOT_EXIST} ${storeName}`);
          const tx = createTx(db, storeName, TXMode.readwrite);
          const store = tx.objectStore(storeName);
          store.clear();
          tx.oncomplete = () => {
            this.eventsIndexedDB('clearStore', dbName, storeName);
            resolve(true);
          }
        })
        .catch((error: any) => reject(error))
    });
    return promise;
  }

  /**
   * Function to delete object storage
   * @param dbName 
   * @param storeName 
   * @returns 
   */
  protected deleteObjectStore(dbName: string, storeName: string): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      const database = <IDBSchema>this.getDatabase(dbName);
      if (!database) reject(`${DATABASE_NOT_EXIST} ${dbName}`);

      deleteObjectStore(this.indexedDB, database, storeName)
        .then((data) => {
          this.eventsIndexedDB('deletedObjectStore', dbName, storeName);
          resolve(data);
        })
        .catch((error: any) => reject(error));
    });
    return promise;
  }

  /**
   * Function to create new database inline
   * @param database 
   * @returns 
   */
  protected createDatabase(database: IDBSchema): Promise<boolean> {
    const promise = new Promise<any>((resolve, reject) => {
      if (!database) reject(false);
      this.eventsIndexedDB('createdDatabase', database.dbName);
      this.databases.set(database.dbName, database);
      createDatabaseAndObjectsStore(this.indexedDB, database);
      resolve(true);
    });
    return promise;
  }

  /**
   * Function to export database or table of database
   * @param dbName 
   * @param storeName 
   * @param withKeys 
   * @returns 
   */
  protected exportDatabase(dbName: string, storeName?: string, withKeys: boolean = false): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      if (storeName)
        this.getAllItems(dbName, storeName, withKeys).then(data => resolve({ store: storeName, data: data }));
      else {
        const dataExport: any[][] = [];
        const promises: any = [];        
        const database = <IDBSchema>this.getDatabase(dbName);
        if (!database) reject([]);

        database.dbStoresMetaData.forEach(item =>
          promises.push(this.getAllItems(dbName, item.store, withKeys, true)));
        Promise.all(promises).then(data => {
          dataExport.push(data);
          resolve(dataExport);
        });
      }
      this.eventsIndexedDB('exportedDatabase', dbName, storeName);
    });
    return promise;
  }

}
