import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { sha512 } from 'js-sha512';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment as env} from '../../environments/environment';
import { LoginCredentials } from '../model/login-credentials';
import { AuthObject } from '../model/auth-object';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authToken: AuthObject;
  private _authTokenPublisher: BehaviorSubject<AuthObject> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private hashPassword(plain: string, cycles: number): string {
    let i = cycles,
      hash = plain;

    while (i > 0) {
      hash = sha512(hash);
      --i;
    }
    return hash;
  }
  private displayMessageOnAuthError(error: HttpErrorResponse) {
    // TODO - modal with info
    return throwError(error.error || "authentication error");
  }

  public login(credentials: LoginCredentials) {
    const encryptedPswd = this.hashPassword(credentials.password, env.passwordHashIterations);
    let headers = new HttpHeaders().
      append('Accept', 'application/json').
      append('Content-Type', 'application/json');

    this.http.put(
      `${env.authEndpoint}${credentials.email}`,
      { "password": encryptedPswd, "meta": "string" },
      { headers: headers})
    .pipe(catchError(this.displayMessageOnAuthError))
    .subscribe( (authToken: AuthObject) => {
      this._authToken = authToken;
      this._authTokenPublisher.next(this._authToken);
      this.router.navigate(['/user', credentials.email]);
    });
  }
  public get authToken(): BehaviorSubject<AuthObject> {
    return this._authTokenPublisher;
  }
}
