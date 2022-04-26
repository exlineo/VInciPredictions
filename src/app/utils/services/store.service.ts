import { Injectable } from '@angular/core';

// Accès aux bases de données
import { first } from 'rxjs/operators';
import { Database, objectVal, ref } from '@angular/fire/database';
import { Firestore, collection, getDocs, doc, getDoc, setDoc, query, where, limit, orderBy } from "@angular/fire/firestore";
import { DataI, Rendement, RendementI } from '../modeles/filtres-i';
import { HttpClient } from '@angular/common/http';

export interface TraductionI {
  langue: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private doc: any;
  filtres:any;
  dataset:Array<RendementI>=[new Rendement()];
  chartConfigs:any = {};

  constructor(private dbrt: Database, public dbf: Firestore, private http:HttpClient) {}
  /**
   * Get back data from local storage
   * @param {string} id IID of the data
   * @returns {promise} Renvoie une chaîne de caractères
   */
  getLocalString(id: string, defaut: string): string {
    if (localStorage.getItem(id)) {
      return localStorage.getItem(id) as string
    } else { return defaut };
  }
  /**
   * Get JSON data
   * @param {string} id ID of the data
   * @returns {promise}
   */
  getLocalData(id: string): unknown {
    if (localStorage.getItem(id)) {
      return JSON.parse(localStorage.getItem(id) as string);
    }
    return null;
  }
  /**
   * Write data localy
   * @param id {string} ID of the data
   * @param data {unknown} data to write
   */
  setData(id: string, data: unknown) {
    localStorage.setItem(id, JSON.stringify(data));
  }
  /** Get realtime data */
  getRTDB() {
    this.doc = ref(this.dbrt, 'fr');
    objectVal(this.doc).pipe(
      // traceUntilFirst('database')
      first()
    ).subscribe(
      d => console.log(d)
    );
  }
  /**
   * Get entire collection
   * @param {string} collection Collection name to get
   * @returns {promise} Returns data received
   */
  async getFireCol(collec: string) {
    return await getDocs(collection(this.dbf, collec));
  }
  /**
   * Get pecific object with parameters
   * @param {string} collection Name of called collection
   * @param {string} param Searched object
   * @returns {promise} Send back object
   */
  async getFireDoc(collec: string, param: string){
    const customDoc = doc(this.dbf, collec, param);
    return await getDoc(customDoc);
  }
  /**
   * write a document on Firestore
   * @param collec Name of collection
   * @param data Object with UID to write
   * @returns {promise} Returns a promise
   */
  async setFireDoc(collec: string, data:{uid:string, doc:any}){
    const customDoc = doc(this.dbf, collec, data.uid);
    return await setDoc(customDoc, data.doc, { merge: true }); // Mettre à jour un objet existant
  }
  /** Get datas from filters */
  async getFireFiltre(){
    // Exemple
    const q = query(collection(this.dbf, ''), where("state", ">=", "CA"), where("population", ">", 100000));
  }
  /**
   * Get last document in a collection (for data)
   * @param {string} collection Name of called collection
   * @param {string} param Searched object
   * @returns {promise} Send back object
   */
   async getLastData(){
    const q = query(collection(this.dbf, 'predictions'), orderBy('creeLe', 'desc'), limit(1));
    return await getDocs(q);
  }
  /** Local charts config */
  localChartsConfig(){
    return this.http.get('assets/data/charts.json');
  }
}
