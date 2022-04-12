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
    type: [''],
    rendements: [[]],
    moyennes: [[]],
    croissance: [[]],
    debut: [1983],
    fin: [2032]
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
  /** Renew countries list */
  majPays(){

  }
  /** Renew regions list */
  majRegions(){

  }
  /** Renew PDOs list */
  majPDO(){

  }
  /** Renew wines types list */
  majTypes(){

  }
  /** Get list of countries, regions, PDOs, types
   * @param {string} f wich filter apply
  */
  getList(f:string){

  }
  setFiltres(){

  }
}
