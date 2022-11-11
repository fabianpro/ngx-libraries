import { Component } from '@angular/core';
import { NgxSimpleIndexeddbService } from 'ngx-simple-indexeddb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  index: number = 0;

  constructor(
    private _ngxSimpleIndexedDB: NgxSimpleIndexeddbService
  ) { }

  ngOnInit(): void {
    this._ngxSimpleIndexedDB.transactionsMessagesObs.subscribe(res => console.log(res));
  }  

  saveData() {
    this._ngxSimpleIndexedDB.addItems('TMP_NOT_INDEXED', {name: 'Person', age: 33});
  }

  saveGeneratedData() {
    const indexes = [
      {id: 'by_name', name: 'name', unique: true}, 
      {id: 'by_age', name: 'age', unique: true}
    ];
    const data = [];
    for (let i = this.index; i < this.index + 5; i++) 
      data.push({age: i, name: 'Person' + i});
    this._ngxSimpleIndexedDB.addItems('TMP_INDEXED', data, indexes, true);
    this.index =+ 5;
  }
  
  getData() {
    this._ngxSimpleIndexedDB.getItem('TMP_INDEXED', 2);

    setTimeout(() => {
      this._ngxSimpleIndexedDB.getItem('TMP_INDEXED', 'Person', 'by_name');
    }, 2000);   
  }
  
  getAllData() {
    this._ngxSimpleIndexedDB.getItems('TMP_INDEXED', true);
  }
  
  updateData() {    
    const data = [{name: 'Person', age: 35}];
    this._ngxSimpleIndexedDB.updateItem('TMP_INDEXED', 'Person', data);    
  }
  
  deleteData() {
    this._ngxSimpleIndexedDB.deleteItem('TMP_INDEXED', 2);
  }

  clearObjectStorage() {
    this._ngxSimpleIndexedDB.clearObjStorage('TMP_INDEXED');
  }
  
  deleteBD() {
    this._ngxSimpleIndexedDB.removeDB();
  }

}
