import { ModuleWithProviders, NgModule } from '@angular/core';
import { IDBSchema, SCHEMA_TOKEN } from './indexdb-meta-models';
import { NgxSimpleIndexeddbService } from './ngx-simple-indexeddb.service';

@NgModule()
export class NgxSimpleIndexeddbModule {
  static forRoot(schemas: IDBSchema[]): ModuleWithProviders<NgxSimpleIndexeddbModule> {
    return {
      ngModule: NgxSimpleIndexeddbModule,
      providers: [        
        NgxSimpleIndexeddbService, 
        { 
          provide: SCHEMA_TOKEN, 
          useValue: schemas 
        }
      ],
    };
  }
}

