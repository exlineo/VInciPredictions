import { Injectable } from '@angular/core';

// Accès aux bases de données
import { first } from 'rxjs/operators';
import { Database, objectVal, ref } from '@angular/fire/database';
import { Firestore, collection, getDocs, doc, getDoc, docData, query, where } from "@angular/fire/firestore";

export interface TraductionI {
  langue: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private doc: any;
  private dataFiltre:any;
  public filtres:any;

  constructor(private dbrt: Database, private dbf: Firestore) {
    // console.log(doc);
  }
  /**
   * Récupérer les données stockées localement
   * @param id {string} Identifiant de la donnée à récupérer localement
   * @returns Renvoie une chaîne de caractères
   */
  getLocalString(id: string, defaut: string): string {
    if (localStorage.getItem(id)) {
      return localStorage.getItem(id) as string
    } else { return defaut };
  }
  /**
   * Récupérer des données structurées JSON
   * @param id {string} Identifiant à appeler dans les données
   * @returns Renvoie un objet JSON
   */
  getLocalData(id: string): unknown {
    if (localStorage.getItem(id)) {
      return JSON.parse(localStorage.getItem(id) as string);
    }
    return null;
  }
  /**
   * Ecrire des données locales
   * @param id {string} Identifiant des données locales à écrire
   * @param data {unknown} Les données à stocker (seront transformées en chaîne)
   */
  setData(id: string, data: unknown) {
    localStorage.setItem(id, JSON.stringify(data));
  }
  /** Récupérer les données en temps réel */
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
   * @param collection Nom de la collection appelée
   * @returns Renvoie les données
   */
  async getFireCol(collec: string) {
    return await getDocs(collection(this.dbf, collec));
  }
  /**
   * Récupérer un objet spécifique dans la base
   * @param collection Nom de la collection appelée
   * @param param Nom de l'objet recherché
   * @returns Renvoie les données
   */
  async getFireDoc(collec: string, param: string){
    const customDoc = doc(this.dbf, collec, param);
    return await getDoc(customDoc);
  }
  /** Effectuer une requête à partir des filtres */
  async getFireFiltre(){

    // Exemple
    const q = query(collection(this.dbf, ''), where("state", ">=", "CA"), where("population", ">", 100000));
  }
}
