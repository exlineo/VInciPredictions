import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataI } from 'src/app/utils/modeles/filtres-i';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { StoreService } from 'src/app/utils/services/store.service';
import { Subscription } from 'rxjs';
import { GraphI } from '../utils/modeles/graph-i';

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit, OnDestroy {

  /** Ensemble des filtres appliqués */
  filtres: Array<string> = [];
  l$!:Subscription;
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
  chartType: string = 'line';
  basicOptions: any;
  graphDataset:GraphI = {labels:[], datasets:[]};
  /** Portées des années à filtrer */
  range: { min: number, max: number } = { min: 1996, max: 2024 };
  pays: Array<any> = [];
  infos:boolean = false;

  constructor(public l: LanguesService, public fbuild: FormBuilder, public store: StoreService) {}

  ngOnInit(): void {
    // Loading text page content from database
    this.l.getPage('filtrage');
    // Subscribe to langue to get syncrhonized data
    this.l$ = this.l.t$.subscribe(t => {
      this.pays = [
        { nom: this.l.t['FILTRE_ES'], value: "es" },
        { nom: this.l.t['FILTRE_FR'], value: "fr" },
        { nom: this.l.t['FILTRE_PT'], value: "pt" }
      ];
    }
    )
    /** Load data from server */
    this.store.getLastData()
      .then(
        data => data.forEach(
          d => {
            let ds = d.data() as DataI;
            this.store.dataset = ds.data; // Send data to store
            // console.log(this.store.dataset);
            this.store.setFilters(); // Set filters from datas
          }
        )
      )
      .catch(er => console.log(er));
    // Options for charts
    this.basicOptions = {
      plugins: {
        legend: {
          display:false,
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };

  }
  ngOnDestroy() {
    this.l$.unsubscribe();
  }
  /** Set data for graph view */
  setGraphData(){
  }
  /** Valid filters and create chart */
  appliqueFiltres() {
    console.log(this.filtresForm.value);
    this.setGraphData();
  }
  /** List accounts */
  getChartsConfig() {
    this.store.getFireDoc('graphes', 'config')
      .then(c => c.data())
      .then(c => {
        // Get data for charts
        this.store.getLastData()
          .then(
            data => data.forEach(
              d => console.log(d.data())
            )
          )
          .catch(er => console.log(er));
      })
      .catch(er => console.log(er));
  }
}
