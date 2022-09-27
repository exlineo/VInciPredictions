import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DatasetI, RendementI, ChartI, Chart } from 'src/app/utils/modeles/filtres-i';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { StoreService } from 'src/app/utils/services/store.service';
import { Subscription } from 'rxjs';
import { UIChart } from 'primeng/chart';
import { options } from '../utils/chartOptions';

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
  // @ViewChild('averagePredictions') chartAvpr!: UIChart;
  @ViewChild('growthPredictions') chartGrowthpr!: UIChart;

  config: any = { couleurs: {}, predictions: { debut: 2020, fin: 2032 }, rendements: { debut: 1981, fin: 2019 } }; // App config

  filtres: Array<string> = []; // Ensemble des filtres appliqués
  l$!: Subscription; // Subscribe to translation loading
  config$!: Subscription; // Subscribe to configuration loading observable
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
  chartOp = { nu: {}, left: {}, right: {}, barLeft: {}, barRight: {} };

  /** All data for charts */
  DATA: any = { RD: new Chart(), PR: new Chart(), RDAV: new Chart(), PRAV: new Chart(), RDGR: new Chart(), PRGR: new Chart() };

  pays: Array<any> = []; // List of countries
  infos: boolean = false; // Show / hide infos on click
  listes: { pays: Array<string>, regions: Array<string>, pdo: Array<string> } = { pays: [], regions: [], pdo: [] }; // Liste of filters
  pdo: Array<RendementI> = [];

  constructor(public l: LanguesService, public fbuild: FormBuilder, public store: StoreService) { }

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
      this.chartOp.left = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false, 'left', 0, 100);
      this.chartOp.right = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false, 'right', 0, 100);
      this.chartOp.nu = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false);
      this.chartOp.barLeft = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false, 'left', -100, 500);
      this.chartOp.barRight = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false, 'right', -100, 500);
    }
    );
    /** Get config and   */
    this.config$ = this.store.config$.subscribe(c => {
      // Get last version of data from database
      this.store.getLastData();
    });
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
  /** Set data and show for yields and predictions on charts */
  setFiltres() {
    this.DATA.RD.labels = [...this.store.charts.labels.RD];
    this.DATA.PR.labels = [...this.store.charts.labels.PR];
    this.DATA.RD.datasets = [];
    this.DATA.PR.datasets = [];
    // const data: Array<any> = [];
    // Set region if some was selected in filters
    if (this.listes.pays.length > 0) {
      for (let i = 0; i < this.listes.pays.length; ++i) {
        this.getDatasets(this.listes.pays[i]);
      };
    }
    // Set region if some was selected in filters
    if (this.listes.regions.length > 0) {
      for (let i = 0; i < this.listes.regions.length; ++i) {
        this.getDatasets(this.listes.regions[i]);
      };
    }
    // Add PDO
    if (this.pdo.length > 0) {
      for (let i = 0; i < this.pdo.length; ++i) {
        this.getDatasets(this.pdo[i].pdo!);
      };
    }
    // Refresh data on graph
    this.applyFilters();
  }
  /** Get datasets from  */
  getDatasets(i: string) {
    const rd = { ...this.store.charts.datasets.RD[i] };
    this.DATA.RD.datasets.push(rd);
    const pr = { ...this.store.charts.datasets.PR[i] };
    this.DATA.PR.datasets.push(pr);
  }
  /** Filter dataset to get years */
  applyFilters(e: any = null) {

    if (this.fF.controls.rendements.value != this.store.config.debut || this.fF.controls.predictions.value != this.store.config.fin) {
      // const rd = this.fF.controls.rendements.value ? this.fF.controls.rendements.value - this.store.config.rendements.debut : 0;
      // const rdLength = (this.store.config.rendements.fin - this.store.config.rendements.debut) - rd;
      // const pr = this.fF.controls.predictions.value ? this.store.config.predictions.fin - this.fF.controls.predictions.value : 0;
      // const prLength = (this.store.config.predictions.fin - this.store.config.predictions.debut) - pr;

      // this.DATA.RD.labels = [];
      // this.DATA.PR.labels = [];
      // // Calculer les nouveaux labels sur le graph
      // for (let i = 0; i < rdLength; ++i) {
      //   this.DATA.RD.labels.push(this.fF.controls.rendements.value + i);
      // };
      // for (let i = 0; i < prLength; ++i) {
      //   this.DATA.PR.labels.push(this.store.config.predictions.debut + i);
      // };
      // // Cut datasets from years
      // this.DATA.RD.datasets.forEach((ds: DatasetI) => {
      //   console.log("Data RD", ds);
      //   if (ds.data) ds.data.splice(0, ds.data.length);
      // });
      // this.DATA.PR.datasets.forEach((ds: DatasetI) => {
      //   if (ds.data) ds.data.splice(0, prLength);
      // });
    }
    this.chartrd.refresh();
    this.chartpr.refresh();
    if (this.fF.controls.moyennes.value || this.fF.controls.croissance.value) this.setAverage();
  }
  /** Calculate and show the average data */
  setAverage() {
    // Calculate average data, 5 years and purcent growth on years
    this.DATA.RDAV.labels = this.DATA.RD.labels.slice(4, this.DATA.RD.labels.length);
    this.DATA.RDGR.labels = this.DATA.RD.labels.slice(1, this.DATA.RD.labels.length);
    // this.DATA.PRAV.labels = this.DATA.RD.labels.slice(3, this.DATA.PR.labels.length);
    this.DATA.PRGR.labels = this.DATA.PR.labels;

    this.DATA.RDAV.datasets = [];
    this.DATA.RDGR.datasets = [];

    this.DATA.PRGR.datasets = [];

    // Calculate purcent growth on years
    this.DATA.RD.datasets.forEach((av: DatasetI) => {
      // Empty datasets containers
      const rd: DatasetI = { label: av.label, borderColor: av.borderColor, backgroundColor: av.borderColor, data: [] }; // Yields datas average
      const gr: DatasetI = { label: av.label, backgroundColor: av.borderColor, data: [] }; // Growth data purcent

      av.data.forEach((d, i) => {
        if (i > 3) {
          // Add average data to data array
          rd.data.push(Math.round((av.data[i - 4] + av.data[i - 3] + av.data[i - 2] + av.data[i - 1] + av.data[i]) / 5));
        };
        if (i > 0) {
          gr.data.push((av.data[i] * 100 / av.data[i - 1]) - 100);
        };
      });
      this.DATA.RDAV.datasets.push(rd);
      this.DATA.RDGR.datasets.push(gr);
    });
    /** Calculate growth prediction in purcent */
    this.DATA.PR.datasets.forEach((av: DatasetI) => {
      // Empty datasets containers
      const gr: DatasetI = { label: av.label, backgroundColor: av.borderColor, data: [] }; // Growth data purcent

      av.data.forEach((d, i) => {
        if (i == 0) {
          const tmp = this.DATA.PR.datasets[this.DATA.PR.datasets.length - 1];
          console.log(av.data[i], tmp.data[tmp.data.length - 1]);
          gr.data.push(Math.round((av.data[i] * 100 / tmp.data[tmp.data.length - 1]) - 100));
        } else {
          gr.data.push(Math.round((av.data[i] * 100 / av.data[i - 1]) - 100));
        };
      });
      this.DATA.PRGR.datasets.push(gr);
    });

    this.chartAvrd.refresh();
    // this.chartAvpr.refresh();
    this.chartGrowthrd.refresh();
    this.chartGrowthpr.refresh();
    console.log(this.DATA.PRGR.datasets);
  }
  /** Set color of graph with automated gradiant
   * @param {number} i index of color
   * @param {string} coul Color base
   */
  setCouleur(i: number = 0, coul: string = 'bleu') {
    if (i > this.store.config.couleurs[coul].length - 1) i -= this.store.config.couleurs[coul].length - 1;
    return this.store.config.couleurs[coul][i];
  }
  /** Download img */
  downloadStats(el: string) {
    let img;
    const lien = document.createElement('a');
    // this.chart.toDataURL('image/png');
    switch (el) {
      case 'chart':
        // console.log(this.chart.getCanvas());
        img = this.chartrd.getBase64Image();
        lien.setAttribute('download', 'yields.png')
        break;
      case 'chartPredictions':
        // console.log(this.chart.getCanvas());
        img = this.chartpr.getBase64Image();
        lien.setAttribute('download', 'yieldsPredictions.png')
        break;
      case 'average':
        img = this.chartAvrd.getBase64Image();
        lien.setAttribute('download', 'averages.png')
        break;
      case 'averagePredictions':
        img = this.chartAvrd.getBase64Image();
        lien.setAttribute('download', 'averagesPredictions.png')
        break;
      case 'growth':
        img = this.chartGrowthrd.getBase64Image();
        lien.setAttribute('download', 'growths.png')
        break;
      case 'chartPredictions':
        // console.log(this.chart.getCanvas());
        img = this.chartGrowthpr.getBase64Image();
        lien.setAttribute('download', 'growthPredictions.png')
        break;
    };
    lien.setAttribute('href', img.replace("image/png", "image/octet-stream"));
    lien.click();
  }
  /** Clear observable on navigation change to avoid data overload */
  ngOnDestroy() {
    this.l$.unsubscribe();
    this.config$.unsubscribe();
  }
}
