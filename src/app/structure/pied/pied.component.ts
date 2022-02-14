import { Component, OnInit } from '@angular/core';
import { LanguesService } from 'src/app/utils/services/langues.service';

@Component({
  selector: 'app-pied',
  templateUrl: './pied.component.html',
  styleUrls: ['./pied.component.css']
})
export class PiedComponent implements OnInit {

  constructor(public l:LanguesService) { }

  ngOnInit(): void {
  }

}
