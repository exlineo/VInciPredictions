import { Injectable } from '@angular/core';
import { Firestore, doc, writeBatch, setDoc, deleteDoc } from "@angular/fire/firestore";

import { FileI } from 'src/app/utils/modeles/file-i';
import { CreeI, MoyennesI, RendementI, YeildI } from 'src/app/utils/modeles/filtres-i';
import { ProfilI } from 'src/app/utils/modeles/profil-i';
import { LanguesService } from 'src/app/utils/services/langues.service';

@Injectable({
  providedIn: 'root'
})
export class PredictionsService {

  // loadedDataset: Array<RendementI> = []; // Data from database
  listeVersions: Array<string> = []; // List of loadedDataset versions in Firestore
  filesCSV: Array<FileI> = []; // List of files uploaded with datas
  // moyennes: { pays:any, regions:any } = {pays:{}, regions:{}}; // Updated lists of countries, regions, pdos and types
  batch = writeBatch(this.dbf); // Prepare write of new loadedDataset collection
  listeProfils: Array<ProfilI> = [];
  creeTmp?: CreeI;
  listeDataVersions: Array<CreeI> = []; // List of availlable data
  saveVersion:boolean = false; //

  constructor(private dbf: Firestore, public l: LanguesService) {
    // this.listeDatas();
  };

  /** Convert CSV data to RendementI array */
  setDataset(data: string) {
    this.l.store.set.data = [];
    let lignes = data.split('\n');
    lignes.forEach(l => {
      this.setPredictions(l);
    });
    this.l.msg.msgOk(this.l.t['MSG_LOAD'], this.l.t['MSG_VALID']);
  }
  /**
   * Set predictions array
   * @param p Object to convert
   */
  setPredictions(p: any) {
    p = p.replace(/[\r]/g, '').trim();
    let m = p.split(',');
    // this.loadedDataset.push(this.conversion(m));
    let tmp = this.conversion(m);
    this.l.store.set.data.push(tmp);
    // Create lists from data for countries, regions and pdo
    this.l.store.setFilterFromData(tmp);
    this.setAverages(); // Get average values
  }
  /** Convert excel line to JSON object */
  conversion(d: Array<any>): RendementI {
    const er:number = this.l.store.config.rendements.fin-this.l.store.config.rendements.debut+1;
    const ep:number = this.l.store.config.predictions.fin-this.l.store.config.rendements.debut+1;
    console.log(er, ep);
    return { pays: d[0].trim(), regions: d[1].trim(), pdo: d[2].trim(), rendements: this.setNumbers(d.slice(3, 3+er)), predictions: this.setNumbers(d.slice(3+er, 3+ep)), fiabilites: this.setNumbers(d.slice(3+ep, d.length)) };
    // return { pays: l[0].trim(), regions: l[1].trim(), type: l[2].trim(), pdo: l[3].trim(), rendements: this.setNumbers(l.slice(4, 55)), predictions: this.setNumbers(l.slice(44, 55)), fiabilites: this.setNumbers(l.slice(56, l.length)) };
  }
  /** Parse string to integer on dataset */
  setNumbers(a: Array<string>): Array<number> {
    return a.map(c => parseFloat(c));
  }
  /** Set average data from countries and regions
   * @param {array} ar Array to reduce to get values
  */
  av(ar: Array<RendementI>):YeildI {
    const truc: YeildI = {RD:[], PR:[]};
    for (let i = 0; i < ar[0].rendements.length; ++i) {
      // ATTENTION, LE 0 APRES RENDEMENTS[i] PEUT BIAISER LES MOYENNES MAIS CA EVITE LES ERREURS (NaN) SI LA DONNEE N'EST PAS RENSEIGNEE
      truc.RD.push(Math.round(ar.reduce((p, c) => p + c.rendements[i] | 0, 0) / ar.length));
    };
    for (let i = 0; i < ar[0].predictions.length; ++i) {
      // ATTENTION, LE 0 APRES RENDEMENTS[i] PEUT BIAISER LES MOYENNES MAIS CA EVITE LES ERREURS (NaN) SI LA DONNEE N'EST PAS RENSEIGNEE
      truc.PR.push(Math.round(ar.reduce((p, c) => p + c.predictions[i] | 0, 0) / ar.length));
    };
    return truc;
  }
  /** Calculate averages values on countries and regions */
  setAverages() {
    // Set averages for countries
    this.l.store.listes.pays.forEach(d => {
      const pays = this.l.store.set.data.filter(p => d && p.pays == d && d.length > 0);
      pays.forEach(p => {
        if (p.pays && p.pays.length > 0) this.l.store.set.moyennes!.pays[p.pays] = this.av(pays);
      })
    });
    // Set averages for regions
    this.l.store.listes.regions.forEach(d => {
      const regions = this.l.store.set.data.filter(p => d && p.regions == d && d.length > 0);
      regions.forEach(r => {
        if (r.regions && r.regions.length > 0) this.l.store.set.moyennes!.regions[r.regions] = this.av(regions);
      })
    });
  }
  /** List predictions versions data in SELECT on data-maj */
  listeDatas() {
    this.l.store.getFireCol('data')
      .then(d => d.forEach(
        f => {
          // const d = f.data() as CrreI;
          // this.listeVersions.push(d.collection);
        }
      ))
      .catch(er => console.log(er));
  };
  /**
   * Write documents from a new data uploaded
   * @param time time to set name time of the collection, globally not useful
   * @returns {promise} Returns a promise
   */
  async batchFireCollecDocs(time:number = -1) {
    let n = 0;
    const col = this.setDate();
    this.creeTmp = { time: time == -1 ? Date.now() : time, collection: this.setDate() };
    this.batch.set(doc(this.dbf, col, 'creeLe'), this.creeTmp);
    this.batch.set(doc(this.dbf, col, 'moyennes'), this.l.store.set.moyennes);
    this.l.store.set.data.forEach(d => {
      const customDoc = doc(this.dbf, col, n.toString());
      this.batch.set(customDoc, d);
      ++n;
    });
    /** Commit data to write */
    await this.batch.commit()
      .then(d => {
        this.l.store.setFireDoc('data', { uid: String(this.creeTmp?.time), doc: this.creeTmp })
        this.l.msg.msgOk(this.l.t['MSG_MAJ']);
      })
      .catch(er => console.log(er));
  }
  /** Add loadedDataset formatted as array in Firebase */
  docFireAdd() {
    this.l.store.set.creeLe!.time = Date.now();
    this.batchFireCollecDocs();
  }
  /**
   * Delete a document
   * @param doc Document to delete
   */
  async delFireDoc(collec:string, id:string){
    await deleteDoc(doc(this.dbf, collec, id));
  }
  /** Create ID for a new loadedDataset version */
  setDate(d: string = 'dataset:'): string {
    const date = new Date();
    return d + `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}:${date.getHours()}h${date.getMinutes()}mn${date.getSeconds()}s`;
  }
  /** Get complete dataset from Firestore
   * @param {event} e Event send by select HtmlElement
   */
  getData(e: any) {
    this.saveVersion = true;
    this.l.store.setSet(e.target.value);
  }
  /** List accounts */
  getListeProfils() {
    this.l.store.getFireCol('comptes')
      .then(c => {
        this.listeProfils = [];
        c.forEach(d => {
          this.listeProfils.push(d.data() as ProfilI);
        });
        // this.l.msg.msgOk(this.l.t['MSG_LOAD'], this.l.t['MSG_VALID']);
      })
      .catch(er => {
        console.log(er);
        this.l.msg.msgFail(this.l.t['MSG_ER'], er);
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
  /** Update user's profil
   * @param {number} i index of the user in the user's list
  */
  async updateProfil(i: number) {
    const customDoc = doc(this.dbf, 'comptes', this.listeProfils[i].u.uid!);
    await setDoc(customDoc, JSON.parse(JSON.stringify(this.listeProfils[i])), { merge: true })
      .then(p => this.l.msg.msgOk(this.l.t['MSG_DATA'], this.l.t['MSG_U_DESCR']))
      .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER'], er));
  }
  /** Get access from promotionnal code
   * @param { string } code Promotionnal code
  */
  getAccessFromCode(code: string) {
    const infos:Array<string> = code.split('-');
    const access = JSON.parse(atob(infos[1]));
    return access;
  }
}
