import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSimpleIndexeddbComponent } from './ngx-simple-indexeddb.component';

describe('NgxSimpleIndexeddbComponent', () => {
  let component: NgxSimpleIndexeddbComponent;
  let fixture: ComponentFixture<NgxSimpleIndexeddbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxSimpleIndexeddbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxSimpleIndexeddbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
