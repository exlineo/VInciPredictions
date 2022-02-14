import { Component, OnInit } from '@angular/core';
import { LanguesService } from '../utils/services/langues.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomPattern } from '../utils/tools/CustomErrorMatch';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {
  /** Formulaire d'inscription */
  profilForm = new FormGroup({
    title: new FormControl(null, [
      Validators.required
    ]),
    description: new FormControl()
  });
  /** Formulaire et validateurs */
  nomForm = new FormControl('', [Validators.required]);
  prenomForm = new FormControl('', [Validators.required]);
  adrForm = new FormControl('', [Validators.required]);
  adrForm2 = new FormControl('', [Validators.required]);
  codeForm = new FormControl('', [Validators.required]);
  villeForme = new FormControl('', [Validators.required]);
  telForm = new FormControl('', [Validators.required]);
  mobileForm = new FormControl('', [Validators.required]);

  mailForm = new FormControl('', [Validators.required, Validators.email]);
  mailFormConfirm = new FormControl('', [Validators.required, Validators.email]);
  passForm = new FormControl('', [Validators.required, Validators.pattern(CustomPattern)]);
  passFormConfirm = new FormControl('', [Validators.required, Validators.pattern(CustomPattern)]);
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
