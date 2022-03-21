import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { PredictionsService } from '../utils/services/predictions.service';

@Component({
  selector: 'app-data-maj',
  templateUrl: './data-maj.component.html',
  styleUrls: ['./data-maj.component.css']
})
export class DataMajComponent implements OnInit {

  /** Formulaire d'inscription */
  filtres = this.fbuild.group({
    pays: [''],
    regions: [''],
    pdo: [''],
    types: [''],
    rendements: [''],
    moyennes: [''],
    croissance: [''],
    debut: [''],
    fin: ['']
  });

  constructor(public predServ:PredictionsService, public l:LanguesService, private fbuild:FormBuilder) { }

  ngOnInit(): void {
    this.predServ.getCSV();
  }
  /**
   * Upload CSV file
   * @param e File event
   */
  upload(e:any){

  }
  /** Filtre data for admin validation */
  filtreData(){

  }
}
