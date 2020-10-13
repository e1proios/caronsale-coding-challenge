import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import {
  timer,
  BehaviorSubject,
  Subject,
  Subscription,
  throwError
} from 'rxjs';
import {
  takeUntil,
  switchMap,
  retry,
  share,
  catchError
} from 'rxjs/operators';

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
      this._authSvc.loggedOut.subscribe( (loggedOut: boolean) => {
        if (loggedOut && this._stopPolling) {
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
  public startAuctionDataRetrieval(authToken: AuthObject) {
    const dataRequestHeaders = new HttpHeaders().
      append('Accept', 'application/json').
      append('Content-Type', 'application/json').
      append('userid', authToken.userId).
      append('authtoken', authToken.token);

    this._stopPolling = new Subject();
    timer(0, env.pollingInterval).pipe(
      switchMap(() => {
        return this._http.get(
          env.getDataEndpoint(authToken.userId, null),
          { headers: dataRequestHeaders }
        )
      }),
      catchError(this.handleError),
      retry(),
      share(),
      takeUntil(this._stopPolling)
    ).subscribe(response => {
      this._dataPublisher.next(response);
    });
  }
  private handleError(error: HttpErrorResponse) {
    return throwError(error.error || "couldn't get auctions data");
  }
}
