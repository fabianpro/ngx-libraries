[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/fabianpro/ngx-libraries/main/projects/ngx-simple-indexeddb/LICENSE)
[![Build Status](https://app.travis-ci.com/fabianpro/ngx-libraries.svg?branch=main)](https://app.travis-ci.com/fabianpro/ngx-libraries)


# NGX-SIMPLE-INDEXEDDB

This library aims to give you one better way to implement IndexedDB in ***Angular*** and more easy

## Version 2.0.2

- Was optimized code
- Added new features
  - Now you can create database after initialize
  - Now you can export database or just one table


## Install
```
npm install ngx-simple-indexeddb
```

## Setup
**Step 1**
Add the module in your application inside on imports

```
....
import { NgxSimpleIndexeddbModule } from  'ngx-simple-indexeddb';
....

const databases = [
  {
    dbName: 'BD1', 
    dbVersion: 5,
    dbStoresMetaData: [{
      store: 'languages',
      storeConfig: { 
        autoIncrement: false 
      },
      storeIndexes: [
        { name: 'name', keyPath: 'name', options: { unique: false } }
      ]
    }, {
      store: 'companies',
      storeConfig: { 
        autoIncrement: true 
      },
      storeIndexes: [
        { name: 'name', keyPath: 'name', options: { unique: true } },
        { name: 'antique', keyPath: 'antique', options: { unique: true } },
      ]
    }]
  }
];


@NgModule({
	declarations: [
	...
	],
	imports: [
		...,
		NgxSimpleIndexeddbModule.forRoot(databases),
		...
	]
})
export  class  AppModule { }
```
  
**Step 2**
  - Call service when you need to use it
  - Inject in constructor
```
import { NgxSimpleIndexeddbService } from  'ngx-simple-indexeddb';

....

constructor(
	private _sIDB: NgxSimpleIndexeddbService
) { }

...

ngOnInit(): void {
	/*This subscription listen events like save, update, delete, delete store, delete DB, you can apply your logic inside the this block subscription*/
	this._sIDB.eventsIndexedObs.subscribe(res => console.log(res));
}
```

**Step 3**
Execute operation needed

#### addItems

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|
|data|`any`||`Data to save`| true |


- ***Create record(s) with autoincrement true***
```
this._sIDB.addRecords('BD1', 'companies', {name: 'AWS', antique: 25})
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

- ***Create record(s) with autoincrement false (is necessary add to each item pk attribute)***
```
//With pk
const  data = [
	{pk: 1, name:  'Java'}, 
	{pk: 2, name:  'Dart'},
	{pk: 3, name:  'C#'}
];
this._sIDB.addRecords('BD1', 'languages', data)
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### getItem

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|
|key|`string|number`||`Key object to find`| true|
|indexName|`string`||`Key Name index`| false|

- ***Get record without index***
```
this._sIDB.getRecord('BD1', 2)
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```
- ***Get record with index***
```
this._sIDB.getRecord('BD1', 'languages', 'AWS' 'name')
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### getRecords

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|
|withKeys|`boolean`|false|`If you set this attribute in true, the response of query will return the primary key of each object and value`| false|

- ***Get list records without primaryKey***
```
this._sIDB.getRecords('BD1', 'languages')
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

- ***Get list records with primaryKey***
```
this._sIDB.getRecords('BD1', 'languages', true)
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### updateRecord

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|
|key|`string|number`||`Key object to find`| true|
|newValue|`any`||`Object to save`| true|

- ***Update record***
```
const data = {pk: 3, name: 'Rust'};
this._sIDB.updateRecord('BD1', 'languages', 3, data)
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### deleteRecord

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|
|key|`string|number`||`Key object to delete`| true|

- ***Delete record***
```
this._sIDB.deleteRecord('BD1', 'languages', 2
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### countRecords

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|

- ***Delete record***
```
this._sIDB.countRecords('BD1', 'languages')
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### clearObjStore

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|

- ***Delete object store***
```
this._sIDB.clearObjStore('BD1', 'languages')
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### deleteObjStore

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|

- ***Delete object store***
```
this._sIDB.deleteObjStore('BD1', 'companies')
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### removeDB

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|

- ***Remove database***
```
this._sIDB.removeDB(database)
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### addDatabase

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`IDBSchema`||`Schema of new database`|true|

- ***Create database***
```
const newDatabase = {
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

this._sIDB.addDatabase(newDatabase)
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### exportToJSON

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of database`|true|
|storeName|`string`||`Name of Object Store`|false|
|withKeys|`boolean`|false|`If you set this attribute in true, the response of query will return the primary key of each object and value`| false|

- ***Export database or table***
```
this._sIDB.exportToJSON(newDatabase)
    .subscribe({
        next: (data) => console.log(data), //Observable return data exported
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```



## Catalog Objects and Interfaces

This **interface** contain the data structure when observable emit data:
**ResponseStoreIndexedDB**  

| Attribute |Type |Description |Required |
|-----------|-----|------------|------------|
|event |`string`|`Emitted event executed`|true|
|dbName |`string`|`Name of database`|true|
|storeName |`string`|`Name of store`|false|
|data |`any` |`Emitted data result of execution`|false|


This **class** contain the main structure to build database
**IDBSchema**

| Attribute |Type |Description |Required |
|-----------|-----|------------|------------|
|dbName|`string`|`Name database`|true|
|dbVersion |`number`|`Number version`|false|
|dbStoresMetaData |`Array<StoreMetaDataConfig>` |`Contains config stores`|true|


This **class** contain the structure of store
**StoreMetaDataConfig**

| Attribute |Type |Description |Required |
|-----------|-----|------------|------------|
|store|`string`|`Name store`|true|
|storeConfig |`StoreConfig`|`Config store`|true|
|storeIndexes |`Array<IndexObj>` |`Contains indexes of stores`|false|


This **interface** contain the structure of store
**StoreConfig**

| Attribute |Type |Description |Required |
|-----------|-----|------------|------------|
|keyPath|`string`|`Name key path`|false|
|autoIncrement |`boolean`|`Set if key is autoincrement`|true|


This **interface** contain the structure when you needed add to store indexes
**IndexObj**

| Attribute |Type |Description |Required |
|-----------|-----|------------|------------|
|id|`string`|`Id index`|true|
|keyPath |`string`|`Name of key path`|true|
|options |`OptionsIndex` |`Set options index`|true|


This **interface** contain the structure of options to each index
**OptionsIndex**

| Attribute |Type |Description |Required |
|-----------|-----|------------|------------|
|unique|`boolean`|`Set if data is unique`|true|


# NGX-SIMPLE-INDEXEDDB

This library aims to give you one better way to implement IndexedDB in ***Angular*** and more easy

## Version 2.0.2

- Was optimized code
- Added new features
  - Now you can create database after initialize
  - Now you can export database or just one table


## Install
```
npm install ngx-simple-indexeddb
```

## Setup
**Step 1**
Add the module in your application inside on imports

```
....
import { NgxSimpleIndexeddbModule } from  'ngx-simple-indexeddb';
....

const databases = [
  {
    dbName: 'BD1', 
    dbVersion: 5,
    dbStoresMetaData: [{
      store: 'languages',
      storeConfig: { 
        autoIncrement: false 
      },
      storeIndexes: [
        { name: 'name', keyPath: 'name', options: { unique: false } }
      ]
    }, {
      store: 'companies',
      storeConfig: { 
        autoIncrement: true 
      },
      storeIndexes: [
        { name: 'name', keyPath: 'name', options: { unique: true } },
        { name: 'antique', keyPath: 'antique', options: { unique: true } },
      ]
    }]
  }
];


@NgModule({
	declarations: [
	...
	],
	imports: [
		...,
		NgxSimpleIndexeddbModule.forRoot(databases),
		...
	]
})
export  class  AppModule { }
```
  
**Step 2**
  - Call service when you need to use it
  - Inject in constructor
```
import { NgxSimpleIndexeddbService } from  'ngx-simple-indexeddb';

....

constructor(
	private _sIDB: NgxSimpleIndexeddbService
) { }

...

ngOnInit(): void {
	/*This subscription listen events like save, update, delete, delete store, delete DB, you can apply your logic inside the this block subscription*/
	this._sIDB.eventsIndexedObs.subscribe(res => console.log(res));
}
```

**Step 3**
Execute operation needed

#### addItems

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|
|data|`any`||`Data to save`| true |


- ***Create record(s) with autoincrement true***
```
this._sIDB.addRecords('BD1', 'companies', {name: 'AWS', antique: 25})
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

- ***Create record(s) with autoincrement false (is necessary add to each item pk attribute)***
```
//With pk
const  data = [
	{pk: 1, name:  'Java'}, 
	{pk: 2, name:  'Dart'},
	{pk: 3, name:  'C#'}
];
this._sIDB.addItems('BD1', 'languages', data)
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### getItem

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|
|key|`string|number`||`Key object to find`| true|
|indexName|`string`||`Key Name index`| false|

- ***Get record without index***
```
this._sIDB.getRecord('BD1', 2)
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```
- ***Get record with index***
```
this._sIDB.getItem('BD1', 'languages', 'AWS' 'name')
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### getRecords

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|
|withKeys|`boolean`|false|`If you set this attribute in true, the response of query will return the primary key of each object and value`| false|

- ***Get list records without primaryKey***
```
this._sIDB.getRecords('BD1', 'languages')
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

- ***Get list records with primaryKey***
```
this._sIDB.getRecords('BD1', 'languages', true)
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### updateRecord

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|
|key|`string|number`||`Key object to find`| true|
|newValue|`any`||`Object to save`| true|

- ***Update record***
```
const data = {pk: 3, name: 'Rust'};
this._sIDB.updateRecord('BD1', 'languages', 3, data)
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### deleteRecord

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|
|key|`string|number`||`Key object to delete`| true|

- ***Delete record***
```
this._sIDB.deleteRecord('BD1', 'languages', 2
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### countRecords

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|

- ***Delete record***
```
this._sIDB.countRecords('BD1', 'languages')
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### clearObjStore

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|

- ***Delete object store***
```
this._sIDB.clearObjStore('BD1', 'languages')
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### deleteObjStore

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|
|storeName|`string`||`Name of Object Store`|true|

- ***Delete object store***
```
this._sIDB.deleteObjStore('BD1', 'companies')
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### removeDB

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of Database`|true|

- ***Remove database***
```
this._sIDB.removeDB(database)
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### addDatabase

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`IDBSchema`||`Schema of new database`|true|

- ***Create database***
```
const newDatabase = {
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

this._sIDB.addDatabase(newDatabase)
    .subscribe({
        next: (data) => console.log(data),  
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```

#### exportToJSON

| Attribute |Type |Default | Description | Required |
|-----------|-----|--------|-------------|----------|
|database|`string`||`Name of database`|true|
|storeName|`string`||`Name of Object Store`|false|
|withKeys|`boolean`|false|`If you set this attribute in true, the response of query will return the primary key of each object and value`| false|

- ***Export database or table***
```
this._sIDB.exportToJSON(newDatabase)
    .subscribe({
        next: (data) => console.log(data), //Observable return data exported
        error: (error) => console.error(error),
        complete: () => console.log("Complete")
      });
```



## Catalog Objects and Interfaces

This **interface** contain the data structure when observable emit data:
**ResponseStoreIndexedDB**  

| Attribute |Type |Description |Required |
|-----------|-----|------------|------------|
|event |`string`|`Emitted event executed`|true|
|dbName |`string`|`Name of database`|true|
|storeName |`string`|`Name of store`|false|
|data |`any` |`Emitted data result of execution`|false|


This **class** contain the main structure to build database
**IDBSchema**

| Attribute |Type |Description |Required |
|-----------|-----|------------|------------|
|dbName|`string`|`Name database`|true|
|dbVersion |`number`|`Number version`|false|
|dbStoresMetaData |`Array<StoreMetaDataConfig>` |`Contains config stores`|true|


This **class** contain the structure of store
**StoreMetaDataConfig**

| Attribute |Type |Description |Required |
|-----------|-----|------------|------------|
|store|`string`|`Name store`|true|
|storeConfig |`StoreConfig`|`Config store`|true|
|storeIndexes |`Array<IndexObj>` |`Contains indexes of stores`|false|


This **interface** contain the structure of store
**StoreConfig**

| Attribute |Type |Description |Required |
|-----------|-----|------------|------------|
|keyPath|`string`|`Name key path`|false|
|autoIncrement |`boolean`|`Set if key is autoincrement`|true|


This **interface** contain the structure when you needed add to store indexes
**IndexObj**

| Attribute |Type |Description |Required |
|-----------|-----|------------|------------|
|id|`string`|`Id index`|true|
|keyPath |`string`|`Name of key path`|true|
|options |`OptionsIndex` |`Set options index`|true|


This **interface** contain the structure of options to each index
**OptionsIndex**

| Attribute |Type |Description |Required |
|-----------|-----|------------|------------|
|unique|`boolean`|`Set if data is unique`|true|
