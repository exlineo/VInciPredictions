import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
import { FormBuilder } from '@angular/forms';
import { UIChart } from 'primeng/chart';
import { RendementI, ChartI, Chart, DatasetI } from 'src/app/utils/modeles/filtres-i';
import { ProfilI } from 'src/app/utils/modeles/profil-i';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { StoreService } from 'src/app/utils/services/store.service';
import { options } from '../../utils/chartOptions';

@Injectable({
  providedIn: 'root'
})
export class VisualService {

  // Forms local configuration
  config: any = { couleurs: {}, predictions: { debut: 2020, fin: 2032 }, rendements: { debut: 1981, fin: 2019 } }; // App config

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
  /** Year's gaps for yields and predictions */
  gap: any = { rd: 0, pr: 0 };

  pays: Array<any> = []; // List of countries
  listes: { pays: Array<string>, regions: Array<string>, pdo: Array<string> } = { pays: [], regions: [], pdo: [] }; // Liste of filters
  pdo: Array<RendementI> = []; // List of loaded PDOs in session

  chartsEls:Array<UIChart> = []; // List of charts to refresh

  constructor(private dbf:Firestore, public store:StoreService, public l:LanguesService, private fbuild:FormBuilder) {};

  /** Update user's profil
   * @param {number} uid uid to update
   * @param {ProfilI} profil Updated data
  */
   async updateOwnProfil(uid:string, profil:ProfilI){
    const customDoc = doc(this.dbf, 'comptes', uid);
    await setDoc(customDoc, JSON.parse(JSON.stringify(profil)), { merge: true })
    .then(p => this.l.msg.msgOk(this.l.t['MSG_DATA'], this.l.t['MSG_U_DESCR']))
    .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER'], er));
  }
  /** Initialise data and objects */
  initData(){
    this.chartOp = { nu: {}, left: {}, right: {}, barLeft: {}, barRight: {} };
    this.DATA = { RD: new Chart(), PR: new Chart(), RDAV: new Chart(), PRAV: new Chart(), RDGR: new Chart(), PRGR: new Chart() };
    this.gap = { rd: 0, pr: 0 };
    this.fF = this.fbuild.group({
      pays: [[]],
      regions: [[]],
      pdo: [[]],
      rendements: [this.store.config.rendements.debut],
      predictions: [this.store.config.predictions.fin],
      donnees: [true],
      moyennes: [true],
      croissance: [true],
      type: ['']
    });
  }
  /**
   * write a document on Firestore
   * @param collec Name of collection
   * @param data Object with UID to write
   * @returns {promise} Returns a promise
   */
   async setFireDoc(collec: string, data: { uid: string, doc: any }) {
    const customDoc = doc(this.dbf, collec, data.uid);
    return await setDoc(customDoc, JSON.parse(JSON.stringify(data.doc)), { merge: true }); // Mettre à jour un objet existant
  }
  // ============ MANIPULATE DATA =============
  /** Load PDO data from database
   */
  async filtrePdo() {
    this.pdo = [];
    // let ar = this.fF.controls.pdo.value!.map(p => p['name']);
    if (this.fF.controls.pdo.value!.length > 0) {
      // Get PDO data
      await this.store.getPdo(this.fF.controls.pdo.value as Array<string>)
        .then(d => {
          d.forEach(p => {
            this.pdo.push(p.data() as RendementI);
          });
          this.filtrePlages();
        })
    } else {
      this.filtrePlages();
    }
  }
  /** Filter dataset to get years */
  filtrePlages(e: any = null) {
    this.gap.rd = this.fF.controls.rendements.value - this.config.rendements.debut;
    this.gap.pr = this.fF.controls.predictions.value - this.config.predictions.fin;
    this.setFiltres();
  }
  /** Set data and show for yields and predictions on charts */
  setFiltres() {
    this.DATA.RD.labels = this.gap.rd != 0 ? this.store.chartsSudoe.labels.RD.slice(this.gap.rd, this.store.chartsSudoe.labels.RD.length) : [...this.store.chartsSudoe.labels.RD];
    this.DATA.PR.labels = this.gap.pr != 0 ? this.store.chartsSudoe.labels.PR.slice(0, this.gap.pr) : [...this.store.chartsSudoe.labels.PR];
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

    this.setAverage();
  }
  /** Get datasets from  */
  getDatasets(i: string) {
    const rd = { ...this.store.chartsSudoe.datasets.RD[i] };
    // this.DATA.RD.datasets.push(rd);
    this.DATA.RD.datasets.push(this.setPlageRd(rd));
    const pr = { ...this.store.chartsSudoe.datasets.PR[i] };
    this.DATA.PR.datasets.push(this.setPlagePr(pr));
  }
  /** Calculate gap in years with slides filters for yields  */
  setPlageRd(d: DatasetI) {
    if (this.gap.rd != 0) {
      d.data.slice(this.gap.rd, d.data.length);
    }
    return d;
  }
  /** Calculate gap in years with slides filters for predictions  */
  setPlagePr(d: DatasetI) {
    if (this.gap.pr != 0) {
      d.data.slice(0, this.gap.pr);
    }
    return d;
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
          gr.data.push(Math.round((av.data[i] * 100 / tmp.data[tmp.data.length - 1]) - 100));
        } else {
          gr.data.push(Math.round((av.data[i] * 100 / av.data[i - 1]) - 100));
        };
      });
      this.DATA.PRGR.datasets.push(gr);
    });
    // Refreshing HTML charts
    this.refreshCharts()
  }
  // =============== INTERFACE ================
  /** Refreshing charts in page */
  refreshCharts() {
    this.chartsEls.forEach( c => {
      c.refresh()});
  }
  /** Set color of graph with automated gradiant
   * @param {number} i index of color
   * @param {string} coul Color base
   */
  // setCouleur(i: number = 0, coul: string = 'bleu') {
  //   if (i > this.store.config.couleurs[coul].length - 1) i -= this.store.config.couleurs[coul].length - 1;
  //   return this.store.config.couleurs[coul][i];
  // }
  /**
   * Get image from a chart
   * @param localChart Chart from where the graph is extracted
   * @param name Name of the file to generate
   */
  imgDownloadStats(localChart:UIChart, name:string) {
    let img;
    const lien = document.createElement('a');
    img = localChart.getBase64Image();
    lien.setAttribute('download', name);
    lien.setAttribute('href', img.replace("image/png", "image/octet-stream"));
    lien.click();
  }
}
