import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    token:any;
    
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.token=sessionStorage.getItem('access_token');

    if(this.token){
        req = req.clone({
            setHeaders: {
              //'Access-Control-Allow-Origin': '*',
              'Content-Type' : 'application/json',
              //'Accept'       : 'application/json',
              //'Access-Control-Allow-Methods' :' POST, GET, DELETE, PUT, PATCH, OPTIONS',
              //'Access-Control-Max-Age': '3600',
              'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
              'Authorization': this.token,
            },
          });
          return next.handle(req);
    }
    else{
        req = req.clone({
            setHeaders: {
              //'Access-Control-Allow-Origin': '*',
              'Content-Type' : 'application/json',
             // 'Accept'       : 'application/json',
              //'Access-Control-Allow-Methods' :' POST, GET, DELETE, PUT, PATCH, OPTIONS',
             //'Access-Control-Max-Age': '3600',
              //'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
            },
          });
          return next.handle(req);
    }


   
  }
}