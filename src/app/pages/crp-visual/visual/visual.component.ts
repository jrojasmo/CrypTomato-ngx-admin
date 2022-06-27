import { Component, ElementRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogoComponent } from '../../dialogo/dialogo.component';
import { TextUtilService } from '../../common-services/text-util.service';


@Component({
  selector: 'ngx-crypVisual',
  styleUrls: ['./visual.component.scss'],
  templateUrl: './visual.component.html',
})

export class VisualComponent {

  @ViewChild('fileSelectorEn')
  fileSelectorEn: ElementRef<HTMLInputElement>;
  @ViewChild('canvasNormal')
  canvasNormal: ElementRef<HTMLCanvasElement>;
  inputNormalImage: HTMLImageElement;
  @ViewChild('canvasTrans1')
  canvasTrans1: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasTrans2')
  canvasTrans2: ElementRef<HTMLCanvasElement>;

  @ViewChild('fileSelectorDe')
  fileSelectorDe: ElementRef<HTMLInputElement>;
  @ViewChild('canvasTrans1up')
  canvasTrans1up: ElementRef<HTMLCanvasElement>;
  inputTrans1: HTMLImageElement;
  @ViewChild('canvasTrans2up')
  canvasTrans2up: ElementRef<HTMLCanvasElement>;
  inputTrans2: HTMLImageElement;
  @ViewChild('canvasDec')
  canvasDec: ElementRef<HTMLCanvasElement>;

  constructor(private dialogService: NbDialogService, private util: TextUtilService) {
    this.inputNormalImage = new Image();
    this.inputTrans1 = new Image();
    this.inputTrans2 = new Image();
  }

  fillToDecrypt($event) {
    $event.preventDefault();
    const canvasT1 = this.canvasTrans1.nativeElement;
    const canvasT2 = this.canvasTrans2.nativeElement;
    const canvasT1up = this.canvasTrans1up.nativeElement;
    var ctxT1up = canvasT1up.getContext('2d');
    const canvasT2up = this.canvasTrans2up.nativeElement;
    var ctxT2up = canvasT2up.getContext('2d');
    canvasT1up.width = canvasT1.width;
    canvasT1up.height = canvasT1.height;
    canvasT2up.width = canvasT2.width;
    canvasT2up.height = canvasT2.height;
    ctxT1up.drawImage(canvasT1, 0, 0);
    ctxT2up.drawImage(canvasT2, 0, 0);
  }

  stackTrans($event) {
    $event.preventDefault();
    const canvasT1up = this.canvasTrans1up.nativeElement;
    var ctxT1up = canvasT1up.getContext('2d');
    const scannedImage = ctxT1up.getImageData(0, 0, canvasT1up.width, canvasT1up.height);
    const scannedData = scannedImage.data;
    const canvasT2up = this.canvasTrans2up.nativeElement;
    var ctxT2up = canvasT2up.getContext('2d');
    const scannedImage2 = ctxT2up.getImageData(0, 0, canvasT2up.width, canvasT2up.height);
    const scannedData2 = scannedImage2.data;
    if (canvasT1up.height < 15 || canvasT1up.width < 15 || canvasT2up.height < 15 || canvasT2up.width < 15) {
      this.showMsg("You have to upload two image files!");
      return;
    }
    if (canvasT1up.width != canvasT2up.width || canvasT1up.height != canvasT2up.height) { //Add cond. if is empty
      this.showMsg("Width or height don't match! They have to be equal in order to decrypt");
      return;
    }
    const canvasSol = this.canvasDec.nativeElement;
    var ctxSol = canvasSol.getContext('2d');
    canvasSol.width = canvasT2up.width;
    canvasSol.height = canvasT1up.height;
    //DECRYPT IMAGE
    const scannedDataDecipher = this.VSSS_decipher_image(scannedData, scannedData2, canvasSol.height, canvasSol.width);
    var decipherImage = ctxSol.getImageData(0, 0, canvasSol.width, canvasSol.height); //x,y,w,h
    decipherImage.data.set(new Uint8ClampedArray(scannedDataDecipher)); // assuming values 0..255, RGBA, pre-mult.
    ctxSol.putImageData(decipherImage, 0, 0, 0, 0, canvasSol.width, canvasSol.height);
  }

  getTrans($event) {
    $event.preventDefault();
    const canvas = this.canvasNormal.nativeElement;
    var ctx = canvas.getContext('2d');
    const inputHeight = canvas.height;
    const inputWidth = canvas.width;
    if (canvas.height < 15 || canvas.width < 15) {
      this.showMsg("You have to upload an image file!");
      return;
    }
    const canvasT1 = this.canvasTrans1.nativeElement;
    var ctxT1 = canvasT1.getContext('2d');
    canvasT1.width = inputWidth * 4;
    canvasT1.height = inputHeight * 4;
    const canvasT2 = this.canvasTrans2.nativeElement;
    var ctxT2 = canvasT2.getContext('2d');
    canvasT2.width = inputWidth * 4;
    canvasT2.height = inputHeight * 4;
    // CIPHER IMAGE
    // GET INPUT IMAGE
    const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const scannedData = scannedImage.data;
    var transScannedData = this.VSSS_cipher_image(scannedData, inputHeight, inputWidth); // Cipher Function
    //DRAW THE RESULTS
    const cipher_image1 = ctxT1.getImageData(0, 0, canvasT2.width, canvasT1.height); //x,y,w,h
    cipher_image1.data.set(new Uint8ClampedArray(transScannedData[0])); // assuming values 0..255, RGBA, pre-mult.
    ctxT1.putImageData(cipher_image1, 0, 0);
    const cipher_image2 = ctxT2.getImageData(0, 0, canvasT2.width, canvasT2.height); //x,y,w,h
    cipher_image2.data.set(new Uint8ClampedArray(transScannedData[1])); // assuming values 0..255, RGBA, pre-mult.
    ctxT2.putImageData(cipher_image2, 0, 0);
  }

  ngAfterViewInit(): void {
    this.drawNormalizedInput(this.inputNormalImage, this.canvasNormal);
    this.setLoadEvent(this.inputTrans1, this.canvasTrans1up);
    this.setLoadEvent(this.inputTrans2, this.canvasTrans2up);
  }

  setLoadEvent(imagen, canvas) {
    var canvas = canvas.nativeElement;
    var context = canvas.getContext('2d');
    imagen.addEventListener('load', function () {
      canvas.width = this.width;
      canvas.height = this.height;
      context.drawImage(this, 0, 0, canvas.width, canvas.height);
    }, false);
  }

  drawNormalizedInput(imagen, canvas) {
    var canvas = canvas.nativeElement;
    var ctx = canvas.getContext('2d');
    var _this = this;
    imagen.addEventListener('load', function () {
      if (this.width > 600 || this.height > 600) {
        _this.showMsg("The image is too big! (max. 600x600px)")
        return;
      }
      canvas.width = this.width;
      canvas.height = this.height;
      ctx.drawImage(imagen, 0, 0);
      const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const scannedData = scannedImage.data;
      // Normalice colors of input image
      const normRGBArray = _this.normaliceImgInput(scannedData);
      scannedImage.data.set(new Uint8ClampedArray(normRGBArray));
      ctx.putImageData(scannedImage, 0, 0);
    }, false);
  }

  funcInput(event) {
    event.preventDefault();
    const fileList = event.target.files;
    if (!fileList[0] || fileList[0].length == 0) {
      this.showMsg('You must select an image');
      return;
    }
    var mimeType = fileList[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.showMsg("Only images are supported");
      return;
    }
    this.inputNormalImage.src = URL.createObjectURL(fileList[0]);;
    this.inputNormalImage.onerror = this.failed;
    this.inputNormalImage.crossOrigin = 'anonymous';
  }

  failed() {
    this.showMsg("The provided file couldn't be loaded as an Image media");
    console.error("The provided file couldn't be loaded as an Image media");
  }

  funcInputDe(event) {
    event.preventDefault();
    const fileList = event.target.files;
    if (!fileList[0] || fileList.length == 1) {
      this.showMsg('You must select two images.');
      return;
    }
    var mimeType0 = fileList[0].type;
    var mimeType1 = fileList[1].type;
    if (mimeType0.match(/image\/*/) == null || mimeType1.match(/image\/*/) == null) {
      this.showMsg("Only images are supported");
      return;
    }
    // Read first image
    this.inputTrans1.src = URL.createObjectURL(fileList[0]);;
    this.inputTrans1.onerror = this.failed;
    this.inputTrans1.crossOrigin = 'anonymous';
    // Read second image
    this.inputTrans2.src = URL.createObjectURL(fileList[1]);;
    this.inputTrans2.onerror = this.failed;
    this.inputTrans2.crossOrigin = 'anonymous';
  }

  // NORMALIZE IMAGE INPUT FOR ENCRYPTION
  normaliceImgInput(rgbArray) {
    var retArr = rgbArray;
    const black = [0, 0, 0];
    const red = [255, 0, 0];
    const green = [0, 255, 0];
    const blue = [0, 0, 255];
    const yellow = [255, 255, 0];
    const magenta = [255, 0, 255];
    const cyan = [0, 255, 255];
    const white = [255, 255, 255];
    const lattColors = [black, red, green, blue, yellow, magenta, cyan, white];
    var auxArray = [-1, -1, -1];
    var nearestIndex = 9;
    var minDistAux = 10000;
    for (let i = 0; i < retArr.length; i += 4) {
      nearestIndex = 9;
      minDistAux = 10000;
      auxArray = [retArr[i], retArr[i + 1], retArr[i + 2]];
      // set alpha
      retArr[i + 3] = 255;
      for (let j = 0; j < lattColors.length; j++) {
        if (this.distArray(auxArray, lattColors[j]) < minDistAux) {
          nearestIndex = j;
          minDistAux = this.distArray(auxArray, lattColors[j]);
        }
      }
      retArr[i] = lattColors[nearestIndex][0];
      retArr[i + 1] = lattColors[nearestIndex][1];
      retArr[i + 2] = lattColors[nearestIndex][2];
    }
    return retArr;
  }
  distArray(arr1, arr2) {
    if (arr1.length != arr2.length) {
      return -1;
    }
    var sum = 0;
    for (let i = 0; i < arr1.length; i++) {
      sum += Math.pow(arr1[i] - arr2[i], 2);
    }

    return Math.sqrt(sum);
  }


  ///////////////

  cleanCanvas(canvas) {
    const canvasNormal = canvas.nativeElement;
    var ctxNormal = canvasNormal.getContext('2d');
    ctxNormal.clearRect(0, 0, canvasNormal.width, canvasNormal.height);
    canvasNormal.width = 10;
    canvasNormal.height = 10;
  }
  cleanFormEn($event) {
    $event.preventDefault();
    this.cleanCanvas(this.canvasNormal);
    this.cleanCanvas(this.canvasTrans1);
    this.cleanCanvas(this.canvasTrans2);
    this.fileSelectorEn.nativeElement.value = "";
  }

  cleanFormDe($event) {
    $event.preventDefault();
    this.cleanCanvas(this.canvasTrans1up);
    this.cleanCanvas(this.canvasTrans2up);
    this.cleanCanvas(this.canvasDec);
    this.fileSelectorDe.nativeElement.value = "";
  }

  showMsg(msg) {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Error Message 😠',
        content: msg
      },
    });
  }

  array_zeros_new_image(height_image, width_image) {
    var index_cant = height_image * width_image * 4 * 16;
    //console.log("h & w cipher", height_image, width_image, index_cant);
    var array_zeros_total = Array(index_cant).fill(0);
    //console.log("height_image", height_image, "width_image", width_image, array_zeros_total.length);
    return array_zeros_total;
  }

  array_zeros_new_image_d(height_image, width_image) {
    var index_cant = height_image * width_image;
    //console.log("h & w decipher", height_image, width_image, index_cant);
    var array_zeros_total = Array(index_cant).fill(0);
    return array_zeros_total;
  }

  arrayMax(arr) { // Max of array
    return arr.reduce(function (p, v) {
      return (p > v ? p : v);
    });
  }

  prod_lattice(arr1, arr2, arr3) {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] == arr2[i] && arr1[i] == 255) {
        arr3[i] = 255;
      }
      else {
        arr3[i] = 0;
      }
    }
    return arr3
  }

  random_array(array) {
    // array_n = array;
    var array_n = array.sort(function () { return Math.random() - 0.5 });
    return array_n;
  }

  // ---------------- CONFIGURATION COLORS -----------

  transformation_m16(R, G, B, i_g, width_image, scannedData_new1, scannedData_new2) {
    const black = [0, 0, 0];
    const red = [255, 0, 0];
    const green = [0, 255, 0];
    const blue = [0, 0, 255];
    const yellow = [255, 255, 0];
    const magenta = [255, 0, 255];
    const cyan = [0, 255, 255];
    const white = [255, 255, 255];
    // Black
    // K & C & K & W & K & W & K & Y & K & Y & K & W & M & Y & M & C
    // W & K & C & K & Y & K & W & K & Y & K & W & K & C & M & Y & M 
    var K_col = [[black, white], [cyan, black], [black, cyan], [white, black], [black, yellow], [white, black], [black, white], [yellow, black], [black, yellow], [yellow, black], [black, white], [white, black], [magenta, cyan], [yellow, magenta], [magenta, yellow], [cyan, magenta]];
    // Red
    // Y & M & Y & M & Y & W & K & C & K & C & K & K & K & W & W & K
    // M & Y & M & Y & W & K & C & K & C & K & Y & W & W & K & K & K 
    var R_col = [[yellow, magenta], [magenta, yellow], [yellow, magenta], [magenta, yellow], [yellow, white], [white, black], [black, cyan], [cyan, black], [black, cyan], [cyan, black], [black, yellow], [black, white], [black, white], [white, black], [white, black], [black, black]];
    // Green
    // Y & Y & C & C & Y & W & W & W & K & K & K & M & M & K & K & K
    // C & C & Y & Y & Y & K & K & K & W & W & W & K & K & M & M & K 
    var G_col = [[yellow, cyan], [yellow, cyan], [cyan, yellow], [cyan, yellow], [yellow, yellow], [white, black], [white, black], [white, black], [black, white], [black, white], [black, white], [magenta, black], [magenta, black], [black, magenta], [black, magenta], [black, black]];
    // Blue
    // M & M & C & C & W & Y & Y & K & K & Y & K & K & K & W & W & K
    // C & C & M & M & Y & K & K & Y & Y & K & W & W & W & K & K & K 
    var B_col = [[magenta, cyan], [magenta, cyan], [cyan, magenta], [cyan, magenta], [white, yellow], [yellow, black], [yellow, black], [black, yellow], [black, yellow], [yellow, black], [black, white], [black, white], [black, white], [white, black], [white, black], [black, black]];
    // Yellow
    // Y & Y & Y Y W & W & W & K & K & C & C & K & K & M & M & K & K
    // W & W & W W Y & Y & Y & C & C & K & K & M & M & K & K & K & K 
    var Y_col = [[yellow, white], [yellow, white], [yellow, white], [white, yellow], [white, yellow], [white, yellow], [black, cyan], [black, cyan], [cyan, black], [cyan, black], [black, magenta], [black, magenta], [magenta, black], [magenta, black], [black, black], [black, black]];
    // Magenta
    // M & M & W & W & W & K & K & Y & Y & Y & K & K & C & C & K & K
    // W & W & M & M & W & Y & Y & K & K & K & C & C & K & K & K & Y 
    var M_col = [[magenta, white], [magenta, white], [white, magenta], [white, magenta], [white, white], [black, yellow], [black, yellow], [yellow, black], [yellow, black], [yellow, black], [black, cyan], [black, cyan], [cyan, black], [cyan, black], [black, black], [black, yellow]];
    // Cyan
    // C & C & W & W & W & Y & Y & Y & K & K & K & K & M & M & K & K
    // W & W & C & C & W & K & K & K & Y & Y & M & M & K & K & Y & K 
    var C_col = [[cyan, white], [cyan, white], [white, cyan], [white, cyan], [white, white], [yellow, black], [yellow, black], [yellow, black], [black, yellow], [black, yellow], [black, magenta], [black, magenta], [magenta, black], [magenta, black], [black, yellow], [black, black]];
    // White
    // W & W & W & M & M & Y & Y & Y & C & C & K & K & K & K & K & K
    // W & W & W & M & M & Y & Y & Y & C & C & K & K & K & K & K & K 
    var W_col = [[white, white], [white, white], [white, white], [magenta, magenta], [magenta, magenta], [yellow, yellow], [yellow, yellow], [yellow, yellow], [cyan, cyan], [cyan, cyan], [black, black], [black, black], [black, black], [black, black], [black, black], [black, black]];

    var color_array = [];
    if (R == 255 && G == 255 && B == 255) {
      color_array = this.random_array(W_col); // Color_new = K or R or G or B ...
      scannedData_new1 = this.agregation_array(i_g, scannedData_new1, width_image, 0, color_array);
      scannedData_new2 = this.agregation_array(i_g, scannedData_new2, width_image, 1, color_array);
      return [scannedData_new1, scannedData_new2];
    }
    else if (R == 255 && G == 255 && B == 0) {
      color_array = this.random_array(Y_col); // Color_new = K or R or G or B ...
      scannedData_new1 = this.agregation_array(i_g, scannedData_new1, width_image, 0, color_array);
      scannedData_new2 = this.agregation_array(i_g, scannedData_new2, width_image, 1, color_array);
      return [scannedData_new1, scannedData_new2];
    }
    else if (R == 255 && G == 0 && B == 255) {
      color_array = this.random_array(M_col); // Color_new = K or R or G or B ...
      scannedData_new1 = this.agregation_array(i_g, scannedData_new1, width_image, 0, color_array);
      scannedData_new2 = this.agregation_array(i_g, scannedData_new2, width_image, 1, color_array);
      return [scannedData_new1, scannedData_new2];
    }
    else if (R == 0 && G == 255 && B == 255) {
      color_array = this.random_array(C_col); // Color_new = K or R or G or B ...
      scannedData_new1 = this.agregation_array(i_g, scannedData_new1, width_image, 0, color_array);
      scannedData_new2 = this.agregation_array(i_g, scannedData_new2, width_image, 1, color_array);
      return [scannedData_new1, scannedData_new2];
    }
    else if (R == 255 && G == 0 && B == 0) {
      color_array = this.random_array(R_col); // Color_new = K or R or G or B ...
      scannedData_new1 = this.agregation_array(i_g, scannedData_new1, width_image, 0, color_array);
      scannedData_new2 = this.agregation_array(i_g, scannedData_new2, width_image, 1, color_array);
      return [scannedData_new1, scannedData_new2];
    }
    else if (R == 0 && G == 255 && B == 0) {
      color_array = this.random_array(G_col); // Color_new = K or R or G or B ...
      scannedData_new1 = this.agregation_array(i_g, scannedData_new1, width_image, 0, color_array);
      scannedData_new2 = this.agregation_array(i_g, scannedData_new2, width_image, 1, color_array);
      return [scannedData_new1, scannedData_new2];
    }
    else if (R == 0 && G == 0 && B == 255) {
      color_array = this.random_array(B_col); // Color_new = K or R or G or B ...
      scannedData_new1 = this.agregation_array(i_g, scannedData_new1, width_image, 0, color_array);
      scannedData_new2 = this.agregation_array(i_g, scannedData_new2, width_image, 1, color_array);
      return [scannedData_new1, scannedData_new2];
    }
    else if (R == 0 && G == 0 && B == 0) {
      color_array = this.random_array(K_col); // Color_new = K or R or G or B ...
      scannedData_new1 = this.agregation_array(i_g, scannedData_new1, width_image, 0, color_array);
      scannedData_new2 = this.agregation_array(i_g, scannedData_new2, width_image, 1, color_array);
      return [scannedData_new1, scannedData_new2];
    }

  }

  // [[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]]]

  agregation_array(i_g, scannedData_new, width_image, img_0_or_1, color_array) {
    var i = i_g;
    var k = 16 * width_image;
    var k2 = 32 * width_image;
    var k3 = 48 * width_image;

    scannedData_new[i] = color_array[0][img_0_or_1][0];
    scannedData_new[i + 1] = color_array[0][img_0_or_1][1];
    scannedData_new[i + 2] = color_array[0][img_0_or_1][2];
    scannedData_new[i + 3] = 255;
    //3 -> 255
    scannedData_new[i + 4] = color_array[1][img_0_or_1][0];
    scannedData_new[i + 5] = color_array[1][img_0_or_1][1];
    scannedData_new[i + 6] = color_array[1][img_0_or_1][2];
    scannedData_new[i + 7] = 255;
    //7 -> 255
    scannedData_new[i + 8] = color_array[2][img_0_or_1][0];
    scannedData_new[i + 9] = color_array[2][img_0_or_1][1];
    scannedData_new[i + 10] = color_array[2][img_0_or_1][2];
    scannedData_new[i + 11] = 255;
    //11 -> 255
    scannedData_new[i + 12] = color_array[3][img_0_or_1][0];
    scannedData_new[i + 13] = color_array[3][img_0_or_1][1];
    scannedData_new[i + 14] = color_array[3][img_0_or_1][2];
    scannedData_new[i + 15] = 255;
    //15 -> 255

    scannedData_new[i + k] = color_array[4][img_0_or_1][0];
    scannedData_new[i + 1 + k] = color_array[4][img_0_or_1][1];
    scannedData_new[i + 2 + k] = color_array[4][img_0_or_1][2];
    scannedData_new[i + 3 + k] = 255;

    scannedData_new[i + 4 + k] = color_array[5][img_0_or_1][0];
    scannedData_new[i + 5 + k] = color_array[5][img_0_or_1][1];
    scannedData_new[i + 6 + k] = color_array[5][img_0_or_1][2];
    scannedData_new[i + 7 + k] = 255;

    scannedData_new[i + 8 + k] = color_array[6][img_0_or_1][0];
    scannedData_new[i + 9 + k] = color_array[6][img_0_or_1][1];
    scannedData_new[i + 10 + k] = color_array[6][img_0_or_1][2];
    scannedData_new[i + 11 + k] = 255;

    scannedData_new[i + 12 + k] = color_array[7][img_0_or_1][0];
    scannedData_new[i + 13 + k] = color_array[7][img_0_or_1][1];
    scannedData_new[i + 14 + k] = color_array[7][img_0_or_1][2];
    scannedData_new[i + 15 + k] = 255;


    scannedData_new[i + k2] = color_array[8][img_0_or_1][0];
    scannedData_new[i + 1 + k2] = color_array[8][img_0_or_1][1];
    scannedData_new[i + 2 + k2] = color_array[8][img_0_or_1][2];
    scannedData_new[i + 3 + k2] = 255;

    scannedData_new[i + 4 + k2] = color_array[9][img_0_or_1][0];
    scannedData_new[i + 5 + k2] = color_array[9][img_0_or_1][1];
    scannedData_new[i + 6 + k2] = color_array[9][img_0_or_1][2];
    scannedData_new[i + 7 + k2] = 255;

    scannedData_new[i + 8 + k2] = color_array[10][img_0_or_1][0];
    scannedData_new[i + 9 + k2] = color_array[10][img_0_or_1][1];
    scannedData_new[i + 10 + k2] = color_array[10][img_0_or_1][2];
    scannedData_new[i + 11 + k2] = 255;

    scannedData_new[i + 12 + k2] = color_array[11][img_0_or_1][0];
    scannedData_new[i + 13 + k2] = color_array[11][img_0_or_1][1];
    scannedData_new[i + 14 + k2] = color_array[11][img_0_or_1][2];
    scannedData_new[i + 15 + k2] = 255;


    scannedData_new[i + k3] = color_array[12][img_0_or_1][0];
    scannedData_new[i + 1 + k3] = color_array[12][img_0_or_1][1];
    scannedData_new[i + 2 + k3] = color_array[12][img_0_or_1][2];
    scannedData_new[i + 3 + k3] = 255;

    scannedData_new[i + 4 + k3] = color_array[13][img_0_or_1][0];
    scannedData_new[i + 5 + k3] = color_array[13][img_0_or_1][1];
    scannedData_new[i + 6 + k3] = color_array[13][img_0_or_1][2];
    scannedData_new[i + 7 + k3] = 255;

    scannedData_new[i + 8 + k3] = color_array[14][img_0_or_1][0];
    scannedData_new[i + 9 + k3] = color_array[14][img_0_or_1][1];
    scannedData_new[i + 10 + k3] = color_array[14][img_0_or_1][2];
    scannedData_new[i + 11 + k3] = 255;

    scannedData_new[i + 12 + k3] = color_array[15][img_0_or_1][0];
    scannedData_new[i + 13 + k3] = color_array[15][img_0_or_1][1];
    scannedData_new[i + 14 + k3] = color_array[15][img_0_or_1][2];
    scannedData_new[i + 15 + k3] = 255;

    return scannedData_new;
  }

  //----------------------------------------------------------------------------------------------------------------
  //                                         CIPHER FUNCTION
  //----------------------------------------------------------------------------------------------------------------

  VSSS_cipher_image(scannedData, height_image, width_image) { // Función que cifra la imagen pos. [j,j+4,j+ancho,j+4+ancho] con key [k_0, k_1, k_2, k_3]
    var scannedData_new1 = this.array_zeros_new_image(height_image, width_image); //
    var scannedData_new2 = this.array_zeros_new_image(height_image, width_image);
    //console.log("scannedData_new1", scannedData_new1.length, "scannedData_new1", scannedData_new2.length);
    // Imagen normalizada
    var count = 0;
    var count_z = 0;
    // var flag = false;
    var i_g = 0;
    for (let i = 0; i <= scannedData.length - 1; i += 4) { //scannedData.length
      if (Number.isInteger(count / width_image)) {
        i_g = i * 16;
      }
      else {
        i_g = i_g + 16;
      }
      var full_2_array = this.transformation_m16(scannedData[i], scannedData[i + 1], scannedData[i + 2], i_g, width_image, scannedData_new1, scannedData_new2);
      scannedData_new1 = full_2_array[0];
      scannedData_new2 = full_2_array[1];
      count = count + 1;
      count_z = Math.trunc(count / width_image);
    }
    // console.log("22222", "scannedData_new1", scannedData_new1.length, "scannedData_new1", scannedData_new2.length);
    return [scannedData_new1, scannedData_new2];
  };

  //----------------------------------------------------------------------------------------------------------------
  //                                         DECIPHER FUNCTION
  //----------------------------------------------------------------------------------------------------------------

  VSSS_decipher_image(scannedData1, scannedData2, height_image, width_image) { // Función que cifra la imagen pos. [j,j+4,j+ancho,j+4+ancho] con key [k_0, k_1, k_2, k_3]

    var scannedData_new1 = this.array_zeros_new_image_d(height_image, width_image); //
    //console.log("wtf", scannedData1.length, scannedData2.length, scannedData_new1.length)
    scannedData_new1 = this.prod_lattice(scannedData1, scannedData2, scannedData_new1)

    return scannedData_new1;
  };
}