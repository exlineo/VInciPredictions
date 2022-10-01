import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PageI } from '../modeles/page-i';
import { MsgService } from './msg.service';
import { StoreService } from './store.service';


@Injectable({
  providedIn: 'root'
})
export class LanguesService {

  langue = 'fr';
  t: any = {}; // Traductions téléchargées
  // lang: any; // Langue actuelle
  pages: any = { fr: [], es: [], pt: [], uk: [] };
  page: PageI = { id: '', nom: '', titre: '', contenu: '' }; // Nom de la page en cours si nécessaire
  t$: BehaviorSubject<any> = new BehaviorSubject({})

  /**
   * Service de gestion des langues et traductions
   * @param http Opérer des requêtes HTTP
   * @param store Service de gestion des données locales
   */
  constructor(private http: HttpClient, public store: StoreService, public msg: MsgService) {
    // Récupérer la langue par défaut de l'utilisateur ou indiquer en français sinon
    this.langue = this.store.getLocalString('langue', 'fr');
    // Récupérer les traductions stockées en local pour éviter des requêtes
    this.getTraductions();
  }
  /** Charger les ndonnées de la langue depuis la base de données */
  loadLangue() {
    console.log(this.langue, typeof this.langue, JSON.stringify(this.langue));
    this.store.getFireDoc('traductions', this.langue)
      .then<any>(d => {
        console.log(d, d.data());
        return d.data();
      })
      .then<unknown>(d => {
        console.log(d);
        if (d) {
          let tmp = d['data'];
          this.t = JSON.parse(tmp);
          this.t$.next(this.t);
          this.store.setLocalData('t-' + this.langue, this.t);
        }
      })
      .catch(er => {
        this.msg.msgFail(this.t['MSG_ER_DATA'], this.t['MSG_ER_HTTP']);
        console.log(er)});
  }
  /** Get translations from local or online data */
  getTraductions() {
    this.store.getLocalData('t-' + this.langue) ? this.t = this.store.getLocalData('t-' + this.langue) : this.loadLangue();
  }
  /**
   * Modifier la langue par défaut et recharger un nouveau texte
   * Les données de la langue sont écrasées dans la localstorage et deviennent par défaut
   * @param l Langue à transmettre
   */
  setLang(l: string) {
    this.langue = l;
    this.store.setLocalData('langue', l);
    this.getTraductions();
    this.getPage(this.page.id);
  }
  /** Get texts from Firestore to populate HTML pages */
  getPage(id: string) {
    if (this.pages[this.langue][id]) {
      this.page = this.pages[this.langue][id];
    } else {
      this.store.getFireDoc(this.langue, id)
        .then<any>(d => d.data())
        .then<unknown>(p => {
          this.page = p;
          if (!this.page.id) this.page.id = id;
          this.pages[this.langue][id] = p;
        }
        )
        .catch(er => console.log(er));
    }

    // if (this.pages[this.langue][id]) {
    // } else {
    //   this.store.getFireDoc(this.langue, id)
    //     .then<any>(d => d.data())
    //     .then<unknown>(p => {
    //       this.page = p;
    //       if(!this.page.id) this.page.id = id;
    //       this.pages[this.langue][id] = p;
    //     }
    //     )
    //     .catch(er => console.log(er));
    // }
  }
}
