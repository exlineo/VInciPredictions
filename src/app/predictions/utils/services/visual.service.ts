import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
import { ProfilI } from 'src/app/utils/modeles/profil-i';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { StoreService } from 'src/app/utils/services/store.service';

@Injectable({
  providedIn: 'root'
})
export class VisualService {

  constructor(private dbf:Firestore, public store:StoreService, private l:LanguesService) {};

  /** Update user's profil
   * @param {number} uid uid to update
   * @param {ProfilI} profil Updated data
  */
   async updateOwnProfil(uid:string, profil:ProfilI){
    const customDoc = doc(this.dbf, 'comptes', uid);
    await setDoc(customDoc, JSON.parse(JSON.stringify(profil)), { merge: true })
    .then(p => this.l.msg.msgOk(this.l.t['MSG_DATA'], this.l.t['MSG_U_DESCR']))
    .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER'], er));
  }
  /**
   * write a document on Firestore
   * @param collec Name of collection
   * @param data Object with UID to write
   * @returns {promise} Returns a promise
   */
   async setFireDoc(collec: string, data: { uid: string, doc: any }) {
    const customDoc = doc(this.dbf, collec, data.uid);
    return await setDoc(customDoc, JSON.parse(JSON.stringify(data.doc)), { merge: true }); // Mettre à jour un objet existant
  }
}
