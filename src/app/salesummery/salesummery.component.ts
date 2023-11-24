import { Component,OnInit } from '@angular/core';
import {SalesummeryService} from '../services/salesummery.service';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import * as moment from 'moment';


@Component({
  selector: 'app-salesummery',
  templateUrl: './salesummery.component.html',
  styleUrls: ['./salesummery.component.scss']
})
export class SalesummeryComponent implements OnInit{


  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  format1 = "YYYY-MM-DD";
  date1 = new Date();
  endDate:any;
  startDate:any;
  Invoice_List:any
  frameOneData:any
  frameTwoData:any
  frame1=false;
  frame2=false;
  frame3=false;
  
  constructor(private saleSummery:SalesummeryService){}
  
  ngOnInit(): void 
   {
    this.fetchDateInput();
   }

  fetchSaleDetails(start_Date:any,end_Date:any){
      
    this.saleSummery.getSalseSummery(start_Date,end_Date).subscribe(
      (data) => {
        console.log(data.data);
        this.Invoice_List = data.data;
        if(this.Invoice_List){
          this.InvoiceSummary();
        }
      },
      (error) => {
        console.error('An error occurred:', error);
        // Handle the error here
      }
    );
  }


  fetchDateInput(){
    if(this.range.value.start != null && this.range.value.end != null){
      this.startDate = moment(this.range.value.start).format(this.format1);
      this.endDate= moment(this.range.value.end).format(this.format1);
      this.fetchSaleDetails(this.startDate,this.endDate);
      console.log(this.startDate,this.endDate);
    }else{
      this.startDate = moment(this.date1).format(this.format1);
      this.endDate = moment(this.date1).format(this.format1);
      this.fetchSaleDetails(this.startDate,this.endDate);
    }
 }
 InvoiceSummary(){
    const nameCounts: Map<string, number> = new Map();
    const similarNamesList: {COMP_NAME:any, LEDGER_NAME:any, count:number,CGST_AMT:Number,SGST_AMT:Number,IGST_AMT:Number,
      INVOICE_AMT:Number,TAXABLE_AMT:Number,T18P_TAXAM:Number,T18P_GSTAM:number, T28P_TAXAM:number, T28P_GSTAM:number,
      MSNAME:any,SMNAME:any,PARTY_CITY:any,GSTIN:any,GST:Number}[] = [];
    
    for (const item of  this.Invoice_List) {
      const COMPNAME = item.COMP_NAME;
      if (nameCounts.has(COMPNAME)) {
        nameCounts.set(COMPNAME, nameCounts.get(COMPNAME)! + 1);
      } else {
        nameCounts.set(COMPNAME, 1);
      }
    }
    
    for (const item of  this.Invoice_List) {
      const COMP_NAME = item.COMP_NAME;
      const LEDGER_NAME = item.LEDGER_NAME;
      const PARTY_CITY = item.PARTY_CITY;
      const GSTIN = item.GSTIN;
      const MSNAME = item.MKTSTAFF_NAME;
      const SMNAME = item.SALESMAN_NAME;
      if (nameCounts.get(COMP_NAME)! >= 1) {
      const count = nameCounts.get(COMP_NAME)!;
      const IGST_AMT =  (this.Invoice_List
          .filter((obj:any) => obj.COMP_NAME === COMP_NAME)
          .reduce((acc:any, obj:any) => Number(acc) + Number(obj.IGST_AMT), 0)).toFixed(2);
      const CGST_AMT =  (this.Invoice_List
          .filter((obj:any) => obj.COMP_NAME === COMP_NAME)
          .reduce((acc:any, obj:any) => Number(acc) + Number(obj.CGST_AMT), 0)).toFixed(2);
      const SGST_AMT =  (this.Invoice_List
          .filter((obj:any) => obj.COMP_NAME === COMP_NAME)
          .reduce((acc:any, obj:any) => Number(acc) + Number(obj.SGST_AMT), 0)).toFixed(2);
      const TAXABLE_AMT =  (this.Invoice_List
          .filter((obj:any) => obj.COMP_NAME === COMP_NAME)
          .reduce((acc:any, obj:any) => Number(acc) + Number(obj.TAXABLE_AMT), 0)).toFixed(2);
      const INVOICE_AMT =  (this.Invoice_List
          .filter((obj:any) => obj.COMP_NAME === COMP_NAME)
          .reduce((acc:any, obj:any) => Number(acc) + Number(obj.INVOICE_AMT), 0)).toFixed(2);
      const T18P_TAXAM =  (this.Invoice_List
          .filter((obj:any) => obj.COMP_NAME === COMP_NAME)
          .reduce((acc:any, obj:any) => Number(acc) + Number(obj.T18P_TAXAM), 0)).toFixed(2);
      const T18P_GSTAM =  (this.Invoice_List
          .filter((obj:any) => obj.COMP_NAME === COMP_NAME)
          .reduce((acc:any, obj:any) => Number(acc) + Number(obj.T18P_GSTAM), 0)).toFixed(2);
      const T28P_TAXAM =  (this.Invoice_List
          .filter((obj:any) => obj.COMP_NAME === COMP_NAME)
          .reduce((acc:any, obj:any) => Number(acc) + Number(obj.T28P_TAXAM), 0)).toFixed(2);
      const T28P_GSTAM =  (this.Invoice_List
          .filter((obj:any) => obj.COMP_NAME === COMP_NAME)
          .reduce((acc:any, obj:any) => Number(acc) + Number(obj.T28P_GSTAM), 0)).toFixed(2);
      const GST = Number(SGST_AMT) + Number(CGST_AMT) + Number(IGST_AMT);

      //const GST = Number(SGST) + Number(CGST) + Number(IGST);
       
        similarNamesList.push({ COMP_NAME, LEDGER_NAME, PARTY_CITY, GSTIN, MSNAME, SMNAME, count,IGST_AMT, CGST_AMT , SGST_AMT, TAXABLE_AMT, INVOICE_AMT, 
          T18P_TAXAM, T18P_GSTAM, T28P_TAXAM, T28P_GSTAM, GST});
        nameCounts.set(COMP_NAME, 0); // Set the count to 0 to avoid duplicates in the result
      }
    }
    console.log(similarNamesList);
    this.frameOneData = similarNamesList;
    this.FrameDisplayHandler('Frame1');
  }

  InvoiceDetail(SALE_INV:any){
    const VCH_NO = SALE_INV;
    console.log(VCH_NO)
    const foundObject = this.Invoice_List.find((item:any) => item.VCH_NO === VCH_NO);
    const similarNamesList: {VCHNO:any, LEDGER_NAME:any, CGST_AMT:Number,SGST_AMT:Number,
      INVOICE_AMT:Number,TAXABLE_AMT:Number,T18P_TAXAM:Number,T18P_GSTAM:number, T28P_TAXAM:number, T28P_GSTAM:number,IGST_AMT:Number,
      MS_NAME:any, SM_NAME:any, PARTY_CITY:any, GSTIN:any, GST:Number}[] = [];
    
    if (foundObject) {
      console.log("Object found:", foundObject);
      const VCHNO = SALE_INV;
      const LEDGER_NAME = foundObject.LEDGER_NAME;
      const PARTY_CITY = foundObject.PARTY_CITY;
      const GSTIN = foundObject.GSTIN;
      const SM_NAME = foundObject.SALESMAN_NAME;
      const MS_NAME = foundObject.MKTSTAFF_NAME;
      const SGST_AMT = Number(foundObject.SGST_AMT.toFixed(2));
      const CGST_AMT = Number(foundObject.CGST_AMT.toFixed(2));
      const IGST_AMT = Number(foundObject.IGST_AMT.toFixed(2));
      const GST = CGST_AMT + SGST_AMT + IGST_AMT;
      const TAXABLE_AMT = Number(foundObject.TAXABLE_AMT.toFixed(2));
      const INVOICE_AMT = Number(foundObject.INVOICE_AMT.toFixed(2));
      const T18P_TAXAM = Number(foundObject.T18P_TAXAM.toFixed(2));
      const T18P_GSTAM = Number(foundObject.T18P_GSTAM.toFixed(2));
      const T28P_TAXAM = Number(foundObject.T28P_TAXAM.toFixed(2));
      const T28P_GSTAM = Number(foundObject.T28P_GSTAM.toFixed(2));
      similarNamesList.push({ VCHNO, LEDGER_NAME, TAXABLE_AMT, IGST_AMT, CGST_AMT ,SGST_AMT, INVOICE_AMT, MS_NAME, SM_NAME, 
        PARTY_CITY, GSTIN, T18P_TAXAM, T18P_GSTAM, T28P_TAXAM, T28P_GSTAM, GST});
        this.frameTwoData = similarNamesList;
        this.FrameDisplayHandler('Frame3');
           
    } else {
      console.log("Object not found.");
    }
  }

  FrameDisplayHandler(CurFrame:any){
    if(CurFrame == 'Frame1'){
      this.frame1 = true;
      this.frame2 = false;
      this.frame3 = false;
    }
    else if(CurFrame == 'Frame2'){
      this.frame3 = false;
      this.frame1 = false;
      this.frame2 = true;
    }
    else if(CurFrame == 'Frame3'){
      this.frame3 = true;
      this.frame1 = false;
      this.frame2 = false;
    }
    else{
      this.frame3 = false;
      this.frame1 = false;
      this.frame2 = false;
    }
  }

}
