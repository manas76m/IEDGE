import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ScannerQRCodeConfig, NgxScannerQrcodeService, ScannerQRCodeSelectedFiles, ScannerQRCodeResult, NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { productInfo } from '../productInfo';
import { StockList } from './stockListmodel';
import { TokenGeneratorService } from './tokengenerator.service';
import { CartService } from './cart.service';
import {IndexedDBServicesService} from '../index-db/indexed-db.services.service';
import {QueryServerService} from '../services/query-server.service';

import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  ActivatedRoute
} from '@angular/router';



@Component({
  selector: 'app-qrscannervtwo',
  templateUrl: './qrscannervtwo.component.html',
  styleUrls: ['./qrscannervtwo.component.scss']
})
export class QrscannervtwoComponent implements AfterViewInit {


  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#front_and_back_camera
  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth
      },
    },
    // canvasStyles: [
    //   {
    //     lineWidth: 1,
    //     fillStyle: '#00950685',
    //     strokeStyle: '#00950685',
    //   },
    //   {
    //     font: '17px serif',
    //     fillStyle: '#ff0000',
    //     strokeStyle: '#ff0000',
    //   }
    // ],
  };

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];

  syncData = true;

  metalPriceData: any;

  metalRateTodayAtMyStatePerGram = 0;
  cgstRate = 1.50;
  sgstRate = 1.50;
  igstRate = 3;
  discount_error_indicator = 'rgb(253, 253, 253)';
  maxDiscountRateOvermakingCharges = 50;
  // discountValue: any;
  initialDiscount = 0;

  dynamicMakingCharges = 0;
  dynamicNetValue = 0;
  dynamicGrossValue = 0;
  dynamicCgst = 0;
  dynamicSgst = 0;
  dynamicMakingRate = 0;

  colorBtnBg = "orange";



  format1 = "YYYY-MM-DD HH:mm:ss";
  date1 = new Date();
  dateTime1 = moment(this.date1).format(this.format1);
  info_pop_up = false;
  info_pop_up_data_not_found = false;


  stock_list_data: any;

  show_stock_data: any;
  find_product_data: any;

  stockList = new StockList;
  open_canvas = false;
  showScanner = false;
  scannerValue: any;
  get_metal_data_from_local_storage: any;
  find_the_price_of_the_metal: any;
  show_metal_price: any;

  USERNAME: any;
  COMPANY_NAME: any;
  MAKING_DATA: any;
  NETVALUE: any;
  ENABLE_CART:any;
  cart_items_count:any;

  discountValue:Number = 0;

  addButton=false;

  RETIVEDATAFROMDEVIDEMEMEORY:any

 key:any;

 intervalId: any;
 isIntervalRunning = false;




  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  
  constructor(private qrcode: NgxScannerQrcodeService, private http: HttpClient, private tokenGeneratorService: TokenGeneratorService,private cartService: CartService,
    private indexedDBService :IndexedDBServicesService,
    private router:Router,
    private route: ActivatedRoute,
    private  queryServerService:QueryServerService
    ) {

      // this.route.queryParams.subscribe(params => {
      //   const keyword = params['keyword']; // 'keyword' should match the query parameter name.
      //   // Use the 'keyword' query parameter in your component.
      //   //console.log(keyword + "jdkdjfh")
      //   this.scannerValue = keyword;
      //   //this.getInputValueforScanner(keyword);
      // });

   }



  ngOnInit(): void {
    this.retriveTheMetalPriceDataFromLocalStorage();
    this.getTheCredential();  
    this.cartService.getCartCount();
   
      // alert(this.key)
      //this.getInfo(this.key);

      if(sessionStorage.getItem('BARCODE')){
        this.scannerValue = sessionStorage.getItem('BARCODE');
        sessionStorage.removeItem('BARCODE');
        // this.scannerValue = " ";
      }
     
  }

  moveIt(){
    this.router.navigate(['/optima']);
  }

  ngAfterViewInit(): void {
    // this.action.isReady.subscribe((res: any) => {
    //   this.handle(this.action, 'start');
    // });
  }

  public getTheCredential() {
    this.USERNAME = sessionStorage.getItem('username');
    this.COMPANY_NAME = sessionStorage.getItem('company_name');
    this.ENABLE_CART =  sessionStorage.getItem('enable_cart');

    this.getStockList();
    this.getMetalPriceList();
    this.getMakingData();
    this.syncData = false;
  }



  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    // e && action && action.pause();
    console.log(e);

    if (this.getInfo(e) == true) {
      // action.stop();
      this.showScannerController();
    }

    // alert(e)
  }

  public handle(action: any, fn: string): void {
    // Fix issue #27, #29
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r));
      // action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }


  public onGetConstraints() {
    const constrains = this.action.getConstraints();
    console.log(constrains);
  }

  public applyConstraints() {
    const constrains = this.action.applyConstraints({
      ...this.action.getConstraints(),
      width: 510
    });
    console.log(constrains);
  }
  
  public getInfo(infoEvent: any) {
    let returnVal = false;
   
    if (infoEvent[0].value != null) {
      returnVal = true;
      this.findStockInfo(infoEvent[0].value);
    }
    else{
      returnVal = false;
    }
    return returnVal
  }





  public retriveTheMetalPriceDataFromLocalStorage() {
    this.get_metal_data_from_local_storage = localStorage.getItem('stockMetalPrice');
    if (this.get_metal_data_from_local_storage) {
      this.metalPriceData = JSON.parse(this.get_metal_data_from_local_storage);
      return this.metalPriceData;
    }
    else {
      return " ";
    }

  }

  public getMetalRatePerGram(iPure: any) {
    this.find_the_price_of_the_metal = this.retriveTheMetalPriceDataFromLocalStorage().data;//DESCP
    //console.log(this.find_the_price_of_the_metal);
    if (this.find_the_price_of_the_metal) {
      this.metalRateTodayAtMyStatePerGram = this.find_the_price_of_the_metal.find((show: any) => show.DESCP == iPure);
      if (this.metalRateTodayAtMyStatePerGram) {
        this.show_metal_price = this.metalRateTodayAtMyStatePerGram;
        return Number(this.show_metal_price.PRICE);
      }
      else {
        return 0;
      }
    }
    else {
      return 0;
    }


  }


  public getMakingData() {
    var url = 'https://qrscan.kratuinfotech.in/V1/getmcratefml2';
    var req = {
      "USER_ID": this.USERNAME,
      "COMPANY_NAME": this.COMPANY_NAME
    }
    this.http.post(url, req).subscribe((data: any) => {
      if (data.data) {
        localStorage.setItem('stockMakingData', JSON.stringify(data));
      }
      else {
        localStorage.removeItem('stockMakingData');
      }
    }, err => {
      //this.error_screen = true;
      console.log(err);
    })
  }












  public infoPopupClose() {
    if (this.info_pop_up == true) {
      this.info_pop_up = false;
      this.scannerValue = "";
    }
  }



  public showScannerController() {
    if (this.showScanner == false) {
      this.showScanner = true;
    }
    else {
      this.showScanner = false;
      this.handle(this.action, 'stop');
    }
  }

  public getInputValueforScanner(Value: any) {
    console.log(Value+"------------");
    if (Value) {
    
      var val = Value.toUpperCase();
      console.log(val+"-----s-------");
      this.findStockInfo(val);
    }
    else {
      this.info_pop_up_data_not_found = true;
      this.info_pop_up = true;
      setTimeout(() => {
        this.infoPopupClose();
        this.info_pop_up_data_not_found = false;
      }, 3000)
    }

  }

  public getMetalPriceList() {
    var req = {
      "COMPANY_NAME": this.COMPANY_NAME,
      "USER_ID": this.USERNAME
    }

    this.http.post('https://qrscan.kratuinfotech.in/V1/getmetalrate', req).subscribe((data: any) => {
      if (data.data) {
        localStorage.setItem('stockMetalPrice', JSON.stringify(data));
      }
      else {
        localStorage.removeItem('stockMetalPrice');
      }

    }, err => {
      console.log(err);
      // check error status code is 500, if so, do some action
    })
  }


  async getStockList() {
    const data = await this.indexedDBService.getAllData();
    this.RETIVEDATAFROMDEVIDEMEMEORY = data
    // this.indexedDBService.getAllData().then((data:any) => {
    //   console.log(data);
    //   this.RETIVEDATAFROMDEVIDEMEMEORY = data;
    //   //return data;
    
    // });
    // var req = {
    //   "COMPANY_NAME": this.COMPANY_NAME,
    //   "USER_ID": this.USERNAME
    // }
    // this.http.post('https://qrscan.kratuinfotech.in/V1/getstock', req).subscribe((data: any) => {
    //   //localStorage.setItem('stockList', JSON.stringify(data));

    // }, err => {
    //   console.log(err);
    //   // check error status code is 500, if so, do some action
    // })
  }


  public retriveStockFromLocalStorage() {
    //this.stock_list_data = localStorage.getItem('stockList');
    this.stock_list_data = this.RETIVEDATAFROMDEVIDEMEMEORY;
    //console.log('retrievedObject: ', JSON.parse(this.stock_list_data));
   // return JSON.parse(this.stock_list_data);
    return  this.stock_list_data ;
  }
  



  public findStockInfo(barcodeId: any) {
    let val = false;
    console.log(barcodeId +"------------sssss")
    //this.find_product_data = this.retriveStockFromLocalStorage().data;
    
   this.find_product_data = this.retriveStockFromLocalStorage();
    // console.log(this.find_product_data);
    this.show_stock_data = this.find_product_data.find((show: any) => show.BARCODE == barcodeId);
    if (this.show_stock_data) {
      this.showStockInfo(this.show_stock_data)
      this.info_pop_up = true;
      val = true;
      return val;
    }
    else {
      this.info_pop_up_data_not_found = true;
      this.info_pop_up = true;
      setTimeout(() => {
        this.infoPopupClose();
        this.info_pop_up_data_not_found = false;
      }, 3000)
      return val;
    }
  }


  public showStockInfo(stockData: any) {


    this.stockList.ID = stockData.ID;
    this.stockList.COMP_NAME = stockData.COMP_NAME;
    this.stockList.COMP_ID = stockData.COMP_ID;
    this.stockList.BARCODE = stockData.BARCODE;
    this.stockList.BCNO = stockData.BCNO;
    this.stockList.ADD_DATE = stockData.ADD_DATE;
    this.stockList.GRWT = parseFloat(stockData.GRWT);
    this.stockList.HCODE = stockData.HCODE;
    this.stockList.HUID = stockData.HUID;
    this.stockList.ITEM_CAT = stockData.ITEM_CAT;
    this.stockList.ITEM_MRP = stockData.ITEM_MRP;
    this.stockList.ITEM_NAME = stockData.ITEM_NAME;
    this.stockList.MC_CODE = stockData.MC_CODE;
    this.stockList.MET_PUR = stockData.MET_PUR;
    this.stockList.MET_TYPE = stockData.MET_TYPE;
    this.stockList.NETWT = parseFloat(stockData.NETWT);
    this.stockList.OT_CHGS = parseFloat(stockData.OT_CHGS);
    this.stockList.PCS = stockData.PCS;
    this.stockList.SALE_DATE = stockData.SALE_DATE;
    this.stockList.SALE_INV = stockData.SALE_INV;
    this.stockList.SALE_VALUE = stockData.SALE_VALUE;
    this.stockList.SH_NO = stockData.SH_NO;
    this.stockList.STA = stockData.STA;
    this.stockList.SUP_NAME = stockData.SUP_NAME;
    this.stockList.SZ = stockData.SZ;

    //will get metalprice through the desc MET_PUR
    this.stockList.METAL_PRICE = Number(this.getMetalRatePerGram(this.stockList.MET_PUR));
    this.stockList.METAL_TOTAL_VALUE = Number(this.stockList.NETWT) * Number(this.stockList.METAL_PRICE);
    this.stockList.MAKING_RATE = Number(this.MakingCharges(this.stockList.MC_CODE, this.stockList.NETWT, this.stockList.METAL_PRICE).toFixed(2));
    this.stockList.DISCMAKING_RATE = Number(this.DiscMakingCharges(this.stockList.MC_CODE, this.stockList.NETWT, this.stockList.METAL_PRICE).toFixed(2));//ok

    console.log(this.stockList)


    if (sessionStorage.getItem('calc_type') == 'PERCENT') {
      this.stockList.MAKING_CHARGES = Number(this.stockList.MAKING_RATE) * Number(this.stockList.NETWT);
      this.stockList.DISCMAKING_CHARGES = Number(this.stockList.DISCMAKING_RATE) * Number(this.stockList.NETWT);
    }
    else {
      if (Number(this.stockList.NETWT) < 1) {
        this.stockList.MAKING_CHARGES = Number(this.stockList.MAKING_RATE);
        this.stockList.DISCMAKING_CHARGES = Number(this.stockList.DISCMAKING_RATE);
      }
      else {
        this.stockList.MAKING_CHARGES = Number(this.stockList.MAKING_RATE) * Number(this.stockList.NETWT);
        this.stockList.DISCMAKING_CHARGES = Number(this.stockList.DISCMAKING_RATE) * Number(this.stockList.NETWT);
      }

    }
    //this.stockList.MAKING_CHARGES = Number(this.stockList.MAKING_RATE) * Number(this.stockList.NETWT);
    this.stockList.NET_VALUE = Number(this.NetValue(this.stockList.METAL_TOTAL_VALUE, this.stockList.MAKING_CHARGES, this.stockList.OT_CHGS).toFixed(2));
    this.stockList.CGST = this.cgstCal(this.stockList.NET_VALUE);
    this.stockList.SGST = this.sgstCal(this.stockList.NET_VALUE);
    this.stockList.GROSS_VALUE = Number(this.GrossValue(this.stockList.NET_VALUE, this.stockList.CGST, this.stockList.SGST));
    //this.MakingCharges(this.stockList.MC_CODE);
    //console.log(this.stockList);

    this.stockList.DISCNET_VALUE = Number(this.NetValue(this.stockList.METAL_TOTAL_VALUE, this.stockList.DISCMAKING_CHARGES, this.stockList.OT_CHGS).toFixed(2));
    this.stockList.DISCCGST = Number(this.cgstCal(this.stockList.DISCNET_VALUE).toFixed(2));
    this.stockList.DISCSGST = Number(this.sgstCal(this.stockList.DISCNET_VALUE).toFixed(2));
    this.stockList.DISCGROSS_VALUE = Number(this.GrossValue(this.stockList.DISCNET_VALUE, this.stockList.DISCCGST, this.stockList.DISCSGST));
    this.discountValue = this.stockList.GROSS_VALUE;
  }

  public cgstCal(netVal: any) {
    return Number(((Number(netVal) * this.cgstRate) / 100).toFixed(2));
  }

  public sgstCal(netVal: any) {
    return Number(((Number(netVal) * this.sgstRate) / 100).toFixed(2));
  }

  public NetValue(metalTotalValue: Number, metalTotalCharges: Number, metalOthersCharges: Number) {
    return this.NETVALUE = Number(metalTotalValue) + Number(metalTotalCharges) + Number(metalOthersCharges);
  }

  public GrossValue(grossValue: any, SGST: Number, CGST: Number) {
    return Number(grossValue + SGST + CGST).toFixed(2);
  }

  public retriveMakingChargesRate(MC_CODE: any) {
    this.MAKING_DATA = localStorage.getItem('stockMakingData');
    if (this.MAKING_DATA) {
      var find_making_data = JSON.parse(this.MAKING_DATA).data;
      var get_the_mc_data = find_making_data.find((show: any) => show.MC_CODE == MC_CODE);
      return get_the_mc_data;
    }
    else {
      return 0;
    }

  }

  public MakingCharges(makingCode: any, netWt: any, metalPrice: any) {

    var mcRate_data = this.retriveMakingChargesRate(makingCode);
    // console.log(mcRate_data.MC_RATE);

    if (mcRate_data != 0 && sessionStorage.getItem('calc_type') == 'PERCENT') {
      var mc_Rate = parseFloat(mcRate_data.MC_RATE);
      var DEF_RATE = parseFloat(mcRate_data.DEF_RATE);
      var net_wt = parseFloat(netWt);
      // console.log(net_wt)
      var ADD_EXTRA = 0;
      var metal_price_per_gm = parseFloat(metalPrice);
      if (net_wt < 1) {
        return mc_Rate;
      }
      else if (net_wt <= 0.5) {
        ADD_EXTRA = 19;
        return (metal_price_per_gm) * (DEF_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 0.5 && net_wt <= 0.8) {
        ADD_EXTRA = 17;
        return (metal_price_per_gm) * (DEF_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 0.8 && net_wt <= 1) {
        ADD_EXTRA = 15;
        return (metal_price_per_gm) * (DEF_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 1 && net_wt <= 1.2) {
        ADD_EXTRA = 10;
        return (metal_price_per_gm) * (DEF_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt >= 1.5 && net_wt <= 2) {
        ADD_EXTRA = 5;
        return (metal_price_per_gm) * (DEF_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 2 && net_wt <= 3) {
        ADD_EXTRA = 4;
        return (metal_price_per_gm) * (DEF_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 3 && net_wt <= 4.5) {
        ADD_EXTRA = 3;
        return (metal_price_per_gm) * (DEF_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 4.5 && net_wt <= 9.5) {
        ADD_EXTRA = 2;
        return (metal_price_per_gm) * (DEF_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 9.5 && net_wt <= 13) {
        ADD_EXTRA = 1;
        return (metal_price_per_gm) * (DEF_RATE + ADD_EXTRA) / 100;
      }
      else {
        ADD_EXTRA = 0;
        return (metal_price_per_gm) * (DEF_RATE + ADD_EXTRA) / 100;
      }
    }
    else if (mcRate_data != 0) {
      var mc_Rate = parseFloat(mcRate_data.MC_RATE);
      var DEF_RATE = parseFloat(mcRate_data.DEF_RATE);
      var net_wt = parseFloat(netWt);
      var metal_price_per_gm = parseFloat(metalPrice);
      if (net_wt < 1) {
        return mc_Rate;
      }
      else {
        // return (net_wt) * (mc_Rate);
        return mc_Rate;
      }
    }
    else {
      return 0;
    }
  }

  public DiscMakingCharges(makingCode: any, netWt: any, metalPrice: any) {

    var mcRate_data = this.retriveMakingChargesRate(makingCode);
    if (mcRate_data != 0 && sessionStorage.getItem('calc_type') == 'PERCENT') {
      var DISC_MC_Rate = parseFloat(mcRate_data.DISC_MC);
      var DISC_RATE = parseFloat(mcRate_data.DISC_RATE1);
      var net_wt = parseFloat(netWt);
      // console.log(net_wt)
      var ADD_EXTRA = 0;
      var metal_price_per_gm = parseFloat(metalPrice);
     if (net_wt <= 0.5) {
        ADD_EXTRA = 19;
        return (metal_price_per_gm) * (DISC_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 0.5 && net_wt <= 0.8) {
        ADD_EXTRA = 17;
        return (metal_price_per_gm) * (DISC_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 0.8 && net_wt <= 1) {
        ADD_EXTRA = 15;
        return (metal_price_per_gm) * (DISC_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 1 && net_wt <= 1.2) {
        ADD_EXTRA = 10;
        return (metal_price_per_gm) * (DISC_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt >= 1.5 && net_wt <= 2) {
        ADD_EXTRA = 5;
        return (metal_price_per_gm) * (DISC_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 2 && net_wt <= 3) {
        ADD_EXTRA = 4;
        return (metal_price_per_gm) * (DISC_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 3 && net_wt <= 4.5) {
        ADD_EXTRA = 3;
        return (metal_price_per_gm) * (DISC_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 4.5 && net_wt <= 9.5) {
        ADD_EXTRA = 2;
        return (metal_price_per_gm) * (DISC_RATE + ADD_EXTRA) / 100;
      }
      else if (net_wt > 9.5 && net_wt <= 13) {
        ADD_EXTRA = 1;
        return (metal_price_per_gm) * (DISC_RATE + ADD_EXTRA) / 100;
      }
      else {
        ADD_EXTRA = 0;
        return (metal_price_per_gm) * (DISC_RATE + ADD_EXTRA) / 100;
      }
    }
    else if (mcRate_data != 0) {
      var DISC_MC_Rate = parseFloat(mcRate_data.DISC_MC);
      var net_wt = parseFloat(netWt);
      if (net_wt < 1) {
        return DISC_MC_Rate;
      }
      else {
        return DISC_MC_Rate;
      }
    }
    else {
      return 0;
    }
  }

  dynamciCalc(){
  
    var cgst = Number(this.cgstRate);
    let DiscNet_Value = (Number(this.discountValue)*100)/(Number(cgst)*2+100);
    this.stockList.NET_VALUE = Number(DiscNet_Value.toFixed(2));
    this.stockList.CGST = Number(((DiscNet_Value * this.cgstRate) / 100).toFixed(2));
    this.stockList.SGST = Number(((DiscNet_Value* this.sgstRate) / 100).toFixed(2))
    let DiscMakingChg=Number(DiscNet_Value - Number(this.stockList.METAL_TOTAL_VALUE) - Number(this.stockList.OT_CHGS)).toFixed(2)
    this.stockList.MAKING_CHARGES=parseFloat(DiscMakingChg);
    let MCRATE=Number(DiscMakingChg) / Number(this.stockList.NETWT);
    this.stockList.MAKING_RATE = Number(MCRATE.toFixed(2));
    if(this.discountValue >= this.stockList.DISCGROSS_VALUE){
      this.addButton =false;
      this.colorBtnBg = "Orange";
    }
    else{
      this.addButton = true;
      this.colorBtnBg = "red";
      //alert("Final value cannot be less than Discount value!!");
    }
    console.log(this.stockList.DISCGROSS_VALUE);
  }

  enableCart(){
    if(this.ENABLE_CART == "1"){
      return true;
    }
    else{
      return false;
    }
  }




  addToCart(x:any){
    this.scannerValue = "";
    this.stockList.GROSS_VALUE = this.discountValue;
    this.cartService.addToCart(x);
  }



  public onDowload(action: NgxScannerQrcodeComponent) {
    action.download().subscribe(console.log, alert);
  }

  public onSelects(files: any) {
    this.qrcode.loadFiles(files, 0.5).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      this.qrCodeResult = res;
    });
  
  }

  public onSelects2(files: any) {
    this.qrcode.loadFilesToScan(files, this.config, 0.5).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      console.log(res);
      this.qrCodeResult2 = res;
    });
  }

  scannerOptima(){
    this.router.navigate(['/optima']);
  }


  startInterval() {
    if (!this.isIntervalRunning) {
      this.intervalId = setInterval(() => {
        // Code to run at each interval
        console.log('Interval function running...');
        if(sessionStorage.getItem("Data-Sataus") == '1'){
          console.log("done");
          this.stopInterval();
         
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
      this.syncData = false;
    }
  }


  syncLink(){

    this.syncData = true;
    
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

  

  

  



}
