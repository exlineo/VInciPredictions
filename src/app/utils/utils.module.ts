import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {ChartModule} from 'primeng/chart';
import {SliderModule} from 'primeng/slider';
import {ListboxModule} from 'primeng/listbox';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {DialogModule} from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';

// import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
import {TabViewModule} from 'primeng/tabview';
// import {MessagesModule} from 'primeng/messages';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {TooltipModule} from 'primeng/tooltip';

import { EnteteComponent } from 'src/app/structure/entete/entete.component';
import { PiedComponent } from 'src/app/structure/pied/pied.component';
import { PopupComponent } from '../structure/popup/popup.component';

import { EcartsPipe, FiltresPipe, MarkPipe, ProfilsPipe, TypesPipe } from '../utils/tools/filtres.pipe';

@NgModule({
  declarations: [
    EnteteComponent,
    PiedComponent,
    PopupComponent,
    MarkPipe,
    FiltresPipe,
    ProfilsPipe,
    EcartsPipe,
    TypesPipe
  ],
  exports:[
    EnteteComponent,
    PiedComponent,
    PopupComponent,
    MarkPipe,
    FiltresPipe,
    ProfilsPipe,
    EcartsPipe,
    TypesPipe,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ChartModule,
    SliderModule,
    ListboxModule,
    CheckboxModule,
    RadioButtonModule,
    TabViewModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    EditorModule
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartModule,
    SliderModule,
    ListboxModule,
    CheckboxModule,
    RadioButtonModule,
    TabViewModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    EditorModule
  ],
  providers:[MarkPipe, EcartsPipe, FiltresPipe, ProfilsPipe, MessageService]
})
export class UtilsModule { }
