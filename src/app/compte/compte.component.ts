import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LanguesService } from '../utils/services/langues.service';
import { AuthService } from '../utils/services/auth.service';
import { Profil } from '../utils/modeles/profil-i';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {
  /**
   * Create un acount
   */
  account = this.fbuild.group({
    mail: [this.auth.u.email, [Validators.required, Validators.email]],
    mail2: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.required, Validators.pattern(`(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}`), Validators.minLength(8)]],
    pass2: ['', [Validators.required]]
  });
  /** Profil data */
  profil = this.fbuild.group({
    nom: [this.auth.profil.nom, [Validators.required]],
    prenom: [this.auth.profil.prenom, [Validators.required]],
    organisation:[this.auth.profil.organisation],
    adresse: [this.auth.profil.adresse],
    adresse2: [this.auth.profil.adresse2],
    codePostal: [this.auth.profil.codePostal],
    ville: [this.auth.profil.ville],
    pays: [this.auth.profil.pays],
    tel: [this.auth.profil.tel],
    mobile: [this.auth.profil.mobile],
    code: [this.auth.profil.tel]
  });
  // Tab index for account creation on UI
  tabI:number = 0;
  /**
   * ulaire de connexion des utilisateurs
   * @param l {LanguesService} Pointeur vers le service de langues
   */
  constructor(public l: LanguesService, public auth: AuthService, public fbuild: FormBuilder) { }

  ngOnInit(): void {
    this.l.getPage('compte');
    console.log(this.auth.u.uid);
  }
  /** Permettre de réinitialiser le mot de passe */
  oublie() {

  }
  /** Create user account */
  creeCompte() {
    this.auth.creeUser(this.account.value);
    this.tabI = 1;
  }
  /** Create user's profile */
  creeProfil(){
    console.log(this.profil.value);
    this.auth.creeProfil(this.profil.value as Profil);
  }
}
