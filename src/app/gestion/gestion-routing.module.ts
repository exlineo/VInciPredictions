import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAccueilComponent } from './admin-accueil/admin-accueil.component';
import { DataMajComponent } from './data-maj/data-maj.component';
import { DataComponent } from './data/data.component';
import { ProfilsComponent } from './profils/profils.component';
import { TraductionsComponent } from './traductions/traductions.component';

const routes: Routes = [
  {path:'', component:AdminAccueilComponent},
  {path:'data', component:DataComponent},
  {path:'data-maj', component:DataMajComponent},
  {path:'profils', component:ProfilsComponent},
  {path:'tradictions', component:TraductionsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule { }
