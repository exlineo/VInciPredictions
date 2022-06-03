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

  constructor(public predServ:PredictionsService, public l:LanguesService, private fbuild:FormBuilder) { }

  ngOnInit(): void {
    // this.predServ.getCSV();
  }
  /**
   * Upload CSV file
   * @param e File event
   */
  upload(e:any){
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // console.log('csv content', e.target.result);
      this.file = e.target.result;
      // Transform data to Rendement interface array
      this.predServ.setDataset(this.file as string);
    };
    reader.readAsText(e.target.files[0]);
  }
  /** Save data to database */
  saveData(){
    this.file = undefined;
    this.predServ.docFireAdd();
  }
}
