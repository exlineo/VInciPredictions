import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Dataset, DatasetI, RendementI } from 'src/app/utils/modeles/filtres-i';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { StoreService } from 'src/app/utils/services/store.service';
import { Subscription } from 'rxjs';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit, OnDestroy {

  @ViewChild('chart') chart!: UIChart;
  config: any = {couleurs:{}, predictions:{debut:2023, fin:2033}, rendements:{debut:1982, fin:2023}}; // App config

  filtres: Array<string> = []; // Ensemble des filtres appliqués
  l$!: Subscription;
  /** Filter form */
  fF = this.fbuild.group({
    pays: [[]],
    regions: [[]],
    pdo: [[]],
    rendements: [this.store.config.rendements.debut],
    predictions: [this.store.config.predictions.fin],
    moyennes: [''],
    croissance: [''],
    type: ['']
    // debut: [this.store.config.rendements.debut],
    // fin: [this.store.config.predictions.fin]
  });
  chartType: string = 'line';
  basicOptions: any;
  graphDataset: {labels:Array<number>, datasets:Array<DatasetI>} = { labels: [], datasets: [] };
  fGDS = this.graphDataset; // Copie du graphDataset pour traiter la taille des tableaux en fonction de l'année
  pays: Array<any> = []; // List of countries
  infos: boolean = false; // Show / hide infos on click
  listes: { pays: Array<string>, regions: Array<string>, pdo: Array<string> } = { pays: [], regions: [], pdo: [] };
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
    /** Get  */
    this.store.config$.subscribe(c => {
      if (c.rendements) {
        this.setGraphLabels(c.rendements.debut, c.predictions.fin - c.rendements.debut);
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
  /** Set labels for graph */
  setGraphLabels(debut:number, ecart:number){
    this.graphDataset.labels = [];
    for (let i = 0; i < ecart; ++i) {
      this.graphDataset.labels.push(debut + i);
    };
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
    let ar = this.fF.controls.pdo.value!.map(p => p['name']);
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
  /** Filter dataset to get years */
  filtreGraphDataset(e:any = null){
    this.fGDS = this.graphDataset;
    if(this.fF.controls.rendements.value != this.store.config.debut || this.fF.controls.predictions.value != this.store.config.fin){
      let deb = this.fF.controls.rendements.value ? this.fF.controls.rendements.value : 0;
      let fin = this.fF.controls.predictions.value ? this.fF.controls.predictions.value : 0;
      console.log(fin, deb-this.store.config.rendements.debut, this.fGDS.labels.splice(0, deb-this.store.config.rendements.debut));
      this.fGDS.labels.splice(0, this.store.config.rendements.debut-deb).splice(this.fGDS.labels.length, -(fin - this.store.config.fin) );
      // Calculer les nouveaux labels sur le graph
      this.fGDS.labels = [];
      for (let i = 0; i < fin-deb; ++i) {
        this.fGDS.labels.push(deb + i);
      };

      this.fGDS.datasets.forEach(ds => ds.data.splice(0, this.store.config.debut - deb).splice(ds.data.length, -(fin - this.store.config.fin)))
    }
    this.chart.refresh();
  }
  /** Filter start years on graph */
  filtreStart(e:any){

  }
  /** Filter end years on graph */
  filtreFin(e:any){

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
    this.filtreGraphDataset();
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
    console.log(this.fF.value);
    // this.setGraphData();
  }
  /** Set limits for years filters */
  setLimits(n: number) {
    return new Array(n);
  }
}
