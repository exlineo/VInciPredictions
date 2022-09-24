import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Dataset, DatasetI, RendementI } from 'src/app/utils/modeles/filtres-i';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { StoreService } from 'src/app/utils/services/store.service';
import { Subscription } from 'rxjs';
import { UIChart } from 'primeng/chart';
import { VisualService } from '../utils/services/visual.service';

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit, OnDestroy {

  /** Charts */
  @ViewChild('chart') chart!: UIChart;
  @ViewChild('average') average!: UIChart;
  @ViewChild('growth') growth!: UIChart;
  @ViewChild('chartPrediction') chartPrediction!: UIChart;
  @ViewChild('averagePrediction') averagePrediction!: UIChart;
  @ViewChild('growthPrediction') growthPrediction!: UIChart;

  config: any = { couleurs: {}, predictions: { debut: 2020, fin: 2032 }, rendements: { debut: 1981, fin: 2019 } }; // App config

  filtres: Array<string> = []; // Ensemble des filtres appliqués
  l$!: Subscription;
  /** Filter form */
  fF = this.fbuild.group({
    pays: [[]],
    regions: [[]],
    pdo: [[]],
    rendements: [this.store.config.rendements.debut],
    predictions: [this.store.config.predictions.fin],
    donnees: [true],
    moyennes: [true],
    croissance: [true],
    type: [''],
    // debut: [this.store.config.rendements.debut],
    // fin: [this.store.config.predictions.fin]
  });
  chartType: string = 'line';
  basicOptions: any; // Options of the charts

  /** Labels for charts */
  LABELS: any = { RD: Array<string>, PR: Array<string> };
  // Array of objects listing datas for yield charts and predictions
  DATA: any = { RD: Array<DatasetI>, PR: Array<DatasetI>, RDAV: Array<DatasetI>, PRAV: Array<DatasetI>, RDGR: Array<DatasetI>, RPGR: Array<DatasetI> };

  rendementsDS: { labels: Array<number>, datasets: Array<DatasetI> } = { labels: [], datasets: [] };
  fGDS = this.rendementsDS; // Copie du rendementsDS pour traiter la taille des tableaux en fonction de l'année
  avDS: { labels: Array<number>, datasets: Array<DatasetI> } = { labels: [], datasets: [] }; // Average data
  growDS: { labels: Array<number>, datasets: Array<DatasetI> } = { labels: [], datasets: [] }; // Growth data

  pays: Array<any> = []; // List of countries
  infos: boolean = false; // Show / hide infos on click
  listes: { pays: Array<string>, regions: Array<string>, pdo: Array<string> } = { pays: [], regions: [], pdo: [] }; // Liste of filters
  pdo: Array<RendementI> = [];

  constructor(public l: LanguesService, public fbuild: FormBuilder, public store: StoreService, public visualSer: VisualService) { }

  ngOnInit(): void {
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
    /** Get config and   */
    this.store.config$.subscribe(c => {
      if (c.rendements) {
        this.setGraphLabels(c.rendements.debut, c.predictions.fin - c.rendements.debut);
        // Set labels for yields
        this.setDSLabels(c.rendements.debut, c.rendements.fin - c.rendements.debut);
        // Set labels for predictions
        this.setPRLabels(c.predictions.debut, c.predictions.fin - c.predictions.debut);
      }
      // Get last version of data from database
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
  /** Set labels for graph at start with configuration load
   * DEPRECATED
  */
  setGraphLabels(debut: number, ecart: number) {
    this.rendementsDS.labels = [];
    for (let i = 0; i < ecart; ++i) {
      this.rendementsDS.labels.push(debut + i);
    };
  }
  /** Set labels for graph */
  setDSLabels(debut: number, ecart: number) {
    this.LABELS.DS = [];
    for (let i = 0; i < ecart; ++i) {
      this.LABELS.DS.push(debut + i);
    };
  }
  /** Set labels for graph */
  setPRLabels(debut: number, ecart: number) {
    this.LABELS.PR = [];
    for (let i = 0; i < ecart; ++i) {
      this.LABELS.PR.push(debut + i);
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
  /** Load PDO data from database
   */
  filtrePdo() {
    this.pdo = [];
    // let ar = this.fF.controls.pdo.value!.map(p => p['name']);
    if (this.fF.controls.pdo.value!.length > 0) {
      // Get PDO data
      this.store.getPdo(this.fF.controls.pdo.value as Array<string>)
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
  filtreRendementsDS(e: any = null) {
    this.fGDS = this.rendementsDS;
    if (this.fF.controls.rendements.value != this.store.config.debut || this.fF.controls.predictions.value != this.store.config.fin) {
      let deb = this.fF.controls.rendements.value ? this.fF.controls.rendements.value : 0;
      let fin = this.fF.controls.predictions.value ? this.fF.controls.predictions.value : 0;
      // const {deb, fin} = this.setGap(this.fF.controls.rendements.value, this.fF.controls.predictions.value);

      this.fGDS.labels.splice(0, this.store.config.rendements.debut - deb).splice(this.fGDS.labels.length, -(fin - this.store.config.fin));
      // Calculer les nouveaux labels sur le graph
      this.fGDS.labels = [];
      for (let i = 0; i < fin - deb; ++i) {
        this.fGDS.labels.push(deb + i);
      };
      // Cut datasets from years
      this.fGDS.datasets.forEach(ds => {
        if (ds.data) ds.data.splice(0, this.store.config.debut - deb).splice(ds.data.length, -(fin - this.store.config.fin));
      });
    }
    this.chart.refresh();
    this.setAverage();
  }
  /** Set GAP for years */
  setGap(start: number, end: number) {
    return { deb: 0, fin: 0 }
  }
  /** Calculate and show the average data */
  setAverage() {
    // Calculate average data, 5 years and purcent growth on years
    this.DATA.RDAV.labels = this.LABELS.RD.slice(4, this.LABELS.RD.length);
    this.DATA.PRAV.labels = this.LABELS.PR.slice(4, this.LABELS.PR.length);
    this.DATA.RDAV.datasets = [];
    this.DATA.PRAV.datasets = [];

    this.avDS.labels = this.fGDS.labels.slice(4, this.fGDS.labels.length);
    this.growDS.labels = this.fGDS.labels.slice(1, this.fGDS.labels.length);
    this.avDS.datasets = [];
    this.growDS.datasets = []

    // Calculate purcent growth on years
    this.fGDS.datasets.forEach(av => {
      // Empty datasets containers
      const ds = new Dataset(); // Dataset for Average
      const dg = new Dataset(); // Dataset for growth
      ds.label = av.label;
      ds.borderColor = av.borderColor!;
      dg.label = av.label;
      dg.backgroundColor = av.borderColor!;
      av.data.forEach((d, i) => {
        if (i > 1) {
          // Add average data to data array
          ds.data.push(Math.round((av.data[i - 4] +av.data[i - 3] + av.data[i - 2] + av.data[i - 1] + av.data[i]) / 3));
        };
        if (i > 0) {
          dg.data.push((av.data[i] * 100 / av.data[i - 1]) - 100);
        };
      });
      this.avDS.datasets.push(ds);
      this.growDS.datasets.push(dg);
    });
    this.average.refresh();
    this.growth.refresh();
  }
  /** show the average data */
  setGrowth() {
    this.growth.refresh();
  }
  /** Set color of graph with automated gradiant
   * @param {number} i index of color
   * @param {string} coul Color base
   */
  setCouleur(i: number = 0, coul: string = 'bleu') {
    if (i > this.store.config.couleurs[coul].length - 1) i -= this.store.config.couleurs[coul].length - 1;
    return this.store.config.couleurs[coul][i];
  }
  /** Set filters and add data to lists (countries, regions, pdo) */
  setFiltres() {
    this.rendementsDS.datasets = [];
    this.DATA.DS = [];
    // const data: Array<any> = [];
    // Set region if some was selected in filters
    if (this.listes.pays.length > 0) {
      for (let i = 0; i < this.listes.pays.length; ++i) {
        this.setDataset(this.rendementsDS, this.listes.pays[i], this.store.set.moyennes?.pays.RD[this.listes.pays[i]], this.setCouleur(i, 'bleu')); // DEPRECATED
        this.setDataset(this.DATA.RD, this.listes.pays[i], this.store.set.moyennes?.pays.RD[this.listes.pays[i]], this.setCouleur(i, 'bleu'));
        this.setDataset(this.DATA.PR, this.listes.pays[i], this.store.set.moyennes?.pays.PR[this.listes.pays[i]], this.setCouleur(i, 'bleu'));      };
    }
    // Set region if some was selected in filters
    if (this.listes.regions.length > 0) {
      for (let i = 0; i < this.listes.regions.length; ++i) {
        this.setDataset(this.rendementsDS, this.listes.regions[i], this.store.set.moyennes?.regions.RD[this.listes.regions[i]], this.setCouleur(i, 'vert')); // DEPRECATED
        this.setDataset(this.DATA.RD, this.listes.regions[i], this.store.set.moyennes?.regions.RD[this.listes.regions[i]], this.setCouleur(i, 'vert'));
        this.setDataset(this.DATA.PR, this.listes.regions[i], this.store.set.moyennes?.regions.PR[this.listes.regions[i]], this.setCouleur(i, 'vert'));
      };
    }
    // Add PDO
    if (this.pdo.length > 0) {
      for (let i = 0; i < this.pdo.length; ++i) {
        this.setDataset(this.rendementsDS, this.pdo[i].pdo!, this.pdo[i].rendements.concat(this.pdo[i].predictions), this.setCouleur(i, 'rouge')); // DEPRECATED
        this.setDataset(this.DATA.RD, this.pdo[i].pdo!, this.pdo[i].rendements, this.setCouleur(i, 'rouge'));
        this.setDataset(this.DATA.PR, this.pdo[i].pdo!, this.pdo[i].predictions, this.setCouleur(i, 'rouge'));
      };
    }
    // this.rendementsDS.datasets.concat(this.pdo);
    // Refresh data on graph
    this.filtreRendementsDS();
  }
  /** Set dataset
   * @param {string} l Label to write on over
   * @param {any} d Array of data to write on graph
   * @param {string} c Color of line
  */
  setDataset(target:any, l: string, d: any, c: string = '#78281F') {
    const tmp = new Dataset();
    tmp.label = l;
    tmp.data = d;
    tmp.borderColor = c;
    if (!target.datasets.includes(tmp)) target.datasets.push(tmp);
  }
  /** Set limits for years filters */
  setLimits(n: number) {
    return new Array(n);
  }
  /** Download img */
  downloadStats(el: string) {
    console.log(el);
    let img;
    const lien = document.createElement('a');
    // this.chart.toDataURL('image/png');
    switch (el) {
      case 'chart':
        // console.log(this.chart.getCanvas());
        img = this.chart.getBase64Image();
        lien.setAttribute('download', 'predictions.png')
        break;
      case 'average':
        img = this.average.getBase64Image();
        lien.setAttribute('download', 'averages.png')
        break;
      case 'growth':
        img = this.growth.getBase64Image();
        lien.setAttribute('download', 'growths.png')
        break;
    };
    lien.setAttribute('href', img.replace("image/png", "image/octet-stream"));
    lien.click();
  }
  /** Clear observable on navigation change */
  ngOnDestroy() {
    this.l$.unsubscribe();
    this.store.config$.unsubscribe();
  }
}
