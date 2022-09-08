import { Injectable } from '@angular/core';

// Accès aux bases de données
import { Firestore, collection, getDocs, doc, getDoc, setDoc, query, where, limit, orderBy } from "@angular/fire/firestore";
import { BehaviorSubject } from 'rxjs';
import { CreeI, DataI, MoyennesI, Rendement, RendementI } from '../modeles/filtres-i';
import { ProfilI } from '../modeles/profil-i';
import { MsgService } from './msg.service';

export interface TraductionI {
  langue: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  // private doc: any;
  config$: BehaviorSubject<any> = new BehaviorSubject({});
  config: any = {couleurs:{}, predictions:{debut:2023, fin:2033}, rendements:{debut:1982, fin:2023}, contact:'', cle:'', liens:{petite:'', grande:''}}; // App config
  // Dynamic filters list
  filtres: any;
  lastData: Array<CreeI> = []; // ID of last data loaded in Firestore
  // Set of data with filters and averages
  set: DataI = { creeLe: <CreeI>{}, data: [new Rendement()], moyennes: { pays: {}, regions: {} } };
  // Chart configuration
  chartConfigs: any = {};
  // Updated lists of countries, regions, pdos and types for filters
  listes: { pays: Array<string>, regions: Array<string>, pdo: Array<{type:string, name:string}>, filtres: Array<string> } = { pays: [], regions: [], pdo: [], filtres: [] };

  constructor(public dbf: Firestore, private msg: MsgService) {
    this.getConfig();
  }
  /** Prepare data */
  initSet() {
    this.set = { creeLe: <CreeI>{}, data: [], moyennes: <MoyennesI>{} };
  }
  /** Load app config */
  async getConfig() {
    await this.getFireDoc('config', 'app').
      then(c => {
        this.config$.next(c.data());
        this.config = c.data();
      })
      .catch(er => {
        console.log(er);
      });
  }
  /**
   * Get back data from local storage
   * @param {string} id IID of the data
   * @returns {promise} Renvoie une chaîne de caractères
   */
  getLocalString(id: string, defaut:string='fr'): string {
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
  setLocalData(id: string, data: unknown) {
    typeof data == 'string' ? localStorage.setItem(id, data) : localStorage.setItem(id, JSON.stringify(data));
  }
  /** Get profil from session storage */
  getSessionProfil(){
    if (sessionStorage.getItem('profil')) {
      return JSON.parse(sessionStorage.getItem('profil') as string);
    }
    return null;
  }
  /**
   * Save profil on session storage to help identification when refresh
   * @param data Profil to write on session
   */
  setSessionProfil(data:ProfilI){
    sessionStorage.setItem('profil', JSON.stringify(data));
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
  async getFireDoc(collec: string, param: string) {
    const customDoc = doc(this.dbf, collec, param);
    return await getDoc(customDoc);
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
  /** Demo query for Firebase */
  async getFireFiltre(pays: string, region: string) {
    // Exemple
    const q = query(collection(this.dbf, ''), where("pays", "==", pays), where("region", "==", region));
  }
  /** Get data from PDO
   * @param {Array<string>} pdo Array on filters to looking for in database
  */
  async getPdo(pdo: Array<string>) {
    const q = query(collection(this.dbf, this.lastData[this.lastData.length - 1].collection!), where("pdo", "in", pdo));
    return await getDocs(q);
  }
  /**
   * (Deprecated) Get last document in a collection (for data)
   * @param {string} collection Name of called collection
   * @param {string} param Searched object
   * @returns {promise} Send back object
   */
  async getLastData() {
    const q = query(collection(this.dbf, 'data'));
    await getDocs(q)
      .then(d => {
        d.forEach(l => {
          this.lastData.push(l.data());
        });
        this.setSet();
      })
  }
  /** Set data from database */
  setSet() {
    this.getFireCol(this.lastData[this.lastData.length - 1].collection!)
      .then(d => {
        this.initSet();
        // console.log(d);
        d.forEach(c => {
          if (c.id == 'creeLe') {
            this.set.creeLe = c.data() as CreeI;
          } else if (c.id == 'moyennes') {
            this.set.moyennes = c.data() as MoyennesI;
          } else {
            this.set.data.push(c.data() as RendementI);
          }
        });
        this.setFilters(); // Set filters from datas
      });
  }
  /**
   * (Deprecated) Get last ID document
   */
  async getLastID() {
    const q = query(collection(this.dbf, 'predictions'), orderBy('creeLe', 'desc'), limit(1));
    return await getDocs(q);
  }
  /** Request countries and/or regions
   * @param {Array<string>} p List of countries
   * @param {Array<string} r list of regions
   */
  async getAverageData(p: Array<string>, r: Array<string>) {

  }
  /** Set filters from dataset */
  setFilters() {
    this.set.data.forEach(d => this.setFilterFromData(d));
  }
  /** Set filters from dataset
   * @param {any} r a array of data received from server or uploaded
  */
  setFilterFromData(r: RendementI) {
    // Create lists from data for countries, regions and pdo
    if (!this.listes.pays.includes(r.pays)) this.listes.pays = [...this.listes.pays, r.pays];
    if (!this.listes.regions.includes(r.regions)) this.listes.regions = [...this.listes.regions, r.regions];
    if (!this.listes.pdo.includes({type:r.type as string, name:r.pdo as string})) this.listes.pdo = [...this.listes.pdo, {type:r.type as string, name:r.pdo as string}];
  }
}
