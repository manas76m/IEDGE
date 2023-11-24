import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class SalesummeryService {


  constructor(private http:HttpClient) { }

  getSalseSummery(startDate:any,endDate:any): Observable<any>{

    var req = {
        "COMPANY_NAME": sessionStorage.getItem('company_name'),
        "USER_ID":sessionStorage.getItem('username'),
        "START_DATE":startDate,
        "END_DATE":endDate
    }
    console.log(req);
    return this.http.post('https://iedge.jewellpro.in/api/sales_info', req).pipe(
      catchError((error) => {
        console.log('Error:', error);
        return throwError('An error occurred while fetching sales summary.');
      })
    );
    
  }
}



