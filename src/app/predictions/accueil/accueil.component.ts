import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/utils/services/auth.service';
import { LanguesService } from 'src/app/utils/services/langues.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  contact:string = '';
  /** Informations préalables
   * @param {LanguesService} l récupérer les langues et le traitement des données rattachées
  */
  constructor(public l:LanguesService, public authServ:AuthService) { }

  ngOnInit(): void {
  }
}
