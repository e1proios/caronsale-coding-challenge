import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit {
  @Input() auctionData;

  constructor() { }

  ngOnInit(): void {}
}
