import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogoComponent } from '../../dialogo/dialogo.component';

@Component({
  selector: 'ngx-firma',
  styleUrls: ['./firma.component.scss'],
  templateUrl: './firma.component.html',
})
export class FirmaComponent {

  model1 = {
    sha: '',
    fileName: '',
    fileSign: '',
    key: ''
  }

  model2 = {
    sha: '',
    fileName: '',
    fileSign: '',
    key: '',
    result: ''
  }

  @ViewChild('fileSelector')
  fileSelector;

  @ViewChild('fileSelector2')
  fileSelector2;

  maxNumber = 0;
  pAndQArr = [];
  pAndQArrLen = 0;
  constructor(private dialogService: NbDialogService) {
    this.maxNumber = 11000;
    this.pAndQArr = this.generatePandQ();
    this.pAndQArrLen = this.pAndQArr.length;
  };

  CryptoJS = require("crypto-js");

  fileSelected($event, modelS) {
    $event.preventDefault();
    const fileList = $event.target.files;
    switch (modelS) {
      case 'SIGN':
        this.model1.fileName = fileList[0].name;
        this.readFile(fileList[0], 'SIGN');
        break;
      case 'VER':
        this.model2.fileName = fileList[0].name;
        this.readFile(fileList[0], 'VER');
        break;
    }
  }
  readFile(file, modelS) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      var arrayBuffer = event.target.result.toString();
      //console.log(result);
      var hash = this.CryptoJS.SHA256(arrayBuffer);
      switch (modelS) {
        case 'SIGN':
          this.model1.sha = hash;
          break;
        case 'VER':
          this.model2.sha = hash;
          break;
      }
    });
    reader.onerror = function (e) {
      console.error(e);
    };
    reader.readAsDataURL(file);
  }
  signButton(shaTxt) {
    //console.log('Entró a Firmar! '+shaTxt);
    if(!shaTxt){
      this.showParamVacios();
      return;
    }
    var key = this.generateKey();
    var firma = this.signSha(shaTxt.toString(), key[0], key[1], key[2], key[4]);
    console.log(firma);
    this.model1.fileSign = firma.toString();
    this.model1.key = key[0] + "," + key[1] + "," + key[2] + "," + key[3];
  }

  verifyButton(shaTxt, keyTxt, signTxt) {
    console.log('Entró a Verificar!');
    var re2 = /[0-9,]+/g;
    keyTxt = keyTxt.replace(/(\r\n|\n|\r| )/gm, "");
    signTxt = signTxt.replace(/(\r\n|\n|\r| )/gm, "");
    if (!this.matchExact(keyTxt, re2) || !this.matchExact(signTxt, re2)) {
      this.showTextoIncorrecto();
      return;
    }
    if (!shaTxt || !keyTxt || !signTxt) {
      this.showParamVacios();
      return;
    }
    var keySplit = keyTxt.split(',');
    var key = [];
    var signSplit = signTxt.split(',');
    var signArr = [];
    var arrAux = [];
    if (keySplit.length < 4 || signSplit.length % 2 != 0) {
      this.showClaveIncorrecta();
      return;
    }
    for (var i = 0; i < keySplit.length; i++) {
      key.push(parseInt(keySplit[i], 10));
    }
    for (var i = 0; i < signSplit.length; i += 2) {
      arrAux.push(parseInt(signSplit[i], 10));
      arrAux.push(parseInt(signSplit[i + 1], 10));
      signArr.push(arrAux);
      arrAux = [];
    }
    if (this.verifySha(shaTxt.toString(), signArr, key[0], key[1], key[2], key[3])) {
      this.showMsg("La firma y clave ingresada coinciden con el archivo! ");
    } else {
      this.showMsg("La firma y clave ingresada NO coinciden con el archivo! ");
    }

  }

  matchExact(str, r) {
    r.lastIndex = 0;
    var match = str.match(r);
    return match && str === match[0];
  }

  clearForm($event) {
    $event.preventDefault();
    //this.limpiarCanvas(this.canvas);
  }

  clearForm3($event) {
    $event.preventDefault();
    //this.model3.textoClaro = '';
  }

  showMsg(msg) {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Mensaje',
        content: msg
      },
    });
  }
  showClaveIncorrecta() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Clave Incorrecta',
        content: 'La firma debe tener un número par de números y la llave 4 números.'
      },
    });
  }
  showTextoIncorrecto() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Texto Incorrecto',
        content: 'La llave y la firma son números separados por comas.'
      },
    });
  }
  showParamVacios() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Error',
        content: 'Hay parámetros vacíos.'
      },
    });
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

  prime_factors(num) {
    function is_prime(num) {
      for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
      }
      return true;
    }
    const result = [];
    for (let i = 2; i <= num; i++) {
      while (is_prime(i) && num % i === 0) {
        if (!result.includes(i)) result.push(i);
        num /= i;
      }
    }
    return result;
  }

  gcd(a, b) {
    if (a == 0)
      return b;
    return this.gcd(b % a, a);
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
      if (prime[i] == true) array.push(i);
    }
    return array;
  }

  generatePandQ() {
    var primes = this.sieveOfEratosthenes(this.maxNumber).slice(50);
    var result = [];
    for (var i = 0; i < primes.length; i++) {
      var factorsPm1 = this.prime_factors(primes[i] - 1);
      for (var j = 0; j < factorsPm1.length; j++) {
        if (this.power(factorsPm1[j], factorsPm1[j], primes[i]) == 1) {
          result.push([primes[i], factorsPm1[j]])
        }
      }
    }
    return result;
  }

  getRandomInt(min, max) {
    // random int in (min, max)
    return Math.floor(Math.random() * (max - min)) + min;
  }

  generateKey() {
    var key = [];
    var gen = [];
    var ranNum = this.getRandomInt(0, this.pAndQArrLen);
    var p = this.pAndQArr[ranNum][0];
    var q = this.pAndQArr[ranNum][1];
    //p
    key.push(p);
    //q
    key.push(q);
    // Get generators of p
    /*
    var factorPm1 = prime_factors(p - 1);
    out:
    for (var g = 2; g < p - 2; g++) {
      for (var i = 0; i < factorPm1.length; i++) {
        if (power(g, (p - 1) / factorPm1[i], p) == 1) {
          continue out;
        }
      }
      gen.push(g);
    }
    */
    for (var g = 2; g < p - 1; g++) {
      if (this.power(g, q, p) == 1) {
        gen.push(g);
      }
    }
    ranNum = this.getRandomInt(0, gen.length);
    var alpha = gen[ranNum];
    ranNum = this.getRandomInt(0, q - 1);
    var a = ranNum;
    var beta = this.power(alpha, a, p);
    key.push(alpha);
    key.push(beta);
    key.push(a);
    return key;
  }

  sign(numb, p, q, alpha, a) { // k entre 1 y q
    var ranK;
    var gamma = 0;
    var delta = 0;
    while (gamma == 0 || delta == 0) {
      ranK = this.getRandomInt(1, q - 1);
      gamma = this.power(alpha, ranK, p) % q;
      delta = ((numb + a * gamma) * this.modInverse(ranK, q)) % q;
    }
    var arr = [];
    arr.push(gamma);
    arr.push(delta);
    return arr;
  }

  signSha(shaString, p, q, alpha, a) {
    var arr = [];
    var signArr = [];
    var jump = 2;
    for (var i = 0; i < shaString.length / jump; i++) {
      //console.log(Number("0x" + shaString.slice(i * jump, (i + 1) * jump)));
      arr.push(Number("0x" + shaString.slice(i * jump, (i + 1) * jump)));
    }
    for (var i = 0; i < arr.length; i++) {
      signArr.push(this.sign(arr[i], p, q, alpha, a));
    }
    return signArr;
  }

  verify(numb, gamma, delta, p, q, alpha, beta) {
    var e1 = numb * this.modInverse(delta, q) % q;
    var e2 = gamma * this.modInverse(delta, q) % q;
    return gamma === ((this.power(alpha, e1, p) * this.power(beta, e2, p)) % p) % q;
  }

  verifySha(shaString, signArr, p, q, alpha, beta) {
    var arr = [];
    var jump = 2;
    for (var i = 0; i < shaString.length / jump; i++) {
      arr.push(Number("0x" + shaString.slice(i * jump, (i + 1) * jump)));
    }
    for (var i = 0; i < arr.length; i++) {
      /*
      if (!verify(arr[i], signArr[i][0], signArr[i][1], p, q, alpha, beta)) {
        console.log('MUERE EN ' + arr[i])
      } else {
        console.log('CORRECTO PARA ' + arr[i])
      }
      */
      if (!this.verify(arr[i], signArr[i][0], signArr[i][1], p, q, alpha, beta)) return false;
    }
    return true;
  }
}