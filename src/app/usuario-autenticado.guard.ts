import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioAutenticadoGuard implements CanActivate{
    constructor(
      private router: Router) { }

     canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean{

          if (typeof window !== "undefined") {
            const token = window.localStorage.getItem('token');
            if (token){
              return true;
            } else{ this.router.navigate(['login'])
  
              return false;
            }
            
          }
          return false;
          
        }
  }

