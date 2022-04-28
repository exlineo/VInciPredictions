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
    ecart: this.fbuild.group({
      debut: [''],
      fin: ['']
    })
  });
  chartType: string = 'line';
  basicData: any;
  lineStylesData: any;
  basicOptions: any;
  graphDataset:GraphI = {labels:[], datasets:[]};
  /** Portées des années à filtrer */
  range: { min: number, max: number } = { min: 1996, max: 2024 };
  pays: Array<any> = [];

  constructor(public l: LanguesService, public fbuild: FormBuilder, public store: StoreService) {}

  ngOnInit(): void {
    // Subscribe to langue to get syncrhonized data
    this.l$ = this.l.t$.subscribe(t => {
      this.pays = [
        { nom: this.l.t['FILTRE_ES'], value: "es" },
        { nom: this.l.t['FILTRE_FR'], value: "fr" },
        { nom: this.l.t['FILTRE_PT'], value: "pt" }
      ];
    }
    )
    console.log(this.l.t['FILTRE_FR']);
    /** Load data from server */
    this.store.getLastData()
      .then(
        data => data.forEach(
          d => {
            let ds = d.data() as DataI;
            this.store.dataset = ds.data; // Send data to store
            this.store.setFilters(); // Set filters from datas
            // this.setGraphData(); // Set data for graph
          }
        )
      )
      .catch(er => console.log(er));
    // Liste des pays à afficher dans la sélection
    this.lineStylesData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          tension: .4,
          borderColor: '#42A5F5'
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderDash: [5, 5],
          tension: .4,
          borderColor: '#66BB6A'
        },
        {
          label: 'Third Dataset',
          data: [12, 51, 62, 33, 21, 62, 45],
          fill: true,
          borderColor: '#FFA726',
          tension: .4,
          backgroundColor: 'rgba(255,167,38,0.2)'
        }
      ]
    };
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
  /** Select range for custom double slider */
  // selectRange(e: any, type: string) {
  //   console.log(e.target.value, e.currentTarget.value);
  //   let val = 1996 + parseInt(e.target.value);
  //   if (type == 'min') {
  //     if (val >= this.range.max) val = this.range.max - 1;
  //     this.range.min = val;
  //     e.target.value = val - 1997;
  //   } else {
  //     if (val <= this.range.min) val = this.range.min + 1;
  //     this.range.max = val;
  //     e.target.value = val - 1995;
  //   }
  // }
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
