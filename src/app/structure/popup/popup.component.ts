import { Component, Input, OnInit } from '@angular/core';
import { PageI } from 'src/app/utils/modeles/page-i';
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  /** Réception de données à traiter pour l'affichage */
  @Input() page!:PageI;

  constructor() { }

  ngOnInit(): void {
  }

}
