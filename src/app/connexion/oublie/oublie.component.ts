import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomPattern } from '../../utils/tools/CustomErrorMatch';

import { LanguesService } from '../../utils/services/langues.service';
import { AuthService } from '../../utils/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './oublie.component.html',
  styleUrls: ['./oublie.component.css']
})
export class OublieComponent implements OnInit {

  // Connexion form
  passForm = this.fbuild.group({
    mail!: ['', [Validators.required, Validators.email]],
    pass!: ['', [Validators.required, Validators.pattern(CustomPattern), Validators.minLength(8)]]
  });
  oublie:boolean = false; // Boolean to show form for forgotten password
  /**
   * Formulaire de connexion des utilisateurs
   * @param l {LanguesService} Pointeur vers le service de langues
   */
  constructor(public l: LanguesService, private fbuild:FormBuilder, private auth:AuthService, private router:ActivatedRoute) {}

  ngOnInit(): void {
    this.l.getPage('oublie');
    this.router.params.subscribe(p => console.log(p['uid']));
  }
  /** Permettre de réinitialiser le mot de passe */
  oubliePasse(){

  }
  /** Créer un compte */
  connexion(){
    this.auth.idUser(this.passForm.value.mail as string, this.passForm.value.pass as string);
  }
}
