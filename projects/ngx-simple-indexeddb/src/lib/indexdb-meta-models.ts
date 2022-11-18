import { InjectionToken } from "@angular/core";

export interface OptionsIndex {
    unique: boolean;
}

export interface IndexObj {
    name?: string;
    keyPath?: string;
    options?: OptionsIndex;
}

export interface StoreConfig {
    keyPath?: string;
    autoIncrement?: boolean;
}

export class StoreMetaDataConfig {
    store!: string;
    storeConfig!: StoreConfig;
    storeIndexes?: IndexObj[];
}

export class IDBSchema {
    dbName!: string;
    dbVersion?: number;
    dbStoresMetaData!: StoreMetaDataConfig[]
}

export interface ResponseStoreIndexedDB {    
    event: string;
    dbName: string;
    storeName?: string;
    data?: any;
}

export const SCHEMA_TOKEN = new InjectionToken<IDBSchema[]>('');