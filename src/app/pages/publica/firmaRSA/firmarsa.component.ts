import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogoComponent } from '../../dialogo/dialogo.component';

@Component({
  selector: 'ngx-firmarsa',
  styleUrls: ['./firmarsa.component.scss'],
  templateUrl: './firmarsa.component.html',
})
export class FirmaRSAComponent {

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
  minNumber = 0;
  pArr = [];
  pArrLen = 0;
  constructor(private dialogService: NbDialogService) {
    this.minNumber = 10000;
    this.maxNumber = 262000;
    this.pArr = this.sieveOfEratosthenes(this.minNumber, this.maxNumber);
    this.pArrLen = this.pArr.length;
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
    if (!shaTxt) {
      this.showParamVacios();
      return;
    }
    var key = this.generateKey();
    var firma = this.signSha(shaTxt.toString(), key[0], key[1], key[3]);
    console.log(firma);
    this.model1.fileSign = firma.toString();
    this.model1.key = this.arrToBase64(key, 6);
  }

  verifyButton(shaTxt, keyTxt, signTxt) {
    //console.log('Entró a Verificar!');
    var re2 = /[A-Za-z0-9+/]+/g;
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
    if (keyTxt.length % 6 != 0 || signTxt.length % 6 != 0) {
      this.showClaveIncorrecta();
      return;
    }
    var key = this.base64ToArr(keyTxt, 6);
    if (this.verifySha(shaTxt.toString(), signTxt, key[0], key[1], key[2])) {
      this.showMsg("The entered signature and key match the file! ");
    } else {
      this.showMsg("The signature and password entered do NOT match the file! :(");
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
        title: 'Message',
        content: msg
      },
    });
  }
  showClaveIncorrecta() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Key error',
        content: 'The inserted key or signature is invalid.'
      },
    });
  }
  showTextoIncorrecto() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Input Error',
        content: 'The key and signature must have only base 64 digits (a-z, A-Z, 0-9, +, /).'
      },
    });
  }
  showParamVacios() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Error',
        content: 'There are empty parameters.'
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

  powerBigInt(x, y, p) {
    // Initialize result
    let res = BigInt(1);
    // Update x if it is more
    // than or equal to p
    x = x % p;
    if (x == BigInt(0))
      return BigInt(0);

    while (y > BigInt(0)) {
      // If y is odd, multiply
      // x with result
      if (y & BigInt(1))
        res = (res * x) % p;

      // y must be even now

      // y = $y/2
      y = y >> BigInt(1);
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
    if (b === 0) return a;
    return this.gcd(b, a % b);
  }
  //// KEY MANAGEMENT
  sieveOfEratosthenes(min, n) {
    let array = [];
    let prime = Array.from({ length: n + 1 }, (_, i) => true);

    for (let p = 2; p * p <= n; p++) {
      if (prime[p] == true) {
        for (let i = p * p; i <= n; i += p) prime[i] = false;
      }
    }
    for (let i = min; i <= n; i++) {
      if (prime[i] == true) array.push(i);
    }
    return array;
  }

  getRandomInt(min, max) {
    // random int in (min, max)
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //Base64 code
  Base64 = {
    _Rixits: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/",
    fromNumber: function (number, n) {
      if (
        isNaN(Number(number)) ||
        number === null ||
        number === Number.POSITIVE_INFINITY
      )
        throw "The input is not valid";
      if (number < 0) throw "Can't represent negative numbers now";

      let rixit; // like 'digit', only in some non-decimal radix
      let residual = Math.floor(number);
      let result = "";
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
      if (result.length < n) {
        var auxText = "";
        var need = n - result.length;
        for (var j = 0; j < need; ++j) {
          auxText += "0";
        }
        return auxText + result;
      }
      return result;
    },

    toNumber: function (rixits) {
      let result = 0;
      // console.log("rixits : " + rixits);
      // console.log("rixits.split('') : " + rixits.split(''));
      rixits = rixits.split("");
      for (let e = 0; e < rixits.length; e++) {
        // console.log("_Rixits.indexOf(" + rixits[e] + ") : " +
        // this._Rixits.indexOf(rixits[e]));
        // console.log("result before : " + result);
        result = result * 64 + this._Rixits.indexOf(rixits[e]);
        // console.log("result after : " + result);
      }
      return result;
    },
  };

  sign(x, p, q, a) { // k entre 1 y q
    return this.powerBigInt(BigInt(x), BigInt(a), BigInt(p) * BigInt(q));
  }

  verify(x, y, p, q, b) {
    return BigInt(x) % (BigInt(p) * BigInt(q)) == this.powerBigInt(BigInt(y), BigInt(b), BigInt(p) * BigInt(q));
  }

  signSha(shaString, p, q, a) {
    let arr = [];
    let signArr = [];
    let jump = 4;
    let baseSep = 6;
    for (let i = 0; i < shaString.length / jump; i++) {
      arr.push(Number("0x" + shaString.slice(i * jump, (i + 1) * jump)));
    }
    for (let i = 0; i < arr.length; i++) {
      signArr.push(this.sign(arr[i], p, q, a));
    }
    //console.log(arr);
    // Turn to base64
    var signText = "";
    for (let i = 0; i < signArr.length; i++) {
      signText += this.Base64.fromNumber(Number(signArr[i]), baseSep);
    }
    return signText;
  }

  verifySha(shaString, signStr, p, q, b) {
    let arr = [];
    let jump = 4;
    let signArr = [];
    //let auxArr = [];
    let baseSep = 6;
    for (let i = 0; i < shaString.length / jump; i++) {
      arr.push(Number("0x" + shaString.slice(i * jump, (i + 1) * jump)));
    }
    for (var i = 0; i < signStr.length / baseSep; i++) {
      signArr.push(this.Base64.toNumber(signStr.substring(baseSep * i, baseSep * (i + 1))));
    }
    //console.log(signArr);
    for (let i = 0; i < arr.length; i++) {
      //console.log(verify(arr[i], signArr[i], p, q, b));
      if (!this.verify(arr[i], signArr[i], p, q, b)) return false;
    }
    return true;
  }
  arrToBase64(numArr, sep) {
    var strOut = "";
    for (let i = 0; i < numArr.length; i++) {
      strOut += this.Base64.fromNumber(numArr[i], sep);
    }
    return strOut;
  }
  base64ToArr(str, sep) {
    var arr = [];
    for (var i = 0; i < str.length / sep; i++) {
      arr.push(this.Base64.toNumber(str.substring(sep * i, sep * (i + 1))));
    }
    return arr;
  }
  generateKey() {
    let key = [];
    let p, q;
    let ranNum = 1, ranNum2 = 1;
    while (ranNum == ranNum2) {
      ranNum = this.getRandomInt(0, this.pArrLen);
      ranNum2 = this.getRandomInt(0, this.pArrLen);
    }
    p = this.pArr[ranNum];
    q = this.pArr[ranNum2];

    //p
    key.push(p);
    //q
    key.push(q);

    let tot = (p - 1) * (q - 1);
    ranNum = this.getRandomInt(3, tot);
    while (this.gcd(ranNum, tot) != 1) {
      ranNum = this.getRandomInt(3, tot);
    }
    let a = ranNum;
    let b = this.modInverse(a, tot);
    key.push(b);
    key.push(a);
    return key;
  }

}