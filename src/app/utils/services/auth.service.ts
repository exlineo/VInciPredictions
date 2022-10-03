import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, sendEmailVerification, User, IdTokenResult } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { Profil, ProfilI } from '../modeles/profil-i';
import { LanguesService } from './langues.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** User's data */
  profil: ProfilI = new Profil();

  /** Accessing Firebase
   * @param auth Firebase object to authentication
  */
  constructor(public auth: Auth, private route: Router, public l: LanguesService) {
    if (this.l.store.getSessionProfil()) {
      this.profil = this.l.store.getSessionProfil() as ProfilI;
    }
  }
  /**
   * Create account on firebase with email and password
   * @param p Object with email and password transmitted from connection form
   */
  creeUser(p: any) {
    createUserWithEmailAndPassword(this.auth, p.mail, p.pass)
      .then((retour) => {
        this.l.msg.msgOk(this.l.t['MSG_US_ADD'], this.l.t['MSG_US_ADD_DESCR']);
      })
      .catch((error) => {
        if (error.code == 'auth/email-already-in-use') {
          this.l.msg.msgFail(this.l.t['MSG_ER_US_DEJA'], this.l.t['MSG_ER_US_DEJA_DESCR']);
        } else {
          this.l.msg.msgFail(this.l.t['MSG_ER_DATA'], this.l.t['MSG_ER_DATA_DESCR']);
        }
        console.log(error.code, error.message);
      });
  }
  /** Add profil data to firestore */
  creeProfil(p: ProfilI) {
    this.setProfil(p);
    // Add profil to firestore
    if (this.auth.currentUser!) {
      this.l.store.setFireDoc('comptes', { uid: this.auth.currentUser!.uid, doc: this.profil })
        .then(r => {
          this.l.msg.msgOk(this.l.t['MSG_AC_ADD'], this.l.t['MSG_AC_ADD_DESCR']);
          this.verificationEmail();
        })
        .catch(er => {
          this.l.msg.msgFail(this.l.t['MSG_ER_DATA'], this.l.t['MSG_ER_DATA_DESCR']);
          console.log(er);
        });
    }
  }
  /** Set complete profil to create a new one */
  setProfil(p: ProfilI) {
    this.profil = p;
    this.profil.u = this.auth.currentUser!;
    this.profil.droits = { petite: 1, grande: 1, export: 1 };
    this.profil.statut = 77;
  }
  /**
   * User connection with email and password in firebase
   * @param mail User's email
   * @param mdp User's password
   */
  idUser(mail: string, pass: string) {
    console.log("Connexion");
    /**
     * Get authentication from user's credentials
     * @param {Auth} auth Authentication object from Firebase admin SDK
     * @param {string} connexion.mail Email from id form
     * @param {string} connexion.pass Password from id form
     */
    signInWithEmailAndPassword(this.auth, mail, pass)
      .then((r) => {
        // Get profil from Firestore
        this.l.store.getFireDoc('comptes', r.user.uid)
          .then(d => d.data())
          .then(p => {
            // console.log("Création du compte réussie", u);
            this.profil = p as ProfilI;
            this.profil.u = this.auth.currentUser!;
            this.l.store.setSessionProfil(this.profil);
            if (this.getAccess()) {
              this.l.msg.msgOk(this.l.t['MSG_LOG'], this.l.t['MSG_LOG_DESCR']);
              this.route.navigateByUrl('/predictions')
            } else {
              this.l.msg.msgOk(this.l.t['MSG_VERIFIE'], this.l.t['MSG_VERIFIE_DESCR']);
            };
          })
          .catch(er => console.log(er));
      })
      .catch((error) => {
        this.l.msg.msgFail(this.l.t['MSG_ER_LOG'], this.l.t['MSG_ER_LOG_DESCR']);
        console.log(error.code, error.message);
      });
  }
  /** Reset password process */
  resetPassword(email: string) {
    sendPasswordResetEmail(this.auth, email, { url: `${window.location.protocol}//${window.location.hostname}/?email=${email}` })
      .then(id => {
        this.l.msg.msgOk(this.l.t['MSG_PW'], this.l.t['MSG_PW_DESCR']);
      })
      .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER_LOG'], this.l.t['MSG_ER_LOG_DESCR']))
  }
  /** User di */
  deconnexion() {
    signOut(this.auth).then(() => {
      this.profil.statut = 0;
      this.l.msg.msgOk(this.l.t['MSG_DELOG']);
      this.l.store.setSessionProfil(null);
      this.route.navigateByUrl('/');
    }).catch((er) => {
      this.l.msg.msgFail(this.l.t['MSG_ER_LOG'], this.l.t['MSG_ER_LOG_DESCR']);
      console.log('Problème dans la déconnexion', er);
    });
  };
  /** Resend verification email */
  verificationEmail() {
    sendEmailVerification(this.auth.currentUser!)
      .then(d => {
        this.l.msg.msgOk(this.l.t['VERIF_MAIL_TITRE'], this.l.t['VERIF_MAIL_DESCR']);
        this.route.navigateByUrl('/');
        console.log(d)
      })
      .catch(er => console.log(er));
  }
  /** Giving admin access to contents */
  getAdmin() {
    if (!this.auth.currentUser!) {
      this.route.navigateByUrl('/');
    } else if(this.auth.currentUser! && !this.auth.currentUser!.hasOwnProperty('emailVerified')){
      this.route.navigateByUrl('/verification');
    } else if (this.auth.currentUser! && this.profil.statut == 666) return true;
    return false;
  }
  /** Giving user access to contents */
  getAccess() {
    if (!this.auth.currentUser!) {
      this.route.navigateByUrl('/');
    } else if(this.auth.currentUser! && this.auth.currentUser!.emailVerified == false){
      this.route.navigateByUrl('/verification');
    } else if (this.auth.currentUser!) return true;
    return false;
  }
}
