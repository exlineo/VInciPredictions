import { Injectable } from '@angular/core';
import { DataI } from 'src/app/utils/modeles/filtres-i';
import { StoreService } from 'src/app/utils/services/store.service';

@Injectable({
  providedIn: 'root'
})
export class VisualService {

  constructor(public store:StoreService) { }

  /** Get loadedDataset from Firestore
   * @param {event} e Event send by select HtmlElement
   */
   getData(e: any) {
    this.store.getFireDoc('predictions', e.target.value)
      .then(d => d.data() as DataI)
      .then(d => {
        this.store.dataset = d.data;
      })
      .catch(er => console.log(er))
  }
}
