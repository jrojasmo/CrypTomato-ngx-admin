import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlockchainComponent } from './blockchain/blockchain.component';
import { SimulationComponent } from './simulation.component';




const routes: Routes = [{
  path: '',
  component: SimulationComponent,
  children: [
    {
      path: 'blockchain',
      component: BlockchainComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulationRoutingModule {
}
