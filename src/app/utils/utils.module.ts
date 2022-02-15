import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
import { EnteteComponent } from 'src/app/structure/entete/entete.component';
import { PiedComponent } from 'src/app/structure/pied/pied.component';
import { PopupComponent } from '../structure/popup/popup.component';

@NgModule({
  declarations: [
    EnteteComponent,
    PiedComponent,
    PopupComponent
  ],
  exports:[
    EnteteComponent,
    PiedComponent,
    PopupComponent
  ],
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    // HttpClientModule
  ]
})
export class UtilsModule { }
