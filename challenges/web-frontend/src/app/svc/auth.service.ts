import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse } from '@angular/common/http';

import { sha512 } from 'js-sha512';

import { LoginCredentials } from '../model/login-credentials';

const HASH_ITERATIONS = 5;

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

  public login(credentials: LoginCredentials) {
    const encryptedPswd = this.hashPassword(credentials.password, HASH_ITERATIONS);
    return encryptedPswd;
  }
  public getAuthToken() {

  }
}
