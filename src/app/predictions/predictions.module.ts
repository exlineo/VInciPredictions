import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PredictionsRoutingModule } from './predictions-routing.module';
import { UtilsModule } from '../utils/utils.module';

import { AccueilComponent } from './accueil/accueil.component';
import { VisualisationsComponent } from './visualisations/visualisations.component';
import { ProfilComponent } from './profil/profil.component';
import { InfosComponent } from './infos/infos.component';

import {ChartModule} from 'primeng/chart';

@NgModule({
  declarations: [
    AccueilComponent,
    VisualisationsComponent,
    ProfilComponent,
    InfosComponent
  ],
  imports: [
    CommonModule,
    PredictionsRoutingModule,
    UtilsModule,
    ChartModule
  ]
})
export class PredictionsModule { }
