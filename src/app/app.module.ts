import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MaterialModule } from './utils/material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ConnexionComponent } from './connexion/connexion.component';
import { ProfilComponent } from './profil/profil.component';
import { ContactComponent } from './contact/contact.component';
import { CompteComponent } from './compte/compte.component';
import { ErreurComponent } from './erreur/erreur.component';
import { EnteteComponent } from './structure/entete/entete.component';
import { PiedComponent } from './structure/pied/pied.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    ProfilComponent,
    ContactComponent,
    CompteComponent,
    ErreurComponent,
    EnteteComponent,
    PiedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
