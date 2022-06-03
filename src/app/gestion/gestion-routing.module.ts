import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAccueilComponent } from './admin-accueil/admin-accueil.component';
import { DataMajComponent } from './data-maj/data-maj.component';
import { InfosComponent } from './infos/infos.component';
import { ProfilsComponent } from './profils/profils.component';
import { TraductionsComponent } from './traductions/traductions.component';

const routes: Routes = [
  {
    path: '', component: AdminAccueilComponent, children: [
      { path: '', component:InfosComponent },
      { path: 'predictions', component: DataMajComponent },
      { path: 'utilisateurs', component: ProfilsComponent },
      { path: 'traductions', component: TraductionsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule { }
