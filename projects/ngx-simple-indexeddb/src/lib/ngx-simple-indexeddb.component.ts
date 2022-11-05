import { Component, OnInit } from '@angular/core';
import { NgxSimpleIndexeddbService } from './ngx-simple-indexeddb.service';

@Component({
  selector: 'lib-ngx-simple-indexeddb',
  template: `
    <p>
      ngx-simple-indexeddb works!
    </p>

    <button (click)="saveData()">Save</button><br>
    <button (click)="getData()">Get</button><br>
    <button (click)="getAllData()">Get All</button><br>
    <button (click)="updateData()">Update</button><br>
    <button (click)="deleteData()">Delete</button><br>
    <button (click)="deleteBD()">Delete BD</button>
  `,
  styles: [
  ]
})
export class NgxSimpleIndexeddbComponent implements OnInit {

  constructor(
    private _ngxSimpleIndexedDB: NgxSimpleIndexeddbService
  ) { }

  ngOnInit(): void {
  }

  saveData() {
    console.log("Save");
    this._ngxSimpleIndexedDB.addItems('FABIAN', {name: 'Fabian', age: 33});

    const indexes = [{id: 'by_name', name: 'name', unique: true}];
    this._ngxSimpleIndexedDB.addItems('FABIAN_INDEXED', {name: 'Fabian', age: 33}, indexes, true);
  }
  
  getData() {}
  
  getAllData() {}
  
  updateData() {}
  
  deleteData() {}
  
  deleteBD() {}

}
