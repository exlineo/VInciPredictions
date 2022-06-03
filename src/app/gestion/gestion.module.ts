import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../utils/utils.module';

import { AdminAccueilComponent } from './admin-accueil/admin-accueil.component';
import { ProfilsComponent } from './profils/profils.component';
import { DataMajComponent } from './data-maj/data-maj.component';
import { TraductionsComponent } from './traductions/traductions.component';
import { GestionRoutingModule } from './gestion-routing.module';
import { StatutPipe, AccesPipe, SetStatePipe } from './utils/tools/statut.pipe';

@NgModule({
  declarations: [
    AdminAccueilComponent,
    ProfilsComponent,
    DataMajComponent,
    TraductionsComponent,
    StatutPipe,
    AccesPipe,
    SetStatePipe
  ],
  imports: [
    CommonModule,
    GestionRoutingModule,
    UtilsModule,
    // EditorModule
  ]
})
export class GestionModule { }
