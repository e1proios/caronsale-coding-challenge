import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { timer, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

import { environment as env } from '../../environments/environment';
import { AuthObject } from '../model/auth-object';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  private _subscriptions = [];
  private _stopPolling: Subject<any>;
  private _dataPublisher: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private _authSvc: AuthService,
    private _http: HttpClient
  ) {
    this._subscriptions.push(
      this._authSvc.authToken.subscribe( (authToken: AuthObject) => {
        const dataRequestHeaders = new HttpHeaders().
          append('Accept', 'application/json').
          append('Content-Type', 'application/json').
          append('userid', authToken.userId).
          append('authtoken', authToken.token);

        this._stopPolling = new Subject();
        this._http.get(
          env.getDataEndpoint(authToken.userId, null),
          { headers: dataRequestHeaders }
        ).subscribe(response => {
          this._dataPublisher.next(response);
        });
        /*
        timer(0, env.pollingInterval).pipe(
          takeUntil(this._stopPolling)
        ).subscribe(val => {
          this._dataPublisher.next(val);
        });*/
      })
    );
    this._subscriptions.push(
      this._authSvc.loggedOut.subscribe( (loggedOut: boolean) => {
        if (loggedOut) {
          this._stopPolling.next();
        }
      })
    );
  }
  ngOnDestroy() {
    this._subscriptions.forEach( (sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  public get data() {
    return this._dataPublisher;
  }
}
