import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IndexedDBServicesService} from '../index-db/indexed-db.services.service';

@Component({
  selector: 'app-itemsummery',
  templateUrl: './itemsummery.component.html',
  styleUrls: ['./itemsummery.component.scss']
})
export class ItemsummeryComponent {
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



  displayList = "ITEM";

  display = "none";
  totalCataWt: number = 0;
  totalCataPcs = 0;

  title = "ITEMS";

  kuchBe:any;


  constructor(private http: HttpClient,private indexedDBService:IndexedDBServicesService) { }


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
           return obj.ITEM_NAME.toLowerCase().includes(input.toLowerCase());
        }
        else{
          return obj.ITEM_NAME === input;
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
      if (!uniqueSet.has(file.ITEM_NAME)) {
        uniqueSet.add(file.ITEM_NAME);
        this.item_description.push(file.ITEM_NAME);
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
    const similarNamesList: {ITEM_NAME:any, count:number,NET_WT:Number,GRWT:Number }[] = [];
    
    for (const item of  this.METAL_DETAILS) {
      const ITEM_NAME = item.ITEM_NAME;
      if (nameCounts.has(ITEM_NAME)) {
        nameCounts.set(ITEM_NAME, nameCounts.get(ITEM_NAME)! + 1);
      } else {
        nameCounts.set(ITEM_NAME, 1);
      }
    }
    
    for (const item of  this.METAL_DETAILS) {
      const ITEM_NAME = item.ITEM_NAME;
      const ID = item.ITEM_NAME;
      if (nameCounts.get(ITEM_NAME)! >= 1) {
        const count = nameCounts.get(ITEM_NAME)!;
      const NET_WT =  (this.METAL_DETAILS
      .filter((obj:any) => obj.ITEM_NAME === ITEM_NAME)
      .reduce((acc:any, obj:any) => Number(acc) + Number(obj.NETWT), 0)).toFixed(3);
      const GRWT =  (this.METAL_DETAILS
      .filter((obj:any) => obj.ITEM_NAME === ITEM_NAME)
      .reduce((acc:any, obj:any) => Number(acc) + Number(obj.GRWT), 0)).toFixed(3);


        similarNamesList.push({ ITEM_NAME, NET_WT ,count,GRWT });
        nameCounts.set(ITEM_NAME, 0); // Set the count to 0 to avoid duplicates in the result
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

  



  syncLink(){
    this.loadingProcess = true;
    this.USERNAME = sessionStorage.getItem('username');
    this.COMPANY_NAME = sessionStorage.getItem('company_name');
    localStorage.removeItem('stockList');
    var req = {
      "COMPANY_NAME": this.COMPANY_NAME,
      "USER_ID": this.USERNAME
    }
    this.http.post('https://qrscan.kratuinfotech.in/V1/getstock', req).subscribe((data: any) => {
      localStorage.setItem('stockList', JSON.stringify(data));
      this.displayList = "ITEM";
     this.testIt('');
      this.loadingProcess = false;
    }, err => {
      console.log(err);
      // check error status code is 500, if so, do some action
    })
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
