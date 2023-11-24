import { Component,OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenGeneratorService } from '../qrscannervtwo/tokengenerator.service';
import { CartService } from '../qrscannervtwo/cart.service';
import { Subscription } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';

@Component({
  selector: 'app-session-cart',
  templateUrl: './session-cart.component.html',
  styleUrls: ['./session-cart.component.scss']
})
export class SessionCartComponent implements OnInit, OnDestroy{

  //private dataSubscription!: Subscription;

  cart_items_count:Number=0;
  ENABLE_CART:any;
  cartList:any;
  token:any;
  USERNAME: string | null | undefined;
  COMPANY_NAME: string | null | undefined;
  customerName:any;
  customerNumber:any;

  success = false;

  constructor(private http: HttpClient, private tokenGeneratorService: TokenGeneratorService,private cartService: CartService,private router:Router) {
   
   
   }
  
  ngOnInit(): void {
    // this.dataSubscription = this.cartService.count$.subscribe(data =>{
    //   this.cart_items_count = data;
    // });

   this.getTheCredential();
  //  console.log(this.cartList)
    // this.ENABLE_CART =  sessionStorage.getItem('enable_cart');
  }

  getTheCredential() {
    this.USERNAME = sessionStorage.getItem('username');
    this.COMPANY_NAME = sessionStorage.getItem('company_name');
    this.ENABLE_CART =  sessionStorage.getItem('enable_cart');

  }

  getCartItems(){
    //console.log(this.cartService.getCartItems())
    return this.cartService.getCartItems();
  }


  enableCart(){
    if(this.ENABLE_CART == "1"){
      return true;
    }
    else{
      return false;
    }
  }

  navigateToCart(){
    this.router.navigate(['/codescannerv2']);
  }





  removeFromCart(cartItem:any){
    this.cartList =  this.cartService.getCartItems();
    this.cartService.removeFromCart(cartItem);
  }


  

  generateToken(): void {
    this.token = this.tokenGeneratorService.generateUnique4DigitToken();
    console.log(this.token);
    return this.token;
  }

  orderCartSubmit(custName:any,custNumber:any,item:any){

    
      
      if(!custName && !custNumber){
        alert("please enter Name and Number!!")
      }
      else if(custNumber){
        let number = custNumber.toString(); 

        if(number.length == 10){
          console.log(custName, custNumber,item)

          const arrayOfObjectswithcustnamecustNumber = item.map((obj:any) => ({
            // Copy the existing properties
            ...obj,
            CUST_NAME:custName,
            CUST_MOB:custNumber,
          }));


          //console.log(arrayOfObjectswithcustnamecustNumber);
  
          this.submitTOcartDB(arrayOfObjectswithcustnamecustNumber);
        }
        else{
          alert("please enter correct Number!!")
        }

       
       


      }
      else{
        alert("please enter correct Number!!")
       
      }

  }

 

   submitTOcartDB(datatoCart:any){
    console.log(datatoCart);
   
    let chl_no = this.generateToken();
   
    this.http.post('https://qrscan.kratuinfotech.in/V1/insertcart/'+chl_no+'/'+this.COMPANY_NAME, datatoCart).subscribe((data: any) => {
      if(data.success === true ){
        this.cartService.clearCart();
        //alert("TOKENNO/CHALLANNO="+chl_no);
        
        this.success = true;
        setTimeout(()=>{
          this.success = false;
          this.router.navigate(['/codescannerv2']);
        },2000)
      }
    }, err => {
      console.log(err);
    })
   }

   




  ngOnDestroy(): void {
    //this.dataSubscription.unsubscribe();
    
  }
}
