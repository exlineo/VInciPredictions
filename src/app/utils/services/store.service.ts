import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() { }
  /**
   * Récupérer les données stockées localement
   * @param id {string} Identifiant de la donnée à récupérer localement
   * @returns Renvoie une chaîne de caractères
   */
  getLocalString(id:string, defaut:string):string{
    if(localStorage.getItem(id)) {
      return localStorage.getItem(id) as string
    } else {return defaut};
  }
  /**
   * Récupérer des données structurées JSON
   * @param id {string} Identifiant à appeler dans les données
   * @returns Renvoie un objet JSON
   */
  getLocalData(id:string):unknown{
    if(localStorage.getItem(id)){
      return JSON.parse(localStorage.getItem(id) as string);
    }
    return null;
  }
  /**
   * Ecrire des données locales
   * @param id {string} Identifiant des données locales à écrire
   * @param data {unknown} Les données à stocker (seront transformées en chaîne)
   */
  setData(id:string, data:unknown){
    localStorage.setItem(id, JSON.stringify(data));
  }
}
