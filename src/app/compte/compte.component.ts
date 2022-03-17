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
  /** Formulaire d'inscription */
  compte = this.fbuild.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    adresse: [''],
    adresse2: [''],
    codePostal: [''],
    ville: [''],
    pays: [''],
    tel: [''],
    mobile: [''],
    mailGroup: this.fbuild.group({
      mail: ['', [Validators.required, Validators.email]],
      mail2: ['', [Validators.required, Validators.email]]
    }),
    passGroup: this.fbuild.group({
      pass: ['', [Validators.required, Validators.pattern(`(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}`), Validators.minLength(8)]],
      pass2: ['', [Validators.required]]
    }),
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
  /** Créer un compte */
  creeCompte() {
    this.auth.creeUser(this.compte.value);
  }

}
