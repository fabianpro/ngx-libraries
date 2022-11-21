import { IDBSchema, StoreMetaDataConfig } from "../public-api";

const NOT_AVAILABLE_DB = 'IndexedDB not available';
const INVALID_PARAMETERS = 'Invalid parameters';

/**
   * Function to create connection to database
   * @param indexedDB 
   * @param database
   * @param upgradeCB 
   * @returns 
   */
export function connectDatabase(
  indexedDB: IDBFactory,
  database: IDBSchema,
  upgradeCB?: (event: Event, database: IDBDatabase) => void
) {
  const promise = new Promise<IDBDatabase>((resolve, reject) => {
    if (!indexedDB) reject(NOT_AVAILABLE_DB);

    const request = indexedDB.open(database.dbName, database.dbVersion);
    let db: IDBDatabase;

    request.onerror = (e: Event) => reject(e);
    request.onsuccess = (event: Event) => {
      db = request.result;
      resolve(db);
    };

    if (typeof upgradeCB === 'function')
      request.onupgradeneeded = (e: Event) => upgradeCB(e, db);
  });
  return promise;
}

/**
 * Function to create object store
 * @param indexedDB 
 * @param database 
 * @returns 
 */
export function createDatabaseAndObjectsStore(
  indexedDB: IDBFactory,
  database: IDBSchema
): void {
  if (!indexedDB) return;
  const request: IDBOpenDBRequest = indexedDB.open(database.dbName, database.dbVersion);

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const db: IDBDatabase = (event.target as any).result;
    database.dbStoresMetaData.forEach((storeSchema: StoreMetaDataConfig) => {
      if (!db.objectStoreNames.contains(storeSchema.store)) {
        const objectStore = db.createObjectStore(storeSchema.store, storeSchema.storeConfig);
        if (storeSchema && storeSchema.storeIndexes) {
          for (let schema of storeSchema.storeIndexes) {
            if (!schema.name || !schema.keyPath) continue;
            objectStore.createIndex(schema.name!, schema.keyPath!, schema.options);
          }
        }
      }
    });
    db.close();
  };
  request.onsuccess = (e: any) => e.target.result.close();
}

/**
 * Function to delete object storage
 * @param indexedDB 
 * @param database 
 * @param storeName 
 * @returns 
 */
export function deleteObjectStore(indexedDB: IDBFactory, database: IDBSchema, storeName: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (!database.dbName || !storeName) reject(INVALID_PARAMETERS);

    try {
      validateDatabase(database).then((data) => {
        const request: IDBOpenDBRequest = indexedDB.open(data.dbName, ++data.dbVersion!);
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const database: IDBDatabase = (event.target as any).result;
          database.deleteObjectStore(storeName);
          database.close();
          resolve(true);
        };
        request.onerror = (e: Event) => reject(e);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Function to validate database and set version if not was specified
 * @param database 
 * @returns 
 */
export function validateDatabase(database: IDBSchema): Promise<IDBSchema> {
  return new Promise<IDBSchema>((resolve) => {
    connectDatabase(indexedDB, database).then((db) => {
      if (!database.hasOwnProperty('dbVersion') || !database.dbVersion) {
        database.dbVersion = db.version;
        resolve(database);
      }
    });
  });
}

/**
 * Function to export database in json file
 * @param jsonData 
 * @param fileName 
 * @returns 
 */
export function exportDatabaseToJSON(jsonData: any, fileName?: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      const data = JSON.stringify(jsonData);
      const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
      const fileNameExport = fileName ?? 'indexeddb-exported.json';
      const el = document.createElement('a');
      el.setAttribute('href', uri);
      el.setAttribute('download', fileNameExport);
      el.click();
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
}
