import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { Profil, ProfilI } from '../modeles/profil-i';
import { UserI } from '../modeles/user-i';
import { LanguesService } from './langues.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** User's data */
  profil: ProfilI = new Profil();
  u: UserI = <UserI>{};

  /** Accessing Firebase
   * @param auth Firebase object to authentication
  */
  constructor(private auth: Auth, private route: Router, private l:LanguesService) {
    if(this.l.store.getSessionProfil()) {
      this.profil = this.l.store.getSessionProfil() as ProfilI;
      this.u = this.profil.u;
    }else{
      this.u.uid = "12";
    }
  }
  /**
   * Create account on firebase with email and password
   * @param p Object with email and password transmitted from connection form
   */
  creeUser(p: any) {
    createUserWithEmailAndPassword(this.auth, p.mail, p.pass)
      .then((retour) => {
        this.u = {uid:retour.user.uid, email:retour.user.email, emailVerified:retour.user.emailVerified};
        this.l.msg.msgOk(this.l.t['MSG_US_ADD'], this.l.t['MSG_US_ADD_DESCR']);
      })
      .catch((error) => {
        if(error.code == 'auth/email-already-in-use'){
          this.l.msg.msgFail(this.l.t['MSG_ER_US_DEJA'], this.l.t['MSG_ER_US_DEJA_DESCR']);
        }else{
          this.l.msg.msgFail(this.l.t['MSG_ER_DATA'], this.l.t['MSG_ER_DATA_DESCR']);
        }
        console.log(error.code, error.message);
      });
  }
  /** Add profil data to firestore */
  creeProfil(p:ProfilI) {
    this.setProfil(p);
    // Add profil to firestore
    if (this.u.uid) {
      this.l.store.setFireDoc('comptes', { uid: this.u.uid, doc:this.profil })
        .then(r => {
          this.l.msg.msgOk(this.l.t['MSG_AC_ADD'], this.l.t['MSG_AC_ADD_DESCR']);
          this.route.navigateByUrl('/');
        })
        .catch(er => {
          this.l.msg.msgFail(this.l.t['MSG_ER_DATA'], this.l.t['MSG_ER_DATA_DESCR']);
          console.log(er);
        });
    }
  }
  /** Set complete profil to create a new one */
  setProfil(p:ProfilI){
    this.profil = p;
    this.profil.u = this.u;
    // this.profil.u.uid = this.u.uid;
    // this.profil.u.email = this.u.email;
    this.profil.droits = {petite:0, grande:0, export:0};
    this.profil.statut = 0;
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
        this.u.uid = r.user.uid;
        this.u.email = mail;
        // Get profil from Firestore
        this.l.store.getFireDoc('comptes', r.user.uid)
          .then(d => d.data())
          .then(p => {
            // console.log("Création du compte réussie", u);
            this.profil = p as ProfilI;
            this.l.store.setSessionProfil(this.profil);
            this.l.msg.msgOk(this.l.t['MSG_LOG'], this.l.t['MSG_LOG_DESCR']);
            this.route.navigateByUrl('/predictions');
          })
          .catch(er => console.log(er));
      })
      .catch((error) => {
        this.l.msg.msgFail(this.l.t['MSG_ER_LOG'], this.l.t['MSG_ER_LOG_DESCR']);
        console.log(error.code, error.message);
      });
  }
  /** Reset password process */
  resetPassword(email:string){
    sendPasswordResetEmail(this.auth, email, {url:`${window.location.protocol}//${window.location.hostname}/?email=${email}`})
    .then(id =>{
      this.l.msg.msgOk(this.l.t['MSG_PW'], this.l.t['MSG_PW_DESCR']);
      // https://firebase.google.com/docs/reference/js/auth.md#sendpasswordresetemail
    })
    .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER_LOG'], this.l.t['MSG_ER_LOG_DESCR']))
  }
  /** User di */
  deconnexion() {
    signOut(this.auth).then(() => {
      this.u.uid = undefined;
      this.profil.statut = 0;
      this.l.msg.msgOk(this.l.t['MSG_DELOG']);
      console.log("Déconnexion réussie");
      this.route.navigateByUrl('/');
    }).catch((er) => {
      this.l.msg.msgFail(this.l.t['MSG_ER_LOG'], this.l.t['MSG_ER_LOG_DESCR']);
      console.log('Problème dans la déconnexion', er);
    });
  };
}
