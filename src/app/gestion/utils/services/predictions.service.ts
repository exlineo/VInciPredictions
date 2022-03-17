import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictionsService {
  predictions:Array<any> = [];
  constructor(private http:HttpClient) {}
  /**
   * Load CSV and filter data to set the database
   */
  getCSV(){
    this.http.get(environment.csvUrl, {responseType:'text'}).subscribe(d => {
      let lignes = d.split('\n');
      lignes.forEach(l => {
        l = l.replace(/[\r]/g, '').trim();
        let m = l.split(',');
        this.predictions.push(this.conversion(m));
      });
      console.log(this.predictions);
    });
  }
  /** Convert excel line to JSON object */
  conversion(l:Array<any>){
    return {pays:l[0], region:l[1],type:l[2],pdo:l[3],rendements:l.slice(4,43),previsions:l.slice(44,55),fiabilites:l.slice(56,l.length)};
  }
  /** Return JSON object */
  setJSON(d:string){
  }
}
