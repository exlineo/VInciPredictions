import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
import { FormBuilder } from '@angular/forms';
import { UIChart } from 'primeng/chart';
import { RendementI, Chart, DatasetI } from 'src/app/utils/modeles/filtres-i';
import { ProfilI } from 'src/app/utils/modeles/profil-i';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { StoreService } from 'src/app/utils/services/store.service';
import { options } from '../../utils/chartOptions';

@Injectable({
  providedIn: 'root'
})
export class VisualService {
  /** Filter form */
  fF = this.fbuild.group({
    pays: [[]],
    regions: [[]],
    pdo: [[]],
    bordeaux: [[]],
    rendements: [this.store.config.rendements.debut],
    predictions: [this.store.config.predictions.fin],
    donnees: [true],
    moyennes: [true],
    croissance: [true],
    type: ['']
  });
  chartType: string = 'line'; // Default charts style (lines)
  // chartOp = { nu: {}, left: {}, right: {}, barLeft: {}, barRight: {} };
  chartOp: any = { left: {}, right: {}, RD: {}, PR: {}, PRGR:{}, RDGR:{}, RDB: {}, PRB: {}, PRGRB:{}, RDGRB:{} }; // Options for charts
  /** All data for charts (sudoe zone) */
  DATA: any = { RD: new Chart(), PR: new Chart(), RDAV: new Chart(), PRAV: new Chart(), RDGR: new Chart(), PRGR: new Chart() };
  /** All data for charts (Bordeaux) */
  DATA_B: any = { RD: new Chart(), PR: new Chart(), RDAV: new Chart(), PRAV: new Chart(), RDGR: new Chart(), PRGR: new Chart() };
  /** Year's gaps for yields and predictions */
  gap: any = { rd: 0, pr: 0 };

  scales = {min:0, max:25, grmin:-25, grmax:25};
  minimum: number = 0;
  maximum: number = 25;

  pays: Array<any> = []; // List of countries
  listes: { pays: Array<string>, regions: Array<string>, pdo: Array<string>, bordeaux: Array<string> } = { pays: [], regions: [], pdo: [], bordeaux: [] }; // Liste of filters
  pdo: Array<RendementI> = []; // List of loaded PDOs from SUDOE zone
  bordeaux: Array<RendementI> = []; // List of PDOs from Bordeaux
  chartsEls: Array<UIChart> = []; // List of charts of Sudoe to refresh
  chartsBEls: Array<UIChart> = []; // List of charts pf Bordeaux to refresh

  constructor(private dbf: Firestore, public store: StoreService, public l: LanguesService, private fbuild: FormBuilder) { };

  /** Update user's profil
   * @param {number} uid uid to update
   * @param {ProfilI} profil Updated data
  */
  async updateOwnProfil(uid: string, profil: ProfilI) {
    const customDoc = doc(this.dbf, 'comptes', uid);
    await setDoc(customDoc, JSON.parse(JSON.stringify(profil)), { merge: true })
      .then(p => this.l.msg.msgOk(this.l.t['MSG_DATA'], this.l.t['MSG_U_DESCR']))
      .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER'], er));
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
  /** Load PDO data from database in SUDOE
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
  /** Load PDO data from database in Bordeaux */
  async filtreBordeauxPdo() {
    this.bordeaux = [];
    // let ar = this.fF.controls.pdo.value!.map(p => p['name']);
    if (this.fF.controls.bordeaux.value!.length > 0) {
      this.bordeaux = [];
      // Get PDO data
      await this.store.getBordeauxPdo(this.fF.controls.bordeaux.value as Array<string>)
        .then(d => {
          d.forEach(p => {
            this.bordeaux.push(p.data() as RendementI);
          });
          this.filtrePlages(null, 'bordeaux');
        })
    } else {
      this.filtrePlages(null, 'bordeaux');
    }
  }
  /** Define start and end of data scale in charts (yields and predictions) */
  setGaps() {
    this.gap.rd = this.fF.controls.rendements.value! - this.store.config.rendements.debut;
    this.gap.pr = this.fF.controls.predictions.value! - this.store.config.predictions.fin;
  }
  /** Filter dataset to get years */
  filtrePlages(e: any = null, filtre:string = 'sudoe') {
    this.setGaps();
    filtre == 'sudoe' ? this.setFiltres() : this.setBordeauxFiltres();
  }
  // filtreBordeauxPlages(e: any = null) {
  //   this.setGaps();
  //   this.setBordeauxFiltres();
  // }
  /** Set data and show for yields and predictions on charts */
  setFiltres() {
    this.DATA.RD.labels = this.gap.rd != 0 ? this.store.chartsSudoe.labels.RD.slice(this.gap.rd, this.store.chartsSudoe.labels.RD.length) : [...this.store.chartsSudoe.labels.RD];
    this.DATA.PR.labels = this.gap.pr != 0 ? this.store.chartsSudoe.labels.PR.slice(0, this.gap.pr) : [...this.store.chartsSudoe.labels.PR];
    this.DATA.RD.datasets = [];
    this.DATA.PR.datasets = [];
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

    this.setAverage(this.DATA); // Calculate average values for chart data
    this.setScalesSudoe(); // Calculate min and max for charts scale
  }
  /** Set data and show for yields and predictions on charts */
  setBordeauxFiltres() {
    this.DATA_B.RD.labels = this.gap.rd != 0 ? this.store.chartsBordeaux.labels.RD.slice(this.gap.rd, this.store.chartsBordeaux.labels.RD.length) : [...this.store.chartsBordeaux.labels.RD];
    this.DATA_B.PR.labels = this.gap.pr != 0 ? this.store.chartsBordeaux.labels.PR.slice(0, this.gap.pr) : [...this.store.chartsBordeaux.labels.PR];
    this.DATA_B.RD.datasets = [];
    this.DATA_B.PR.datasets = [];
    // Add PDO
    if (this.bordeaux.length > 0) {
      for (let i = 0; i < this.bordeaux.length; ++i) {
        this.getBordeauxDatasets(this.bordeaux[i].pdo!);
      };
    }
    this.setAverage(this.DATA_B); // Calculate average values for chart data
    this.setScalesBordeaux(); // Calculate min and max for charts scale
  }
  /** Get datasets from  */
  getDatasets(i: string) {
    const rd = { ...this.store.chartsSudoe.datasets.RD[i] };
    this.DATA.RD.datasets.push(this.setPlageRd(rd));
    // this.DATA.RD.datasets.push(rd);

    const pr = { ...this.store.chartsSudoe.datasets.PR[i] };
    this.DATA.PR.datasets.push(this.setPlagePr(pr));
    // this.DATA.PR.datasets.push(pr);
  }
  /** Get datasets from  */
  getBordeauxDatasets(i: string) {
    const rd = { ...this.store.chartsBordeaux.datasets.RD[i] };
    this.DATA_B.RD.datasets.push(this.setPlageRd(rd));
    // this.DATA_B.RD.datasets.push(rd);

    const pr = { ...this.store.chartsBordeaux.datasets.PR[i] };
    this.DATA_B.PR.datasets.push(this.setPlagePr(pr));
    // this.DATA_B.PR.datasets.push(pr);
  }
  /** Calculate gap in years with slides filters for yields  */
  setPlageRd(d: DatasetI) {
    if (this.gap.rd != 0) {
      d.data = d.data.slice(this.gap.rd, d.data.length);
    }
    return d;
  }
  /** Calculate gap in years with slides filters for predictions  */
  setPlagePr(d: DatasetI) {
    if (this.gap.pr != 0) {
      d.data = d.data.slice(0, this.gap.pr);
    }
    return d;
  }
  /** Calculate and show the average data */
  setAverage(data: any) {
    this.scales = {min:0, max:25, grmin:-100, grmax:100};

    // Calculate average data, 5 years and purcent growth on years
    data.RDAV.labels = data.RD.labels.slice(4, data.RD.labels.length);
    data.RDGR.labels = data.RD.labels.slice(1, data.RD.labels.length);
    // data.PRAV.labels = data.RD.labels.slice(3, data.PR.labels.length);
    data.PRGR.labels = data.PR.labels;

    data.RDAV.datasets = [];
    data.RDGR.datasets = [];

    data.PRGR.datasets = [];

    // Calculate purcent growth on years
    data.RD.datasets.forEach((av: DatasetI) => {
      // Empty datasets containers
      const rd: DatasetI = { label: av.label, borderColor: av.borderColor, backgroundColor: av.borderColor, data: [] }; // Yields datas average
      const gr: DatasetI = { label: av.label, backgroundColor: av.borderColor, data: [] }; // Growth data purcent

      av.data.forEach((d, i) => {
        let n = 0;
        if (i > 3) {
          // Add average data to data array
          rd.data.push(Math.round((av.data[i - 4] + av.data[i - 3] + av.data[i - 2] + av.data[i - 1] + av.data[i]) / 5));
        };
        if (i > 0) {
          n = (av.data[i] * 100 / av.data[i - 1]) - 100
          gr.data.push(n);
        };
        // Calculate scale for charts
        if (av.data[i] < this.scales.min) this.scales.min = Math.floor(av.data[i]);
        if (av.data[i] > this.scales.max) this.scales.max = Math.ceil(av.data[i]);

        if (n < this.scales.grmin && n != -Infinity) this.scales.grmin = Math.floor(n);
        if (n > this.scales.grmax && n != Infinity) this.scales.grmax = Math.ceil(n);

      });
      // Set datasets for average charts
      data.RDAV.datasets.push(rd);
      data.RDGR.datasets.push(gr);
    });
    /** Calculate growth prediction in purcent */
    data.PR.datasets.forEach((av: DatasetI) => {
      // Empty datasets containers
      const gr: DatasetI = { label: av.label, backgroundColor: av.borderColor, data: [] }; // Growth data purcent

      av.data.forEach((d, i) => {
        let n = 0;
        if (i == 0) {
          const tmp = data.RD.datasets[data.RD.datasets.length - 1];
          n = Math.round((av.data[i] * 100 / tmp.data[tmp.data.length - 1]) - 100);
        } else {
          n = Math.round((av.data[i] * 100 / av.data[i - 1]) - 100);
        };
        gr.data.push(n == -100 || Number.isNaN(n) || n == Infinity || n == -Infinity ? 0 : n);
        console.log("Pourcentage des prédictions", gr, n);
        // Calculate scale for charts
        if (n < this.scales.grmin && n != -Infinity) this.scales.grmin = Math.floor(n);
        if (n > this.scales.grmax && n != Infinity) this.scales.grmax = Math.ceil(n);
      });
      data.PRGR.datasets.push(gr);

    });
    console.log(data);
    // Refreshing HTML charts
    this.refreshCharts(data);
  }
  // =============== INTERFACE ================
  /** Set min and max values for charts scales */
  setScalesSudoe() {
    this.chartOp.RD = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false, 'left', this.scales.min, this.scales.max);
    this.chartOp.PR = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false, 'right', this.scales.min, this.scales.max);

    this.chartOp.RDGR = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false, 'left', this.scales.grmin, this.scales.grmax);
    this.chartOp.PRGR = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false, 'right', this.scales.grmin, this.scales.grmax);
  }
  setScalesBordeaux() {
    this.chartOp.RDB = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false, 'left', this.scales.min, this.scales.max);
    this.chartOp.PRB = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false, 'right', this.scales.min, this.scales.max);

    this.chartOp.RDGRB = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false, 'left', this.scales.grmin, this.scales.grmax);
    this.chartOp.PRGRB = options(this.l.t['FORM_ANNEES'], this.l.t['FORM_RENDEMENTS'], false, 'right', this.scales.grmin, this.scales.grmax);
  }
  /** Refreshing charts in page */
  refreshCharts(data: any) {
    if (data == this.DATA) {
      this.chartsEls.forEach(c => {
        c.refresh();
      });
    } else {
      this.chartsBEls.forEach(c => {
        console.log("refresh con", c, this.scales);
        c.refresh();
      });
    }
  }
  /**
   * Get image from a chart
   * @param localChart Chart from where the graph is extracted
   * @param name Name of the file to generate
   */
  imgDownloadStats(localChart: UIChart, name: string) {
    let img;
    const lien = document.createElement('a');
    img = localChart.getBase64Image();
    lien.setAttribute('download', name);
    lien.setAttribute('href', img.replace("image/png", "image/octet-stream"));
    lien.click();
  }
}
