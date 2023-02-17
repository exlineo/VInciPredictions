import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { PredictionsService } from '../utils/services/predictions.service';

@Component({
  selector: 'app-data-maj',
  templateUrl: './data-maj.component.html',
  styleUrls: ['./data-maj.component.css']
})
export class DataMajComponent implements OnInit {

  /** Formulaire d'inscription */
  filtresForm = this.fbuild.group({
    pays: [[]],
    regions: [[]],
    pdo: [[]],
    rendements: [[1981, 2022]],
    predictions: [[2023, 2032]],
    moyennes: [''],
    croissance: [''],
    type: [''],
    debut: [1983],
    fin: [2032]
  });
  /** File to load */
  file?: string;
  /** Show/hide pages infos */
  infos:boolean = false; // Show informations
  sudoe:boolean = true; // Boolean to check wich data is on

  constructor(public predServ:PredictionsService, public l:LanguesService, private fbuild:FormBuilder) { }

  ngOnInit(): void {
    this.predServ.saveVersion = false;
    // Loading text page content from database
    this.l.getPage('adminvisualisation');
    if(this.l.store.lastSudoe.length == 0) this.l.store.getLastSudoe();
  }
  /** Set contents after tab click */
  getSudoe(){
    this.sudoe = true;
    this.file=undefined;
  }
  getBordeaux(){
    this.sudoe = false;
    this.file = undefined;
    console.log(this.l.store.set.bordeaux);
  }
  /**
   * Upload CSV file
   * @param e File event
   */
  uploadSudoe(e:any){
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // console.log('csv content', e.target.result);
      this.file = e.target.result;
      // Transform data to Rendement interface array
      this.predServ.setDataSudoe(this.file as string);
    };
    reader.readAsText(e.target.files[0]);
  }
  uploadBordeaux(e:any){
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // console.log('csv content', e.target.result);
      this.file = e.target.result;
      // Transform data to Rendement interface array
      this.predServ.setDataBordeaux(this.file as string);
    };
    reader.readAsText(e.target.files[0]);
  }
  /** Save data for harvests (SUDOE) */
  saveSudoe(){
    this.predServ.fireSudoeAdd();
    this.file = undefined;
  }
  /** Save data for yields (Bordeaux) */
  saveBordeaux(){
    this.predServ.fireBordeauxAdd();
    this.file = undefined;
  }
}
