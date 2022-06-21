import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: 'home',
      component: HomeComponent,
    },
    {
      path: 'publica',
      loadChildren: () => import('./publica/publica.module')
        .then(m => m.PublicaModule),
    },
    {
      path: 'crpvisual',
      loadChildren: () => import('./crp-visual/crp-visual.module')
        .then(m => m.CrpVisualModule),
    },
    {
      path: 'simulation',
      loadChildren: () => import('./simulation/simulation.module')
        .then(m => m.SimulationModule),
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
