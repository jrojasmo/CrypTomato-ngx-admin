import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TextUtilService {

  constructor() { }

  rmSpanishAccents (inputText) {
    var accents = "ÁÄáäÓÖóöÉËéÇçÍÏíïÚÜúüÑñ";
    var noAccents = "AAaaOOooEEeeCcIIiiUUuuNn";
    return inputText
        .split("")
        .map(function (chr) {
            const accentIndex = accents.indexOf(chr);
            return accentIndex !== -1 ? noAccents[accentIndex] : chr;
        })
        .join("");
  };

  normalizeInput (input) {
      return this.rmSpanishAccents(input)
          .replaceAll(/[^a-zA-Z]/g, "")
          .replaceAll(" ", "")
          .toLowerCase();
  };

  getCharCodes (inputText, allowDot = false) {
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
      if (allowDot) dict["."] = 26;
      return inputText.split("").map((char) => dict[char]);
  };

  codesToString (inputArr, allowDot = false) {
      const dict = {
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
      if (allowDot) dict[26] = ".";
      return inputArr.map((code) => dict[code]).join("");
  };

}