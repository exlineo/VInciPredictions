import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Dataset, Rendement, RendementI } from 'src/app/utils/modeles/filtres-i';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { StoreService } from 'src/app/utils/services/store.service';
import { Subscription } from 'rxjs';
import { UIChart } from 'primeng/chart';
import { AnyAaaaRecord } from 'dns';

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit, OnDestroy {

  @ViewChild('chart') chart!: UIChart;

  filtres: Array<string> = []; // Ensemble des filtres appliqués
  l$!: Subscription;
  /** Filter form */
  filtresForm = this.fbuild.group({
    pays: [[]],
    regions: [[]],
    pdo: [[]],
    rendements: [1981],
    predictions: [2032],
    moyennes: [''],
    croissance: [''],
    type: [''],
    debut: [1983],
    fin: [2032]
  });
  chartType: string = 'line';
  basicOptions: any;
  graphDataset: any = { labels: [], datasets: [] };
  pays: Array<any> = []; // List of countries
  infos: boolean = false; // Show / hide infos on click
  listes: { pays: Array<string>, regions: Array<string>, pdo: Array<string> } = { pays: [], regions: [], pdo: [] };
  config: any; // App config
  pdo: Array<RendementI> = [];
  couleurs: Array<string> = ['ff', 'ee', 'dd', 'cc', 'bb', 'aa', '90', '80', '70', '60', '50', '40', '30', '20']; // Calculate colors for gradients ont graph

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
  /** Clear observable on navigation change */
  ngOnDestroy() {
    this.l$.unsubscribe();
  }
  /** Set data for graph view (obsolete)
   * @param {event} e Event send from HTML
  */
  setGraphData(e: any) {
    this.store.listes.filtres.forEach(f => {
      // ev.value.forEach(e => console.log(e));
    })
  }
  /** Get data from countries selected countries
   * @param {event} e Event send from HTML
  */
  filtrePays(e: any) {
    this.listes.pays = e.value;
    this.setFiltres();
  }
  /** Get data from selected regions
   * @param {event} e Event send from HTML
   */
  filtreRegions(e: any) {
    this.listes.regions = e.value;
    this.setFiltres();
  }
  /** Get data from PDO filtered
   * @param {event} e Event send from HTML
   */
  filtrePdo(e: any) {
    this.pdo = [];
    let ar = this.filtresForm.controls.pdo.value!.map(p => p['name']);
    if (ar.length > 0) {
      this.store.getPdo(ar)
        .then(d => {
          d.forEach(p => {
            this.pdo.push(p.data() as RendementI);
          });
          this.setFiltres();
        })
    } else {
      this.setFiltres();
    }
  }
  /** Set color of graph with automated gradiant
   * @param {number} i index of color
   * @param {string} coul Color base
   */
  setCouleur(i: number = 0, coul: string = 'bleu') {
    let c = '';
    switch (coul) {
      case 'rouge':
        c = this.couleurs[i] + '0000';
        break;
      case 'vert':
        c = '00' + this.couleurs[i] + '00';
        break;
      case 'bleu':
        c = '0000' + this.couleurs[i];
        break;
    }
    return '#' + c;
  }
  /** Set filters and add data to lists (countries, regions, pdo) */
  setFiltres() {
    this.graphDataset.datasets = [];
    const data: Array<any> = [];
    for (let i = 0; i < this.listes.pays.length; ++i) {
      this.setDataset(this.listes.pays[i], this.store.set.moyennes?.pays[this.listes.pays[i]], this.setCouleur(i, 'bleu'));
    };
    for (let i = 0; i < this.listes.regions.length; ++i) {
      this.setDataset(this.listes.regions[i], this.store.set.moyennes?.regions[this.listes.regions[i]], this.setCouleur(i, 'vert'));
    };
    // Add PDO
    for (let i = 0; i < this.pdo.length; ++i) {
      this.setDataset(this.pdo[i].pdo!, this.pdo[i].rendements.concat(this.pdo[i].predictions), this.setCouleur(i, 'rouge'));
    };
    // this.graphDataset.datasets.concat(this.pdo);
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
  /** Set limits for years filters */
  setLimits(n: number) {
    return new Array(n);
  }
}
