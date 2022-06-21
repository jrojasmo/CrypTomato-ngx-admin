import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrpVisualComponent } from './crp-visual.component';
import { VisualComponent } from './visual/visual.component';
//import { ElGamalComponent } from './elgamal/elgamal.component';



const routes: Routes = [{
  path: '',
  component: CrpVisualComponent,
  children: [
    {
      path: 'visual',
      component: VisualComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class  CrpVisualRoutingModule {
}
