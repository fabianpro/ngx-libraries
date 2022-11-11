import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSimpleIndexeddbModule } from 'ngx-simple-indexeddb';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxSimpleIndexeddbModule.forRoot({
      dbName: 'TEST_INDEXEDDB', 
      dbVersion: 5
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
