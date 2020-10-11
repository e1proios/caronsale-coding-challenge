import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { DataService } from '../../svc/data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[];
  userId: string;

  constructor(
    private route: ActivatedRoute,
    private dataSvc: DataService
  ) { }

  ngOnInit(): void {
    this.userId = '';
    this.subscriptions = [];

    this.subscriptions.push(
      this.route.params.subscribe( params => {
        const userId = params['id'];
        this.userId = userId;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach( (sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
