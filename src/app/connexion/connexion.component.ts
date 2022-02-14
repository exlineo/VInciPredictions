import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomErrorMatch, CustomPattern } from '../utils/tools/CustomErrorMatch';

import { LanguesService } from '../utils/services/langues.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {

  connexionForm = new FormGroup({
    title: new FormControl(null, [
      Validators.required
    ]),
    description: new FormControl()
  });
  /** Validateurs du formulaire */
  mailForm = new FormControl('', [Validators.required, Validators.email]);
  passForm = new FormControl('', [Validators.required, Validators.pattern(CustomPattern)]);
  matcher = new CustomErrorMatch();
  /**
   * Formulaire de connexion des utilisateurs
   * @param l {LanguesService} Pointeur vers le service de langues
   */
  constructor(public l: LanguesService) { }

  ngOnInit(): void {
  }
  /** Permettre de réinitialiser le mot de passe */
  oublie(){

  }
  /** Créer un compte */
  creer(){

  }
}
