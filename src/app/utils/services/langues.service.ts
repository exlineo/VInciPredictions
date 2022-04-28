import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PageI } from '../modeles/page-i';
import { MarkPipe } from '../tools/filtres.pipe';
import { BucketService } from './bucket.service';
import { StoreService } from './store.service';


@Injectable({
  providedIn: 'root'
})
export class LanguesService {

  langue = 'fr';
  t: any = {}; // Traductions téléchargées
  // lang: any; // Langue actuelle
  page: PageI = { nom: '', titre: '', contenu: '' }; // Nom de la page en cours si nécessaire
  t$:BehaviorSubject<any> = new BehaviorSubject({})

  /**
   * Service de gestion des langues et traductions
   * @param http Opérer des requêtes HTTP
   * @param store Service de gestion des données locales
   */
  constructor(private http: HttpClient, private store: StoreService) {
    // Récupérer la langue par défaut de l'utilisateur ou indiquer en français sinon
    this.langue = this.store.getLocalString('langue', 'fr');
    // Récupérer les traductions stockées en local pour éviter des requêtes
    this.store.getLocalData('traductions') ? this.t = this.store.getLocalData('traductions') : this.loadLangue();
  }
  /** Charger les ndonnées de la langue depuis la base de données */
  loadLangue() {
    this.store.getFireDoc('traductions', this.langue)
      .then<any>(d => d.data())
      .then<unknown>(d => {
        let tmp = d['data'];
        this.t = JSON.parse(tmp);
        this.t$.next(this.t);
        console.log(d);
      }
      )
      .catch(er => console.log(er));
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
  /** Récupérer les informations de la page en cours */
  getPage(page: string) {
    this.store.getFireDoc(this.langue, page)
      .then<any>(d => d.data())
      .then<unknown>(p => {
        this.page = p;
        console.log(p, "Contenus markdown");
      }
      )
      .catch(er => console.log(er));
  }
}
