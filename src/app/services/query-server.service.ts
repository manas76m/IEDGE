import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IndexedDBServicesService} from '../index-db/indexed-db.services.service'


@Injectable({
  providedIn: 'root'
})
export class QueryServerService {

  constructor(private http: HttpClient, private indexedDBService:IndexedDBServicesService) { }
  async getStockList() {
    try {
      var req = {
        "COMPANY_NAME": sessionStorage.getItem('company_name'),
        "USER_ID":  sessionStorage.getItem('username')
      }
      this.http.post('https://iedge.jewellpro.in/api/get_itemlist', req).subscribe(async (data: any) => {
        this.indexedDBService.clearData()
        this.insertData(data.data);
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.error(error);
    }
     
  }

  chunkArray(arr:any, chunkSize:any) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }
  async insertData(apiData:any) {
    const data = apiData/* Your large data array */;
    const chunkSize = 100; // Adjust the chunk size as needed
    const dataChunks = this.chunkArray(data, chunkSize);
    for (const chunk of dataChunks) {
      await this.indexedDBService.storeDataChunk(chunk);
    }
    console.log('Data insertion complete.');
    sessionStorage.setItem("Data-Sataus",'1');
   }
}
