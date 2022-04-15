import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogoComponent } from '../../dialogo/dialogo.component';
import { TextUtilService } from '../../common-services/text-util.service';

@Component({
  selector: 'ngx-rsa',
  styleUrls: ['./elgamal.component.scss'],
  templateUrl: './elgamal.component.html',
})

export class ElGamalComponent {

  model1 = {
    textoClaro: '',
    numP: '',
    numB: '',
    numA: '',
    textoCifrado: ''
  }

  model2 = {
    textoCifrado: '',
    numP: '',
    numB: '',
    numA: '',
    textoClaro: ''
  }

  model3 = {
    numP: '',
    numB: '',
    numA: ''
  }

  maxNumber = 0;
  primeArray = [];
  primeNumber = 0;
  alphSize = 0;
  minValueN = 0;
  blockSize = 0;
  alpha = 501;

  constructor(private dialogService: NbDialogService, private util: TextUtilService) {
    this.blockSize = 3;
    this.minValueN = 18279;
    this.maxNumber = 51000;
    this.primeArray = this.sieveOfEratosthenes(this.maxNumber);
    this.primeNumber = this.primeArray.length;
    this.alphSize = 26;
  }

  matchExact(str, r) {
    r.lastIndex = 0;
    var match = str.match(r);
    return match && str === match[0];
  }

  cifrar(textoClaro, beta, p) {
    textoClaro = this.util.normalizeInput(textoClaro);
    if (!beta || !textoClaro || !p) {
      this.showClaveIncorrecta();
      return;
    }
    if(parseInt(beta, 10) >= parseInt(p, 10)){
      this.showKeyError();
      return;
    }
    this.model1.textoCifrado = this.cipher_Elgamal(textoClaro, parseInt(beta, 10), parseInt(p, 10)).toString();
  }

  descifrar(textoCifrado, a, p) {
    if (!p || !a || !textoCifrado) {
      this.showClaveIncorrecta();
      return;
    }
    var re2 = /[0-9,]+/;
    textoCifrado = textoCifrado.replace(/(\r\n|\n|\r| )/gm, "");
    if (!this.matchExact(textoCifrado, re2)) {
      this.showTextoIncorrecto();
      return;
    }
    var aux = textoCifrado.split(',');
    var ciphArr = [];
    for(var i = 0; i < aux.length; i++){
      ciphArr.push(parseInt(aux[i], 10));
    }
    this.model2.textoClaro = this.decipher_Elgamal(ciphArr, parseInt(a, 10), parseInt(p, 10));
    //this.model2.textoClaro = "AAAAAA";
  }

  generarClave($event, model) {
    $event.preventDefault();
    var arr = this.generateParams();
    model.numP = arr[0];
    model.numA = arr[1];
    model.numB = arr[2];
  }

  fillKey($event, model) {
    $event.preventDefault();
    this.model1.numP = model.numP;
    this.model1.numB = model.numB;
    this.model1.numA = model.numA;
    this.model2.numB = model.numB;
    this.model2.numP = model.numP;
    this.model2.numA = model.numA;
  }

  clearForm1($event, model) {
    $event.preventDefault();
    model.textoClaro = '';
    model.textoCifrado = '';
    model.numP = '';
    model.numB = '';
  }

  clearForm2($event, model) {
    $event.preventDefault();
    model.textoClaro = '';
    model.textoCifrado = '';
    model.numP = '';
    model.numA = '';
  }

  showClaveIncorrecta() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Invalid parameters!',
        content: 'There are empty parameters.'
      },
    });
  }

  showTextoIncorrecto() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Texto Error!',
        content: 'The ciphertext must have only numbers and commas.'
      },
    });
  }

  showKeyError() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Key Error!',
        content: 'Remember that p > beta'
      },
    });
  }

  verification_neg_mod(n, p) {
    // negative numbers to positive number in Z_p
    while (n < 0) {
      n = n + p;
    }
    return n % p
  }
  getRandomInt(min, max) {
    // random int in (min, max)
    return Math.floor(Math.random() * (max - min)) + min;
  }
  private_key_a(prime) {
    // Alice or Bob take a random key in [1,p-1]
    var priv_key_a = this.getRandomInt(1, prime - 1);
    // console.log(priv_key_a);
    return priv_key_a;
  }
  generateKey(primeNumber, primeArray, min) {
    var p;
    var minPrime = min;
    p = primeArray[Math.floor(Math.random() * primeNumber)];
    while (p <= minPrime) {
      p = primeArray[Math.floor(Math.random() * primeNumber)];
    }
    return p;
  }
  sieveOfEratosthenes(n) {
    var array = [];
    var prime = Array.from({ length: n + 1 }, (_, i) => true);

    for (var p = 2; p * p <= n; p++) {
      if (prime[p] == true) {
        for (i = p * p; i <= n; i += p) prime[i] = false;
      }
    }
    for (var i = 2; i <= n; i++) {
      if (prime[i] == true && i % 4 == 3) array.push(i);
    }
    return array;
  }
  //  to return gcd of a and b
  gcd(a, b) {
    if (a == 0)
      return b;
    return this.gcd(b % a, a);
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
  // Print generators of n
  printGenerators(n) {
    // 1 is always a generator
    console.log("1 ");
    for (var i = 2; i < n; i++)
      // A number x is generator of
      // GCD is 1
      if (this.gcd(i, n) == 1)
        console.log(i + " ");
  }
  // var n = 29;
  // printGenerators(n);
  modInverse(a, mod) {
    // validate inputs
    [a, mod] = [Number(a), Number(mod)]
    if (Number.isNaN(a) || Number.isNaN(mod)) {
      return NaN // invalid input
    }
    a = (a % mod + mod) % mod
    if (!a || mod < 2) {
      return NaN // invalid input
    }
    // find the gcd
    const s = []
    let b = mod
    while (b) {
      [a, b] = [b, a % b]
      s.push({ a, b })
    }
    if (a !== 1) {
      return NaN // inverse does not exists
    }
    // find the inverse
    let x = 1
    let y = 0
    for (let i = s.length - 2; i >= 0; --i) {
      [x, y] = [y, x - y * Math.floor(s[i].a / s[i].b)]
    }
    return (y % mod + mod) % mod
  }
  inv_aditive(point, p) {
    //compute the aditive inverse of point mod p
    point = [(point[0]), this.verification_neg_mod(-point[1], p)];
    return point
  }

  text_2_list_numbers(plaintext) {
    var list = plaintext.split('');
    var array_cipher_list = [];
    for (let i = 0; i < list.length; i++) {
      array_cipher_list.push(plaintext[i].charCodeAt(0));
    }
    return array_cipher_list
  }

  chipher_list_2_plaintext(cipher_list) {
    var plaint_text_array = [];
    for (let i = 0; i < cipher_list.length; i++) {
      plaint_text_array.push(String.fromCharCode(cipher_list[i]));
    }
    var plain_text = (plaint_text_array).join('');
    return plain_text;
  }

  // ------------------------------------------------- INPUTS -------------------------------------------------------------------------

  generateRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  generateParams() {
    var arr = [];
    var ranNum = this.getRandomInt(100, this.primeArray.length);
    var p = this.primeArray[ranNum];
    var a = 0;
    ranNum = this.getRandomInt(50, p);
    a = ranNum;
    var beta = this.power(this.alpha, a, p);
    arr.push(p);
    arr.push(a);
    arr.push(beta);
    return arr;
  }

  cipher_Elgamal(plain_text, beta, p) {
    var plain_textPl = this.text_2_list_numbers(plain_text);
    // var params = generateParams();
    var M = 39;
    var betaInput = beta;
    var y_1 = this.power(this.alpha, M, p);
    var cipher_list = [];
    cipher_list.push(y_1);
    for (let i = 0; i < plain_textPl.length; i++) {
      var y_2 = (plain_textPl[i]) * (this.power(betaInput, M, p)) % p;
      cipher_list.push(y_2);
    }
    console.log(cipher_list);
    return (cipher_list);
  }

  decipher_Elgamal(cipher_text, a_secret, p) {
    var inv_y_1 = this.modInverse(this.power(cipher_text[0], a_secret, p), p);
    var decipher_list = [];
    for (let i = 1; i < cipher_text.length; i++) {
      decipher_list.push((cipher_text[i] * inv_y_1) % p);
    }
    var plaint_text = this.chipher_list_2_plaintext(decipher_list);
    return plaint_text;
  }
}
