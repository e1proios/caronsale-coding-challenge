import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.scss']
})
export class AuctionsComponent implements OnInit {
  @Input() auctions;

  constructor() { }

  ngOnInit(): void {
  }
}
