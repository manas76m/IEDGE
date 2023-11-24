import { Component, ViewChild, OnInit } from '@angular/core';

import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import {IndexedDBServicesService} from '../index-db/indexed-db.services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loadingProcess = false;

  username: any;
  password: any;

  error_message: any
  message: any;

  loadingMessage = "Making your things read!! ...."

  constructor(private http: HttpClient,  private router:Router, private indexedDBService: IndexedDBServicesService) { }

  ngOnInit(): void {
    //this.getDataFromDB();
    //this.getTheMetalPrice();

  }

  chunkArray(arr:any, chunkSize:any) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }

  async insertData(apiData:any) {
  
    const data = apiData/* Your large data array */;
    const chunkSize = 100; // Adjust the chunk size as needed

    const dataChunks = this.chunkArray(data, chunkSize);

    for (const chunk of dataChunks) {
      await this.indexedDBService.storeDataChunk(chunk);
    }
    this.loadingProcess=false;

    this.loadingMessage = "We are ready !! ..";
    //this.router.navigate(['/codescannerv2']);
    
    console.log('Data insertion complete.');
    
  }



  public userLogin() {
    this.loadingProcess=true;

    this.message = "Login Successfull";
    this.message = "Syncing Data please wait...";
    var request = {
      "USER_ID": this.username,
      "PASSWORD": this.password
    }
    var url = 'https://iedge.jewellpro.in/api/sessions';


    this.http.post(url,request).subscribe((data: any) => {


     if (data.statusCode === 201 && data.success === true) {
          sessionStorage.setItem('username',this.username);
          sessionStorage.setItem('session_ID',data.data.session_ID);
          sessionStorage.setItem('access_token',data.data.access_token);
          sessionStorage.setItem('access_token_expires_in',data.data.access_token_expires_in);
          sessionStorage.setItem('company_name',data.data.company_name);
          sessionStorage.setItem('enable_cart',data.data.enable_cart);
          sessionStorage.setItem('calc_type',data.data.calc_type)
          sessionStorage.setItem('STOCK_DATA',data.data.STOCK_DATA)
          sessionStorage.setItem('SHOP_NAME',data.data.SHOP_NAME)
          sessionStorage.setItem("Data-Sataus",'1');
          this.loadingMessage = "Welcome "+sessionStorage.getItem('username');
          //this.loadingProcess=false;
          this.loadingMessage = "We are ready !! ..";
          this.router.navigate(['/Home']);
      }
    }, err => {
      console.log(err); 
      this.loadingProcess=false;
      this.error_message = "Username or Password is wrong !!";
      setTimeout(() => {
        this.error_message = " "
      }, 3000);
    })
      
    
  }

}
