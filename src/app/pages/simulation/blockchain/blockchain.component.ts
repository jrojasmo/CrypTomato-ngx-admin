import { Component, Input } from '@angular/core';
import { NbDialogService, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { DialogoComponent } from '../../dialogo/dialogo.component';
import { TextUtilService } from '../../common-services/text-util.service';

const SHA256 = require("crypto-js/sha256");

/////// FUNC TO CIPHER
class VigenereObj {

  constructor(private util: TextUtilService) { }

  getTexts() {
    var array = [
      "inthetownwhereiwasbornlivedamanwhosailedtoseaandhetoldusofhislifeinthelandofsubmarinessowesailedontothesuntilwefoundaseaofgreenandwelivedbeneaththewavesinouryellowsubmarineweallliveinayellowsubmarineyellowsubmarineyellowsubmarineweallliveinayellowsub",
      "ahlookatallthelonelypeopleeleanorrigbypicksupthericeinthechurchwhereaweddinghasbeenlivesinadreamwaitsatthewindowwearingthefacethatshekeepsinajarbythedoorwhoisitforallthelonelypeoplewheredotheyallcomefromallthelonelypeoplewheredotheyallbelongfathermck",
      "nooneithinkisinmytreeimeanitmustbehighorlowthatisyoucantyouknowtuneinbutitsallrightthatisithinkitsnottoobadletmetakeyoudowncauseimgoingtostrawberryfieldsnothingisrealandnothingtogethungaboutstrawberryfieldsforeverlivingiseasywitheyesclosedmisundersta",
      "heyjudedontmakeitbadtakeasadsongandmakeitbetterremembertoletherintoyourheartthenyoucanstarttomakeitbetterheyjudedontbeafraidyouweremadetogooutandgethertheminuteyouletherunderyourskinthenyoubegintomakeitbetterandanytimeyoufeelthepainheyjuderefraindont",
      "herecomeoldflattophecomegroovingupslowlyhegotjoojooeyeballheoneholyrollerhegothairdowntohiskneegottobeajokerhejustdowhathepleasehewearnoshoeshinehegottoejamfootballhegotmonkeyfingerheshootcocacolahesayiknowyouyouknowmeonethingicantellyouisyougottobef",
      "yesterdayallmytroublesseemedsofarawaynowitlooksasthoughtheyreheretostayohibelieveinyesterdaysuddenlyimnothalfthemaniusedtobetheresashadowhangingovermeohyesterdaycamesuddenlywhyshehadtogoidontknowshewouldntsayisaidsomethingwrongnowilongforyesterdayyes"
    ];
    for (var i = 0; i < array.length; ++i) {
      array[i] = this.util.normalizeInput(array[i]);
    }
    return array;
  }
  vigenere(clearText, key, cipher) {
    var normalTextCodes = this.util.getCharCodes(this.util.normalizeInput(clearText));
    var normalKeyCodes = this.util.getCharCodes(this.util.normalizeInput(key));
    var m = normalKeyCodes.length;
    var indexKey = 0;
    for (var i = 0; i < normalTextCodes.length; i++) {
      indexKey = i % m;
      if (cipher)
        normalTextCodes[i] = (normalTextCodes[i] + normalKeyCodes[indexKey]) % 26;
      else
        normalTextCodes[i] =
          (normalTextCodes[i] - normalKeyCodes[indexKey] + 26) % 26;
    }
    return this.util.codesToString(normalTextCodes);
  }
  vigenereCipher(clearText, key) {
    return this.vigenere(clearText, key, true);
  }
  vigenereDecipher(cipherText, key) {
    return this.vigenere(cipherText, key, false);
  }
  vigenereCryptanalysis(cipherText, m) {
    var possibleKey = this.splitStr(cipherText, m);
    const expectedCI = 0.065;
    var minDiff = -1;
    var indexMinDiff = -1;
    var testDiff = 0;
    for (var i = 0; i < m; i++) {
      minDiff = 100;
      indexMinDiff = 0;
      for (var j = 0; j < 26; j++) {
        testDiff = Math.abs(this.funM_g(possibleKey[i], j) - expectedCI);
        if (testDiff < minDiff) {
          minDiff = testDiff;
          indexMinDiff = j;
        }
      }
      possibleKey[i] = this.util.codesToString([indexMinDiff])
    }
    console.log('posible key: ' + possibleKey.join(""));
    console.log(this.vigenereDecipher(cipherText, possibleKey.join("")));
    return possibleKey.join("");
  }
  splitStr(strText, m) {
    var strToSend = [];
    for (var i = 0; i < m; i++) {
      strToSend.push("");
    }
    for (var i = 0; i < strText.length; i++) {
      strToSend[i % m] += strText.charAt(i);
    }
    return strToSend;
  }
  funM_g(strText, g) {
    // Probabilidades estandar de encontrarse la i-ésima letra de un texto en inglés.  
    var standardProbabilities =
      [0.082, 0.015, 0.028, 0.043, 0.127, 0.022, 0.020, 0.061, 0.070,
        0.002, 0.008, 0.040, 0.024, 0.067, 0.075, 0.019, 0.001, 0.060,
        0.063, 0.091, 0.028, 0.010, 0.023, 0.001, 0.020, 0.001];
    var text = this.util.normalizeInput(strText);
    var frecuencies = {};
    for (var i = 0; i < text.length; i++) {
      if (frecuencies[text.charAt(i)])
        frecuencies[text.charAt(i)] += 1;
      else
        frecuencies[text.charAt(i)] = 1;
    }
    var t = [];
    for (var i = 0; i < standardProbabilities.length; i++) {
      t = [(i + g) % 26];
      if (frecuencies[this.util.codesToString(t)]) {
        standardProbabilities[i] *= frecuencies[this.util.codesToString(t)];
      }
      else {
        standardProbabilities[i] = 0;
      }
    }
    var sum = 0;
    for (var i = 0; i < standardProbabilities.length; i++) {
      sum += standardProbabilities[i];
    }
    return sum / strText.length;
  }

}
/////// BLOCKCHAIN
class Transaction {
  from: string;
  to: string;
  amount: number;
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
  calculateHash() {
    return SHA256(this.from + this.to + this.amount).toString();
  }
}
class Block {
  time: string;
  previoushHash: string;
  hash: string;
  text: string;
  transactions: Transaction[];
  constructor(time, transactions, previoushHash = "") {
    this.time = time;
    this.transactions = transactions;
    this.previoushHash = previoushHash;
    this.hash = this.getBlockHash();
    this.text = "";
  }
  getBlockHash() {
    return SHA256(
      this.time + JSON.stringify(this.transactions) + this.previoushHash
    ).toString();
  }
}
class BlockChain {
  blockChainSuperUser: string;
  chain: Block[];
  height: number;
  pendingTransactions: any[];
  blocksToMine: Block[];
  miningReward: number;
  keyLength: number;
  vigenere: VigenereObj;
  texts: string[];
  users: string[];
  constructor(private util: TextUtilService) {
    this.vigenere = new VigenereObj(util);
    this.blockChainSuperUser = "Cryptomato";
    this.chain = [this.createGenesisBlock()];
    this.height = 4;
    this.pendingTransactions = [];
    this.blocksToMine = []; //Arreglo de bloque y el texto cifrado
    this.miningReward = 0.25;
    this.keyLength = 10;
    this.texts = this.vigenere.getTexts();
    this.users = ["beto", "rosa", "hugo", "alice"];
  }
  createGenesisBlock() {
    var genesis = new Block(new Date(Date.now()).toString(), [], "");
    var transactions = [];
    var usersGen = ["beto", "rosa", "hugo", "alice"];
    for (var i = 0; i < 4; ++i) {
      transactions.push(
        new Transaction(this.blockChainSuperUser, usersGen[i], 10)
      );
    }
    genesis.transactions = transactions;
    genesis.text = "The Genesis Block";
    genesis.hash = genesis.getBlockHash();
    return genesis;
  }
  printPendingTransactions() {
    for (var i = 0; i < this.pendingTransactions.length; ++i) {
      console.log(
        "Transaction #" +
        (i + 1) +
        " " +
        this.pendingTransactions[i].from +
        " " +
        this.pendingTransactions[i].to +
        " " +
        this.pendingTransactions[i].amount
      );
    }
  }
  getBalanceOfUser(user) {
    var balance = 0;
    user = this.util.normalizeInput(user);
    //console.log(user);
    for (var i = 0; i < this.chain.length; ++i) {
      var tempBlock = this.chain[i];
      for (var j = 0; j < tempBlock.transactions.length; ++j) {
        var tempTransaction = tempBlock.transactions[j];
        //console.log(normalizeInput(tempTransaction.from));
        if (this.util.normalizeInput(tempTransaction.from) == user) {
          balance -= tempTransaction.amount;
        }
        if (this.util.normalizeInput(tempTransaction.to) == user) {
          balance += tempTransaction.amount;
        }
      }
    }
    return balance;
  }

  getTotalBalance() {
    var usersBalance = [];
    for (var z = 0; z < this.users.length; ++z) {
      var userInfo = [];
      var tempUsuario = this.users[z];
      var historicBalance = 0;
      var pendingBalance = 0;

      tempUsuario = this.util.normalizeInput(tempUsuario);
      for (var i = 0; i < this.chain.length; ++i) {
        var tempBlock = this.chain[i];
        for (var j = 0; j < tempBlock.transactions.length; ++j) {
          var tempTransaction = tempBlock.transactions[j];
          if (this.util.normalizeInput(tempTransaction.from) == tempUsuario) {
            historicBalance -= tempTransaction.amount;
          }
          if (this.util.normalizeInput(tempTransaction.to) == tempUsuario) {
            historicBalance += tempTransaction.amount;
          }
        }
      }
      for (var i = 0; i < this.pendingTransactions.length; ++i) {
        if (this.util.normalizeInput(this.pendingTransactions[i].from) == tempUsuario)
          pendingBalance -= this.pendingTransactions[i].amount;
      }
      for (var i = 0; i < this.blocksToMine.length; ++i) {
        var tempBlock = this.blocksToMine[i];
        for (var j = 0; j < tempBlock.transactions.length; ++j) {
          if (this.util.normalizeInput(tempBlock.transactions[j].from) == tempUsuario)
            pendingBalance -= tempBlock.transactions[j].amount;
        }
      }
      userInfo.push(tempUsuario);
      userInfo.push(historicBalance);
      userInfo.push(pendingBalance);
      usersBalance.push(userInfo);
    }
    return usersBalance;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }
  mineBlock(guess, miningBlockNumber, minerName) {
    //add to this block the latest block address
    if (
      miningBlockNumber > this.blocksToMine.length ||
      this.blocksToMine.length == 0
    ) {
      return "Invalid block ID";
    }
    var clearGuess = this.vigenere.vigenereDecipher(
      this.blocksToMine[miningBlockNumber].text,
      guess
    );
    for (var i = 0; i < this.texts.length; ++i) {
      if (clearGuess == this.texts[i]) {
        var reward = new Transaction(
          this.blockChainSuperUser,
          minerName,
          this.miningReward
        );
        this.blocksToMine[miningBlockNumber].transactions.push(reward);
        var lastHash = this.getLastBlock().getBlockHash();
        this.chain.push(this.blocksToMine[miningBlockNumber]);
        this.blocksToMine.splice(miningBlockNumber, 1);
        this.getLastBlock().time = new Date(Date.now()).toString();
        this.getLastBlock().previoushHash = lastHash;
        this.getLastBlock().hash = this.getLastBlock().getBlockHash();
        // Check is there a new user
        const trans = this.getLastBlock().transactions;
        for (let j = 0; j < trans.length; j++) {
          if (!this.users.includes(trans[j].to)) {
            this.users.push(trans[j].to);
          }
        }
        console.log("Block mined, the hash is: " + this.getLastBlock().hash);
        return "Block successfully mined! 🤑";
      }
    }
    console.log("Incorrect guess. Please try again.");
    return "Incorrect guess. Please try again.";

  }
  isValid(transaction) {
    var userBalance = this.getBalanceOfUser(transaction.from);
    var user = this.util.normalizeInput(transaction.from);
    for (var i = 0; i < this.pendingTransactions.length; ++i) {
      if (this.util.normalizeInput(this.pendingTransactions[i].from) == user)
        userBalance -= this.pendingTransactions[i].amount;
    }
    for (var i = 0; i < this.blocksToMine.length; ++i) {
      var tempBlock = this.blocksToMine[i];
      for (var j = 0; j < tempBlock.transactions.length; ++j) {
        if (this.util.normalizeInput(tempBlock.transactions[j].from) == user)
          userBalance -= tempBlock.transactions[j].amount;
      }
    }
    return userBalance >= transaction.amount;
  }

  addBlocksToMine() {
    if (this.pendingTransactions.length == this.height) {
      var block = new Block("", [], "");
      for (var i = 0; i < 4; ++i) {
        block.transactions.push(this.pendingTransactions[i]);
      }
      for (var i = 3; i >= 0; --i) {
        this.pendingTransactions.splice(i, 1);
      }
      var key = this.util.ranKey(this.keyLength);
      //var key = "aaaaaaaaaa";
      console.log("KEY", key);
      var cleartext = this.texts[Math.floor(Math.random() * this.texts.length)];
      block.text = this.vigenere.vigenereCipher(cleartext, key);
      // Add temp time
      block.time = new Date(Date.now()).toString();
      this.blocksToMine.push(block);
    }
  }
  addTransaction(transaction) {
    var msgTrans = "";
    if (!transaction.from || !transaction.to) {
      msgTrans = "Please type the user to send or receive 🍅.";
      return msgTrans;
    }
    if (transaction.from == transaction.to) {
      msgTrans = "You cannot send 🍅 to yourself, they are meant to be shared.";
      return msgTrans;
    }
    if (!this.isValid(transaction)) {
      msgTrans = "The transaction is not valid, the sender must have enough 🍅 to send in his available pool.";
      return msgTrans;
    }
    this.pendingTransactions.push(transaction);
    this.addBlocksToMine();
    msgTrans = "Succesfully added to Pending Transactions!";
    return msgTrans;
  }
}

@Component({
  selector: 'ngx-blockchain',
  styleUrls: ['./blockchain.component.scss'],
  templateUrl: './blockchain.component.html',
})

export class BlockchainComponent {
  // BLOCKCHAIN
  tomatoChain: BlockChain;
  tableTomatos: any[];
  tableColTomatos: string[];
  tableTomatoChain: any[];
  tableColTomatoChain: string[];
  tableTomatoPending: any[];
  tableColTomatoPending: string[];
  tableTomatoMine: any[];
  tableColTomatoMine: string[];
  // MODELS
  modelTrans = {
    from: '',
    to: '',
    amount: 0.1
  }
  modelMine = {
    idList: [],
    id: 0,
    text: "",
    key: "",
    minerName: ""
  }
  modelDecipher = {
    cipherText: "",
    key: "",
    clearText: ""
  }
  modelAnlysis = {
    cipherText: "",
    lenKey: 1,
    guessKey: ""
  }

  vigenere: VigenereObj;

  constructor(private dialogService: NbDialogService, private util: TextUtilService) {
    this.tableColTomatos = ['User', 'Balance', 'Pending'];
    this.tableColTomatoChain = ['Hash', 'Time', 'Prev_Hash'];
    this.tableColTomatoPending = ['From', 'To', 'Amount'];
    this.tableColTomatoMine = ['ID', 'Time', 'Amount'];
    this.vigenere = new VigenereObj(util);
    this.tomatoChain = new BlockChain(util);
    this.updateTableTomatos();
    this.updateTableTomatoChain();
    this.updateTablePending();
    this.updateTableTomatoMine();
  }
  // BLOCKCHAIN FUNC
  sendTransaction(from, to, amount) {
    const amountN = Number(amount);
    if (amountN <= 0) {
      this.showTxtMessage("The amount must be greater or equal to zero.");
      return;
    }
    const tempTrans = new Transaction(this.util.normalizeInput(from), this.util.normalizeInput(to), amountN);
    const resultMsg = this.tomatoChain.addTransaction(tempTrans);
    this.showTxtMessage(resultMsg);
    console.log(JSON.stringify(this.tomatoChain.pendingTransactions));
    this.updateTableTomatos();
    this.updateTablePending();
    this.updateTableTomatoMine();
  }
  updateTableTomatos() {
    const arr = this.tomatoChain.getTotalBalance();
    var tableData = [];
    var tObj = {};
    for (let i = 0; i < arr.length; i++) {
      tObj = {
        data: { User: arr[i][0], Balance: arr[i][1], Pending: Math.abs(Number(arr[i][2])) }
      }
      tableData.push(tObj);
    }
    //console.log(JSON.stringify(tableData));
    this.tableTomatos = tableData;
  }
  updateTableTomatoChain() {
    const arr = this.tomatoChain.chain;
    var tableData = [];
    var tObj = {};
    var tChildrenArr = [];
    var tChildrenObj = {};
    for (let i = 0; i < arr.length; i++) {
      tChildrenArr = [];
      for (let j = 0; j < arr[i].transactions.length; j++) {
        tChildrenObj = {
          data: { Hash: arr[i].transactions[j].from, Time: arr[i].transactions[j].to, Prev_Hash: arr[i].transactions[j].amount },
        };
        tChildrenArr.push(tChildrenObj);
      }
      tObj = {
        data: { Hash: arr[i].hash, Time: arr[i].time.split('(')[0], Prev_Hash: arr[i].previoushHash },
        children: tChildrenArr
      };
      tableData.push(tObj);
    }
    //console.log(JSON.stringify(tableData));
    this.tableTomatoChain = tableData;
  }
  updateTablePending() {
    const arr = this.tomatoChain.pendingTransactions;
    var tableData = [];
    var tObj = {};
    for (let i = 0; i < arr.length; i++) {
      tObj = {
        data: { From: arr[i].from, To: arr[i].to, Amount: arr[i].amount }
      }
      tableData.push(tObj);
    }
    console.log(JSON.stringify(tableData));
    this.tableTomatoPending = tableData;
  }
  updateTableTomatoMine() {
    const arr = this.tomatoChain.blocksToMine;
    var tableData = [];
    var tObj = {};
    var tChildrenArr = [];
    var tChildrenObj = {};
    var tAmount = 0;
    for (let i = 0; i < arr.length; i++) {
      tAmount = 0;
      tChildrenArr = [];
      for (let j = 0; j < arr[i].transactions.length; j++) {
        tChildrenObj = {
          data: { ID: arr[i].transactions[j].from, Time: arr[i].transactions[j].to, Amount: arr[i].transactions[j].amount },
        };
        tChildrenArr.push(tChildrenObj);
        tAmount += Number(arr[i].transactions[j].amount);
      }
      tObj = {
        data: { ID: i, Time: arr[i].time.split('(')[0], Amount: tAmount },
        children: tChildrenArr
      };
      tableData.push(tObj);
    }
    //console.log(JSON.stringify(tableData));
    this.tableTomatoMine = tableData;
    // Update dropdown list
    var tList = [];
    for (let i = 0; i < tableData.length; i++) {
      tList.push(i);
    }
    this.modelMine.idList = tList;
  }
  updateBlockToMine(id, $event) {
    $event.preventDefault();
    this.modelMine.text = this.tomatoChain.blocksToMine[id].text;
    this.modelMine.id = id;
    console.log(id);
  }
  mineSelBlock($event) {
    $event.preventDefault();
    const username = this.util.normalizeInput(this.modelMine.minerName);
    const idBlock = Number(this.modelMine.id);
    const key = this.util.normalizeInput(this.modelMine.key);
    if (!username || !key) {
      this.showTxtMessage("Please fill all the text fields!");
      return;
    }
    const msgMine = this.tomatoChain.mineBlock(key, idBlock, username);
    if (msgMine == "Block successfully mined! 🤑") {
      this.updateTableTomatos();
      this.updateTableTomatoChain();
      this.updateTablePending();
      this.updateTableTomatoMine();
      this.clearFormMine();
    }
    setTimeout(() => {  this.showTxtMessage(msgMine); }, 700);
    console.log(JSON.stringify(this.tomatoChain.chain));
  }
  clearFormTrans($event) {
    $event.preventDefault();
    this.modelTrans.from = '';
    this.modelTrans.to = '';
    this.modelTrans.amount = 0.1;
  }
  clearFormMine() {
    this.modelMine.id = undefined;
    this.modelMine.text = "";
    this.modelMine.key = "";
    this.modelMine.minerName = "";
    var tList = [];
    for (let i = 0; i < this.tableTomatoPending.length; i++) {
      tList.push(i);
    }
    this.modelMine.idList = tList;
  }
  // VIGENERE
  decipherVigenere(cipherTxt, key) {
    if (!cipherTxt || !key) {
      this.showTxtMessage("Please fill all fields");
    }
    this.modelDecipher.clearText = this.vigenere.vigenereDecipher(cipherTxt, key);
  }
  clearFormVig($event) {
    $event.preventDefault();
    this.modelDecipher.cipherText = '';
    this.modelDecipher.key = '';
    this.modelDecipher.clearText = '';
  }
  analysisVigenere(cipherText, m) {
    if (!cipherText){
      this.showTxtMessage("Please type the Ciphertext.");
      return;
    } else if (m <= 0){
      this.showTxtMessage("Key length must be greater or equal to zero.");
      return;
    }
    else {
      cipherText = this.util.normalizeInput(cipherText);
      this.modelAnlysis.guessKey = this.vigenere.vigenereCryptanalysis(cipherText, m);
      return;
    }
  }
  clearFormAn($event) {
    $event.preventDefault();
    this.modelAnlysis.cipherText = '';
    this.modelAnlysis.lenKey = 1;
    this.modelAnlysis.guessKey = '';
  }
  // DIALOG
  showTxtMessage(msg) {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Messsage! ⚠️',
        content: msg
      },
    });
  }
}
