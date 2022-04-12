import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getDownloadURL, getStorage, list, listAll, ref } from '@angular/fire/storage';
import { getMetadata } from 'firebase/storage';
import { FileI } from 'src/app/utils/modeles/file-i';
import { RendementI } from 'src/app/utils/modeles/filtres-i';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictionsService {

  dataset: Array<RendementI> = []; // Data from database
  filesCSV: Array<FileI> = []; // List of files uploaded with datas
  listes:{pays:Array<string>, regions:Array<string>, pdo:Array<string>} = {pays:[], regions:[], pdo:[]}; // Updated lists of countries, regions, pdos and types

  constructor(private http: HttpClient) {
    this.listeFiles();
  };
  /**
   * Load CSV and filter data to set the database
   */
  getCSV() {
    this.http.get(environment.csvUrl, { responseType: 'text' }).subscribe(d => {
      let lignes = d.split('\n');
      lignes.forEach(l => {
        this.setPredictions(l);
      });
    });
  }
  /**
   * Set predictions array
   * @param l Object to convert
   */
  setPredictions(l: any) {
    l = l.replace(/[\r]/g, '').trim();
    let m = l.split(',');
    this.dataset.push(this.conversion(m));


    // Create lists from data for countries, regions and pdo
    if(!this.listes.pays.includes(m[0].trim())) this.listes.pays.push(m[0].trim());
    if(!this.listes.regions.includes(m[1].trim())) this.listes.regions.push(m[1].trim());
    if(!this.listes.pdo.includes(m[3].trim())) this.listes.pdo.push(m[3].trim());
  }
  /** Convert excel line to JSON object */
  conversion(l: Array<any>):RendementI {

    return { pays: l[0].trim(), regions: l[1].trim(), type: l[2].trim(), pdo: l[3].trim(), rendements:this.setNumbers(l.slice(4, 43)), predictions:this.setNumbers(l.slice(44, 55)), fiabilites:this.setNumbers(l.slice(56, l.length))};
  }
  /** Parse string to integer on dataset */
  setNumbers(a:Array<string>):Array<number>{
    return a.map(c => parseInt(c));
  }
  /** Set list of criterias */
  setListes(){

  }
  /** Return JSON object */
  setJSON(d: string) {
  }
  /** List files from fire bucket to get archived datas */
  listeFiles() {
    let fireStore = getStorage();
    let listRef = ref(fireStore, 'gs://vinciplateforme');

    listAll(listRef).then((res) => {
      res.prefixes.forEach((folderRef) => {
        // All the prefixes under listRef
        console.log('folder', folderRef);
      });
      res.items.forEach((itemRef) => {
        // console.log('item', itemRef);
        getMetadata(itemRef).then(meta => {
          this.filesCSV.push({ nom: meta.name, creation: meta.timeCreated, maj: meta.updated, taille: meta.size, bucket: meta.bucket });
          console.log('meta', meta);
        });
      });
    }).catch((er) => {
      console.log(er)
    });
  }
  /** Filter countries from data and hydrate filters */
  setFiltres(){

  }

}
