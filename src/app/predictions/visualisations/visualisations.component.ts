import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Dataset, DatasetI, RendementI, ChartI, YeildI } from 'src/app/utils/modeles/filtres-i';
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
  @ViewChild('chart') chartrd!: UIChart;
  @ViewChild('average') chartAvrd!: UIChart;
  @ViewChild('growth') chartGrowthrd!: UIChart;
  @ViewChild('chartPredictions') chartpr!: UIChart;
  @ViewChild('averagePredictions') chartAvpr!: UIChart;
  @ViewChild('growthPredictions') chartGrowthpr!: UIChart;

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
  // LABELS: any = { RD: Array<string>, PR: Array<string>, RDAV:Array<string>, PRAV:Array<string>, RDGR:Array<string>, RPGR:Array<string> };
  // Array of objects listing datas for yield charts and predictions
  DATA: any = { RD: <ChartI>{}, PR: <ChartI>{}, RDAV: <ChartI>{}, PRAV: <ChartI>{}, RDGR: <ChartI>{}, PRGR: <ChartI>{} };

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
  /** Set labels for graph */
  setDSLabels(debut: number, ecart: number) {
    this.DATA.RD.labels = [];
    console.log(debut, ecart);
    for (let i = 0; i < ecart+1; ++i) {
      this.DATA.RD.labels.push(debut + i);
    };
    console.log("RD Labels", this.DATA.RD.labels);
  }
  /** Set labels for graph */
  setPRLabels(debut: number, ecart: number) {
    this.DATA.PR.labels = [];
    for (let i = 0; i < ecart+1; ++i) {
      this.DATA.PR.labels.push(debut + i);
    };
    console.log("RD Labels", this.DATA.PR.labels);
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

    if (this.fF.controls.rendements.value != this.store.config.debut || this.fF.controls.predictions.value != this.store.config.fin) {
      const rd = this.fF.controls.rendements.value ? this.fF.controls.rendements.value - this.store.config.rendements.debut : 0;
      const rdLength = (this.store.config.rendements.fin - this.store.config.rendements.debut) - rd;
      const pr = this.fF.controls.predictions.value ? this.store.config.predictions.fin - this.fF.controls.predictions.value : 0;
      const prLength = (this.store.config.predictions.fin - this.store.config.predictions.debut) - pr;

      this.DATA.RD.labels = [];
      this.DATA.PR.labels = [];
      // Calculer les nouveaux labels sur le graph
      for (let i = 0; i < rdLength; ++i) {
        this.DATA.RD.labels.push(this.fF.controls.rendements.value + i);
      };
      for (let i = 0; i < prLength; ++i) {
        this.DATA.PR.labels.push(this.store.config.predictions.debut + i);
      };
      // Cut datasets from years
      this.DATA.RD.datasets.forEach((ds:DatasetI) => {
        if (ds.data) ds.data.splice(rd, ds.data.length);
      });
      this.DATA.PR.datasets.forEach((ds:DatasetI) => {
        if (ds.data) ds.data.splice(0, prLength);
      });
    }
    this.chartrd.refresh();
    this.chartpr.refresh();
    if(this.fF.controls.moyennes.value || this.fF.controls.croissance.value) this.setAverage();
  }
  /** Calculate and show the average data */
  setAverage() {
    // Calculate average data, 5 years and purcent growth on years
    this.DATA.RDAV.labels = this.DATA.RD.labels.slice(4, this.DATA.RD.labels.length);
    this.DATA.PRAV.labels = this.DATA.PR.labels.slice(4, this.DATA.PR.labels.length);

    this.DATA.RDAV.datasets = [];
    this.DATA.PRAV.datasets = [];

    // Calculate purcent growth on years
    this.DATA.RD.datasets.forEach((av:DatasetI) => {
      // Empty datasets containers
      const dsrd = new Dataset(); // Dataset for Average
      const dgrd = new Dataset(); // Dataset for growth

      dsrd.label = av.label;
      dsrd.borderColor = av.borderColor!;
      dgrd.label = av.label;
      dgrd.backgroundColor = av.borderColor!;

      av.data.forEach((d, i) => {
        if (i > 1) {
          // Add average data to data array
          dsrd.data.push(Math.round((av.data[i - 4] +av.data[i - 3] + av.data[i - 2] + av.data[i - 1] + av.data[i]) / 3));
        };
        if (i > 0) {
          dgrd.data.push((av.data[i] * 100 / av.data[i - 1]) - 100);
        };
      });
      this.DATA.RDAV.datasets.push(dsrd);
      this.DATA.RDGR.datasets.push(dgrd);
    });
    this.chartAvrd.refresh();
    this.chartAvpr.refresh();
    this.chartGrowthrd.refresh();
    this.chartGrowthpr.refresh();
  }
  /** Create an element in list of dataset */
  setDatasetElement(av:DatasetI){
    return {
      label : av.label,
      borderColor : av.borderColor!
    }
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
    console.log(this.store.set);
    this.DATA.RD.datasets = [];
    this.DATA.PR.datasets = [];
    // const data: Array<any> = [];
    // Set region if some was selected in filters
    if (this.listes.pays.length > 0) {
      console.log(this.listes.pays);
      for (let i = 0; i < this.listes.pays.length; ++i) {

        console.log(this.listes.pays[i], this.store.set.moyennes.pays[this.listes.pays[i]]);
        if(this.store.set.moyennes.pays[this.listes.pays[i]]){
          this.setDataset(this.DATA.RD.datasets, this.listes.pays[i], this.setCouleur(i, 'bleu'), this.store.set.moyennes.pays[this.listes.pays[i]]['RD']);
          console.log(this.store.set.moyennes.pays[this.listes.pays[i]]);
        }
        if(this.store.set.moyennes.pays[this.listes.pays[i]])
          this.setDataset(this.DATA.PR.datasets, this.listes.pays[i], this.setCouleur(i, 'bleu'), this.store.set.moyennes.pays[this.listes.pays[i]]['PR']);
      };
    }
    // Set region if some was selected in filters
    if (this.listes.regions.length > 0) {
      for (let i = 0; i < this.listes.regions.length; ++i) {
        if(this.store.set.moyennes.regions[this.listes.regions[i]])
          this.setDataset(this.DATA.RD.datasets, this.listes.regions[i], this.setCouleur(i, 'vert'), this.store.set.moyennes.regions[this.listes.regions[i]].RD);
        if(this.store.set.moyennes.regions[this.listes.regions[i]])
          this.setDataset(this.DATA.PR.datasets, this.listes.regions[i], this.setCouleur(i, 'vert'), this.store.set.moyennes.regions[this.listes.regions[i]].PR);
      };
    }
    // Add PDO
    if (this.pdo.length > 0) {
      for (let i = 0; i < this.pdo.length; ++i) {
        // this.setDataset(this.rendementsDS, this.pdo[i].pdo!, this.pdo[i].rendements.concat(this.pdo[i].predictions), this.setCouleur(i, 'rouge')); // DEPRECATED
        if(this.pdo[i])
          this.setDataset(this.DATA.RD.datasets, this.pdo[i].pdo!, this.setCouleur(i, 'rouge'), this.pdo[i].rendements);
        if(this.pdo[i])
          this.setDataset(this.DATA.PR.datasets, this.pdo[i].pdo!, this.setCouleur(i, 'rouge'), this.pdo[i].predictions);
      };
    }
    // this.rendementsDS.datasets.concat(this.pdo);
    console.log(this.DATA);
    // Refresh data on graph
    this.filtreRendementsDS();
  }
  /** Set dataset
   * @param {string} l Label to write on over
   * @param {any} d Array of data to write on graph
   * @param {string} c Color of line
  */
  setDataset(target:any, l: string, c: string = '#78281F', d:Array<number>) {
    console.log(d);
    const tmp = new Dataset();
    tmp.label = l;
    tmp.data = d;
    tmp.borderColor = c;
    if (!target.includes(tmp)) target.push(tmp);
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
        img = this.chartrd.getBase64Image();
        lien.setAttribute('download', 'predictions.png')
        break;
      case 'average':
        img = this.chartAvrd.getBase64Image();
        lien.setAttribute('download', 'averages.png')
        break;
      case 'growth':
        img = this.chartGrowthrd.getBase64Image();
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
