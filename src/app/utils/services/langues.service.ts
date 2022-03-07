import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';


@Injectable({
  providedIn: 'root'
})
export class LanguesService {

  langue = 'fr';
  t: any = {};
  // lang:Array<any> = [];
  lang:any;
  // private lang: AngularFirestoreDocument<TraductionI>;
  /**
   * Service de gestion des langues et traductions
   * @param http Opérer des requêtes HTTP
   * @param store Service de gestion des données locales
   */
  constructor(private http: HttpClient, private store: StoreService) {
    // Récupérer la langue par défaut de l'utilisateur ou indiquer en français sinon
    this.langue = this.store.getLocalString('langue', 'fr');
    // Récupérer les traductions stockées en local pour éviter des requêtes
    this.store.getLocalData('traductions') ? this.t = this.store.getLocalData('traductions') : this.getTextLangue(this.langue);
  }
  /** Charger les ndonnées de la langue depuis la base de données */
  async loadLangue() {
    this.lang = await this.store.getFireDoc('traductions', this.langue);
    console.log("lang", JSON.parse(this.lang.data));
  }
  /**
   * Permet de récupérer les textes en lien avec une langue lors de la sélection
   * @param l {String} La langue dont il faut récupérer les données
   */
  getTextLangue(l: string) {
    this.langue = l;
    this.http.get(`assets/langues/${this.langue}/traductions.json`).subscribe(t => {
      this.t = t;
    });
  }
  /**
   * Modifier la langue par défaut et recharger un nouveau texte
   * Les données de la langue sont écrasées dans la localstorage et deviennent par défaut
   * @param l Langue à transmettre
   */
  setLang(l: string) {
    this.langue = l;
    this.store.setData('langue', l);
    // Recharger la langue après la sélection
    this.getTextLangue(l);
  }
}
