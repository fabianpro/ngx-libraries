import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxAdalAngularService } from './ngx-adal-angular.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class NgxAdalAngularModule { 
  static forRoot(adalConfig: any): ModuleWithProviders<NgxAdalAngularModule> {
    return {
      ngModule: NgxAdalAngularModule,
      providers: [NgxAdalAngularService, { provide: 'adalConfig', useValue: adalConfig }]
    };
  }
}
