import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LanguesService } from '../utils/services/langues.service';
import { CustomPattern } from '../utils/tools/CustomErrorMatch';
import { AuthService } from '../utils/services/auth.service';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {
  /** Formulaire d'inscription */
  profile = this.fbuild.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    adr: [''],
    adr2: [''],
    code: [''],
    ville: [''],
    pays: [''],
    tel: [''],
    mobile: [''],
    mail: ['', [Validators.required, Validators.email]],
    mail2: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.required, Validators.pattern(CustomPattern), Validators.minLength(8)]],
    pass2: ['', [Validators.required, Validators.pattern(CustomPattern), Validators.minLength(8)]]
  });
  /**
   * ulaire de connexion des utilisateurs
   * @param l {LanguesService} Pointeur vers le service de langues
   */
  constructor(public l: LanguesService, public auth: AuthService, public fbuild: FormBuilder) {

  }

  ngOnInit(): void {
  }
  /** Permettre de réinitialiser le mot de passe */
  oublie() {

  }
  /** Créer un compte */
  creeCompte() {
    this.auth.creeUser(this.profile.value);
  }

}
