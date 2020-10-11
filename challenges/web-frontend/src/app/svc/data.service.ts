import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { AuthObject } from '../model/auth-object';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private subscriptions = [];
  
  constructor(
    private authSvc: AuthService
  ) {
    this.subscriptions.push(
      this.authSvc.authToken.subscribe( (authToken: AuthObject) => {
        console.log(`Auth token received: ${authToken.token}`);
      })
    );
  }
}
