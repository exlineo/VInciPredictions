import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { InfosComponent } from './infos/infos.component';
import { ProfilComponent } from './profil/profil.component';
import { VisualisationsComponent } from './visualisations/visualisations.component';

const routes: Routes = [
  {
    path: '', component: AccueilComponent, children: [
      { path:'', component:InfosComponent },
      { path:'visualisations', component: VisualisationsComponent },
      { path:'profil', component: ProfilComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PredictionsRoutingModule { }
