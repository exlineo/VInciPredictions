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

  loadedDataset: Array<RendementI> = []; // Data from database
  listeVersions: Array<string> = []; // List of loadedDataset versions in Firestore
  filesCSV: Array<FileI> = []; // List of files uploaded with datas
  listes: { pays: Array<string>, regions: Array<string>, pdo: Array<string> } = { pays: [], regions: [], pdo: [] }; // Updated lists of countries, regions, pdos and types
  batch = writeBatch(this.store.dbf); // Prepare write of new loadedDataset collection
  listeProfils: Array<ProfilI> = [];

  constructor(private http: HttpClient, public store: StoreService) {
    this.listeDatas();
  };
  /**
   * Load CSV and filter data to set the database
   */
  getCSV(file: string = environment.csvUrl) {
    this.http.get(file, { responseType: 'text' }).subscribe(d => {
      let lignes = d.split('\n');
      lignes.forEach(l => {
        this.setPredictions(l);
      });
    });
  }
  /** Convert CSV data to RendementI array */
  setDataset(data: string) {
    this.store.dataset = [];
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
    this.store.dataset.push(tmp);
    console.log(m);
    // Create lists from data for countries, regions and pdo
    this.store.setFilterFromData(tmp);
  }
  /** Convert excel line to JSON object */
  conversion(l: Array<any>): RendementI {
    return { pays: l[0].trim(), regions: l[1].trim(), type: l[2].trim(), pdo: l[3].trim(), rendements: this.setNumbers(l.slice(4, 43)), predictions: this.setNumbers(l.slice(44, 55)), fiabilites: this.setNumbers(l.slice(56, l.length)) };
  }
  /** Parse string to integer on dataset */
  setNumbers(a: Array<string>): Array<number> {
    return a.map(c => parseInt(c));
  }
  /** List files from fire bucket to get archived datas */
  listeFiles() {
    // let fireStore = getStorage();
    // let listRef = ref(fireStore, 'gs://vinciplateforme');

    // listAll(listRef).then((res) => {
    //   res.prefixes.forEach((folderRef) => {
    //   });
    //   res.items.forEach((itemRef) => {
    //     // console.log('item', itemRef);
    //     getMetadata(itemRef).then(meta => {
    //       this.filesCSV.push({ nom: meta.name, creation: meta.timeCreated, maj: meta.updated, taille: meta.size, bucket: meta.bucket });
    //       console.log('meta', meta);
    //     });
    //   });
    // }).catch((er) => {
    //   console.log(er)
    // });
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
   * Write documents from a new data upload
   * @param collec Name of collection
   * @param data Object with UID to write
   * @returns {promise} Returns a promise
   */
  async batchFireCollecDocs() {
    let n = 0;
    this.loadedDataset.forEach(d => {
      const customDoc = doc(this.store.dbf, this.setColName(), n.toString());
      this.batch.set(customDoc, d);
      ++n;
    })
    return await this.batch.commit(); // Commit data to write
  }
  /** Add loadedDataset formatted as array */
  docFireAdd() {
    this.store.setFireDoc('predictions', { uid: this.setColName(), doc: { data: this.store.dataset, creeLe:Date.now() } })
  }
  /** Create ID for a new loadedDataset version */
  setColName() {
    const date = new Date();
    return `loadedDataset-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}:${date.getHours()}h${date.getMinutes()}mn${date.getSeconds()}s`;
  }
  /** Get loadedDataset from Firestore
   * @param {event} e Event send by select HtmlElement
   */
  getData(e: any) {
    this.store.getFireDoc('predictions', e.target.value)
      .then(d => d.data() as DataI)
      .then(d => {
        this.store.dataset = d.data; // Data loaded send to store
        this.store.setFilters(); // Create filters from data
      })
      .catch(er => console.log(er))
  }
  /** List accounts */
  getListeProfils() {
    this.store.getFireCol('comptes')
      .then(c => {
        c.forEach(d => {
          this.listeProfils.push(d.data() as ProfilI);
          console.log(d.data(), d.id);
        })
      })
      .catch(er => console.log(er));
  }
}
