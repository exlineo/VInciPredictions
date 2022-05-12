import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PredictionsRoutingModule } from './predictions-routing.module';
import { UtilsModule } from '../utils/utils.module';

import { AccueilComponent } from './accueil/accueil.component';
import { VisualisationsComponent } from './visualisations/visualisations.component';
import { InfosComponent } from './infos/infos.component';
import { ProfilComponent } from './profil/profil.component';

@NgModule({
  declarations: [
    AccueilComponent,
    VisualisationsComponent,
    InfosComponent,
    ProfilComponent
  ],
  imports: [
    CommonModule,
    PredictionsRoutingModule,
    UtilsModule
  ]
})
export class PredictionsModule { }
