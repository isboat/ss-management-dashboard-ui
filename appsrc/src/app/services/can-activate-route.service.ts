import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class GuardPermissionsService {
  
  canActivate(auth: AuthService): boolean {
    var authenticated = auth.isAuthenticated();
    if(authenticated){
      return true;
    }
    else
    {
      auth.redirectToLogin();      
      return false;
    }
  }
  canActivateUserRoute(auth: AuthService): boolean {
    var authenticated = auth.isAdminUser();
    if(authenticated){
      return true;
    }
    else
    {
      auth.redirectToLogin();      
      return false;
    }
  }
  
  canActivateLogin(auth: AuthService): boolean {
    var authenticated = auth.isAuthenticated();
    return !authenticated;
  }
}

export const canActivateRoute: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(GuardPermissionsService).canActivate(inject(AuthService));
    };
  export const canActivateUserRoute: CanActivateFn =
      (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(GuardPermissionsService).canActivateUserRoute(inject(AuthService));
      };

export const canActivateLoginRoute: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(GuardPermissionsService).canActivateLogin(inject(AuthService));
    };
