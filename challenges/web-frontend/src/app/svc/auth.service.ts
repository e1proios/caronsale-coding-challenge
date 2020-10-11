import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse } from '@angular/common/http';

import { sha512 } from 'js-sha512';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment as env} from '../../environments/environment';
import { LoginCredentials } from '../model/login-credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
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
  private redirectOnAuthError(error: HttpErrorResponse) {
    // TODO
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
    .pipe(catchError(this.redirectOnAuthError))
    .subscribe( response => {
      console.log(response);
    });
  }
}
