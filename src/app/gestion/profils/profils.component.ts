import { Component, OnInit } from '@angular/core';
import { Profil, ProfilI } from 'src/app/utils/modeles/profil-i';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { PredictionsService } from '../utils/services/predictions.service';

@Component({
  selector: 'app-profils',
  templateUrl: './profils.component.html',
  styleUrls: ['./profils.component.css']
})
export class ProfilsComponent implements OnInit {

  profil: ProfilI = <ProfilI>{}; // Selected profil

  constructor(public l: LanguesService, public predServ: PredictionsService) { }

  ngOnInit(): void {
    this.predServ.getListeProfils();
  }
  /** Set individual statuts on access */
  setStatut(e: any, i: number) {
    console.log(e.target.value);
    let n = parseInt(e.target.value);
    switch (n) {
      case 0:
        this.predServ.listeProfils[i].statut = 0;
        break;
      case 1:
        this.predServ.listeProfils[i].statut = 77;
        break;
      case 2:
        this.predServ.listeProfils[i].statut = 666;
        break;
    }
  }
  setStatutBack(i: number): number {
    let n: number = 0;
    switch (this.predServ.listeProfils[i].statut) {
      case 0:
        n = 0;
        break;
      case 77:
        n = 1;
        break;
      case 666:
        n = 2;
        break;
    }
    return n;
  }
  /** Set individual statuts on access */
  setAcces(e: any, i: number, val: string) {
    console.log(e.target.value);
    let n = parseInt(e.target.value);
    switch (val) {
      case 'petite':
        this.predServ.listeProfils[i].droits.petite = n;
        break;
      case 'grande':
        this.predServ.listeProfils[i].droits.grande = n;
        break;
      case 'export':
        this.predServ.listeProfils[i].droits.export = n;
        break;
      case 'statut':
        this.predServ.listeProfils[i].statut = n;
        break;
    }
  }
  /** Select all profils to edit*/
  selectAll(e: any) {

  }
  /** Select a profil to edit*/
  selectUn(e: any, i: number) {

  }
  setClasse(statut: number): string {
    // let classe:string = '';
    // switch(statut){
    //   case 0:
    //     classe = 'bloque'
    //     break;
    //   case 1:
    //     classe = 'identifie'
    //     break;
    //   case 2:
    //     classe = 'ok'
    //     break;
    // }
    // console.log(statut, classe);
    // return classe;
    return ''
  }
}
