import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IndexedDBServicesService} from '../index-db/indexed-db.services.service';
import {QueryServerService} from '../services/query-server.service';

@Component({
  selector: 'app-stocksummery',
  templateUrl: './stocksummery.component.html',
  styleUrls: ['./stocksummery.component.scss']
})
export class StocksummeryComponent implements OnInit{

  stock_list_data:any;
  loadingProcess = true;
  error_screen=false;
  METAL_DETAILS:any;
  searchText='';
  filteredLocationList:any;
  resultCount:any;
  USERNAME: any;
  COMPANY_NAME: any;
  item_description:string[] = [];
  displayList = "CATAGORY";
  display = "none";
  totalCataWt=0;
  totalCataPcs = 0;
  title = "CATAGORY";
  kuchBe:any;
  intervalId: any;
  isIntervalRunning = false;

  constructor(private http: HttpClient, private indexedDBService:IndexedDBServicesService,private  queryServerService:QueryServerService) { }
  ngOnInit():void{
    // console.log(this.filteredLocationList.find(this.setThelistasPerDropDown)); 
    //console.log( this.getByValue4(this.METAL_DETAILS,'BABY CHAIN'))
    //this.testIt('');
    //this.findUniqueItemName(this.retriveStockFromLocalStorage().data);
    this.fetchDataFromIndexedDB();
  }

  fetchDataFromIndexedDB() {
    // this.indexedDBService.getAllStockList().then((data:any) => {
    //   console.log(data)
    //   this.RETIVEDATAFROMDEVIDEMEMEORY = data;
    //   return data;
    
    // });
    this.indexedDBService.getAllData().then((data:any) => {
      //console.log(data)
     
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

  testIt(inu:any){
    const input = inu;
 
    const arrayOfObjects = this.retriveStockFromLocalStorage().data;
    
    // Your input
    // This could be any input you want to match
    
    // Function to find matching or similar objects
    function findMatchingObjects(input: string, threshold: number = 3) {
      return arrayOfObjects.filter((obj:any) => {
        // You can use a similarity metric here, for simplicity, we're using a basic string comparison

        if(input === ''){
           return obj.ITEM_CAT.toLowerCase().includes(input.toLowerCase());
        }
        else{
          return obj.ITEM_CAT === input;
        }
      });
    }
    
    const matchingObjects = findMatchingObjects(input);

    const arrayOfObjectsWithNumbers = matchingObjects.map((obj:any) => ({
      ...obj,  // Copy the other properties
      NETWT: Number(obj.NETWT)// Convert the value property to a number
    }));
    
    

    this.METAL_DETAILS=arrayOfObjectsWithNumbers;
   // this.filteredLocationList =  this.METAL_DETAILS;
    //this.filteredLocationList.push(this.filteredLocationList.map((i:any)=>i.NETWT=Number(i.NETWT)));
    // this.resultCount = this.METAL_DETAILS.length;
   this.summeryofCata();

  }

  public retriveStockFromLocalStorage() {
    this.stock_list_data = this.kuchBe;
    //this.stock_list_data = localStorage.getItem('stockList');
    //console.log('retrievedObject: ', JSON.parse(this.stock_list_data));
    this.loadingProcess = false;
    //return JSON.parse(this.stock_list_data);
    return this.stock_list_data;

  }

  findUniqueItemName(data:any) {
    this.item_description.push('All');
    const uniqueSet = new Set<string>();
    data.forEach((file:any) => {
      if (!uniqueSet.has(file.ITEM_CAT)) {
        uniqueSet.add(file.ITEM_CAT);
        this.item_description.push(file.ITEM_CAT);
      }
    });
   
    //console.log(this.item_description);
  }

 

  ItemfilterResults(text: any) {

    if(text === 'All'){
      this.displayList = text;
    
      this.testIt('');
    }
    else{
      this.displayList = text;
      this.testIt(text);
    }

   
  }

  summeryofCata(){
  
    
    const nameCounts: Map<string, number> = new Map();
    const similarNamesList: {ITEM_CAT:any, count:number,NET_WT:Number,GRWT:Number }[] = [];
    
    for (const item of  this.METAL_DETAILS) {
      const ITEM_CAT = item.ITEM_CAT;
      if (nameCounts.has(ITEM_CAT)) {
        nameCounts.set(ITEM_CAT, nameCounts.get(ITEM_CAT)! + 1);
      } else {
        nameCounts.set(ITEM_CAT, 1);
      }
    }
    
    for (const item of  this.METAL_DETAILS) {
      const ITEM_CAT = item.ITEM_CAT;
      const ID = item.ITEM_CAT;
      if (nameCounts.get(ITEM_CAT)! >= 1) {
        const count = nameCounts.get(ITEM_CAT)!;
      const NET_WT =  (this.METAL_DETAILS
      .filter((obj:any) => obj.ITEM_CAT === ITEM_CAT)
      .reduce((acc:any, obj:any) => Number(acc) + Number(obj.NETWT), 0)).toFixed(3);
      const GRWT =  (this.METAL_DETAILS
      .filter((obj:any) => obj.ITEM_CAT === ITEM_CAT)
      .reduce((acc:any, obj:any) => Number(acc) + Number(obj.GRWT), 0)).toFixed(3);


        similarNamesList.push({ ITEM_CAT, NET_WT ,count,GRWT });
        nameCounts.set(ITEM_CAT, 0); // Set the count to 0 to avoid duplicates in the result
      }
    }
    
    console.log(similarNamesList);
  //  this.CONVERTED_DATA = similarNamesList;
    
  this.filteredLocationList = similarNamesList;
  this.resultCount = this.filteredLocationList.length;


  this.totalCataWt = this.summeryofCataTOTAL();
  this.totalCataPcs = this.summeryofCataPCs();
  
  }

  summeryofCataTOTAL(): number{
    
 
      return this.filteredLocationList.reduce((total:any, item:any) => total + Number(item.NET_WT), 0).toFixed(3);
    
  
  }

  summeryofCataPCs(): number{
    
 
    return this.filteredLocationList.reduce((total:any, item:any) => total + Number(item.count), 0)
  

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
