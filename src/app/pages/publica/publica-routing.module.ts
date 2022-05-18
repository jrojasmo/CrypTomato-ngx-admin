import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ElGamalComponent } from './elgamal/elgamal.component';
import { ElGamalMVComponent } from './elgamalMV/elgamalMV.component';
import { FirmaElGamalComponent } from './firmaElGammal/firmaelgamal.component';
import { FirmaRSAComponent } from './firmaRSA/firmarsa.component';
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
      path: 'elGammalSign',
      component: FirmaElGamalComponent,
    },
    {
      path: 'RSASign',
      component: FirmaRSAComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicaRoutingModule {
}
