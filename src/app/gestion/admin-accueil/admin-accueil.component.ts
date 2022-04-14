import { Component, OnInit } from '@angular/core';
import { LanguesService } from 'src/app/utils/services/langues.service';

@Component({
  selector: 'app-admin-accueil',
  templateUrl: './admin-accueil.component.html',
  styleUrls: ['./admin-accueil.component.css']
})
export class AdminAccueilComponent implements OnInit {

  constructor(public l:LanguesService) { }

  ngOnInit(): void {
  }

}
