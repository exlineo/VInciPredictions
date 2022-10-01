import { Component, OnInit } from '@angular/core';
import { LanguesService } from 'src/app/utils/services/langues.service';

@Component({
  selector: 'app-rgpd',
  templateUrl: './rgpd.component.html',
  styleUrls: ['./rgpd.component.css']
})
export class RgpdComponent implements OnInit {

  /**
   * Formulaire de connexion des utilisateurs
   * @param l {LanguesService} Pointeur vers le service de langues
   */
   constructor(public l:LanguesService) {}

   ngOnInit(): void {
     this.l.getPage('rgpd');
   }

}
