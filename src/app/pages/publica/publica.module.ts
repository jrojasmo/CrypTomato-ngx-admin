import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbTreeGridModule,
  NbUserModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { PublicaComponent } from './publica.component';
import { PublicaRoutingModule } from './publica-routing.module';
import { RsaComponent } from './rsa/rsa.component';
import { ElGamalComponent } from './elgamal/elgamal.component';
import { FirmaComponent } from './firma/firma.component';
import { RabinComponent } from './rabin/rabin.component';

@NgModule({
  imports: [
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    ngFormsModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    NbSelectModule,
    NbIconModule,
    NbTreeGridModule,
    Ng2SmartTableModule,
    CommonComponentsModule,
    PublicaRoutingModule,
  ],
  declarations: [
    PublicaComponent,
    RsaComponent,
    ElGamalComponent,
    FirmaComponent,
    RabinComponent
  ],
})
export class PublicaModule { }
