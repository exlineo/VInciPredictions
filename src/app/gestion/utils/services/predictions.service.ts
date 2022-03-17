import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getDownloadURL, getStorage, list, listAll, ref } from '@angular/fire/storage';
import { getMetadata } from 'firebase/storage';
import { FileI } from 'src/app/utils/modeles/file-i';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictionsService {

  predictions:Array<any> = []; // Data from database
  filesCSV:Array<FileI> = []; // List of files uploaded with datas

  constructor(private http:HttpClient) {
    this.listeFiles();
  }
  /**
   * Load CSV and filter data to set the database
   */
  getCSV(){
    this.http.get(environment.csvUrl, {responseType:'text'}).subscribe(d => {
      let lignes = d.split('\n');
      lignes.forEach(l => {
        l = l.replace(/[\r]/g, '').trim();
        let m = l.split(',');
        this.predictions.push(this.conversion(m));
      });
      console.log(this.predictions);
    });
  }
  /** Convert excel line to JSON object */
  conversion(l:Array<any>){
    return {pays:l[0], region:l[1],type:l[2],pdo:l[3],rendements:l.slice(4,43),previsions:l.slice(44,55),fiabilites:l.slice(56,l.length)};
  }
  /** Return JSON object */
  setJSON(d:string){
  }
  /** List files from fire bucket to get archived datas */
  listeFiles(){
    let fireStore = getStorage();
    let  listRef = ref(fireStore, 'gs://vinciplateforme');

    listAll(listRef).then((res) => {
      res.prefixes.forEach((folderRef) => {
        // All the prefixes under listRef
        console.log('folder', folderRef);
      });
      res.items.forEach((itemRef) => {
        console.log('item', itemRef);
        getMetadata(itemRef).then(meta => {
          this.filesCSV.push({nom:meta.name, creation:meta.timeCreated, maj:meta.updated, taille:meta.size, bucket:meta.bucket});
          console.log('meta', meta);
        });
      });
    }).catch((er) => {
      console.log(er)
    });
  }
}
