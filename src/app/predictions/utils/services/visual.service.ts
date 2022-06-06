import { Injectable } from '@angular/core';
import { DataI } from 'src/app/utils/modeles/filtres-i';
import { StoreService } from 'src/app/utils/services/store.service';

@Injectable({
  providedIn: 'root'
})
export class VisualService {

  constructor(public store:StoreService) { }
}
