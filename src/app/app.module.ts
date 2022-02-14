import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConnexionComponent } from './connexion/connexion.component';
import { ProfilComponent } from './profil/profil.component';
import { ContactComponent } from './contact/contact.component';
import { ErreurComponent } from './erreur/erreur.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    ProfilComponent,
    ContactComponent,
    ErreurComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
