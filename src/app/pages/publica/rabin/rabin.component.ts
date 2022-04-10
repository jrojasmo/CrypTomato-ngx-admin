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
    this.model1.textoCifrado = this.cipherRabin(textoClaro, parseInt(n, 10), parseInt(b, 10)).toString();
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
    if (p % 4 != 3 || q % 4 != 3) {
      this.showMsg("Error: primes p and q must be congruent 3 mod 4.");
      return;
    }
    if (p * q <= this.minValueN) {
      this.showMsg("Error: p*q must be greater than " + this.minValueN + " to make deciphering possible.");
      return;
    }
    if (b < 0 || b > p * q - 1) {
      this.showIncorrectaB();
      return;
    }
    this.model2.textoClaro = this.decipherRabin(textoCifrado, parseInt(b, 10), intP, intQ);
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

  showIncorrectaB() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Key Error!',
        content: 'Number b entered is not correct: 0<=b<=p*q-1.'
      },
    });
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

  showMsg(msg) {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Message',
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
  cipherRabin(clearText, n, B) {
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

    for (var i = 0; i < text.length / 3; ++i) {
      var array = [];
      array.push(dict[text[i * 3]]);
      array.push(dict[text[i * 3 + 1]]);
      array.push(dict[text[i * 3 + 2]]);
      var x = this.tupleToBase26(array);
      var number1 = x + B;
      number1 %= n;
      var number = x * number1;
      number %= n;
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

  getRootsToDecipher(array, p, q, B) {
    var pp = p;
    var qq = q;
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
    var clearText = [];

    for (var i = 0; i < array.length; ++i) {
      var root = toFind + array[i];
      // console.log("ale", root);
      // console.log("ale2", pp, qq);
      var roots = this.findSquareRoots(root, pp, qq);
      var minus = B * invTwo;
      minus %= n;
      for (var j = 0; j < roots.length; ++j) {
        roots[j] -= minus;
        while (roots[j] < 0) {
          roots[j] += n;
          roots[j] %= n;
        }
      }
      //console.log(i, roots);
      var toPush = [];
      //toPush.push(array[i]);
      for (var j = 0; j < roots.length; ++j) {
        var diff = true;
        for (var k = j + 1; k < roots.length; ++k) {
          if (roots[j] == roots[k]) {
            diff = false;
            break;
          }
        }
        if (diff) {
          if (roots[j] < this.minValueN) {
            var arr = this.base26ToTriple(roots[j]);
            var toArr = [];
            toArr.push(arr[0]);
            toArr.push(arr[1]);
            toArr.push(arr[2]);
            toPush.push(toArr);
          }
        }
      }
      clearText.push(toPush);
    }
    return clearText;
  }

  decipherRabin(text, B, p, q) {
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
    if (p * q <= this.minValueN) {
      console.log(
        "n es algo pequeño por lo que pueden haber problemas en el descifrado"
      );
    }
    var array = [];
    for (var i = 0; i < text.length / 5; ++i) {
      array.push(this.Base64.toNumber(text.substring(5 * i, 5 * i + 5)));
    }
    var roots = this.getRootsToDecipher(array, p, q, B);
    console.log(roots);
    var maxR = 0; //Gives the maximum number of roots per letter
    for (var i = 0; i < roots.length; ++i) {
      maxR = Math.max(roots[i].length, maxR);
    }
    //console.log(maxR);
    var clearText = "";
    if (maxR == 1) {
      for (var i = 0; i < roots.length; ++i) {
        for (var j = 0; j < roots[i][0].length; ++j) {
          clearText += dict1[roots[i][0][j]];
        }
      }
    } else {
      for (var i = 0; i < roots.length; ++i) {
        if (roots[i].length == 1) {
          for (var j = 0; j < roots[i][0].length; ++j) {
            clearText += dict1[roots[i][0][j]];
          }
        } else {
          clearText += "[ ";
          for (var j = 0; j < roots[i].length; ++j) {
            for (var k = 0; k < roots[i][0].length; ++k) {
              clearText += dict1[roots[i][j][k]];
            }
            if (j < roots[i].length - 1) clearText += ",";
          }
          clearText += " ]";
        }
      }
    }
    return clearText;
  }

  generateKey() {
    var p, q;
    var minPrime = 150;
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
