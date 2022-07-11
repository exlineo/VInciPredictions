import { Component, OnInit } from '@angular/core';
import { LanguesService } from 'src/app/utils/services/langues.service';

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css']
})
export class InfosComponent implements OnInit {

  constructor(public l: LanguesService) { }

  ngOnInit(): void {
    // Loading text page content from database
    this.l.getPage('adminaccueil');
  }
}
