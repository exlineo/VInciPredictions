import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PredictionsRoutingModule } from './predictions-routing.module';
import { AccueilComponent } from './accueil/accueil.component';
import { UtilsModule } from '../utils/utils.module';
import { VisualisationsComponent } from './visualisations/visualisations.component';
import { ProfilComponent } from './profil/profil.component';

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    AccueilComponent,
    VisualisationsComponent,
    ProfilComponent
  ],
  imports: [
    CommonModule,
    PredictionsRoutingModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
    UtilsModule
  ]
})
export class PredictionsModule { }
