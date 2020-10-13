import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../svc/auth.service';
import { DataService } from '../../svc/data.service';
import { AuthObject } from '../../model/auth-object';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[];
  userId: string;
  userAuctions;

  constructor(
    private route: ActivatedRoute,
    private _authSvc: AuthService,
    private _dataSvc: DataService
  ) { }

  ngOnInit(): void {
    this.userId = '';
    this._subscriptions = [];

    this._subscriptions.push(
      this.route.params.subscribe( params => {
        this.userId = params['id'];
      })
    );
    this._subscriptions.push(
      this._authSvc.authToken.subscribe( (authToken: AuthObject) => {
        this._dataSvc.startAuctionDataRetrieval(authToken);
      })
    );
    this._subscriptions.push(
      this._dataSvc.data.subscribe( data => {
        if (data) {
          this.userAuctions = data.items;
        }
      })
    );
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach( (sub: Subscription) => {
      sub.unsubscribe();
    });
  }
  public userLogOut() {
    this._authSvc.logout();
  }
}
