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
  styleUrls: ['./blockchain.component.scss'],
  templateUrl: './blockchain.component.html',
})

export class BlockchainComponent {

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
  minValueN = 0;
  blockSize = 0;

  constructor(private dialogService: NbDialogService, private util: TextUtilService) {
    this.blockSize = 3;
    this.minValueN = 18279;
    this.maxNumber = 11000;
    this.primeArray = this.sieveOfEratosthenes(this.maxNumber);
    this.primeNumber = this.primeArray.length;
    this.alphSize = 26;
  }

  matchExact(str, r) {
    r.lastIndex = 0;
    var match = str.match(r);
    return match && str === match[0];
  }

  cifrar(textoClaro, n, b) {
    //textoClaro = this.util.normalizeInput(textoClaro);
    if (!n || !b || n < this.minValueN) {
      this.showClaveIncorrecta();
      return;
    }
    this.model1.textoCifrado = this.cipherRSA(textoClaro, parseInt(n, 10), parseInt(b, 10)).toString();
  }

  descifrar(textoCifrado, p, q, b) {
    if (!p || !q || !b || p*q < this.minValueN || textoCifrado.length%5!=0) {
      this.showClaveIncorrecta();
      return;
    }
    var re2 = /[A-Za-z0-9+/]+/;
    textoCifrado = textoCifrado.replace(/(\r\n|\n|\r| )/gm, "");
    if (!this.matchExact(textoCifrado, re2)) {
      this.showTextoIncorrecto();
      return;
    }
    var intP = parseInt(p, 10);
    var intQ = parseInt(q, 10);
    if (intP > this.maxNumber || intQ > this.maxNumber) {
      this.showPrimosIncorrectos();
      return;
    }
    this.model2.textoClaro = this.decipherRSA(textoCifrado, parseInt(b, 10), intP, intQ);
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
        title: 'Key Error!',
        content: 'There are empty or invalid parameters. (n >=' + this.minValueN + ' to encrypt or the text to be decrypted is not divisible by five)'
      },
    });
  }

  showTextoIncorrecto() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Texto Error!',
        content: 'The ciphertext must have only base 64 digits (a-z, A-Z, 0-9, +, /).'
      },
    });
  }

  showPrimosIncorrectos() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Key Error!',
        content: 'The prime numbers p and q must be less than ' + this.maxNumber
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
  tupleToBase26(array) {
    var pow = 1;
    var num = 0;
    for (var i = array.length - 1; i >= 0; --i) {
      num += pow * array[i];
      pow *= 26;
    }
    return num;
  }

  base26ToTriple(num) {
    var array = [];
    array.push(num % 26);
    num -= num % 26;
    num /= 26;
    array.push(num % 26);
    num -= num % 26;
    num /= 26;
    array.push(num);
    return array.reverse();
  }
  //Base64 code
  Base64 = {
    _Rixits: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/",
    fromNumber: function (number) {
      if (
        isNaN(Number(number)) ||
        number === null ||
        number === Number.POSITIVE_INFINITY
      )
        throw "The input is not valid";
      if (number < 0) throw "Can't represent negative numbers now";

      var rixit; // like 'digit', only in some non-decimal radix
      var residual = Math.floor(number);
      var result = "";
      while (true) {
        rixit = residual % 64;
        // console.log("rixit : " + rixit);
        // console.log("result before : " + result);
        result = this._Rixits.charAt(rixit) + result;
        // console.log("result after : " + result);
        // console.log("residual before : " + residual);
        residual = Math.floor(residual / 64);
        // console.log("residual after : " + residual);

        if (residual == 0) break;
      }
      return result;
    },

    toNumber: function (rixits) {
      var result = 0;
      // console.log("rixits : " + rixits);
      // console.log("rixits.split('') : " + rixits.split(''));
      rixits = rixits.split("");
      for (var e = 0; e < rixits.length; e++) {
        // console.log("_Rixits.indexOf(" + rixits[e] + ") : " +
        // this._Rixits.indexOf(rixits[e]));
        // console.log("result before : " + result);
        result = result * 64 + this._Rixits.indexOf(rixits[e]);
        // console.log("result after : " + result);
      }
      return result;
    },
  };

  cipherRSA(clearText, n, b) {
    var text = this.util.normalizeInput(clearText);
    if (text.length % this.blockSize != 0) {
      var mod = this.blockSize - (text.length % this.blockSize);
      while (mod > 0) {
        text += "x";
        mod--;
      }
    }
    var cipheredText = "";

    if (n < this.minValueN) {
      console.log("n debe ser mayor o igual a 18279 para poder cifrar");
      return cipheredText;
    }

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

    for (var i = 0; i < text.length / 3; ++i) {
      var array = [];
      array.push(dict[text[i * 3]]);
      array.push(dict[text[i * 3 + 1]]);
      array.push(dict[text[i * 3 + 2]]);
      var number = this.power(this.tupleToBase26(array), b, n);
      //console.log(number);
      var toPush = this.Base64.fromNumber(number);
      //console.log(toPush);
      if (toPush.length < 5) {
        var need = 5 - toPush.length;
        for (var j = 0; j < need; ++j) {
          cipheredText += "0";
        }
      }
      cipheredText += toPush;
    }
    return cipheredText;
  }
  decipherRSA(text, b, p, q) {
    var pair = new Pair(0, 0);
    var n = p * q;
    var totient = (p - 1) * (q - 1);
    this.gcdExtended(b, totient, pair);
    var a = pair.x;
    while (a < 0) {
      a += totient;
      a %= totient;
    }
    var clearText = "";
    var array = [];
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
    for (var i = 0; i < text.length / 5; ++i) {
      array.push(this.Base64.toNumber(text.substring(5 * i, 5 * i + 5)));
    }
    for (var i = 0; i < array.length; ++i) {
      var num = this.power(array[i], a, n);
      var arr = this.base26ToTriple(num);
      clearText += dict1[arr[0]];
      clearText += dict1[arr[1]];
      clearText += dict1[arr[2]];
    }
    return clearText;
  }

  generateKey() {
    var p, q;
    var minPrime = 60;
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
