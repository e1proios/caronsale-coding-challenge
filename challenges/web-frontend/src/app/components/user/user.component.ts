import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../svc/auth.service';
import { DataService } from '../../svc/data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[];
  userId: string;

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
        const userId = params['id'];
        this.userId = userId;
      })
    );
    this._subscriptions.push(
      this._dataSvc.data.subscribe( data => {
        console.log(`User component received data ${data}`);
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
