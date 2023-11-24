import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{

  loadingProcess = true;
  error_screen=false;
  searchText='';
  resultCount:Number=0;

  USERNAME :any;
  COMPANY_NAME:any;
  cart_list_data:any;
  CART_HISTORY_DETAILS:any;

  filteredLocationList:any;

  CONVERTED_DATA:any;

 
  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.loadingProcess =false;

    this.getcartHistory();
   
  }

  

  getcartHistory(){
   
      this.loadingProcess = true;
      this.USERNAME = sessionStorage.getItem('username');
      this.COMPANY_NAME = sessionStorage.getItem('company_name');
      localStorage.removeItem('cartList');
      var req = {
        "COMPANY_NAME": this.COMPANY_NAME,
        "USER_ID": this.USERNAME
      }
      this.http.post('https://qrscan.kratuinfotech.in/V1/getcartlisthist', req).subscribe((data: any) => {
        if(data.messgae != 'no data available!'){
        localStorage.setItem('cartList', JSON.stringify(data));
        this.retrivecartFromLocalStorage();
        this.showListIntable();
        this.loadingProcess = false;
        }
        else{
          this.error_screen = true;
          this.loadingProcess = false;
        }
        
      }, err => {
        console.log(err);
      })
    
  }

  public retrivecartFromLocalStorage() {
    this.cart_list_data = localStorage.getItem('cartList');
    this.loadingProcess = false;
    return JSON.parse(this.cart_list_data );

  }

  showListIntable(){
    this.CART_HISTORY_DETAILS = this.retrivecartFromLocalStorage().data;
    console.log(this.CART_HISTORY_DETAILS)
   
    //this.resultCount = this.CART_HISTORY_DETAILS.length;

    this.findtheSimilar();
  }

  findtheSimilar(){
  
    
    const nameCounts: Map<string, number> = new Map();
    const similarNamesList: { CHL_NO:any, CUST_NAME:any, ID:any, count:number,totalPrice:Number,NET_WT:Number }[] = [];
    
    for (const item of  this.CART_HISTORY_DETAILS) {
      const CHL_NO = item.CHL_NO;
      if (nameCounts.has(CHL_NO)) {
        nameCounts.set(CHL_NO, nameCounts.get(CHL_NO)! + 1);
      } else {
        nameCounts.set(CHL_NO, 1);
      }
    }
    
    for (const item of  this.CART_HISTORY_DETAILS) {
      const CHL_NO = item.CHL_NO;
      const CUST_NAME = item.CUST_NAME;
      const ID = item.ID;
      if (nameCounts.get(CHL_NO)! >= 1) {
        const count = nameCounts.get(CHL_NO)!;
        const totalPrice =  this.CART_HISTORY_DETAILS
      .filter((obj:any) => obj.CHL_NO === CHL_NO)
      .reduce((acc:any, obj:any) => Number(acc) + Number(obj.GROSS_VALUE), 0);
      const NET_WT =  this.CART_HISTORY_DETAILS
      .filter((obj:any) => obj.CHL_NO === CHL_NO)
      .reduce((acc:any, obj:any) => Number(acc) + Number(obj.NET_WT), 0);
        similarNamesList.push({  CHL_NO, CUST_NAME, ID, totalPrice, NET_WT ,count });
        nameCounts.set(CHL_NO, 0); // Set the count to 0 to avoid duplicates in the result
      }
    }
    
    console.log(similarNamesList);
   this.CONVERTED_DATA = similarNamesList;
    
    this.filteredLocationList = similarNamesList;
    this.resultCount = this.filteredLocationList.length;
  
  }

  filterResults(text: any) {
    //console.log
  
    if (!text) {
    
    }

    this.filteredLocationList =  this.CONVERTED_DATA.filter(
      (METAL_DETAILS:any) => 
      METAL_DETAILS?.CHL_NO.toLowerCase().includes(text.toLowerCase().trim()) 
      // || METAL_DETAILS?.MC_CODE.toLowerCase().includes(text.toLowerCase().trim())
      // || METAL_DETAILS?.MET_TYPE.toLowerCase().includes(text.toLowerCase().trim())
      // || METAL_DETAILS?.MET_PUR.toLowerCase().includes(text.toLowerCase().trim())
      // || METAL_DETAILS?.ITEM_CAT.toLowerCase().includes(text.toLowerCase().trim())
      // || METAL_DETAILS?.ITEM_NAME.toLowerCase().includes(text.toLowerCase().trim())
      // || METAL_DETAILS?.NETWT.toLowerCase().includes(text.toLowerCase().trim())
     
      
    );

    this.resultCount = this.filteredLocationList.length;
  }





}
