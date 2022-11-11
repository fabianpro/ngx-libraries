import { ModuleWithProviders, NgModule } from '@angular/core';

@NgModule()
export class NgxSimpleIndexeddbModule {
  static forRoot(config: IndexedDBConfig): ModuleWithProviders<NgxSimpleIndexeddbModule> {
    return {
      ngModule: NgxSimpleIndexeddbModule,
      providers: [
        {
          provide: IndexedDBConfig,
          useFactory: () => config
        }
      ],
    };
  }
}

export class IndexedDBConfig {
  dbName!: string;
  dbVersion!: number;
}
