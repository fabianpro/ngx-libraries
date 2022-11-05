import { NgModule } from '@angular/core';
import { NgxSimpleIndexeddbComponent } from './ngx-simple-indexeddb.component';
import { NgxSimpleIndexeddbService } from './ngx-simple-indexeddb.service';


@NgModule({
  declarations: [
    NgxSimpleIndexeddbComponent
  ],
  imports: [
  ],
  exports: [
    NgxSimpleIndexeddbComponent
  ],
  providers: [
    NgxSimpleIndexeddbService
  ]
})
export class NgxSimpleIndexeddbModule { }
