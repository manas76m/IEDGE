import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { ScannerQRCodeConfig, NgxScannerQrcodeService, ScannerQRCodeSelectedFiles, ScannerQRCodeResult, NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  RouterOutlet
} from '@angular/router';
import { slideInAnimation } from './route-animation';
import {IndexedDBServicesService} from './index-db/indexed-db.services.service';
//import { CartService } from './qrscannervtwo/cart.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation]
})
export class AppComponent implements OnInit{
  menuDropdown = false;

  acccess_token:any;
  session_ID:any;
  company_name:any;
  company_name_display = true;
  ENABLE_CART:any;
  username:any;
  ver= "1.8"



  
  constructor(private http: HttpClient,  private router:Router,private indexedDBService:IndexedDBServicesService) {
    //this.router.events.subscribe((event) => console.log(event))
  }
  ngOnInit(): void {
    this.checkForAccessToken();
    
    this.router.events.subscribe((event) => this.displayCompanyName());
    

   

    
  }

  

  public displayCompanyName():void{
    this.company_name = sessionStorage.getItem('company_name');
    this.username = sessionStorage.getItem('username');
    this.enableCart();
    if(this.company_name){
      this.company_name_display = false;
    }
    else{
      this.company_name_display = true;
    }
  }
    

  
  public checkForAccessToken():boolean{
    this.acccess_token=sessionStorage.getItem('access_token');
   
    if(this.acccess_token){
     
      return true;
    }
    else{
      return false;
    }
  }

  public logOut(){
   
    this.session_ID = Number(sessionStorage.getItem("session_ID"));
    var url = 'https://iedge.jewellpro.in/api/sessions/';
    this.http.delete(url+this.session_ID).subscribe((data:any) =>{

      if(data.statusCode === 200 && data.success === true){
        sessionStorage.removeItem('session_ID');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('access_token_expires_in');
        sessionStorage.removeItem('company_name');
        sessionStorage.removeItem('enable_cart');
        localStorage.removeItem('stockMetalPrice');
        localStorage.removeItem('stockMakingData');
        localStorage.removeItem('stockList');
        //this.cartService.clearCart();
       
        //this.indexedDBService.deleteDb();

        // this.indexedDBService.deleteDb();
        this.clearDatabase();
       
        
        this.router.navigate(['/login']);

      }
    })
  }

  clearDatabase() {
    this.indexedDBService.clearData()
  }

  
  enableCart(){
    this.ENABLE_CART =  sessionStorage.getItem('enable_cart');
    if(this.ENABLE_CART == "1"){
      return true;
    }
    else{
      return false;
    }
  }



  public showMenu(){
    if(this.menuDropdown  == false){
      this.menuDropdown = true;
    }
    else{
      this.menuDropdown = false;
    }
  }
  public HideMenu(){
    this.menuDropdown = false;
  }

 

  


}
