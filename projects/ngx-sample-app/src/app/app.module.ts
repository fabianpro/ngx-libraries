import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSimpleIndexeddbModule } from 'projects/ngx-simple-indexeddb/src/lib/ngx-simple-indexeddb.module';

import { AppComponent } from './app.component';


const DATABASES = [
  {
    dbName: 'BD1', 
    //dbVersion: 5,
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
  }  
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxSimpleIndexeddbModule.forRoot(DATABASES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
