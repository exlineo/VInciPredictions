import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompteComponent } from './compte/compte.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { ContactComponent } from './contact/contact.component';
import { ErreurComponent } from './erreur/erreur.component';
import { MentionsComponent } from './structure/mentions/mentions.component';
import { RgpdComponent } from './structure/rgpd/rgpd.component';
import { AdminGuard } from './utils/securite/admin.guard';
import { AuthGuard } from './utils/securite/auth.guard';
import { VerificationComponent } from './verification/verification.component';

const routes: Routes = [
  {path:'', component:ConnexionComponent},
  {path:'compte', component:CompteComponent},
  {path:'rgpd', component:RgpdComponent},
  {path:'verification', component:VerificationComponent},
  {path:'mentions', component:MentionsComponent},
  {path:'predictions', loadChildren: () => import('./predictions/predictions.module').then(m => m.PredictionsModule), canActivate:[AuthGuard], canLoad:[AuthGuard]},
  {path:'gestion', loadChildren: () => import('./gestion/gestion.module').then(m => m.GestionModule), canActivate:[AdminGuard], canLoad:[AdminGuard]},
  {path:'contact', component:ContactComponent},
  {path:'**', component:ErreurComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
