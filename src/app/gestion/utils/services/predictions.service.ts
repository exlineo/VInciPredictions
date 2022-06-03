import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { getDownloadURL, getStorage, list, listAll, ref } from '@angular/fire/storage';
// import { getMetadata } from 'firebase/storage';
import { writeBatch, doc, getDoc, setDoc } from "@angular/fire/firestore";

import { FileI } from 'src/app/utils/modeles/file-i';
import { DataI, RendementI } from 'src/app/utils/modeles/filtres-i';
import { ProfilI } from 'src/app/utils/modeles/profil-i';
import { StoreService } from 'src/app/utils/services/store.service';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictionsService {

  // loadedDataset: Array<RendementI> = []; // Data from database
  listeVersions: Array<string> = []; // List of loadedDataset versions in Firestore
  filesCSV: Array<FileI> = []; // List of files uploaded with datas
  // moyennes: { pays:any, regions:any } = {pays:{}, regions:{}}; // Updated lists of countries, regions, pdos and types
  batch = writeBatch(this.store.dbf); // Prepare write of new loadedDataset collection
  listeProfils: Array<ProfilI> = [];

  constructor(private http: HttpClient, public store: StoreService) {
    this.listeDatas();
  };
  /**
   * Load CSV and filter data to set the database
   */
  getCSV(file: string = environment.csvUrl) {
    this.store.set.data = [];
    this.http.get(file, { responseType: 'text' }).subscribe(d => {
      let lignes = d.split('\n');
      lignes.forEach(l => {
        this.setPredictions(l);
      });
    });
  }
  /** Convert CSV data to RendementI array */
  setDataset(data: string) {
    this.store.set.data = [];
    let lignes = data.split('\n');
    lignes.forEach(l => {
      this.setPredictions(l);
    });
  }
  /**
   * Set predictions array
   * @param l Object to convert
   */
  setPredictions(l: any) {
    l = l.replace(/[\r]/g, '').trim();
    let m = l.split(',');
    // this.loadedDataset.push(this.conversion(m));
    let tmp = this.conversion(m);
    this.store.set.data.push(tmp);
    // Create lists from data for countries, regions and pdo
    this.store.setFilterFromData(tmp);
    this.setAverages(); // Get average values
  }
  /** Convert excel line to JSON object */
  conversion(l: Array<any>): RendementI {
    return { pays: l[0].trim(), regions: l[1].trim(), type: l[2].trim(), pdo: l[3].trim(), rendements: this.setNumbers(l.slice(4, 55)), predictions: this.setNumbers(l.slice(44, 55)), fiabilites: this.setNumbers(l.slice(56, l.length)) };
  }
  /** Parse string to integer on dataset */
  setNumbers(a: Array<string>): Array<number> {
    return a.map(c => parseInt(c));
  }
  /** Set average data from countries and regions
   * @param {array} ar Array to reduce to get values
  */
   av(ar:Array<RendementI>){
    const truc:any = [];
     for(let i=0; i<ar[0].rendements.length; ++i){
       // ATTENTION, LE 0 APRES RENDEMENTS[i] PEUT BIAISER LES MOYENNES MAIS CA EVITE LES ERREURS (NaN) SI LA DONNEE N'EST PAS RENSEIGNEE
        truc.push(Math.round(ar.reduce( ( p, c ) => p + c.rendements[i] | 0, 0 ) / ar.length));
      };
      return truc;
  }
  /** Calculate averages values on countries and regions */
  setAverages(){
    // Averages on countries in data
    this.store.listes.pays.forEach(d => {
      const pays = this.store.set.data.filter(p => d && p.pays == d && d.length > 0);
      pays.forEach(p => {
        if(p.pays && p.pays.length > 0) this.store.set.moyennes!.pays[p.pays] = this.av(pays);
      })
    });
    // Averages on regions
    this.store.listes.regions.forEach(d => {
      const regions = this.store.set.data.filter(p => d && p.regions == d && d.length > 0);
      regions.forEach(r => {
        if(r.regions && r.regions.length > 0) this.store.set.moyennes!.regions[r.regions] = this.av(regions);
      })
    });
  }
  /** List predictions versions data */
  listeDatas() {
    this.store.getFireCol('predictions')
      .then(d => d.forEach(
        f => {
          this.listeVersions.push(f.id);
        }
      ));
  };
  /**
   * Write documents from a new data uploaded
   * @param collec Name of collection
   * @param data Object with UID to write
   * @returns {promise} Returns a promise
   */
  // async batchFireCollecDocs() {
  //   let n = 0;
  //   this.loadedDataset.forEach(d => {
  //     const customDoc = doc(this.store.dbf, this.setColName(), n.toString());
  //     this.batch.set(customDoc, d);
  //     ++n;
  //   })
  //   return await this.batch.commit(); // Commit data to write
  // }
  /** Add loadedDataset formatted as array */
  docFireAdd() {
    this.store.set.creeLe = Date.now();
    console.log(this.store.set);
    this.store.setFireDoc('predictions', { uid: this.setColName(), doc:this.store.set })
  }
  /** Create ID for a new loadedDataset version */
  setColName() {
    const date = new Date();
    return `dataset-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}:${date.getHours()}h${date.getMinutes()}mn${date.getSeconds()}s`;
  }
  /** Get dataset from Firestore
   * @param {event} e Event send by select HtmlElement
   */
  getData(e: any) {
    this.store.getFireDoc('predictions', e.target.value)
      .then(d => d.data() as DataI)
      .then(d => {
        this.store.set = d; // Data loaded
        this.store.setFilters(); // Create filters from data
        this.setAverages(); // Get average values on countries and regions
      })
      .catch(er => console.log(er))
  }
  /** List accounts */
  getListeProfils() {
    this.store.getFireCol('comptes')
      .then(c => {
        this.listeProfils = [];
        c.forEach(d => {
          this.listeProfils.push(d.data() as ProfilI);
        })
      })
      .catch(er => console.log(er));
  }
}
