import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnteteComponent } from 'src/app/structure/entete/entete.component';
import { PiedComponent } from 'src/app/structure/pied/pied.component';
import { PopupComponent } from '../structure/popup/popup.component';

import { MarkPipe } from '../utils/tools/filtres.pipe';

@NgModule({
  declarations: [
    EnteteComponent,
    PiedComponent,
    PopupComponent,
    MarkPipe
  ],
  exports:[
    EnteteComponent,
    PiedComponent,
    PopupComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UtilsModule { }
