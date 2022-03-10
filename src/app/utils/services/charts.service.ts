import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RendementI } from '../modeles/filtres-i';
import { LanguesService } from './langues.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  /** Configuration des charts récupérées depuis Firebase */
  chartConfig:unknown = {};
  /** Données filtrées à afficher dans les charts */
  chartData$:BehaviorSubject<Array<unknown>> = new BehaviorSubject<Array<any>>([]);
  rendements:Array<RendementI> = [];

  constructor(private store:StoreService, private lServ:LanguesService) {
    this.loadChartsConfig();
  }

  /** Charger les ndonnées de la langue depuis la base de données */
  loadChartsConfig() {
    this.store.getFireDoc('graphes', 'config')
    .then<any>(d => d.data())
    .then<unknown>(d => {
      let tmp = d['data'];
      this.chartConfig = JSON.parse(tmp);
      console.log(d);
    }
      )
    .catch(er => console.log(er));
  }
  /** Charger les données filtrées */
  loadChartsData(){

  }
}
