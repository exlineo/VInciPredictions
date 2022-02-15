import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, signOut } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { ProfilI } from '../modeles/profil-i';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Les données de l'utilisateur */
  profile:ProfilI = <ProfilI>{};

  /** Accès à l'API de Firebase pour l'authentification
   * @param auth Objet d'authentification déclaré dans le module
  */
  constructor(private auth:Auth, private route:Router) {}
  /**
   * Créer un compte utiisateur sur Firebase
   * @param mail Email saisi par l'utilisateur
   * @param mdp Mot de passe saisi par l'utilisateur
   */
  creeUser(profile:any) {
    this.profile = profile;
    createUserWithEmailAndPassword(this.auth, profile.mail, profile.pass)
      .then((retour) => {
        this.profile.fireU = retour.user;
        console.log(retour, retour.user);
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  }
  /**
   * Connexion avec un compte utiisateur sur Firebase
   * @param mail Email saisi par l'utilisateur
   * @param mdp Mot de passe saisi par l'utilisateur
   */
  idUser(connexion:{mail:string, pass:string}) {
    console.log("Connexion", connexion);
    signInWithEmailAndPassword(this.auth, connexion.mail, connexion.pass)
      .then((retour) => {
        this.profile.fireU = retour.user;
        this.route.navigateByUrl('/predictions');
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  }
  /** Déconnexion d'un utilisateur */
  deconnexion(){
    signOut(this.auth).then(() => {
      this.profile.fireU = null;
      console.log("Déconnexion réussie");
    }).catch((error) => {
      console.log('Problème dans la déconnexion');
    });
  }
}
