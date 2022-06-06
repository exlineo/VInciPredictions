import { Component } from '@angular/core';
import { DataService } from './utils/services/data.service';
import { StoreService } from './utils/services/store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'VInci Predictions';

  constructor(public data:DataService, public store:StoreService){}
}
