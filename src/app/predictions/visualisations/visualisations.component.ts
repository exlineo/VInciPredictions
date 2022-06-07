import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Dataset, Rendement, RendementI } from 'src/app/utils/modeles/filtres-i';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { StoreService } from 'src/app/utils/services/store.service';
import { Subscription } from 'rxjs';
import { GraphI } from '../utils/modeles/graph-i';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit, OnDestroy {

  @ViewChild('chart') chart!: UIChart;

  filtres: Array<string> = []; // Ensemble des filtres appliqués
  l$!: Subscription;
  // Filter form
  filtresForm = this.fbuild.group({
    pays: [[]],
    regions: [[]],
    pdo: [[]],
    rendements: [1981],
    predictions: [2023],
    moyennes: [''],
    croissance: [''],
    type: [''],
    debut: [1983],
    fin: [2032]
  });
  chartType: string = 'line';
  basicOptions: any;
  graphDataset: any = { labels: [], datasets: [] };
  /** Portées des années à filtrer */
  pays: Array<any> = []; // List of countries
  infos: boolean = false; // Show / hide infos on click
  listes: { pays: Array<string>, regions: Array<string>, pdo: Array<string> } = { pays: [], regions: [], pdo: [] };
  config: any; // App config
  pdo: Array<RendementI> = [];

  constructor(public l: LanguesService, public fbuild: FormBuilder, public store: StoreService) { }

  ngOnInit(): void {
    console.log(this.chart);
    // Loading text page content from database
    this.l.getPage('visualisation');
    // Subscribe to langue to get syncrhonized data
    this.l$ = this.l.t$.subscribe(t => {
      this.pays = [
        { nom: this.l.t['FILTRE_ES'], value: "es" },
        { nom: this.l.t['FILTRE_FR'], value: "fr" },
        { nom: this.l.t['FILTRE_PT'], value: "pt" }
      ];
    }
    );
    // Get last data from Firebase
    this.store.config$.subscribe(c => {
      if (c.rendements) {
        this.graphDataset.labels = [];
        const ecart = c.rendements.fin - c.rendements.debut;
        for (let i = 0; i < ecart; ++i) {
          this.graphDataset.labels.push(c.rendements.debut + i);
        };
        this.config = c;
      }
      this.store.getLastData();
    });
    // Options for charts
    this.basicOptions = {
      plugins: {
        legend: {
          display: false,
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
  setGraphData(ev: any) {
    this.store.listes.filtres.forEach(f => {
      // ev.value.forEach(e => console.log(e));
    })
  }
  /** Get data from countries selected countries */
  filtrePays(e: any) {
    this.listes.pays = e.value;
    this.setFiltres();
  }
  /** Get data from selected regions */
  filtreRegions(e: any) {
    this.listes.regions = e.value;
    this.setFiltres();
  }
  /** Get average data */
  filtrePdo(e: any) {
    this.listes.pdo = e.value;
    this.pdo = [];
    if (e.value.length > 0) {
      this.store.getPdo(e.value)
        .then(d => {
          d.forEach(p => {
            // console.log(p.data())
            // const tmp = p.data() as RendementI;
            this.pdo.push(p.data() as RendementI);
          });
          console.log(this.pdo);
          this.setFiltres();
        })
    }else{
      this.setFiltres();
    }
  }
  setCouleur(i: number = 0, c: string = 'rouge') {
    return this.config.couleurs ? this.config.couleurs[c][i] : '#78281F';
  }
  /** Set filters and add data to graph */
  setFiltres() {
    this.graphDataset.datasets = [];
    const data: Array<any> = [];
    for (let i = 0; i < this.listes.pays.length; ++i) {
      this.setDataset(this.listes.pays[i], this.store.set.moyennes?.pays[this.listes.pays[i]], this.setCouleur(i, 'bleu'));
    };
    for (let i = 0; i < this.listes.regions.length; ++i) {
      this.setDataset(this.listes.regions[i], this.store.set.moyennes?.regions[this.listes.regions[i]], this.setCouleur(i, 'orange'));
    };
    // Add PDO
    for (let i = 0; i < this.pdo.length; ++i) {
      this.setDataset(this.pdo[i].pdo!, this.pdo[i].rendements.concat(this.pdo[i].predictions), this.setCouleur(i, 'vert'));
    };
    // this.graphDataset.datasets.concat(this.pdo);
    console.log(this.graphDataset.datasets, this.pdo);
    // Refresh data on graph
    this.chart.refresh();
  }
  setArrayDataset(ar: Array<any>) {
    console.log(ar);
    // ar.forEach(d => {

    // })
  }
  /** Set dataset
   * @param {string} l Label to write on over
   * @param {any} d Array of data to write on graph
   * @param {string} c Color of line
  */
  setDataset(l: string, d: any, c: string = '#78281F') {
    const tmp = new Dataset();
    tmp.data = d;
    tmp.label = l;
    tmp.borderColor = c;
    if (!this.graphDataset.datasets.includes(tmp)) this.graphDataset.datasets.push(tmp);
  }
  /** Valid filters and create chart */
  appliqueFiltres(e: any) {
    console.log(this.filtresForm.value);
    // this.setGraphData();
  }
  /** List accounts */
  // getChartsConfig() {
  //   this.store.getFireDoc('graphes', 'config')
  //     .then(c => c.data())
  //     .then(c => {
  //       // Get data for charts
  //       this.store.getLastData()
  //         .then(
  //           data => data.forEach(
  //             d => console.log(d.data())
  //           )
  //         )
  //         .catch(er => console.log(er));
  //     })
  //     .catch(er => console.log(er));
  // }
}
