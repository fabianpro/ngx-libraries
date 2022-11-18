import { Component } from '@angular/core';
import { NgxSimpleIndexeddbService } from 'projects/ngx-simple-indexeddb/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  index: number = 0;
  response: any;
  loading: boolean = false;

  constructor(
    private _sIDB: NgxSimpleIndexeddbService
  ) { }

  ngOnInit(): void {
    this._sIDB.eventsIndexedObs.subscribe(res => console.log(res));
  }
  
  saveData() {
    this.loading = true;
    const data = { pk: 1, name: 'C#' };
    this._sIDB.addRecords('BD1', 'languages', data)
      .subscribe({
        next: (data) => this.response = data,
        error: (error) => this.response = error,
        complete: () => this.loading = false
      });
  }

  saveGeneratedData() {
    const data = [];
    for (let i = this.index; i < this.index + 5; i++)
      data.push({ pk: i + 1, name: `Company ${i + 1}`, antique: i + 5 });

    this._sIDB.addRecords('BD1', 'companies', data)
      .subscribe({
        next: (data) => this.response = data,
        error: (error) => this.response = error,
        complete: () => this.loading = false
      });
    this.index = + 5;
  }

  getDataById() {
    this._sIDB.getRecord('BD1', 'companies', 2)
      .subscribe({
        next: (data) => this.response = data,
        error: (error) => this.response = error,
        complete: () => this.loading = false
      });
  }


  getDataByIndexName() {
    this._sIDB.getRecord('BD1', 'companies', 'Company 4', 'name')
      .subscribe({
        next: (data) => this.response = data,
        error: (error) => this.response = error,
        complete: () => this.loading = false
      });
  }

  getAllData() {
    this._sIDB.getRecords('BD1', 'companies', true)
      .subscribe({
        next: (data) => this.response = data,
        error: (error) => this.response = error,
        complete: () => this.loading = false
      });
  }

  updateData() {
    const data = { name: 'Company xxx', age: 35 };
    //this._sIDB.updateItem('BD1', 'companies', 'Person 0', data)
    this._sIDB.updateRecord('BD1', 'companies', 2, data)
      .subscribe({
        next: (data) => this.response = data,
        error: (error) => this.response = error,
        complete: () => this.loading = false
      });
  }

  deleteData() {
    this._sIDB.deleteRecord('BD1', 'companies', 3)
      .subscribe({
        next: (data) => this.response = data,
        error: (error) => this.response = error,
        complete: () => this.loading = false
      });
  }

  countData() {
    this._sIDB.countRecords('BD1', 'companies')
      .subscribe({
        next: (data) => this.response = data,
        error: (error) => this.response = error,
        complete: () => this.loading = false
      });
  }

  clearObjectStore() {
    this._sIDB.clearObjStore('BD1', 'companies')
      .subscribe({
        next: (data) => this.response = data,
        error: (error) => this.response = error,
        complete: () => this.loading = false
      });
  }

  deleteObjectStore() {
    this._sIDB.deleteObjStore('BD1', 'languages')
      .subscribe({
        next: (data) => this.response = data,
        error: (error) => this.response = error,
        complete: () => this.loading = false
      });
  }

  deleteBD() {
    this._sIDB.removeDB('BD1')
      .subscribe({
        next: (data) => this.response = data,
        error: (error) => this.response = error,
        complete: () => this.loading = false
      });
  }

}
