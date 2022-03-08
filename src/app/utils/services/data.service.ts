import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { traceUntilFirst } from '@angular/fire/performance';

import { first } from 'rxjs/operators';
import { Database, objectVal, ref } from '@angular/fire/database';
import { Firestore, collection, getDocs } from "@angular/fire/firestore";
import { PageI } from '../modeles/page-i';
import { StoreService } from './store.service';


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
  constructor(private store:StoreService) {

  }
  /** Créer afficher la popup */
  setPop(){

  }
}
