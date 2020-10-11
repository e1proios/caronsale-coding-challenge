import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse } from '@angular/common/http';

import { sha512 } from 'js-sha512';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoginCredentials } from '../model/login-credentials';

const HASH_ITERATIONS = 5;
const AUTH_ENDPOINT = 'https://caronsale-backend-service-dev.herokuapp.com/api/v1/authentication/';

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
    const encryptedPswd = this.hashPassword(credentials.password, HASH_ITERATIONS);
    let headers = new HttpHeaders().
      append('Accept', 'application/json').
      append('Content-Type', 'application/json');

    this.http.put(
      `${AUTH_ENDPOINT}${credentials.email}`,
      { "password": encryptedPswd, "meta": "string" },
      { headers: headers})
    .pipe(catchError(this.redirectOnAuthError))
    .subscribe( response => {
      console.log(response);
    });
  }
}
