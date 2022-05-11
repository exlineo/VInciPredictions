import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LanguesService } from '../utils/services/langues.service';
import { AuthService } from '../utils/services/auth.service';

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
    mail: ['', [Validators.required, Validators.email]],
    mail2: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.required, Validators.pattern(`(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}`), Validators.minLength(8)]],
    pass2: ['', [Validators.required]]
  });
  /** Profil data */
  profil = this.fbuild.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    adresse: [''],
    adresse2: [''],
    codePostal: [''],
    ville: [''],
    pays: [''],
    tel: [''],
    mobile: [''],
    code: ['']
  });
  /**
   * ulaire de connexion des utilisateurs
   * @param l {LanguesService} Pointeur vers le service de langues
   */
  constructor(public l: LanguesService, public auth: AuthService, public fbuild: FormBuilder) { }

  ngOnInit(): void {
    this.l.getPage('compte');
  }
  /** Permettre de réinitialiser le mot de passe */
  oublie() {

  }
  /** Create user account */
  creeCompte() {
    this.auth.creeUser(this.account.value);
  }
  /** Create users profil */
  creeProfil(){

  }
}
