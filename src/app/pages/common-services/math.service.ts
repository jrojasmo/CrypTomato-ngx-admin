import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MathService {

  constructor() { }

  gcd(a, b) {
    if (b == 0) return a;
    return this.gcd(b, a % b);
  }

}