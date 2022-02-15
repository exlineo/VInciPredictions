import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PredictionsRoutingModule } from './predictions-routing.module';
import { AccueilComponent } from './accueil/accueil.component';
import { EnteteComponent } from '../structure/entete/entete.component';
import { PiedComponent } from '../structure/pied/pied.component';

@NgModule({
  declarations: [
    AccueilComponent,
    EnteteComponent,
    PiedComponent
  ],
  imports: [
    CommonModule,
    PredictionsRoutingModule
  ]
})
export class PredictionsModule { }
