import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  /** Réception de données à traiter pour l'affichage */
  @Input() data:unknown = {};

  constructor() { }

  ngOnInit(): void {
  }

}
