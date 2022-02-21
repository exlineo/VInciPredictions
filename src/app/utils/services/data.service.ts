import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { traceUntilFirst } from '@angular/fire/performance';

import { first } from 'rxjs/operators';
import { Database, objectVal, ref } from '@angular/fire/database';
import { Firestore, collection, getDocs } from "@angular/fire/firestore";


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private doc:any;
  /**
   * Service de gestion des données
   * @param db Accès à la base de données géré directement par Firebase
   */
  constructor(private dbrt:Database, private dbf:Firestore) {

  }
  /** Récupérer les données en temps réel */
  getRTDB(){
    this.doc = ref(this.dbrt, 'fr');
    objectVal(this.doc).pipe(
      // traceUntilFirst('database')
      first()
    ).subscribe(
      d => console.log(d)
    );
  }
  /**
   *
   * @param collection Nom de la collection appelée
   * @returns Renvoie les données
   */
  getData(collec:string){
    return getDocs(collection(this.dbf, collec));
  }
}
