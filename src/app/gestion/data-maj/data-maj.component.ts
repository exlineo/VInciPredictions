import { Component, OnInit } from '@angular/core';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { PredictionsService } from '../utils/services/predictions.service';

@Component({
  selector: 'app-data-maj',
  templateUrl: './data-maj.component.html',
  styleUrls: ['./data-maj.component.css']
})
export class DataMajComponent implements OnInit {

  constructor(public predServ:PredictionsService, public l:LanguesService) { }

  ngOnInit(): void {
    this.predServ.getCSV();
  }
  /**
   * Upload CSV file
   * @param e File event
   */
  upload(e:any){

  }
}
