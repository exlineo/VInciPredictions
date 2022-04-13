import { Component, OnInit } from '@angular/core';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { PredictionsService } from '../utils/services/predictions.service';

@Component({
  selector: 'app-profils',
  templateUrl: './profils.component.html',
  styleUrls: ['./profils.component.css']
})
export class ProfilsComponent implements OnInit {

  constructor(public l:LanguesService, public predServ:PredictionsService) { }

  ngOnInit(): void {
  }
  selectRange(e:any){
    console.log(e.target.value);
  }
}
