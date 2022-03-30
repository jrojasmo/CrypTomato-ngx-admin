import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogoComponent } from '../../dialogo/dialogo.component';
import { TextUtilService } from '../../common-services/text-util.service';

class Pair {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

@Component({
  selector: 'ngx-rsa',
  styleUrls: ['./rsa.component.scss'],
  templateUrl: './rsa.component.html',
})

export class RsaComponent {

  model1 = {
    textoClaro: '',
    numN: '',
    numB: '',
    textoCifrado: ''
  }

  model2 = {
    textoCifrado: '',
    numP: '',
    numQ: '',
    numB: '',
    textoClaro: ''
  }

  model3 = {
    numP: '',
    numQ: '',
    numN: '',
    numB: ''
  }

  maxNumber = 0;
  primeArray = [];
  primeNumber = 0;
  alphSize = 0;
  asciiCodeOfA = 0;

  constructor(private dialogService: NbDialogService, private util: TextUtilService) {
    this.maxNumber = 11000;
    this.primeArray = this.sieveOfEratosthenes(this.maxNumber);
    this.primeNumber = this.primeArray.length;
    this.alphSize = 26;
    this.asciiCodeOfA = 97;
  }

  matchExact(str, r) {
    r.lastIndex = 0;
    var match = str.match(r);
    return match && str === match[0];
  }

  cifrar(textoClaro, n, b) {
    //textoClaro = this.util.normalizeInput(textoClaro);
    if(!n || !b){
      this.showClaveIncorrecta();
      return;
    }
    this.model1.textoCifrado = this.cipherRSA(textoClaro, parseInt(n, 10), parseInt(b, 10)).toString();
  }

  descifrar(textoCifrado, p, q, b) {
    if(!p || !q || !b){
      this.showClaveIncorrecta();
      return;
    }
    var re2 = /[0-9,]+/g;
    textoCifrado = textoCifrado.replace(/(\r\n|\n|\r| )/gm, "");
    if (!this.matchExact(textoCifrado, re2)) {
      this.showTextoIncorrecto();
      return;
    }
    var arrCiph = [];
    var aux = textoCifrado.split(',');
    for (var i = 0; i < aux.length; i++) {
      arrCiph.push(parseInt(aux[i], 10));
    }
    var intP = parseInt(p, 10);
    var intQ = parseInt(q, 10);
    if(intP > this.maxNumber || intQ > this.maxNumber){
      this.showPrimosIncorrectos();
      return;
    }
    this.model2.textoClaro = this.decipherRSA(arrCiph, parseInt(b, 10), intP, intQ);
    //this.model2.textoClaro = "AAAAAA";
  }

  generarClave($event, model) {
    $event.preventDefault();
    var arr = this.generateKey();
    model.numN = arr[0];
    model.numP = arr[1];
    model.numQ = arr[2];
    model.numB = arr[3];
  }

  fillKey($event, model) {
    $event.preventDefault();
    this.model1.numB = model.numB;
    this.model1.numN = model.numN;
    this.model2.numB = model.numB;
    this.model2.numP = model.numP;
    this.model2.numQ = model.numQ;
  }

  clearForm1($event, model) {
    $event.preventDefault();
    model.textoClaro = '';
    model.textoCifrado = '';
    model.numN = '';
    model.numB = '';
  }

  clearForm2($event, model) {
    $event.preventDefault();
    model.textoClaro = '';
    model.textoCifrado = '';
    model.numP = '';
    model.numQ = '';
    model.numB = '';
  }

  showClaveIncorrecta() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Clave Incorrecta',
        content: 'Hay parámetros vacíos.'
      },
    });
  }

  showIncorrectaTotient() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Clave Incorrecta',
        content: 'El número b ingresado no es correcto: Recuerde que GCD(b, Totient(n))=1.'
      },
    });
  }

  showTextoIncorrecto() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Texto Incorrecto',
        content: 'El texto cifrado son números separados por comas.'
      },
    });
  }

  showPrimosIncorrectos() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Clave Incorrecto',
        content: 'Los números primos p y q deben ser menores a ' + this.maxNumber
      },
    });
  }

  power(x, y, p) {
    let res = 1;
    x = x % p;

    if (x === 0) return 0;

    while (y > 0) {
      if (y & 1) res = (res * x) % p;
      y = y >> 1;
      x = (x * x) % p;
    }
    return res;
  }

  gcdExtended(a, b, pair = new Pair(0, 0)) {
    if (a === 0) {
      pair.x = 0;
      pair.y = 1;
      return b;
    }
    let gcd = this.gcdExtended(b % a, a, pair);

    var temp = pair.x;
    pair.x = pair.y - Math.floor(b / a) * pair.x;
    pair.y = temp;

    return gcd;
  }
  sieveOfEratosthenes(n) {
    var array = [];
    var prime = Array.from({ length: n + 1 }, (_, i) => true);

    for (var p = 2; p * p <= n; p++) {
      if (prime[p] === true) {
        for (i = p * p; i <= n; i += p) prime[i] = false;
      }
    }
    for (var i = 2; i <= n; i++) {
      if (prime[i] === true) array.push(i);
    }
    return array;
  }
  cipherRSA(clearText, n, b) {
    var text = this.util.normalizeInput(clearText);
    var cipheredText = [];
    const dict = {
      a: 0,
      b: 1,
      c: 2,
      d: 3,
      e: 4,
      f: 5,
      g: 6,
      h: 7,
      i: 8,
      j: 9,
      k: 10,
      l: 11,
      m: 12,
      n: 13,
      o: 14,
      p: 15,
      q: 16,
      r: 17,
      s: 18,
      t: 19,
      u: 20,
      v: 21,
      w: 22,
      x: 23,
      y: 24,
      z: 25,
    };
    for (var i = 0; i < text.length; ++i) {
      var number = this.power(dict[text[i]] + this.asciiCodeOfA, b, n);
      cipheredText.push(number);
    }
    return cipheredText;
  }
  decipherRSA(array, b, p, q) {
    var pair = new Pair(0, 0);
    var n = p * q;
    var totient = (p - 1) * (q - 1);
    this.gcdExtended(b, totient, pair);
    var a = pair.x;
    while (a < 0) {
      a += totient;
      a %= totient;
    }
    if(a*b % totient != 1){
      this.showIncorrectaTotient();
      return '';
    }
    var clearText = "";
    for (var i = 0; i < array.length; ++i) {
      var num = (this.power(array[i], a, n) - this.asciiCodeOfA) % 26;
      while (num < 0) {
        num += 26;
        num %= 26;
      }
      clearText += this.util.codesToString([num]);
    }
    return clearText;
  }

  generateKey() {
    var p, q;
    var minPrime = 100;
    p = Math.floor(Math.random() * this.primeNumber);
    while (p <= minPrime) {
      p = Math.floor(Math.random() * this.primeNumber);
    }
    q = Math.floor(Math.random() * this.primeNumber);
    while (q <= minPrime) {
      q = Math.floor(Math.random() * this.primeNumber);
    }
    p = this.primeArray[p];
    q = this.primeArray[q];
    var array = [];
    array.push(p * q);
    array.push(p);
    array.push(q);
    var max = (p - 1) * (q - 1);
    var b = Math.floor(Math.random() * max);
    while (this.gcdExtended(b, max) != 1) {
      b = Math.floor(Math.random() * max);
    }
    array.push(b);
    return array;
  }
}
