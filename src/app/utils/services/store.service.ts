import { Injectable } from '@angular/core';

// Accès aux bases de données
import { Firestore, collection, getDocs, doc, getDoc, setDoc, query, where, limit, orderBy } from "@angular/fire/firestore";
import { BehaviorSubject } from 'rxjs';
import { CreeI, DataI, ZonesI, Rendement, RendementI, YieldI } from '../modeles/filtres-i';
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
  config: any = { couleurs: {}, predictions: { debut: 2020, fin: 2032 }, rendements: { debut: 1981, fin: 2019 }, contact: '', cle: '', liens: { petite: '', grande: '' }, version:0.9 }; // App config
  // Dynamic filters list
  filtres: any;
  lastData: Array<CreeI> = []; // ID of last data loaded in Firestore
  // Set of data with filters and averages
  set: DataI = { creeLe: <CreeI>{}, data: [new Rendement()], zones: { pays:{RD:[], PR:[]}, regions:{RD:[], PR:[] }}};
  // Save list of labels from config and create datasets when data are loaded
  charts:any = {labels:<YieldI>{RD:[],PR:[]}, datasets:<YieldI>{RD:{},PR:{}}};
  // Chart configuration
  chartConfigs: any = {};
  // Updated lists of countries, regions, pdos and types for filters
  // listes: { pays: Array<string>, regions: Array<string>, pdo: Array<{type:string, name:string}>, filtres: Array<string> } = { pays: [], regions: [], pdo: [], filtres: [] };
  listes: { pays: Array<string>, regions: Array<string>, pdo: Array<string>, filtres: Array<string> } = { pays: [], regions: [], pdo: [], filtres: [] };

  constructor(public dbf: Firestore, private msg: MsgService) {
    this.getConfig();
  }
  /** Prepare data */
  initSet() {
    this.set = { creeLe: <CreeI>{}, data: <Array<RendementI>>[], zones: <ZonesI>{} };
  }
  /** Load app config */
  async getConfig() {
    await this.getFireDoc('config', 'app').
      then(c => {
        this.config$.next(c.data());
        this.config = c.data();
        // Set labels for charts : yields and predictions
        for(let i=0; i<this.config.rendements.fin - this.config.rendements.debut + 1; ++i){
          this.charts.labels.RD.push(this.config.rendements.debut + i);
        }
        for(let i=0; i<this.config.predictions.fin - this.config.predictions.debut +1; ++i){
          this.charts.labels.PR.push(this.config.predictions.debut + i);
        }
        this.setCouleur('bleu');
      })
      .catch(er => {
        console.log(er);
      });
  }
  /** Get local version for data update */
  getVersion(){
    if(localStorage.getItem('version')){
      if(parseInt(localStorage.getItem('version')!) >= this.config.version) {
        return true;
      };
    }
    return false;
  }
  /**
   * Get back data from local storage
   * @param {string} id IID of the data
   * @returns {promise} Renvoie une chaîne de caractères
   */
  getLocalString(id: string, defaut: string = 'fr'): string {
    if (localStorage.getItem(id)) {
      return localStorage.getItem(id) as string
    }
    return defaut;
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
  getSessionProfil() {
    if (sessionStorage.getItem('profil')) {
      return JSON.parse(sessionStorage.getItem('profil') as string);
    }
    return null;
  }
  /**
   * Save profil on session storage to help identification when refresh
   * @param data Profil to write on session
   */
  setSessionProfil(data: ProfilI | null) {
    data ? sessionStorage.setItem('profil', JSON.stringify(data)) : sessionStorage.removeItem('profil');
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
        this.lastData = [];
        d.forEach(l => {
          this.lastData.push(l.data());
        });
        this.setSet(this.lastData[this.lastData.length - 1].collection!);
      })
  }
  /** Set data from database */
  setSet(collection: string) {
    this.getFireCol(collection)
      .then(d => {
        this.initSet();
        d.forEach(c => {
          // console.log("Données brutes", c.data());
          if (c.id == 'creeLe') {
            this.set.creeLe = c.data() as CreeI;
          } else if (c.id == 'zones') {
            // console.log("Moyennes", c.data()['regions']);
            this.set.zones.regions = c.data()['regions'];
            this.set.zones.pays = c.data()['pays'];
            this.setAvDataSets(this.setCouleur('vert'), this.set.zones.regions);
            this.setAvDataSets(this.setCouleur('bleu'), this.set.zones.pays);
          } else {
            this.set.data.push(c.data() as RendementI);
            this.setPdoDataSets(this.setCouleur('violet'), c.data() as RendementI)
          }
        });
        // Set list of filters (countries, regions, pdos for visualisation page)
        this.set.data.forEach(d => this.setFilterFromData(d));
        this.orderLists();
      })
      .catch(er => {
        console.log(er);
      });
  }
  /** Add dataset objects to loaded data for charts */
  setAvDataSets(couleur:string, obj:any){
    for(let i in obj){
      this.charts.datasets.RD[i] = {label:i, borderColor:couleur, backgroundColor:couleur, data:obj[i].RD};
      this.charts.datasets.PR[i] = {label:i, borderColor:couleur, backgroundColor:couleur, data:obj[i].PR};
    }
  }
  setPdoDataSets(couleur:string, obj:RendementI){
      this.charts.datasets.RD[obj.pdo!] = {label:obj.pdo, borderColor:couleur, backgroundColor:couleur, data:obj.rendements};
      this.charts.datasets.PR[obj.pdo!] = {label:obj.pdo, borderColor:couleur, backgroundColor:couleur, data:obj.predictions};
  }
  setCouleur(c:string):string{
    const l = this.config.couleurs[c].length;
    const math = Math.floor(Math.random()*l);
    const couleur = this.config.couleurs[c][math];
    return couleur;
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
  /** Set filters lists (in listbox from visualisation) from dataset
   * @param {any} r a array of data received from server or uploaded
  */
  setFilterFromData(r: RendementI) {
    // Create lists from data for countries, regions and pdo
    if (!this.listes.pays.includes(r.pays)) this.listes.pays = [...this.listes.pays, r.pays];
    if (!this.listes.regions.includes(r.regions)) this.listes.regions = [...this.listes.regions, r.regions];
    if (!this.listes.pdo.includes(r.pdo!)) this.listes.pdo = [...this.listes.pdo, r.pdo!];
  }
  /** Order list in alphabetic */
  orderLists(){
    this.listes.pays.sort();
    this.listes.regions.sort();
    this.listes.pdo.sort();
  }
}
