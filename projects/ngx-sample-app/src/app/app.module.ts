import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSimpleIndexeddbModule } from 'projects/ngx-simple-indexeddb/src/lib/ngx-simple-indexeddb.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxAdalAngularModule } from 'projects/ngx-adal-angular/src/public-api';


const DATABASES = [
  {
    dbName: 'MTPDB', 
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
    NgxSimpleIndexeddbModule.forRoot(DATABASES),
    NgxAdalAngularModule.forRoot({
      tenant: '19fa3ef8-1020-4ab3-8ae3-4cefcedbbef9',
      clientId: '075626f4-9ee2-4fd7-8163-6b99d67814e9',
      redirectUri: window.location.origin,
      endpoints: { 
        "https://localhost/Api/": "xxx-bae6-4760-b434-xxx",        
      },
      navigateToLoginRequestUrl: false,
      cacheLocation: 'sessionStorage', 
    }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

  constructor() {
    console.log("Loaded main module");
  }
}
