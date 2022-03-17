import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../utils/utils.module';

import { AdminMenuComponent } from './admin-menu/admin-menu.component';
import { AdminAccueilComponent } from './admin-accueil/admin-accueil.component';
import { DataComponent } from './data/data.component';
import { ProfilsComponent } from './profils/profils.component';
import { DataMajComponent } from './data-maj/data-maj.component';
import { TraductionsComponent } from './traductions/traductions.component';
import { GestionRoutingModule } from './gestion-routing.module';
import { InfosAdminComponent } from './infos-admin/infos-admin.component';

@NgModule({
  declarations: [
    AdminMenuComponent,
    AdminAccueilComponent,
    DataComponent,
    ProfilsComponent,
    DataMajComponent,
    TraductionsComponent,
    InfosAdminComponent
  ],
  imports: [
    CommonModule,
    GestionRoutingModule,
    UtilsModule
  ]
})
export class GestionModule { }
