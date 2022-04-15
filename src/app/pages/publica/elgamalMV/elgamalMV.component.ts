import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogoComponent } from '../../dialogo/dialogo.component';
import { TextUtilService } from '../../common-services/text-util.service';

@Component({
  selector: 'ngx-elgamal',
  styleUrls: ['./elgamalMV.component.scss'],
  templateUrl: './elgamalMV.component.html',
})
export class ElGamalMVComponent {

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

  a_EC = 125;
  b_EC = 104;
  p_EC = 41611;
  ECC_array = [];
  alpha = [];
  constructor(private dialogService: NbDialogService, private util: TextUtilService) {
    this.maxNumber = 11000;
    this.minNumber = 300;
    this.primeArrayz = this.sieveOfEratosthenes(this.maxNumber);
    this.primeNumberz = this.primeArrayz.length;
    this.ECC_array = this.Elliptic_Curve(this.a_EC, this.b_EC, this.p_EC);
    this.alpha = this.ECC_array[0];
  }

  matchExact(str, r) {
    r.lastIndex = 0;
    var match = str.match(r);
    return match && str === match[0];
  }

  cifrar(textoClaro, beta) {
    if (!beta || !textoClaro) {
      this.showClaveIncorrecta();
      return;
    }
    var re2 = /[0-9,]+/g;
    beta = beta.replace(/(\r\n|\n|\r| )/gm, "");
    if (!this.matchExact(beta, re2)) {
      this.showKeyErrorC();
      return;
    }
    var aux = beta.split(',');
    if (aux.length != 2) {
      this.showKeyErrorC();
      return;
    }
    aux[0] = parseInt(aux[0], 10);
    aux[1] = parseInt(aux[1], 10);

    var normalInput = this.util.normalizeInput(textoClaro);
    var test = this.cipher_MV(normalInput, aux);
    this.model1.textoCifrado = test.toString();
    //this.model2.textoClaro = this.decipherElGamal(test, parseInt(a, 10), parseInt(b, 10), parseInt(p, 10), parseInt(k, 10));
  }

  descifrar(textoCifrado, a) {
    var re2 = /[0-9,]+/g;
    textoCifrado = textoCifrado.replace(/(\r\n|\n|\r| )/gm, "");
    if (!this.matchExact(textoCifrado, re2)) {
      this.showTextoIncorrecto();
      return;
    }
    if (!a || !textoCifrado) {
      this.showClaveIncorrecta();
      return;
    }
    var intA = parseInt(a, 10);
    if (intA >= this.p_EC) {
      this.showKeyError();
      return;
    }
    var arrCiph = [];
    var aux = textoCifrado.split(',');
    if (aux.length % 4 != 0) {
      this.showTextoIncorrecto();
      return;
    }
    var innArr = [];
    var innArr2 = [];
    for (var i = 0; i < aux.length; i += 4) {
      innArr.push(parseInt(aux[i], 10));
      innArr.push(parseInt(aux[i + 1], 10));
      innArr2.push(innArr);
      innArr2.push(parseInt(aux[i + 2], 10));
      innArr2.push(parseInt(aux[i + 3], 10));
      arrCiph.push(innArr2);
      innArr = [];
      innArr2 = [];
    }
    //console.log(arrCiph);
    var test = this.decipher_MV(arrCiph, parseInt(a, 10));

    this.model2.textoClaro = test.toString();
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
        content: 'The ciphertext must be a comma-separated list of numbers with a length divisible by 4.'
      },
    });
  }

  showKeyErrorC() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Key Error!',
        content: 'Remember that beta point is a pair of number separated by a comma.'
      },
    });
  }

  showKeyError() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Key Error!',
        content: 'Remember that ' + this.p_EC + ' > a'
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
    return doubling
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
  generateKey(primeNumber, primeArray, min) {
    var p;
    var minPrime = min;
    p = primeArray[Math.floor(Math.random() * primeNumber)];
    while (p <= minPrime) {
      p = primeArray[Math.floor(Math.random() * primeNumber)];
    }
    return p;
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
  // var params = generateParams();
  // console.log("a,b,p",params);
  // var ECC_array = Elliptic_Curve(params[0],params[1],params[2]);
  cipher_MV(plain_text, input_beta) { //
    var k = 97;
    //var beta = this.a_and_p_product(this.alpha, a_secret, this.a_EC, this.p_EC);
    var beta = input_beta;
    var y_0 = this.a_and_p_product(this.alpha, k, this.a_EC, this.p_EC);
    var c1_c2 = this.a_and_p_product(beta, k, this.a_EC, this.p_EC);
    var c_1 = c1_c2[0];
    var c_2 = c1_c2[1];
    var plain_text_x_1_x_2 = this.plaintext_2_array(plain_text);
    var cipher_list = [];
    for (let i = 0; i < plain_text_x_1_x_2.length; i++) {
      var y_1 = (c_1 * plain_text_x_1_x_2[i][0]) % this.p_EC;
      var y_2 = (c_2 * plain_text_x_1_x_2[i][1]) % this.p_EC;
      cipher_list.push([y_0, y_1, y_2]);
    }
    return cipher_list
  }
  decipher_MV(cipher_text_list, a_secret) {
    var decipher_list = [];
    var c1_c2_d = this.a_and_p_product(cipher_text_list[0][0], a_secret, 125, 41611);
    var c_1_inv = this.modInverse(c1_c2_d[0], 41611);
    var c_2_inv = this.modInverse(c1_c2_d[1], 41611);
    for (let i = 0; i < cipher_text_list.length; i++) {
      var x_1 = (c_1_inv * cipher_text_list[i][1]) % 41611;
      var x_2 = (c_2_inv * cipher_text_list[i][2]) % 41611;
      decipher_list.push([x_1, x_2])
    }
    var plaintext_sol = this.array_decipher_2_pt(decipher_list);
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
  generateParams() {
    var arr = [];
    var a = this.getRandomInt(800, 30000);
    var beta = this.a_and_p_product(this.alpha, a, this.a_EC, this.p_EC);;
    //var primeArray = this.sieveOfEratosthenes(prime_z - 1);
    //var primeNumber = primeArray.length;
    //var kPriv = this.generateKey(primeNumber, primeArray, 300); // private key for Alice or Bob
    arr.push(a);
    arr.push(beta);
    return arr;
  }

  generarClave($event, model) {
    $event.preventDefault();
    var arr = this.generateParams();
    model.numB = arr[0];
    model.numP = arr[1].toString();
  }

  fillKey($event, model) {
    $event.preventDefault();
    this.model1.numP = model.numP;
    this.model1.numB = model.numB;

    this.model2.numP = model.numP;
    this.model2.numB = model.numB;
  }

  clearForm1($event, model) {
    $event.preventDefault();
    model.textoClaro = '';
    model.textoCifrado = '';
    model.numP = '';
    model.numB = '';
  }
}
