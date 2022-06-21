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
import { CrpVisualRoutingModule } from './crp-visual-routing.module';
import { VisualComponent } from './visual/visual.component';
import { CrpVisualComponent } from './crp-visual.component';


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
    CrpVisualRoutingModule,
  ],
  declarations: [
    CrpVisualComponent,
    VisualComponent
  ],
})
export class CrpVisualModule { }
