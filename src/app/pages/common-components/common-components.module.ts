import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbTreeGridModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { CifrarFormComponent } from './cifrar-form/cifrar-form.component';
import { DescifrarFormComponent } from './descifrar-form/descifrar-form.component';
import { AnalizarFormComponent } from './analizar-form/analizar-form.component';
import { TablaComponent } from './tabla/tabla.component';
import { KasiskiFormComponent } from './kasiski-form/kasiski-form.component';
import { KasiskiForm2Component } from './kasiski-form2/kasiski-form2.component';
import { HillCifrarFormComponent } from './hill-cifrar-form/hill-cifrar-form.component';

@NgModule({
  imports: [
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    ngFormsModule,
    NbTreeGridModule,
  ],
  declarations: [
    CifrarFormComponent,
    DescifrarFormComponent,
    AnalizarFormComponent,
    TablaComponent,
    KasiskiFormComponent,
    KasiskiForm2Component,
    HillCifrarFormComponent
  ],
  exports: [
    CifrarFormComponent,
    DescifrarFormComponent,
    AnalizarFormComponent,
    TablaComponent,
    KasiskiFormComponent,
    KasiskiForm2Component,
    HillCifrarFormComponent
  ]
})
export class CommonComponentsModule { }
