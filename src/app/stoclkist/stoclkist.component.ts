import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NumberSymbol } from '@angular/common';
import {IndexedDBServicesService} from '../index-db/indexed-db.services.service';
import {QueryServerService} from '../services/query-server.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stoclkist',
  templateUrl: './stoclkist.component.html',
  styleUrls: ['./stoclkist.component.scss']
})
export class StoclkistComponent implements OnInit {

  stock_list_data:any;
  loadingProcess = true;
  error_screen=false;
  STOCK_DETAILS:any;
  searchText='';
  filteredLocationList:any;
  resultCount:any;
  USERNAME: any;
  COMPANY_NAME: any;
  item_description:string[] = [];
  itemDisplay = "Item filter"
  displayList = "All";
  display = "none";
  kuchBe:any;
  responceFromIndexDb:any;
  intervalId: any;
  isIntervalRunning = false;
  
  
  constructor(private http: HttpClient, private indexedDBService: IndexedDBServicesService, private queryServerService:QueryServerService) { }
  ngOnInit():void{
  
    this.fetchDataFromIndexedDB();
     }

  testIt(inu:any){
    const input = inu;
 
    const arrayOfObjects = this.retriveStockFromLocalStorage().data;
    console.log(arrayOfObjects);
    function findMatchingObjects(input: string, threshold: number = 3) {
      return arrayOfObjects.filter((obj:any) => {

        if(input === ''){
           return obj.PROD_NAME.toLowerCase().includes(input.toLowerCase());
        }
        else{
          return obj.PROD_NAME === input;
        }
      });
    }
    
    const matchingObjects = findMatchingObjects(input);
    const arrayOfObjectsWithNumbers = matchingObjects.map((obj:any) => ({
      ...obj,  // Copy the other properties
      NETWT: Number(obj.NETWT) // Convert the value property to a number
    }));
    this.STOCK_DETAILS=arrayOfObjectsWithNumbers;
    this.filteredLocationList =  this.STOCK_DETAILS;
    this.resultCount = this.STOCK_DETAILS.length;
  }

  public retriveStockFromLocalStorage() {
    this.stock_list_data = this.kuchBe;
    return this.stock_list_data;
  }

  filterResults(text: any) {
     if (!text) {
      this.filteredLocationList = this.STOCK_DETAILS;
      this.resultCount = this.filteredLocationList.length;
    }
    this.filteredLocationList = this.STOCK_DETAILS.filter(
      (STOCK_DETAILS:any) => 
      STOCK_DETAILS?.PROD_CODE.toLowerCase().includes(text.toLowerCase().trim()) 
     );
    this.resultCount = this.filteredLocationList.length;
  }

  public getStockList() {
    var req = {
      "COMPANY_NAME": sessionStorage.getItem('company_name'),
      "USER_ID":  sessionStorage.getItem('username')
    }
    this.http.post('https://iedge.jewellpro.in/api/get_itemlist', req).subscribe((data: any) => {
      this.fetchAndStoreData(data.data);
      this.insertData(data.data);

    }, err => {
      console.log(err);
      // check error status code is 500, if so, do some action
    })
  }

  chunkArray(arr:any, chunkSize:any) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }

  async insertData(apiData:any) {
   this.loadingProcess = true;
    const data = apiData/* Your large data array */;
    const chunkSize = 100; // Adjust the chunk size as needed
    const dataChunks = this.chunkArray(data, chunkSize);
    for (const chunk of dataChunks) {
      await this.indexedDBService.storeDataChunk(chunk);
    }
    console.log('Data insertion complete.');
    this.fetchDataFromIndexedDB();
  }
 
  fetchAndStoreData(apiData:any) {
  }
  fetchDataFromIndexedDB() {
    this.indexedDBService.getAllData().then((data:any) => {
      this.loadingProcess = false;
      this.findUniqueItemName(data);
      this.kuchBe = {
        "status":"200",
        "msg":"ok",
        "data":data
      }
      this.testIt('');
    });
  }

  findUniqueItemName(data:any) {
    this.item_description.push('All');
    const uniqueSet = new Set<string>();
    data.forEach((file:any) => {
      if (!uniqueSet.has(file.PROD_NAME)) {
        uniqueSet.add(file.PROD_NAME);
        this.item_description.push(file.PROD_NAME);
      }
    });
  }

    startInterval() {
      if (!this.isIntervalRunning) {
        this.intervalId = setInterval(() => {
          // Code to run at each interval
          console.log('Interval function running...');
          if(sessionStorage.getItem("Data-Sataus") == '1'){
            console.log("done");
            this.stopInterval();
            this.fetchDataFromIndexedDB();
          }
        }, 1000); // Replace 1000 with your desired interval in milliseconds
        this.isIntervalRunning = true;
      }
    }

    stopInterval() {
      if (this.isIntervalRunning) {
        clearInterval(this.intervalId);
        this.isIntervalRunning = false;
        console.log('Interval stopped.');
        this.loadingProcess = false;
      }
    }

 


   syncLink(){

    this.loadingProcess = true;

    this.queryServerService.getStockList();
    sessionStorage.setItem("Data-Sataus",'0');
    this.startInterval();
    
    
    
    
   
    
    // try {
    //    this.responceFromIndexDb = await this.queryServerService.getStockList();
    //   // You can work with the response data here

    //   console.log(this.responceFromIndexDb   )
     
    //   if(this.responceFromIndexDb == "Data insertion complete."){
    //     console.log("let trigger fetch");
    //   } 
    // } catch (error) {
    //   // Handle any errors that occur during the async operation
    //   console.error(error);
    // }

    //console.log(this.queryServerService.getStockList());
      //localStorage.setItem('stockList', JSON.stringify(data));
     // this.fetchDataFromIndexedDB();
    
  }

  openCloseDropdown(){
    if(this.display == "none"){
      this.display = "show";
      console.log(this.display)
    }
    else{
      this.display = "none";
      console.log(this.display)
    }


  }


}
