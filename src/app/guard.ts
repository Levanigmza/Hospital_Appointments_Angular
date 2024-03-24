import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserAuthService } from './services/user-auth.service';

export const adminGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {

  return inject(UserAuthService).isAdmin()
    ? true
    : inject(Router).createUrlTree(['/'])
};

export const doctorGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {

  return inject(UserAuthService).isdoctor()
    ? true
    : inject(Router).createUrlTree(['/'])
};
