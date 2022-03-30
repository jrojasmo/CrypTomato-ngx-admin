import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogoComponent } from '../../dialogo/dialogo.component';
import { TextUtilService } from '../../common-services/text-util.service';

@Component({
  selector: 'ngx-elgamal',
  styleUrls: ['./elgamal.component.scss'],
  templateUrl: './elgamal.component.html',
})
export class ElGamalComponent {

  model1 = {
    textoClaro: '',
    numP: '',
    numA: '',
    numB: '',
    numK: '',
    textoCifrado: ''
  }

  model2 = {
    textoCifrado: '',
    numP: '',
    numA: '',
    numB: '',
    numK: '',
    textoClaro: ''
  }

  model3 = {
    numP: '',
    numA: '',
    numB: '',
    numK: ''
  }

  maxNumber = 0;
  minNumber = 0;
  primeArrayz = [];
  primeNumberz = 0;

  constructor(private dialogService: NbDialogService, private util: TextUtilService) {
    this.maxNumber = 11000;
    this.minNumber = 300;
    this.primeArrayz = this.sieveOfEratosthenes(this.maxNumber);
    this.primeNumberz = this.primeArrayz.length;
  }

  matchExact(str, r) {
    r.lastIndex = 0;
    var match = str.match(r);
    return match && str === match[0];
  }

  cifrar(textoClaro, a, b, p, k) {
    if (!a || !b || !p || !k) {
      this.showClaveIncorrecta();
      return;
    }
    var intP = parseInt(p, 10);
    var intK = parseInt(k, 10);
    if (this.maxNumber <= intP) {
      this.showPrimoIncorrectos();
      return;
    }
    if (intK >= intP) {
      this.showKIncorrecto();
      return;
    }
    var normalInput = this.util.normalizeInput(textoClaro).replace(/p/g, '(');
    console.log(normalInput);
    var test = this.cipherElGamal(normalInput, parseInt(a, 10), parseInt(b, 10), intP, intK);
    this.model1.textoCifrado = test.toString();
    //this.model2.textoClaro = this.decipherElGamal(test, parseInt(a, 10), parseInt(b, 10), parseInt(p, 10), parseInt(k, 10));
  }

  descifrar(textoCifrado, a, b, p, k) {
    var re2 = /[0-9,]+/g;
    textoCifrado = textoCifrado.replace(/(\r\n|\n|\r| )/gm, "");
    if (!this.matchExact(textoCifrado, re2)) {
      this.showTextoIncorrecto();
      return;
    }
    if (!a || !b || !p || !k || !textoCifrado) {
      this.showClaveIncorrecta();
      return;
    }
    var intP = parseInt(p, 10);
    var intK = parseInt(k, 10);
    if (this.maxNumber <= intP) {
      this.showPrimoIncorrectos();
      return;
    }
    if (intK >= intP) {
      this.showKIncorrecto();
      return;
    }
    var arrCiph = [];
    var aux = textoCifrado.split(',');
    if (aux.length % 2 != 0) {
      this.showClaveIncorrecta();
      return;
    }
    var toPush = [];
    var innArr = [];
    var innArr2 = [];
    for (var i = 0; i < aux.length; i += 4) {
      innArr.push(parseInt(aux[i], 10));
      innArr.push(parseInt(aux[i + 1], 10));
      innArr2.push(parseInt(aux[i + 2], 10));
      innArr2.push(parseInt(aux[i + 3], 10));
      toPush.push(innArr);
      toPush.push(innArr2);
      arrCiph.push(toPush);
      innArr = [];
      innArr2 = [];
      toPush = [];
    }
    //console.log(arrCiph);
    var test = this.decipherElGamal(arrCiph, parseInt(a, 10), parseInt(b, 10), intP, intK);

    this.model2.textoClaro = test.replace(/\(/g, 'p');
  }

  showClaveIncorrecta() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Clave Incorrecta',
        content: 'Hay parámetros vacíos o inválidos.'
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

  showKIncorrecto() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Clave Incorrecta',
        content: 'El numero k debe ser menor a p'
      },
    });
  }

  showPrimoIncorrectos() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Clave Incorrecta',
        content: 'El primo p debe ser menor a' + this.maxNumber
      },
    });
  }

  Elliptic_Curve(a, b, p) {
    // were  a,b \in N : y^2 = x^3 + ax + b mod p
    var array_points = [];
    for (let x = 0; x < p; x++) {
      var y_2 = ((x * x * x) + (a * (x)) + b) % p;
      for (let i = 0; i < 10; i++) {
        var sqrt_y = Math.sqrt(y_2);
        if (sqrt_y - Math.floor(sqrt_y) == 0) {
          array_points.push([x, sqrt_y])
        }
        y_2 += p;
      }
    }
    //console.log("array points ECC", array_points);
    return array_points;
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
  point_doubling(alpha, a_ecuation, p) {
    // compute 2P where P is a point in EC
    var x1 = alpha[0];
    var y1 = alpha[1];
    var lambda = ((((3 * x1 * x1) + a_ecuation) % p) * this.modInverse((2 * y1) % p, p)) % p;
    // console.log("x1,y1,lambda",x1,y1,lambda);
    // console.log((2*y1)%p);
    var x2 = this.verification_neg_mod((lambda * lambda) - (2 * x1), p);
    var y2 = this.verification_neg_mod((((x1 - x2) * lambda) - y1), p);
    var doubling = [x2, y2];
    // console.log('doubling =', doubling);
    return doubling;
  }
  sum_P_Q(point1, point2, p) {
    //console.log("PUNTOS "+ point1 + " " + point2);
    // compute P+Q were P and Q are points in EC
    var x1s = point1[0];
    var y1s = point1[1];
    var x2s = point2[0];
    var y2s = point2[1];
    var lambda_sum = (this.verification_neg_mod((y2s - y1s), p) * (this.verification_neg_mod(this.modInverse(x2s - x1s, p), p))) % p;
    var x3s = this.verification_neg_mod(((lambda_sum * lambda_sum) - x1s - x2s), p);
    var y3s = this.verification_neg_mod(((lambda_sum * (x1s - x3s)) - y1s), p);
    var point3 = [x3s, y3s];
    return point3;
  }
  a_and_p_product(alpha, escalar, a_ecuation, p) {
    // Compute the public key (beta) with private key and point in ECC
    // return beta (array size 2)
    var original_point = alpha
    //console.log("daaaat",alpha,escalar,a_ecuation,p);
    var bin_esc = escalar.toString(2).split('');
    //console.log("bin_esc",bin_esc)
    var alpha_array = [];
    for (let i = 0; i < bin_esc.length; i++) { // length of bin
      //var pot = Math.pow(2, bin_esc.length - i - 1)
      if (bin_esc[i] == '1') { // if bin == 1
        //console.log("pot",pot);
        alpha = original_point;
        for (let j = 0; j < bin_esc.length - i - 1; j++) {
          //console.log("ROUNDS ALPHA", alpha) ;  
          if (i == bin_esc.length - 1) {
            alpha = original_point;
          }
          else {
            var PP = this.point_doubling(alpha, a_ecuation, p);
            //console.log("PP",PP);
            alpha = PP;
          }

        }
        alpha_array.unshift(alpha);
        // console.log("alpha array",alpha_array);                                       
      }
    }
    for (let k = 0; k < alpha_array.length - 1; k++) {
      var sum_p_a = this.sum_P_Q(alpha_array[k + 1], alpha_array[k], p);
      //console.log("SUM",sum_p_a);
      alpha_array[k + 1] = sum_p_a;
    }
    //console.log("SOLUTION",alpha_array[alpha_array.length-1]);
    return alpha_array[alpha_array.length - 1];
  }
  plaintext_2_array(plain_t) {
    // 1 Plaintext to array numbers x char
    var array_plain = [];
    for (let i = 0; i < plain_t.length; i++) {
      var ascii_p = plain_t.charCodeAt(i);
      ascii_p = ascii_p.toString(16);
      array_plain.push([parseInt(ascii_p[0], 16), parseInt(ascii_p[1], 16)]);
    }
    //console.log("array",array_plain);
    return array_plain;
  }
  array_decipher_2_pt(array_decipher) {
    // 1 array_decifer in decimal pair to string
    var array_ascii_decipher = [];
    for (let i = 0; i < array_decipher.length; i++) {
      var pair = array_decipher[i];
      var pair_hexa = [pair[0].toString(16), pair[1].toString(16)];
      var hexa_decipher = pair_hexa.join('');
      var Char_Ascci = String.fromCharCode(parseInt(hexa_decipher, 16));
      array_ascii_decipher.push(Char_Ascci);
    }
    var plain_text_decipher = array_ascii_decipher.join('');
    return plain_text_decipher;
  }
  gcd(a, b) {
    if (a == 0)
      return b;
    return this.gcd(b % a, a);
  }
  printGenerators(n) {
    // 1 is always a generator
    console.log("1 ");
    for (var i = 2; i < n; i++)
      // A number x is genera2tor of
      // GCD is 1
      if (this.gcd(i, n) == 1)
        console.log(i + " ");
  }
  inv_aditive(point, p) {
    //compute the aditive inverse of point mod p
    point = [(point[0]), this.verification_neg_mod(-point[1], p)];
    return point;
  }
  discrete_log(point1_a, point2_a, a, p) {
    // find the discrete logarithm
    var product = [];
    for (let i = 1; i < 16; i++) {
      var sol_discret = i;
      product = this.a_and_p_product(point2_a, sol_discret, a, p);
      //var solution_discrete_log = 0;
      if (((point1_a[0] - product[0]) === 0) && ((point1_a[1] - product[1]) === 0)) {
        var solution_discrete_log = i;
      }
    }
    // -------------------------------------------------
    return solution_discrete_log;
  }
  cipherElGamal(plainText, a, b, p, kPrivBob) {
    // var primeArray = sieveOfEratosthenes(p-1);
    // var primeNumber = primeArray.length;
    var plain_text_array = this.plaintext_2_array(plainText);
    var ECC_array = this.Elliptic_Curve(a, b, p);  // a,b,p : ((y^2 = x^3 + ax + b) mod p), return array of points in ECC
    var alpha = ECC_array[0];
    var random_K = 13; // random K of text
    var betaBob = this.a_and_p_product(alpha, kPrivBob, a, p);
    var array_char_ciphers = [];
    //console.log(plain_text_array);
    for (let i = 0; i < plain_text_array.length; i++) {
      var d_1 = plain_text_array[i][0];
      var d_2 = plain_text_array[i][1];
      var P_1 = this.a_and_p_product(alpha, d_1, a, p);
      var P_2 = this.a_and_p_product(alpha, d_2, a, p);
      //console.log("Pes",P_1,P_2);
      var K_c = this.a_and_p_product(betaBob, random_K, a, p);
      //console.log("KK",K_c); 
      var C_1 = this.sum_P_Q(P_1, K_c, p);
      var C_2 = this.sum_P_Q(P_2, K_c, p);
      //console.log("Cs",C_1,C_2);
      array_char_ciphers.push([C_1, C_2])
    }
    //console.log("Cipher : ", array_char_ciphers);
    return array_char_ciphers;
  }

  decipherElGamal(Cipher_text_array, a, b, p, kPrivBob) {
    var ECC_array = this.Elliptic_Curve(a, b, p);  // a,b,p : ((y^2 = x^3 + ax + b) mod p), return array of points in ECC
    var alpha = ECC_array[0];
    var array_char_deciphers = [];
    var random_K = 13; // random K of text
    var y_0 = this.a_and_p_product(alpha, random_K, a, p);
    var K_c2 = this.a_and_p_product(y_0, kPrivBob, a, p);
    //console.log(K_c2);
    for (let i = 0; i < Cipher_text_array.length; i++) {
      var P_1p = this.sum_P_Q(Cipher_text_array[i][0], this.inv_aditive(K_c2, p), p);
      var P_2p = this.sum_P_Q(Cipher_text_array[i][1], this.inv_aditive(K_c2, p), p);
      //console.log("PES_2",P_1p,P_2p);
      var D_1 = this.discrete_log(P_1p, alpha, a, p);
      var D_2 = this.discrete_log(P_2p, alpha, a, p);
      //console.log("des",D_1,D_2);
      var char = [D_1, D_2];
      array_char_deciphers.push(char);
    }
    //console.log("array char", array_char_deciphers);
    var plaintext_sol = this.array_decipher_2_pt(array_char_deciphers);
    //console.log("Decipher : ", plaintext_sol);
    return plaintext_sol;
  }

  ////////

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

  generateRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
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

  generateParams() {
    var arr = [];
    //Primo
    var prime_z = this.generateKey(this.primeNumberz, this.primeArrayz, this.minNumber);
    //a
    var a = this.getRandomInt(2, this.minNumber);
    //b
    var b = this.getRandomInt(2, this.minNumber);
    //k
    var primeArray = this.sieveOfEratosthenes(prime_z - 1);
    var primeNumber = primeArray.length;
    var kPriv = this.generateKey(primeNumber, primeArray, this.minNumber); // private key for Alice or Bob

    arr.push(a);
    arr.push(b);
    arr.push(prime_z);
    arr.push(kPriv);

    return arr;
  }

  generarClave($event, model) {
    $event.preventDefault();
    var arr = this.generateParams();
    model.numA = arr[0];
    model.numB = arr[1];
    model.numP = arr[2];
    model.numK = arr[3];
  }

  fillKey($event, model) {
    $event.preventDefault();
    this.model1.numP = model.numP;
    this.model1.numA = model.numA;
    this.model1.numB = model.numB;
    this.model1.numK = model.numK;

    this.model2.numP = model.numP;
    this.model2.numA = model.numA;
    this.model2.numB = model.numB;
    this.model2.numK = model.numK;
  }

  clearForm1($event, model) {
    $event.preventDefault();
    model.textoClaro = '';
    model.textoCifrado = '';
    model.numP = '';
    model.numA = '';
    model.numB = '';
    model.numK = '';
  }
}
