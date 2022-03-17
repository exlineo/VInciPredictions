import { Component, OnInit } from '@angular/core';
import { PredictionsService } from '../utils/services/predictions.service';

@Component({
  selector: 'app-data-maj',
  templateUrl: './data-maj.component.html',
  styleUrls: ['./data-maj.component.css']
})
export class DataMajComponent implements OnInit {

  constructor(public predServ:PredictionsService) { }

  ngOnInit(): void {
    this.predServ.getCSV();
  }

}
