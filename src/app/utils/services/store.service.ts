import { Injectable } from '@angular/core';

// Accès aux bases de données
import { first } from 'rxjs/operators';
import { Database, objectVal, ref } from '@angular/fire/database';
import { Firestore, collection, getDocs, doc, getDoc, setDoc, query, where, limit, orderBy } from "@angular/fire/firestore";
import { DataI, Rendement, RendementI } from '../modeles/filtres-i';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

export interface TraductionI {
  langue: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private doc: any;
  // Dynamic filters list
  filtres:any;
  // Set of data
  dataset:Array<RendementI>=[new Rendement()];
  // Chart configuration
  chartConfigs:any = {};
  // Updated lists of countries, regions, pdos and types for filters
  listes: { pays: Array<string>, regions: Array<string>, pdo: Array<string> } = { pays: [], regions: [], pdo: [] };

  constructor(private dbrt: Database, public dbf: Firestore, private http:HttpClient, public alert:MessageService) {}
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
    console.log(data.doc, JSON.parse(JSON.stringify(data.doc)));
    const customDoc = doc(this.dbf, collec, data.uid);
    return await setDoc(customDoc, JSON.parse(JSON.stringify(data.doc)), { merge: true }); // Mettre à jour un objet existant
  }
  /** Demo query for Firebase */
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
  /** Set filters from dataset */
  setFilters(){
    this.dataset.forEach(d => this.setFilterFromData(d));
    console.log(this.listes.regions);
  }
  /** Set filters from dataset
   * @param {any} r a array of data received from server or uploaded
  */
  setFilterFromData(r:RendementI){
    // Create lists from data for countries, regions and pdo
    if (!this.listes.pays.includes(r.pays)) this.listes.pays = [...this.listes.pays, r.pays];
    if (!this.listes.regions.includes(r.regions)) this.listes.regions = [...this.listes.regions, r.regions];
    if (!this.listes.pdo.includes(r.pdo as string)) this.listes.pdo = [...this.listes.pdo, r.pdo as string];
  }
  /**
   * Display success message
   * @param m Message to display
   * @param d Description to display
   */
  msgOk(m:string, d:string=''){
    this.alert.add({severity:'success', summary:m, detail:d});
  }
  /**
   * Display fail message
   * @param m Message to display
   * @param d Description to display
   */
  msgFail(m:string, d:string=''){
    this.alert.add({id:0, severity:'error', summary:m, detail:d});
  }
  /**
   * Display warnin message
   * @param m Message to display
   * @param d Description to display
   */
  msgGaffe(m:string, d:string=''){
    this.alert.add({severity:'warn', summary:m, detail:d});
  }
  /**
   * Display information message
   * @param m Message to display
   * @param d Description to display
   */
  msgInfo(m:string, d:string=''){
    this.alert.add({severity:'info', summary:m, detail:d});
  }
  /**
   * Clear all messages
   */
  msgNo(){
    this.alert.clear();
  }
}
