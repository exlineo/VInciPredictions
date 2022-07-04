import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomPattern } from '../utils/tools/CustomErrorMatch';

import { LanguesService } from '../utils/services/langues.service';
import { AuthService } from '../utils/services/auth.service';
import { UserI } from '../utils/modeles/user-i';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {

  // Connexion form
  connexionForm = this.fbuild.group({
    mail!: ['', [Validators.required, Validators.email]],
    pass!: ['', [Validators.required, Validators.pattern(CustomPattern), Validators.minLength(8)]]
  });
  oublie:boolean = false; // Boolean to show form for forgotten password
  /**
   * Formulaire de connexion des utilisateurs
   * @param l {LanguesService} Pointeur vers le service de langues
   */
  constructor(public l: LanguesService, private fbuild:FormBuilder, private auth:AuthService) {}

  ngOnInit(): void {
    this.l.getPage('connexion');
  }
  /** Permettre de réinitialiser le mot de passe */
  oubliePasse(){

  }
  /** Créer un compte */
  connexion(){
    this.auth.idUser(this.connexionForm.value.mail as string, this.connexionForm.value.pass as string);
  }
}
