import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilI } from 'src/app/utils/modeles/profil-i';
import { AuthService } from 'src/app/utils/services/auth.service';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { VisualService } from '../utils/services/visual.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
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

  constructor(public l:LanguesService, public fbuild:FormBuilder, private visual:VisualService, private auth:AuthService ) { }

  ngOnInit(): void {
    this.l.getPage('profil');
  }

  /** Update user's profile */
  majProfil(){
    console.log(this.auth.profil.u.uid!, this.auth.profil);
    this.visual.updateOwnProfil(this.auth.profil.u.uid!, this.auth.profil);
  }
}
