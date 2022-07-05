import { Injectable } from '@angular/core';
import { PageI } from '../modeles/page-i';
import { StoreService } from './store.service';
import { LanguesService } from './langues.service';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  pop:boolean = false; // Show popup
  support:boolean = false; // Show support for help or informations
  page:PageI= {nom:'', titre:'', contenu:''}; // Page name

  constructor() {

  }
  /** Créer afficher la popup */
  setPop(){

  }

}
