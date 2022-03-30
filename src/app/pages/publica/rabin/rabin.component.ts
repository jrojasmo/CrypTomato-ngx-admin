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
  selector: 'ngx-rabin',
  styleUrls: ['./rabin.component.scss'],
  templateUrl: './rabin.component.html',
})

export class RabinComponent {

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
  asciiCodeOfZ = 0;

  constructor(private dialogService: NbDialogService, private util: TextUtilService) {
    this.maxNumber = 11000;
    this.primeArray = this.sieveOfEratosthenes(this.maxNumber);
    this.primeNumber = this.primeArray.length;
    this.alphSize = 26;
    this.asciiCodeOfA = 97;
    this.asciiCodeOfZ = 122;
  }

  matchExact(str, r) {
    r.lastIndex = 0;
    var match = str.match(r);
    return match && str === match[0];
  }

  cifrar(textoClaro, n, b) {
    //textoClaro = this.util.normalizeInput(textoClaro);
    if (!n || !b) {
      this.showClaveIncorrecta();
      return;
    }
    this.model1.textoCifrado = this.cipherRabin(textoClaro, parseInt(n, 10), parseInt(b, 10)).toString();
  }

  descifrar(textoCifrado, p, q, b) {
    if (!p || !q || !b) {
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
    if (intP > this.maxNumber || intQ > this.maxNumber) {
      this.showPrimosIncorrectos();
      return;
    }
    if (p % 4 != 3 || q % 4 != 3) {
      this.showMsg("Error: Los primos p y q deben ser congruentes 3 mód 4");
      return;
    }
    if (p * q <= this.asciiCodeOfZ) {
      this.showMsg("Error: p*q debe ser mayor a " + this.asciiCodeOfZ + " para que sea posible el decifrado.");
      return;
    }
    if (b<0 || b>p*q-1){
      this.showIncorrectaB();
      return;
    }
    this.model2.textoClaro = this.decipherRabin(arrCiph, parseInt(b, 10), intP, intQ);
  }

  generarClave($event, model) {
    $event.preventDefault();
    var arr = this.generateKey();
    model.numN = arr[0];
    model.numP = arr[2];
    model.numQ = arr[3];
    model.numB = arr[1];
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

  showIncorrectaB() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Clave Incorrecta',
        content: 'El número b ingresado no es correcto: 0<=b<=p*q-1.'
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

  showMsg(msg) {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Mensaje',
        content: msg
      },
    });
  }


  power(x, y, p) {
    let res = 1;
    x = x % p;

    if (x == 0) return 0;

    while (y > 0) {
      if (y & 1) res = (res * x) % p;
      y = y >> 1;
      x = (x * x) % p;
    }
    return res;
  }

  gcdExtended(a, b, pair = new Pair(0, 0)) {
    if (a == 0) {
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
      if (prime[p] == true) {
        for (var i = p * p; i <= n; i += p) prime[i] = false;
      }
    }
    for (var i = 2; i <= n; i++) {
      if (prime[i] == true && i % 4 == 3) array.push(i);
    }
    return array;
  }
  findSquareRoots(y, p, q) {
    var mp = this.power(y, (p + 1) / 4, p);
    var mq = this.power(y, (q + 1) / 4, q);
    //console.log(mp, mq);
    var pair = new Pair(0, 0);
    var n = p * q;
    this.gcdExtended(p, q, pair);
    var yp = pair.x;
    var yq = pair.y;
    var r1 = (yp * p * mq + yq * q * mp) % n;
    while (r1 < 0) {
      r1 += n;
      r1 %= n;
    }
    var r2 = n - r1;
    var r3 = (yp * p * mq - yq * q * mp) % n;
    while (r3 < 0) {
      r3 += n;
      r3 %= n;
    }
    var r4 = n - r3;
    var array = [];
    array.push(r1, r2, r3, r4);
    return array;
  }
  cipherRabin(clearText, n, B) {
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
      var x = dict[text[i]] + this.asciiCodeOfA;
      var number1 = x + B;
      number1 %= n;
      var number = x * number1;
      number %= n;
      cipheredText.push(number);
    }
    return cipheredText;
  }

  addOne(mask, cota) {
    var acarreo = 0;
    if (mask.length >= 1) {
      mask[0] += 1;
      if (mask[0] == cota[0]) {
        acarreo = 1;
        mask[0] = 0;
      }
      for (var i = 1; i < mask.length; ++i) {
        mask[i] += acarreo;
        if (mask[i] == cota[i]) {
          mask[i] = 0;
        } else acarreo = 0;
      }
    }
  }

  decipherRabin(array, B, p, q) {
    const dict1 = {
      0: "a",
      1: "b",
      2: "c",
      3: "d",
      4: "e",
      5: "f",
      6: "g",
      7: "h",
      8: "i",
      9: "j",
      10: "k",
      11: "l",
      12: "m",
      13: "n",
      14: "o",
      15: "p",
      16: "q",
      17: "r",
      18: "s",
      19: "t",
      20: "u",
      21: "v",
      22: "w",
      23: "x",
      24: "y",
      25: "z",
    };
    if (p * q <= this.asciiCodeOfZ) {
      console.log("n es algo pequeño por lo que pueden haber problemas en el descifrado");
    }
    var pair = new Pair(0, 0);
    var n = p * q;
    this.gcdExtended(4, p * q, pair);
    var invFour = pair.x;
    pair.x = 0;
    pair.y = 0;
    this.gcdExtended(2, p * q, pair);
    var invTwo = pair.x;
    while (invFour < 0) {
      invFour += n;
      invFour %= n;
    }
    while (invTwo < 0) {
      invTwo += n;
      invTwo %= n;
    }
    var toFind = ((B * B) % n) * invFour;
    toFind %= n;
    var posibilities = [];
    for (var i = 0; i < this.alphSize; ++i) {
      posibilities.push([]);
      //console.log(posibilities[i].length);
    }
    for (var i = 0; i < array.length; ++i) {
      var root = toFind + array[i];
      var roots = this.findSquareRoots(root, p, q);
      var minus = B * invTwo;
      minus %= n;
      for (var j = 0; j < roots.length; ++j) {
        roots[j] -= minus;
        while (roots[j] < 0) {
          roots[j] += n;
          roots[j] %= n;
        }
      }
      //console.log(roots);
      for (var j = 0; j < roots.length; ++j) {
        if (roots[j] >= this.asciiCodeOfA && roots[j] <= this.asciiCodeOfZ) {
          var index = roots[j] - this.asciiCodeOfA;
          if (posibilities[index].indexOf(array[i]) == -1) {
            posibilities[index].push(array[i]);
          }
        }
      }
    }
    var toPrint = [];
    var posib = 1;
    for (var i = 0; i < this.alphSize; ++i) {
      var arr = [];
      arr.push(dict1[i]);
      if (posibilities[i].length > 0) {
        arr.push(posibilities[i]);
        toPrint.push(arr);
        posib = posib * posibilities[i].length;
      }
    }
    var clearText;
    // console.log(toPrint);
    if (posib == 1) {
      //console.log("Solo hay una forma de descifrar el texto");
      this.showMsg("Solo hay una forma de descifrar el texto");
      clearText = "";
      var map = new Map();
      for (var i = 0; i < toPrint.length; ++i) {
        map.set(toPrint[i][1][0], toPrint[i][0]);
      }
      for (var i = 0; i < array.length; ++i) {
        clearText += map.get(array[i]);
      }
    } else {
      if (posib > 1) {
        //console.log("Hay más de una forma de descifrar el siguiente texto, las posibilidades son las siguientes");
        this.showMsg("Hay más de una forma de descifrar el siguiente texto");
        var mask = [];
        var cota = [];
        var hasMore = [];
        for (var i = 0; i < toPrint.length; ++i) {
          if (toPrint[i][1].length > 1) {
            mask.push(0);
            cota.push(toPrint[i][1].length);
            hasMore.push(true);
          } else hasMore.push(false);
        }
        clearText = [];

        for (var cont = 0; cont < posib; ++cont) {
          var index = 0;
          var tempmap = new Map();
          var tempPosibility = [];
          var arreglo = [];
          for (var j = 0; j < toPrint.length; ++j) {
            if (hasMore[j]) {
              tempmap.set(toPrint[j][1][mask[index]], toPrint[j][0]);
              arreglo.push([toPrint[j][0], toPrint[j][1][mask[index]]]);
              ++index;
            } else {
              tempmap.set(toPrint[j][1][0], toPrint[j][0]);
              arreglo.push([toPrint[j][0], toPrint[j][1][0]]);
            }
          }
          tempPosibility.push(arreglo);
          var tempText = "";
          for (var j = 0; j < array.length; ++j) {
            tempText += tempmap.get(array[j]);
          }
          tempPosibility.push(tempText);
          clearText.push(tempPosibility);
          this.addOne(mask, cota);
        }
      }
    }
    return clearText.toString();
  }

  generateKey() {
    var p, q;
    var minPrime = 100;
    p = this.primeArray[Math.floor(Math.random() * this.primeNumber)];
    while (p <= minPrime) {
      p = this.primeArray[Math.floor(Math.random() * this.primeNumber)];
    }
    q = this.primeArray[Math.floor(Math.random() * this.primeNumber)];
    while (q <= minPrime || q == p) {
      q = this.primeArray[Math.floor(Math.random() * this.primeNumber)];
    }
    var array = [];
    var b = Math.floor(Math.random() * (p * q - 1));
    array.push(p * q);
    array.push(b);
    array.push(p);
    array.push(q);
    return array;
  }
}
