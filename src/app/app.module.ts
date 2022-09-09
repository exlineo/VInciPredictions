import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ConnexionComponent } from './connexion/connexion.component';
import { CompteComponent } from './compte/compte.component';
import { ErreurComponent } from './erreur/erreur.component';
// FIREBASE
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';

import { LanguesService } from './utils/services/langues.service';
import { AuthService } from './utils/services/auth.service';
import { UtilsModule } from './utils/utils.module';
import { RgpdComponent } from './structure/rgpd/rgpd.component';
import { MentionsComponent } from './structure/mentions/mentions.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './utils/securite/auth.interceptor';
import { VerificationComponent } from './verification/verification.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    CompteComponent,
    ErreurComponent,
    RgpdComponent,
    MentionsComponent,
    VerificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UtilsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage())
  ],
  providers: [LanguesService, AuthService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
