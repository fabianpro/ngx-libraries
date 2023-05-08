import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NgxAdalAngularService } from "./ngx-adal-angular.service";

@Injectable()
export class NgxAdalGuard implements CanActivate, CanActivateChild {
    
    constructor(private adalSvc: NgxAdalAngularService) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.adalSvc.isAuthenticated)  return true;
        else {
            this.adalSvc.login();
            return false;
        }
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(childRoute, state);
    }
}