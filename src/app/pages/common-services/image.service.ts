import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {

  constructor() { }

  getVariebles() {
    var canvas = document.getElementById('canvas1');
    var ctx = canvas.getContext('2d');
  }

}