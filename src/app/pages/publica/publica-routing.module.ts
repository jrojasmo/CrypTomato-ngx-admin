import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ElGamalComponent } from './elgamal/elgamal.component';
import { ElGamalMVComponent } from './elgamalMV/elgamalMV.component';
import { FirmaComponent } from './firma/firma.component';
import { PublicaComponent } from './publica.component';
import { RabinComponent } from './rabin/rabin.component';
import { RsaComponent } from './rsa/rsa.component';



const routes: Routes = [{
  path: '',
  component: PublicaComponent,
  children: [
    {
      path: 'rsa',
      component: RsaComponent,
    },
    {
      path: 'elgamalMV',
      component: ElGamalMVComponent,
    },
    {
      path: 'elgamal',
      component: ElGamalComponent,
    },
    {
      path: 'rabin',
      component: RabinComponent,
    },
    {
      path: 'firma',
      component: FirmaComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicaRoutingModule {
}
