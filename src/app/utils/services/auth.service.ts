import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { Profil, ProfilI } from '../modeles/profil-i';
import { UserI } from '../modeles/user-i';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** User's data */
  profil: ProfilI = new Profil();
  utilisateur: UserI = <UserI>{};

  /** Accessing Firebase
   * @param auth Firebase object to authentication
  */
  constructor(private auth: Auth, private route: Router, private store: StoreService) { }
  /**
   * Create account on firebase with email and password
   * @param p Object with email and password transmitted from connection form
   */
  creeUser(p: any) {
    this.setProfil(this.profil);
    createUserWithEmailAndPassword(this.auth, p.mail, p.pass)
      .then((retour) => {
        // Add Firebase UID in user's profil
        console.log(retour, retour.user);
        this.profil.uid = retour.user.uid;
        // Add profil to firestore
        this.store.setFireDoc('comptes', { uid: this.profil.uid, doc: this.profil })
          .then(r => {
            console.log(r);
          })
          .catch(er => console.log(er));
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  }
  /**
   * User connection with email and password in firebase
   * @param mail User's email
   * @param mdp User's password
   */
  idUser(connexion: { mail: string, pass: string }) {
    console.log("Connexion");
    /**
     * Get authentication from user's credentials
     * @param {Auth} auth Authentication object from Firebase admin SDK
     * @param {string} connexion.mail Email from id form
     * @param {string} connexion.pass Password from id form
     */
    signInWithEmailAndPassword(this.auth, connexion.mail, connexion.pass)
      .then((r) => {
        this.profil.uid = r.user.uid;
        // Get profil from Firestore
        this.store.getFireDoc('comptes', r.user.uid)
          .then(d => d.data())
          .then(u => {
            // console.log("Création du compte réussie", u);
            this.profil = u as ProfilI;
            this.route.navigateByUrl('/predictions');
          })
          .catch(er => console.log(er));
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  }
  /** User di */
  deconnexion() {
    signOut(this.auth).then(() => {
      this.profil.uid = undefined;
      this.profil.statut = 0;
      console.log("Déconnexion réussie");
      this.route.navigateByUrl('/');
    }).catch((er) => {
      console.log('Problème dans la déconnexion', er);
    });
  };
  /** Add user data in database from account form */
  setProfil(p: any) {
    for (let prop in this.profil) {
      if (p.hasOwnProperty(prop)) prop = p[prop];
      console.log(prop, p['prop'], this.profil);
    }
    this.profil.statut = 0; // Statut invité par défaut. Ce paramètre sera changé dans l'admin
  }
}
