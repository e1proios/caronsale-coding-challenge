import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit {
  @Input() auctionData;
  carInfo;
  auctionInfo;

  constructor() { }

  ngOnInit(): void {
    const car = this.auctionData.associatedVehicle;

    this.carInfo = {
      type: `${car.make} ${car.model}`,
      color: car.color,
      ez: car.ez,
      km: `${car.mileageInKm} km`,
      fuelType: car.fuelType,
      transmission: car.transmission
    };
    this.auctionInfo = {
      highestBid: this.auctionData.currentHighestBidValue,
      highestBidderId: this.auctionData._fk_highestBiddingSalesmanUser,
      remainingTime: this.formatTime(this.auctionData.remainingTimeInSeconds)
    }
  }
  private formatTime(secs: number): string {
    return moment.utc(secs*1000).format('HH:mm:ss');
  }
}
