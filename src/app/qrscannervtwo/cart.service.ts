import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject} from 'rxjs';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsx: any[] = [];

  

  private countData = new BehaviorSubject<Number>(0);
  count$ = this.countData.asObservable();
    USERNAME: string | null | undefined;
    COMPANY_NAME: string | null | undefined;


  constructor() {
    
    // Retrieve cart items from local storage when the service is initialized
    const savedCart = localStorage.getItem('cartx');
    if (savedCart) {
      this.cartItemsx = JSON.parse(savedCart);
    }

   
  }

  getCartItems(): any[] {
    return this.cartItemsx;
  }

  addToCart(item: any): void {
    this.USERNAME = sessionStorage.getItem('username');
    this.COMPANY_NAME = sessionStorage.getItem('company_name');
    const format1 = "YYYY-MM-DD HH:mm:ss";
    var date2 = new Date();
    var dateTime1 = moment(date2).format(format1);
    const objectToPush = item;
    item["SOLD_BY"] = this.USERNAME;
    item["COMPANY_NAME"] = this.COMPANY_NAME;
    this.cartItemsx.push({
        ADD_DATE:dateTime1,
        BARCODE:objectToPush.BARCODE,
        BCNO:objectToPush.BCNO,
        CGST:objectToPush.CGST,
        COMPANY_NAME:objectToPush.COMPANY_NAME,
        COMP_ID:objectToPush.COMP_ID,
        COMP_NAME:objectToPush.COMP_NAME,
        GROSS_VALUE:objectToPush.GROSS_VALUE,
        HUID:objectToPush.HUID,
        ID:objectToPush.ID,
        ITEM_CAT:objectToPush.ITEM_CAT,
        ITEM_MRP:objectToPush.ITEM_MRP,
        ITEM_NAME:objectToPush.ITEM_NAME,
        MAKING_CHARGES:objectToPush.MAKING_CHARGES,
        MAKING_RATE:objectToPush.MAKING_RATE,
        MC_CODE:objectToPush.MC_CODE,
        METAL_PRICE:objectToPush.METAL_PRICE,
        METAL_TOTAL_VALUE:objectToPush.METAL_TOTAL_VALUE,
        MET_PUR:objectToPush.MET_PUR,
        MET_TYPE:objectToPush.MET_TYPE,
        NETWT:objectToPush.NETWT,
        NET_VALUE:objectToPush.NET_VALUE,
        OT_CHGS:objectToPush.OT_CHGS,
        PCS:objectToPush.PCS,
        SALE_DATE:objectToPush.SALE_DATE,
        SALE_INV:objectToPush.SALE_INV,
        SALE_VALUE:objectToPush.SALE_VALUE,
        SGST:objectToPush.SGST,
        SH_NO:objectToPush.SH_NO,
        SOLD_BY:objectToPush.SOLD_BY,
        STA:objectToPush.STA,
        SUP_NAME:objectToPush.SUP_NAME,
        SZ:objectToPush.SZ,
      });
  
    this.saveCart();
  }

  removeFromCart(index: number): void {
    this.cartItemsx.splice(index, 1);
    this.saveCart();
  }

  clearCart(): void {
    this.cartItemsx = [];
    this.saveCart();
  }

  getCartCount(){
   
    this.countData.next(this.cartItemsx.length);
    
    //return of(this.cartItemsx.length);
  }



  private saveCart(): void {
    this.getCartCount();
    localStorage.setItem('cartx', JSON.stringify(this.cartItemsx));
  }
}