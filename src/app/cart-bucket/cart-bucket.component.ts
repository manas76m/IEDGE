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
  selector: 'app-cart-bucket',
  templateUrl: './cart-bucket.component.html',
  styleUrls: ['./cart-bucket.component.scss']
})
export class CartBucketComponent implements OnInit, OnDestroy{

  private dataSubscription!: Subscription;

  cart_items_count:Number=0;
  ENABLE_CART:any;

  constructor(private http: HttpClient, private tokenGeneratorService: TokenGeneratorService,private cartService: CartService,private router:Router) {
   
   
   }
  
  ngOnInit(): void {
    this.dataSubscription = this.cartService.count$.subscribe(data =>{
      this.cart_items_count = data;
    });
    
    this.getCartItems();
    this.router.events.subscribe((event) => this.enableCart());
  }

  getCartItems(){
    if(this.cart_items_count == 0){
      this.cart_items_count = this.cartService.getCartItems().length;
    }
   
  }



  enableCart(){
    if(this.ENABLE_CART == "1"){
      return true;
    }
    else{
      return false;
    }
  }







  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  // getCount(){

  // this.cartService.getCartCount().subscribe(data => {
  //   // Handle the data received from the service
  //   this.cart_items_count = data;
  //   console.log(data);
  // });
  // }

  navigateToCart(){
    this.router.navigate(['/ses-cart']);
  }

  




}
