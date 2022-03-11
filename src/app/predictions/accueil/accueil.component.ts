import { Component, OnInit } from '@angular/core';
import { LanguesService } from 'src/app/utils/services/langues.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  constructor(public l:LanguesService) { }

  ngOnInit(): void {
    this.l.getPage('predictions');
  }

}
