import { Injectable } from '@angular/core';
import { openDB, DBSchema,deleteDB,IDBPDatabase } from 'idb';
import {StocklistInterfaceIndexDB} from './index-db-interface/stocklist-interface-index-db';

interface MyDB extends DBSchema {
  Stockdata: {
    key: number;
    value: StocklistInterfaceIndexDB;
  };
}
 
@Injectable({
  providedIn: 'root'
})
export class IndexedDBServicesService {

  private dbPromise: any;
  private db!: IDBPDatabase<MyDB>;
  dbx:any
  constructor() { 
    this.dbPromise = openDB<MyDB>('my-database', 1, {
      upgrade(db) {
        const store = db.createObjectStore('Stockdata', { keyPath: 'ID' });
      },
    });
    this.connectToDatabase();
  }

  async connectToDatabase() {
    try {
      this.db = await openDB<MyDB>('my-database', 1, {
        upgrade(db) {
          db.createObjectStore('Stockdata', { keyPath: 'key' });
        },
      });
    } catch (error) {
      console.error('Error opening database:', error);
    }
  }

  async storeDataChunk(chunk: StocklistInterfaceIndexDB[]) {
    const tx=this.db.transaction('Stockdata', 'readwrite');
    const store = tx.objectStore('Stockdata');
    
    for (const item of chunk) {
      store.put(item);
    }
      await tx.done;
  }

  async getAllData() {
   try {
      
    const db = await this.dbPromise;
    const tx = db.transaction('Stockdata', 'readonly');
    const store = tx.objectStore('Stockdata');
    const data = await store.getAll();
    return data;
  
    }catch (error) {
      console.error('Error retrieving data:', error);
      return [];
    }
  }

  async clearData() {
    const tx = this.db.transaction('Stockdata', 'readwrite');
    const store = tx.objectStore('Stockdata');
    store.clear();
    await tx.done;
    console.log('Data cleared successfully');
  }

  async deleteDatabase() {
    await deleteDB('YourDatabaseName');
    console.log('Database deleted successfully');
  }
}
