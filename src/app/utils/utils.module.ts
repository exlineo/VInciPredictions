import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {ChartModule} from 'primeng/chart';
import {SliderModule} from 'primeng/slider';
import {ListboxModule} from 'primeng/listbox';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
// import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
import {TabViewModule} from 'primeng/tabview';
// import {MessagesModule} from 'primeng/messages';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {TooltipModule} from 'primeng/tooltip';

import { EnteteComponent } from 'src/app/structure/entete/entete.component';
import { PiedComponent } from 'src/app/structure/pied/pied.component';
import { PopupComponent } from '../structure/popup/popup.component';

import { EcartsPipe, FiltresPipe, GraphPipe, MarkPipe } from '../utils/tools/filtres.pipe';

@NgModule({
  declarations: [
    EnteteComponent,
    PiedComponent,
    PopupComponent,
    MarkPipe,
    FiltresPipe,
    GraphPipe,
    EcartsPipe
  ],
  exports:[
    EnteteComponent,
    PiedComponent,
    PopupComponent,
    MarkPipe,
    FiltresPipe,
    GraphPipe,
    EcartsPipe,
    ReactiveFormsModule,
    HttpClientModule,
    ChartModule,
    SliderModule,
    ListboxModule,
    CheckboxModule,
    RadioButtonModule,
    TabViewModule,
    ToastModule,
    TooltipModule
    // MessagesModule
    // TriStateCheckboxModule
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
    TooltipModule
    // MessagesModule
    // TriStateCheckboxModule
  ],
  providers:[MarkPipe, EcartsPipe, FiltresPipe, GraphPipe, MessageService]
})
export class UtilsModule { }
