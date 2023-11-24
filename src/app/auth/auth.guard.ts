import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    UrlTree
  } from '@angular/router';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { map, tap, take } from 'rxjs/operators';
  
  
  @Injectable({ providedIn: 'root' })
  export class AuthGuard implements CanActivate {
    
    constructor(private router: Router) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      router: RouterStateSnapshot
    ):
      | boolean
      | UrlTree
      | Promise<boolean | UrlTree>
      | Observable<boolean | UrlTree> {
        var isAuthenticated  = sessionStorage.getItem('access_token');
        if(!isAuthenticated){
            return this.router.createUrlTree(['/login']);
        }
        return !!isAuthenticated;
    //   return this.authService.user.pipe(
    //     take(1),
    //     map(user => {
    //       const isAuth = !!user;
    //       if (isAuth) {
    //         return true;
    //       }
    //       return this.router.createUrlTree(['/auth']);
    //     })
        // tap(isAuth => {
        //   if (!isAuth) {
        //     this.router.navigate(['/auth']);
        //   }
        // })
      //);
    }
  }