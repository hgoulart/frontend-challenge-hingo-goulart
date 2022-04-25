import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ServiceService } from './service.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private service: ServiceService) {
    }

    canActivate(): boolean {
        return this.service.isAuthenticated();
    }
}
