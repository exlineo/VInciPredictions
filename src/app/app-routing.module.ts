import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { ContactComponent } from './contact/contact.component';
import { ErreurComponent } from './erreur/erreur.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  {path:'', component:ConnexionComponent},
  {path:'profil', component:ProfilComponent},
  {path:'predictions', loadChildren: () => import('./predictions/predictions.module').then(m => m.PredictionsModule)},
  {path:'gestion', loadChildren: () => import('./gestion/gestion.module').then(m => m.GestionModule)},
  {path:'contact', component:ContactComponent},
  {path:'**', component:ErreurComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
