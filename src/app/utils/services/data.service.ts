import { Injectable } from '@angular/core';
import { PageI } from '../modeles/page-i';
import { StoreService } from './store.service';
import { LanguesService } from './langues.service';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private doc:any;
  pop:boolean = false;
  page:PageI= {nom:'', titre:'', contenu:''}; // Nom de la page en cours si nécessaire
  /**
   * Service de gestion des données
   * @param db Accès à la base de données géré directement par Firebase
   */
  constructor(private store:StoreService, private l:LanguesService) {

  }
  /** Créer afficher la popup */
  setPop(){

  }

}
