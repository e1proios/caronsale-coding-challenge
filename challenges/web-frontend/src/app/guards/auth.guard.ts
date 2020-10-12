import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import { AuthService } from '../svc/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _authSvc: AuthService,
    private _router: Router
  ) {}

  canActivate() {
    if (this._authSvc.isUserAuthorized) {
      return true;
    } else {
      this._router.navigate(['login']);
      return false;
    }
  }
}
