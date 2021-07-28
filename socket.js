const { config } = require(__dirname + "/config/index.js");
let { chatHist, canUserTransact, usersInvest, userSockets, socketList, userRawSockets, socketListKeys, usersHivePower, auditArray, auditWalletArray, pingArray,
   founderslist, backerslist, hlspreholderlist, enableLenderUSDcost, withdrawUSDcost, contractDeployUSDcost, cancelContractFeePercent, userTokens, hotWalletBalance,
   coldWalletBalance, hotWalletData, coldWalletData, maxWin, bankRoll, greedBR, siteProfit, siteTake, siteEarnings, newCurrentBlock, synced, blockNum, btcprice, hivebtcprice,
   hiveprice, hbdbtcprice, hbdprice, hivePriceData, priceSourceNameArray, priceSourceArray, priceSourceIndex, priceSourceActive, oldprice, lastprice, spotprice, spreadpercent,
   longHIVEprice, shortHIVEprice, priceNonce, cgData, bncData, cmcData, wcData, pricecheckinit, pricechecklast, labelstack, datas, loginContent} = require("./vars.js");
let debug = config.debug;
let verbose = config.verbose;
const owner = config.owner;
let testing = config.testing;
let truebetapass = config.betapass;
let version = config.version;
const fs = require("fs");
const spawn = require("child_process");
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const hive = require('@hiveio/hive-js');
let { pgpKeygenAsync, pgpEncryptAsync, pgpDecryptAsync } = require(__dirname + '/snippets/pgp.js');
let getStringByteSize = require(__dirname + '/snippets/getStringByteSize.js');
let getVP = require(__dirname + '/snippets/getVotingPower.js');
let HP = require(__dirname + '/snippets/getHivePower.js');
let getPowerDownPath = require(__dirname + '/snippets/getPowerDownRoutes.js');
let manaBar = require(__dirname + '/snippets/manaBar.js');
let {Client,  Signature,  cryptoUtils} = require('@hiveio/dhive');
let Price = require(__dirname + '/snippets/priceCheck.js');
new Client('https://api.hive.blog');
const log = require('fancy-log');
const io = require("socket.io");
const socket = io();
const pm2 = require(__dirname + '/snippets/pm2MetricsHost.js');
const moment = require('moment');
const geoip = require('geoip-lite');
const schedule = require('node-schedule');
const fetch = require('node-fetch');
const DB = require('./database/models');
const sequelize = DB.sequelize;
const DataBase = sequelize;
const { Op } = require('sequelize');
const UserData = DataBase.models.Users;
const LoanData = DataBase.models.Loans;
const DepositData = DataBase.models.Deposits;
const WithdrawData = DataBase.models.Withdrawals;
const ChatData = DataBase.models.Messages;
//const OwnkeyData = DataBase.models.Ownerkeys;
const PriceData = DataBase.models.Pricelog;

log("CHAIN: Initializing Blockchain Monitoring...");
var rpcThread = spawn.fork(__dirname + '/monitors/chainSnoop.js'); //, [], {}
log("USERS: Initializing Users & Accounts Monitoring...");
var userThread = spawn.fork(__dirname + '/monitors/userManager.js'); // , [], {}
log("LOANS: Initializing Loans & Lending Monitoring...");
var loanThread = spawn.fork(__dirname + '/monitors/lendEngine.js'); // , [], {}
log("TICKER: Initializing CoinMarketCap HIVE CHART Price Monitoring...");
var tickerThread = spawn.fork(__dirname + '/monitors/tickerPrice.js'); // , [], {}
log("WRITE: Initializing Custom JSON Chain Communication...");
var scribeThread = spawn.fork(__dirname + '/monitors/hiveScribe.js'); // , [], {}
log("TRADE: Initializing Share Exchange & Trading...");
var exchangeThread = spawn.fork(__dirname + '/monitors/exchangeEngine.js');
log("FUTURES: Initializing HIVE Futures Engine...");
var futuresThread = spawn.fork(__dirname + '/monitors/cfdEngine.js');
log("SEER: Initializing Seer Prediction Engine...");
var seerThread = spawn.fork(__dirname + '/monitors/theSeer.js');
log("LEASE: Initializing Hive Power Delegation Engine...")
var leaseThread = spawn.fork(__dirname + '/monitors/leaseEngine.js');

hive.api.setOptions({ url: "https://api.hive.blog" });

var onlineCounter = pm2.onlineCounter;
var dateNow = new Date().getTime();

//==================================================
//--------------------------------------------------
//     Founders & Backers & ShareHolders
//--------------------------------------------------
var foundersload = () => {
  fs.readFile(__dirname + "/lists/founders.csv", function(err, data){
    if(err) return false;
    if(data){
      try{
        founderslist.push(data);
        log(founderslist)
        return founderslist;
      } catch(e) {
        log(e);
        return false;
      }
    }
  });
};//END foundersload
foundersload();

var backersload = () => {
  fs.readFile(__dirname + "/lists/backers.csv", function(err, data){
    if(err) return false;
    if(data){
      try{
        backerslist.push(data);
        log(backerslist)
        return backerslist;
      } catch(e) {
        log(e);
        return false;
      }
    }
  });
};//END backersload
backersload();

var hlspreholder = () => {
  fs.readFile(__dirname + "/lists/birds.json", function(err, data){
    if(err) return false;
    if(data){
      try{
        hlspreholderlist.push(data);
        log(hlspreholderlist)
        return hlspreholderlist;
      } catch(e) {
        log(e);
        return false;
      }
    }
  });
};//END hlspreholder
hlspreholder();

//==================================================
//--------------------------------------------------
//     HIVE Price
//--------------------------------------------------
var pricecheck = async(coin) => {
  //var pricereply;
  if(coin == undefined) {
    coin = "hive%2Chive_dollar%2Cbitcoin"; //hive%2Chive_dollar%2Cbtc
  } else {
    if(coin != "hive%2Chive_dollar%2Cbitcoin") coin = coin.toLowerCase();
  }
  var pricereply = await cg(coin).then(function(res){
    if(res && res.length > 0){
      log(res)
      "var callreply = await function " + priceSourceActive + "("+ coin+").then(await function(res){}).catch(e => {log(`SOCKET: ERROR: pricecheck: ${e} - `);return false;});" +
        priceNonce++;
        if(config.debug === true) log('pricecheck() res:');
        if(debug === true) log(res);
        var resDate = res;
        res = res[0];
        var coinNames = Object.keys(res);
        var timeDate = resDate[1]['date'];
        timeDate.toUTCString();
        var response;
        if(coinNames.length < 2) {
           response = res[coin];
        } else {
          for(entry in coinNames){
            if(debug === true) log(coinNames[entry]);
            if(coinNames[entry] == 'bitcoin') {
              btcprice = res[coinNames[entry]]["usd"];
            }
            if(coinNames[entry] == 'hive') {
              hiveprice = res[coinNames[entry]]["usd"];
              hivebtcprice = res[coinNames[entry]]["btc"];
            }
            if(coinNames[entry] == 'hive_dollar') {
              hbdprice = res[coinNames[entry]]["btc"] * btcprice;//res[coinNames[entry]]["usd"];
              hbdbtcprice = res[coinNames[entry]]["btc"];
            }
          }
        }

        if(pricecheckinit == false) {
          log(`SOCKET: Initializing PriceCheck!`);
          pricechecklast = hiveprice;
          pricecheckinit = true;
        }
        futuresThread.send(JSON.stringify({type:'price', price:hiveprice, date: timeDate}));
        PriceData.create({hivebtcprice: hivebtcprice, hiveusdprice: hiveprice, hbdbtcprice: hbdbtcprice, hbdusdprice: hbdprice, btcusdprice: btcprice, block: newCurrentBlock, synced: synced, validdate: timeDate});


        var spread = spreadpercent / 100;
        longHIVEprice = parseFloat((hiveprice + (hiveprice * spread)).toFixed(6));
        shortHIVEprice = parseFloat((hiveprice - (hiveprice * spread)).toFixed(6));

        if(pricechecklast == hiveprice) {
          return;
        } else {
          pricechecklast = hiveprice;
        }
        if(debug === true){
          log(`hiveprice:`);
          log(hiveprice);
          log(`longHIVEprice:`);
          log(longHIVEprice);
          log(`shortHIVEprice:`);
          log(shortHIVEprice);
        }

        var data = hiveprice;
        var labels = dateNow;//returnTime();//.push( Date.now());  //s.push(data);
        hivePriceData.push(data);
        labelstack.push(labels);
        var labelssend = {labelstack};
        var datasets = {hivePriceData};
        var chartShit = [{close: data, time: labels}]
        //log(hivePriceData);
        var hivePriceDataKeys = Object.keys(hivePriceData);
        var hivePriceDateKeys = Object.keys(labelstack);
        //renderChart(hivePriceData, hivePriceDataKeys, "myChart");

        socketListKeys = Object.keys(socketList);
          if(socketListKeys != undefined){
            socketListKeys.forEach((item, i) => {
                //log(`sent priceupdate to ${item}`)
                socketList[item].emit('priceupdate', {hiveusdprice: hiveprice, hiveshortprice: shortHIVEprice, hivelongprice: longHIVEprice, hivebtcprice: hivebtcprice, date: dateNow}); /// chart: chartShit // to(socketListKeys[i])
            });
          }

        if((hivePriceDateKeys.length > 20) == true){
          hivePriceDateKeys.shift();
          labelstack.shift();
        }
        if((hivePriceDataKeys.length > 20) == true){
           hivePriceDataKeys.shift();
           hivePriceData.shift();
        }
        process.stdout.clearLine();
    }

      //alse;});


  /*
  switch(priceSourceActive) {
    case "cg":
    if(coin == undefined) {
      coin = "hive%2Chive_dollar%2Cbitcoin"; //hive%2Chive_dollar%2Cbtc
    } else {
      if(coin != "hive%2Chive_dollar%2Cbitcoin") coin = coin.toLowerCase();
    }
    pricereply = await cg(coin).then(await function(res){
      log(res)

      var resDate = res;
      res = res[0];
      var coinNames = Object.keys(res);
      var timeDate = dateNow;
      timeDate = (timeDate).toUTCString();
      var response;
      if(coinNames.length < 2) {
        response = res[coin];
      } else {
        for(entry in coinNames){
          if(debug === true) log(coinNames[entry]);
          if(coinNames[entry] == 'bitcoin') {
            btcprice = res[coinNames[entry]]["usd"];
          }
          if(coinNames[entry] == 'hive') {
            hiveprice = res[coinNames[entry]]["usd"];
            hivebtcprice = res[coinNames[entry]]["btc"];
          }
          if(coinNames[entry] == 'hive_dollar') {
            hbdprice = res[coinNames[entry]]["btc"] * btcprice;//res[coinNames[entry]]["usd"];
            hbdbtcprice = res[coinNames[entry]]["btc"];
          }
        }
      }

      var data = hiveprice;
      var labels = timeDate//returnTime();//.push( Date.now());  //s.push(data);
      hivePriceData.push(data);
      labelstack.push(labels);
      var labelssend = {labelstack};
      var datasets = {hivePriceData};
      var chartShit = [{close: data, time: labels}]
      //log(hivePriceData);
      var hivePriceDataKeys = Object.keys(hivePriceData);
      var hivePriceDateKeys = Object.keys(labelstack);
      //renderChart(hivePriceData, hivePriceDataKeys, "myChart");
    }).catch(e => {log(`SOCKET: ERROR: pricecheck: ${e} - `);return false;});

    break;
    case "bn":
      if(coin == undefined) {
        coin = "HIVE";
      } else {
        coin = coin.toUpperCase();
      }
      pricereply = await bn(coin).then(await function(res){
        hiveprice = res[0].price;
        return res[0].price;
      }).catch(e => {log(`SOCKET: ERROR: pricecheck: ${e} - `);return false;});
    break;
    case "wc":
      if(coin == undefined) {
        coin = "HIVE";
      } else {
        coin = coin.toLowerCase();
      }
      pricereply = await wc(coin).then(await function(res){}).catch(e => {log(`SOCKET: ERROR: pricecheck: ${e} - `);return false;});
    break;
    case "cm":
      if(coin == undefined) {
        coin = "HIVE";
      } else {
        coin = coin.toUpperCase();
      }
      pricereply = await cm(coin).then(await function(res){}).catch(e => {log(`SOCKET: ERROR: pricecheck: ${e} - `);return false;});
    break;
  }
  if(typeof pricereply == undefined){
    log(`priceSourceIndex: ${priceSourceIndex}`)
    log(`WTF NO PRICEREPLY`);
    if(priceSourceIndex < 4) {
      priceSourceIndex++;
      priceSourceActive = priceSourceNameArray[priceSourceIndex];
    } else if (priceSourceIndex > 3) {
      priceSourceIndex = 0;
      priceSourceActive = priceSourceNameArray[priceSourceIndex];
    }
    log(`switched to ${priceSourceNameArray[priceSourceIndex]}`);
  } else if(typeof pricereply !== undefined && pricereply == []){
    log(`priceSourceIndex: ${priceSourceIndex}`)
    log(`WTF NO PRICEREPLY`);
    if(priceSourceIndex < 4) {
      priceSourceIndex++;
      priceSourceActive = priceSourceNameArray[priceSourceIndex];
    } else if (priceSourceIndex > 3) {
      priceSourceIndex = 0;
      priceSourceActive = priceSourceNameArray[priceSourceIndex];
    }
    log(`switched to ${priceSourceNameArray[priceSourceIndex]}`);
  } else {
    var spread = spreadpercent / 100;
    longHIVEprice = parseFloat((hiveprice + (hiveprice * spread)).toFixed(6));
    shortHIVEprice = parseFloat((hiveprice - (hiveprice * spread)).toFixed(6));
    if(pricecheckinit == false) {
      log(`SOCKET: Initializing PriceCheck!`);
      pricechecklast = hiveprice;
      pricecheckinit = true;
    }
    if(pricechecklast == hiveprice) {
      return;
    } else {
      pricechecklast = hiveprice;
    }

    PriceData.create({hivebtcprice: hivebtcprice, hiveusdprice: hiveprice, hbdbtcprice: hbdbtcprice, hbdusdprice: hbdprice, btcusdprice: btcprice, block: newCurrentBlock, synced: synced, validdate: timeDate});

    if(debug === true){
      log(`hiveprice:`);
      log(hiveprice);
      log(`longHIVEprice:`);
      log(longHIVEprice);
      log(`shortHIVEprice:`);
      log(shortHIVEprice);
    }

    socketListKeys = Object.keys(socketList);
    log(socketListKeys);
      if(socketListKeys){
        socketListKeys.forEach((item, i) => {
            //log(`sent priceupdate to ${item}`)
            socketList[item].emit('priceupdate', {hiveusdprice: hiveprice, hiveshortprice: shortHIVEprice, hivelongprice: longHIVEprice, hivebtcprice: hivebtcprice, date: timeDate}); /// chart: chartShit // to(socketListKeys[i])
        });
      }
  }
*/


    //log(`PRICE: 1 HIVE / $${hiveprice} USD / ${hivebtcprice} BTC`)
    //     return response;
    //   + "}).catch(e => {log(`SOCKET: ERROR: pricecheck: ${e} - `);return false;});";
  });
};//END pricecheck

var CGpricecheck = async(coin) => {
  if(!coin) return false;
  var coinGeckoPriceCheck = await Price.cgpricecheck(coin).then((res) => {log(res);return res;}).catch((e) => {log(e)});
  if(debug === true){
    log(`var CGpricecheck = async(${coin})`)
    log(`coinGeckoPriceCheck:`);
    log(coinGeckoPriceCheck);
  }
  return coinGeckoPriceCheck;
};//END WCpricecheck

async function cg(coin){
  wcData = await CGpricecheck(coin);
  if(debug === true){
    log(`async function cg(${coin})`);
    log(`cgData`);
    log(cgData);
  }
  return wcData;
};
cg('hive');

var BNCpricecheck = async(coin) => {
if(!coin) return false;
var bncPriceCheck = await Price.bncpricecheck(coin).then((res) => {log(res);return res;}).catch((e) => {log(e)});
if(debug === true){
log(`BNCpricecheck:`);
log(bncPriceCheck);
}
return bncPriceCheck;
};//END CMCpricecheck

async function bn(coin){
  bncData = await BNCpricecheck(coin);
  if(debug === true){
  log(`bncData`);
  log(bncData);
}
};//END bn
bn('HIVE');

var CMCpricecheck = async(coin) => {
if(!coin) return false;
var coinMarketCapPriceCheck = await Price.cmcpricecheck(coin).then((res) => {log(res);return res;}).catch((e) => {log(e)});
if(debug === true){
log(`coinMarketCapPriceCheck:`);
log(coinMarketCapPriceCheck);
}
return coinMarketCapPriceCheck;
};//END CMCpricecheck

async function cm(coin){
  cmcData = await CMCpricecheck(coin);
  if(debug === true){
    log(`cmcData`);
    log(cmcData);
  }
};//END cm
cm('hive');

var WCpricecheck = async(coin) => {
  if(!coin) return false;
  var worldCoinIndexPriceCheck = await Price.wcpricecheck(coin).then((res) => {log(res);return res;}).catch((e) => {log(e)});
  if(debug === true){
    log(`var WCpricecheck = async(${coin})`)
    log(`worldCoinIndexPriceCheck:`);
    log(worldCoinIndexPriceCheck);
  }
  return worldCoinIndexPriceCheck;
};//END WCpricecheck

async function wc(coin){
  wcData = await WCpricecheck(coin);
  if(debug === true){
    log(`async function wc(${coin})`);
    log(`wcData`);
    log(wcData);
  }
  return wcData;
};//END wc
wc('hive');

//https://api.coingecko.com/api/v3/coins/hive?tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false
//==================================================
//--------------------------------------------------
//     HIVE Futures
//--------------------------------------------------
function futuresHIVEUSDAvg() {
  var response;
  var fhap = Price.HIVEUSDMarketsAverage();

  if(fhap == undefined) return log(`futuresHIVEUSDAvg "fhap" Undefined!`);
  //log(`fhap:`)
  //log(fhap)
  var sn = fhap.sourcecount;
  fhap = fhap.price;
  //log(`futuresHIVEUSDAvg HIVE/USD Price:`);
  //log(fhap);
  var spread = spreadpercent / 100;
  if(pricechecklast == fhap) {
    pricechecklast = fhap;
    if(verbose === false) log(`SOCKET: futuresHIVEUSDAvg() SAME PRICE - Cancel Update`)
    return;
  } else {
    pricechecklast = fhap;
    hiveprice = fhap;
    longHIVEprice = parseFloat((fhap + (fhap * spread)).toFixed(8));
    shortHIVEprice = parseFloat((fhap - (fhap * spread)).toFixed(8));
    futuresThread.send(JSON.stringify({type:'price', price:hiveprice, date: dateNow}));
    if(socketListKeys != undefined){
      socketListKeys.forEach((item, i) => {
          //log(`sent priceupdate to ${item}`)
          socketList[item].emit('priceupdate', {hiveusdprice: hiveprice, hiveshortprice: shortHIVEprice, hivelongprice: longHIVEprice, hivebtcprice: hivebtcprice, sources: sn, date: dateNow}); /// chart: chartShit // to(socketListKeys[i])
      });
    }
  }
};//END futuresHIVEUSDAvg
futuresHIVEUSDAvg();

var futuresCheckTimer = setInterval(function(){
  futuresHIVEUSDAvg();
}, 1000);//END futuresCheckTimer

function openFutureContract(data){
  if(!data) return false;
  var u = data.username;
  var a = data.amount;
  var m = data.margin;
  var t = data.type;
  if(!u || !a || !m || !t) return false;
  futuresThread.send(JSON.stringify({type:'open', data:{username:u, amount: a, margin: m, type: t}, date: timeDate}));
};//EMD openFutureContract

function closeFutureContract(data){
  if(!data) return false;
  var u = data.username;
  var i = data.id;
  if(!u || !i) return false;
  futuresThread.send(JSON.stringify({type:'close', data:{username:u, id: i}, date: timeDate}));
};//EMD openFutureContract

/*
  try {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd%2Cbtc')
    .then(res => res.json()).then(json => {
      priceNonce++;
      response = json["hive"];
      hiveprice = parseFloat(response["usd"]);
      hivebtcprice = parseFloat(response["btc"]);

      if((priceNonce % 4) == true){
        if(newCurrentBlock == 0) return;
        //log(`Saving HIVE Price at Block #${newCurrentBlock}`);
        PriceData.create({hiveusdprice: hiveprice, hivebtcprice: hivebtcprice, block: newCurrentBlock});
      }
    }).catch(priceError => {
      log(`pricefetch error: ${priceError}`)
    });

      var data = response["usd"];

      var labels = returnTime();//.push( Date.now());  //s.push(data);
      hivePriceData.push(data);
      labelstack.push(labels);
      var labelssend = [{labels:[labels]}];
      var datasets = [{data:[data]}];
      //log(hivePriceData);
      var hivePriceDataKeys = Object.keys(hivePriceData);
      //renderChart(hivePriceData, hivePriceDataKeys, "myChart");

      socketListKeys = Object.keys(socketList);
        if(socketListKeys != undefined){
          socketListKeys.forEach((item, i) => {
              //log(`sent priceupdate to ${item}`)
              socketList[item].emit('priceupdate', {hiveusdprice: hiveprice, hivebtcprice: hivebtcprice, datasets, labelssend}); ///to(socketListKeys[i])
          });
        }


      if((hivePriceDataKeys.length > 20) == true){
         hivePriceDataKeys.shift();
         hivePriceData.shift();
      }
      process.stdout.clearLine();
      //log(`PRICE: 1 HIVE / $${hiveprice} USD / ${hivebtcprice} BTC`)
    }catch(error) {
      log("Error: " + error);
    };


};
*/

pricecheck();

var priceCheckTimer = setInterval(function(){
  pricecheck();
}, 30000);

async function founders(){
  founderslist = [];
  var votelist = await hive.api.callAsync('condenser_api.list_proposal_votes', [['154'], 1000, 'by_proposal_voter', 'descending']) .then(res => {return res});
  votelist.forEach((item, i) => {
    founderslist.push(item.voter);
  });
  return founderslist;
};//END founders
founders();

setTimeout(function(){
  founders();
}, 60000);

function jsonBreadCrumb(name, action, payload, socketid) {
  log(`function jsonBreadCrumb(name: ${name}, action: ${action}, payload: ${payload}, socketid: ${socketid}) `)
  if(!name) return log(`SOCKET: ERROR: jsonBreadCrumb Missing name!`);
  if(!action) return log(`SOCKET: ERROR: jsonBreadCrumb Missing action!`);
  //if(name == '')
  if(!payload) return log(`SOCKET: ERROR: jsonBreadCrumb Missing payload!`);
  if(debug === true){
    if(socketid == undefined) {
      log(`SOCKET: jsonBreadCrumb(${name}, ${action}, ${payload}, ${socketid})`);
    } else {
      log(`SOCKET: jsonBreadCrumb(${name}, ${action}, ${payload})`);
    }
  }
  var payloadBytes;
  var hsPayload;
  try{
    payloadBytes = 0;
    payload = [payload];
    payloadBytes = getStringByteSize.getStringByteSize(payload);
    if(debug === true) log("payload size: " + payloadBytes + " bytes");
  } catch(e) {
    return log(`SOCKET: ERROR: jsonBreadCrumb: ${e}`);
  }
  if(payloadBytes < 8192) {
    log(`payloadBytes < 8192`);
    if(!socketid){
      if(debug === true) {
        log(`jsonBreadCrumb(${name}, ${action}, ${payload})`);
        log(payload);
      }
      hsPayload = JSON.stringify({type: 'jsonbreadcrumb', name: name, action: action, payload: payload});
    } else {
      if(debug === true) {
        log(`jsonBreadCrumb(${name}, ${action}, ${payload}, ${socketid})`);
        log(payload);
      }
      hsPayload = JSON.stringify({type: 'jsonbreadcrumb', name: name, action: action, payload: payload, socketid: simpleStringify(socketList[socket.id])});
    }
  } else {
    return log(`SOCKET: ERROR: payloadBytes > 8192 bytes!`);
  }
  if(hsPayload && scribeThread){
    scribeThread.send(hsPayload);
  }
};//END jsonBreadCrumb

/* //sendbackersupdate
async function sendbackersupdate() {
await DepositData.findAll({
limit: 100,
where: {amount: {[Op.gte]: 100000}},
order: [[ 'amount', 'DESC' ]],
raw: true
}).then(async function(entries){
var loadedDeposits = [];
let cleanedDeposits = entries.map(function(key) {
if (key.id !== -1) {
delete key.id;
}
if (key.userId !== -1) {
delete key.userId;
}
//if (key.username !== -1) {
//    delete key.username;
//}
if (key.borrower !== -1) {
delete key.borrower;
}
if (key.collected !== -1) {
delete key.collected;
}
if (key.currentpayments !== -1) {
delete key.currentpayments;
}
if (key.totalpayments !== -1) {
delete key.totalpayments;
}
if (key.completed !== -1) {
delete key.completed;
}
if (key.confirms !== -1) {
delete key.confirms;
}
if (key.txid !== -1) {
delete key.txid;
}
if (key.confirmed !== -1) {
delete key.confirmed;
}
if (key.coin !== -1) {
delete key.coin;
}
if (key.nextcollect !== -1) {
delete key.nextcollect;
}
if (key.updatedAt !== -1) {
delete key.updatedAt;
}
if (key.createdAt !== -1) {
delete key.createdAt;
}
return key;
});
cleanedDeposits.forEach((item, i) => {
loadedDeposits.push(item);
});
//loadedBets.push(entries);
var updatekeys = Object.keys(userSockets);
for (var i = 0; i< updatekeys.length;i++){
  if (userSockets[updatekeys[i]]) {
    userSockets[updatekeys[i]].emit('backersupdate', {deposits: loadedDeposits});
  }
}
})
}

sendbackersupdate();

//var backerTimer = setInterval(function(){
//sendbackersupdate();
//}, 30000);
*/

//==================================================
//--------------------------------------------------
//     User Stats
//--------------------------------------------------
var getManaBarRC = async(user) => {
  if(!user) return "No User Specified";
  if(debug === true) log(`SOCKET: getUserWDRoutes(${user})`);
  var userRC = await manaBar.fetchRC(user);
  if(debug === true) log(`SOCKET: RC - ${user} Resource Credit Available: ${userRC}%`);
  return userRC;
};//END getManaBarRC

var getUserWDRoutes = async(user) => {
  if(!user) return "No User Specified";
  if(debug === true) log(`SOCKET: getUserWDRoutes(${user})`);
  var userWD = await getPowerDownPath.getRoutes(user);
  if(debug === true) log(`SOCKET: userWD: ${userWD}`);
  return userWD;
};//END getUserWDRoutes

var getVotePowerPercent = async(user) => {
  if(!user) return "No User Specified";
  if(debug === true) log(`SOCKET: getVotePowerPercent(${user})`);
  var userVP = await getVP.fetch(user);
  if(debug === true) log(`SOCKET: userVP: ${userVP}`);
  return userVP;
};//END getVotePowerPercent

var getHivePower = async(user) => {
  if(!user) return "No User Specified";
  var userHP = await HP.getHivePower(user).then((res) => {return JSON.parse(JSON.stringify(res))}).catch((e) => log(e));
    log(`getHivePower Called!`)
    var resultData = await hive.api.callAsync('condenser_api.get_accounts', [[`${user}`]]).then((res) => {return JSON.parse(JSON.stringify(res))}).catch((e) => log(e));
    var chainProps = await hive.api.callAsync('condenser_api.get_dynamic_global_properties', []).then((res) => {return JSON.parse(JSON.stringify(res))}).catch((e) => log(e));
    var hivePower = await splitOffVests(resultData[0].vesting_shares);
    var total_vesting_shares = await splitOffVests(chainProps.total_vesting_shares);
    var total_vesting_fund = await splitOffVests(chainProps.total_vesting_fund_hive);
    var hiveVested = parseFloat(((total_vesting_fund *  hivePower ) / total_vesting_shares).toFixed(3));
    var hiveDelegated = await getHiveDelegations(user).then((res) => {return JSON.parse(JSON.stringify(res))}).catch((e) => log(e));
    var hiveHPDelegated = parseFloat(((total_vesting_fund *  hivePower ) / total_vesting_shares).toFixed(3));
    var vp = await getVotePowerPercent(`${user}`);
    var wd = await getUserWDRoutes(`${user}`);
    log(`vp: ${vp}`);
    log(`wd: ${wd}`);
    //usersHivePower[user] = (hiveVested - hiveHPDelegated);
    //hiveVested =- hiveHPDelegated;
    log(`userHP`);
    log(userHP);
    loanMax = parseFloat(hiveVested * 0.7);
    log(`${user} - ${hiveVested} HP > ${loanMax} HIVE Credit`);
    log(`${user} - ${hiveHPDelegated} HP Delegated - ${vp}% Vote Power`)
    return hiveVested;
};//END getHivePower

var getHiveDelegations = async(user) => {
  var vestsDelegated = 0;
  var hiveDelegated = 0;
  if(!user) return "No User Specified";
  if(debug === true) log(`getHiveDelegations(${user}) Called!`);
  log(`getHiveDelegations(${user}) Called!`);
  var delegationData = await hive.api.callAsync('condenser_api.get_vesting_delegations', [user, '', 1000]).then((res) => {return JSON.parse(JSON.stringify(res))}).catch((e) => log(e));
  var chainProps = await hive.api.callAsync('condenser_api.get_dynamic_global_properties', []).then((res) => {return JSON.parse(JSON.stringify(res))}).catch((e) => log(e));
  delegationData.forEach(async(item, i) => {
    log(item);
    var rawVests = await splitOffVests(item.vesting_shares);
    vestsDelegated += parseFloat(rawVests);
  });
  var total_vesting_shares = await splitOffVests(chainProps.total_vesting_shares);
  var total_vesting_fund = await splitOffVests(chainProps.total_vesting_fund_hive);
  var hiveDelegated = parseFloat(((total_vesting_fund *  vestsDelegated ) / total_vesting_shares).toFixed(3));
  delegationData.push({hivedelegated: hiveDelegated, vestsdelegated: vestsDelegated});
  if(debug === true) log(`User ${user} has ${hiveDelegated} Hive Delegated!`);
  return delegationData;
  //hive.api.getVestingDelegations(`${user}`, '', 1000, await function(err, result) {
  //  console.log(err, result);
  //});
};//END getHivePower =

//==================================================
//--------------------------------------------------
//      Sequelize Database Initialize
//--------------------------------------------------
var connectiontest = async() => {
  try {
    await sequelize.authenticate();
    log('SUCCESS: Connection to DB been Established!');
  } catch (error) {
    log('ERROR: Unable to Connect to the Database:', error);
  }
};
connectiontest();

//==================================================
//--------------------------------------------------
//      Audit
//--------------------------------------------------
function siteAudit() {
  if(config.verbose === true) log(`SOCKET: Start Site Audit!`);
  var utpayload = JSON.stringify({type:'getacct', username:'siteaudit'});
  rpcThread.send(utpayload);
  var ltpayload = JSON.stringify({type:'siteaudit'});
  loanThread.send(ltpayload);
  var wdpayload = JSON.stringify({type:'wdfeeaudit'});
  userThread.send(wdpayload);
};

function siteAuditDaemon() {
  log(`SOCKET: Site Audit in Progress!`);
  var utpayload = JSON.stringify({type:'grabacct', username:'siteaudit'});
  rpcThread.send(utpayload);
  var ltpayload = JSON.stringify({type:'siteaudit'});
  loanThread.send(ltpayload);
  var wdpayload = JSON.stringify({type:'wdfeeaudit'});
  userThread.send(wdpayload);
  setTimeout(function(){
    siteAuditDaemon()
  }, 60000);
};

siteAuditDaemon();

//==================================================
//--------------------------------------------------
//     Socket.io Functions
//--------------------------------------------------

exports = module.exports = function(socket, io){

  socket.on('connectinit', function(cb){
    return cb(version);
  });

  socket.on('latency', function(startTime, cb) {
    if(socket.request.session['user']) {
      var newUser = socket.request.session['user'];
      var latency = parseFloat(((Date.now() - startTime) / 2).toFixed(2));
      if(!pingArray.includes(socket.request.session['user'])) {
        pingArray.push(newUser);
        pingArray[newUser] = latency
      } else {
        pingArray[newUser] = latency
      }
      if(debug === true) log(pingArray);
    }
    return cb(startTime, null);
  });

    var userbetapass;
    var checkbetapass;
  socket.on('betapass', function(req, cb){
    socket.request.session['betapass'] = false;
    if(debug === false) log(`socket.on('betapass'): ${req}`);
    console.log(req);
    userbetapass = parseInt(req.pass);
    checkbetapass = parseInt(truebetapass);
    log(`${userbetapass} == ${checkbetapass} ??`)
    if(userbetapass == truebetapass){
      socket.request.session['betapass'] = true;
      return cb(null, {data: loginContent, passed: socket.request.session['betapass']});
    } else {
      socket.request.session['betapass'] = false;
      return cb('ERROR: Incorrect Passcode!');
    }

  });

  if (!socketList.includes(socket)) {
        socketList[socket.id] = socket;
        socketListKeys = Object.keys(socketList);
        log(`SOCKET: Total Connected: ${socketListKeys.length}`);
        socket.emit('latestblock', {block: newCurrentBlock, synced:synced});
        socket.emit('priceupdate', {hiveusdprice: hiveprice, hiveshortprice: shortHIVEprice, hivelongprice: longHIVEprice, hivebtcprice: hivebtcprice, date: dateNow});
      } else if (socketList.includes(socket)) {
        socketListKeys = Object.keys(socketList);
        log(`SOCKET: Known Socket Detected! Total Connected ${socketList.length}`);
        socket.emit('latestblock', {block: newCurrentBlock, synced:synced});
        socket.emit('priceupdate', {hiveusdprice: hiveprice, hiveshortprice: shortHIVEprice, hivelongprice: longHIVEprice, hivebtcprice: hivebtcprice, date: dateNow});
      } else {
        log(`Not on or Off list wtf`);
      }

      var pricepayload = JSON.stringify({type:'hivespotprice', socketid: simpleStringify(socketList[socket.id])});
      tickerThread.send(pricepayload);

/*
var chatpunt = async() => {
  log(`chatpunt fired`)
  var chatHist = await ChatData.findAll({
    limit: 50,
    order: [[ 'createdAt', 'DESC' ]],
    raw: true
  });
  return socket.emit('chatHistory', {chathist: chatHist, newmsg: "0"});
}
*/

socket.on("disconnect", function() {
  console.log('User Disconnect:', socket.request.session['user']);
  onlineCounter.dec();
  delete userSockets[socket.request.session['user']];
  delete canUserTransact[socket.request.session['user']];
  delete userTokens[socket.request.session['user']];
  delete usersHivePower[socket.request.session['user']];
  delete socketList[socket.id];
  socketListKeys = Object.keys(socketList);
});

socket.on('withdrawopen', async function(req, cb) {
  var user = socket.request.session['user'];
  let userData;
  var rank;
  var has2fa;
  var fee;
  var type = req.coin.toLowerCase();
  let userCheck = await UserData.findOne({where:{username:`${user}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
  if (userCheck === null) {
    return cb('Error: Failed to fetch users statistics!', null);
  } else {
    userData = JSON.parse(JSON.stringify(userCheck));//.map(function(userNameCheck){ return userNameCheck.toJSON()});
    rank = userData.rank;
    if(userData.twofactor != null) {
      has2fa = true;
    } else {
      has2fa = false;
    }
  }

  if (rank == 'user'){
    withdrawUSDcost = 0.25;
  } else if (rank == 'owner'){
    withdrawUSDcost = 0;
  } else if (rank == 'backer'){
    withdrawUSDcost = 0.25;
  } else if (rank == 'benefactor'){
    withdrawUSDcost = 0;
  } else if (rank == 'founder'){
    withdrawUSDcost = 0.125;
  } else {
    withdrawUSDcost = 0.25;
  }

  await pricecheck();

  if (hiveprice == undefined || hiveprice == 0){
    await pricecheck();
    fee = parseFloat((withdrawUSDcost / hiveprice).toFixed(3));
  } else {
    fee = parseFloat((withdrawUSDcost / hiveprice).toFixed(3));
  }

  var feestring = fee.toString();
  var secbytes = crypto.createHash('sha256').update(feestring).digest('hex');
  var withdrawbalance;
  if (type == 'hive'){
    withdrawbalance = (userData.hivebalance / 1000);
  } else if (type == 'hbd') {
    withdrawbalance = (userData.hbdbalance / 1000);
  } else {
    return cb('No Currency Type Specified!', null);
  }
  log(`WITHDRAW: ${socket.request.session['user']} Opened Withdraw Modal`);
  return cb(null, {user: user, balance: withdrawbalance, fee: fee, security: secbytes, rank: rank, coin: type, twofactor: has2fa});
});

socket.on('withdraw', async function(req, cb) {
  log(`socket.on('withdraw' ${JSON.stringify(req)}`)
  if(typeof req.fee == undefined || req.fee == null){
    req.fee = null;
  }
  log(req)
  var user = socket.request.session['user'];
  changeToken(user);
  log()
  var userData;
  var wData;
  var feecheck = req.fee;
  var cointype = req.type.toUpperCase();
  var feecheckstring = feecheck.toString();
  var secbytes;
  var sendtype = req.type.toLowerCase();
  var stealth;
  var senttx;
  var wduserID;
  if(user != owner){
    if (req.amount < req.fee) {
      return cb(`Must Withdraw ${req.type} Amount > Fee`, {token: userTokens[socket.request.session['user']]});
    }
  }
  if ( user != owner || req.amount < 1) {
    return cb(`Must Withdraw Atleast 1 ${req.type}`, {token: userTokens[socket.request.session['user']]});
  }
  if (canUserTransact[user] == true) canUserTransact[user] = false;
  let userCheck = await UserData.findOne({where:{username:`${user}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
  if (userCheck === null) {
    canUserTransact[user] == true
    return cb('Failed to fetch users statistics!', {token: userTokens[socket.request.session['user']]});
  } else {
    userData = JSON.parse(JSON.stringify(userCheck));//.map(function(userNameCheck){ return userNameCheck.toJSON()});
  }
  wduserID = userData.id;
  //var userDepositTotal = await DepositsData.findAll({where: {userId: userData.id},{attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'totalDepositAmount']], raw:true}});
  //userDepositTotal = userDepositTotal['totalDepositAmount'];
  //log('userDepositTotal:');
  //log(userDepositTotal);
  try{
    feecheckstring = feecheck.toString();
    secbytes = crypto.createHash('sha256').update(feecheckstring).digest('hex');
    log(`secbytes`);
    log(secbytes);
    log(`req.security`);
    log(req.security);
  } catch(e) {
    console.error(e);
    return cb('Fee Amount Security Check Failed!', {token: userTokens[socket.request.session['user']]});
  }

  if(secbytes != req.security){
    return cb('Fee Amount Security Check Failed!', {token: userTokens[socket.request.session['user']]});
  }

  log("WITHDRAW: Transfer to: " + req.account + " - Amount: " + req.amount);
  if (req.amount < feecheck) {
    canUserTransact[user] = true;
    return cb('Tried to Withdraw Less Than Fee!', {token: userTokens[socket.request.session['user']]});
  }
  if (socket.request.session['user'] == undefined) {
    canUserTransact[user] = true;
    return cb('Withdraw User Not Found!', {token: userTokens[socket.request.session['user']]});
  }
  var saneSendAmount = req.amount;
  var sanefeecheck = feecheck;
  var oldWithdrawCount = userData.withdrawals;
  var oldWithdrawTotal = userData.withdrawals;
  var oldWithdrawFeeTotal = userData.withdrawalsfee;
  feecheck = parseInt(feecheck * 1000);
  req.amount = parseInt(req.amount * 1000);

  if(cointype == 'HIVE') {
    if (userData.hivebalance < req.amount) {
      canUserTransact[user] = true;
      return cb(`Not Enough ${cointype} in Balance!`, {token: userTokens[socket.request.session['user']]});
    } //END Balance < Check

    if (userData.hivebalance >= req.amount) {
      userData.hivebalance -= req.amount;
      userData.withdrawals++;
      userData.withdrawalsfee += feecheck;
      userData.withdrawalstotal += req.amount;
      req.amount = parseInt(req.amount - feecheck);
      saneSendAmount = parseFloat((saneSendAmount - sanefeecheck).toFixed(8));
    } //END if balance > amount

    sequelize.transaction().then(async function(t) {
      await UserData.update({hivebalance: userData.hivebalance, withdrawals: userData.withdrawals, withdrawalsfee: userData.withdrawalsfee, withdrawalstotal: userData.withdrawalstotal},{where:{id:`${wduserID}`}})
      .then( async function() {
        async function sendTransfer() {
          hive.broadcast.transfer(config.bankwif, config.appName, req.account, parseFloat(req.amount / 1000).toFixed(3) + " " + cointype, req.memo, async function (fuckeduptransfer, senttransfer) {
            if (fuckeduptransfer) {
              console.log("Refund Fucked Up: " + fuckeduptransfer);
              t.rollback();
              return cb('Withdraw Send RPC Command Failed... Please Try Again!', {token: userTokens[socket.request.session['user']]});
            }
            if (senttransfer) {
              log(senttransfer);
              log(`Withdraw Transfer to ${user} of ${parseFloat(req.amount / 1000).toFixed(3)} ${cointype} Sent!`);

              await WithdrawData.create({userId: userData.id, coin: cointype, username: user, sentto: req.account, amount: (req.amount + feecheck), txid: senttransfer.id, fee: feecheck, confirmed: true});
              canUserTransact[user] = true;
              t.commit();
              jsonBreadCrumb('wallet', 'withdraw', {userId: userData.id, coin: cointype, username: user, txid: senttransfer.id, fee: feecheck});
              return cb(null, {balance: userData.hivebalance, token: userTokens[socket.request.session['user']]});
            }
          }); //end refund transfer
        }
        await sendTransfer();
      }).catch(function(error) {
        t.rollback();
        console.log(error);
        canUserTransact[user] = true;
        return cb('Withdraw Transaction Failed... Please Try Again!', {token: userTokens[socket.request.session['user']]});
      });
    });
  } else if (cointype == 'HBD') {
    if (userData.hbdbalance < req.amount) {
      canUserTransact[user] = true;
      return cb(`Not Enough ${cointype} in Balance!`, {token: userTokens[socket.request.session['user']]});
    } //END Balance < Check

    if (userData.hbdbalance >= req.amount) {
      userData.hbdbalance -= req.amount;
      req.amount = parseInt(req.amount - feecheck);
      saneSendAmount = parseFloat((saneSendAmount - sanefeecheck).toFixed(8));
      userData.withdrawals++;
    } //END if balance > amount

    sequelize.transaction().then(async function(t) {
      await UserData.update({hbdbalance: userData.hbdbalance, withdrawals: userData.withdrawals},{where:{id:`${wduserID}`}})
      .then( async function() {
        async function sendTransfer() {
          hive.broadcast.transfer(config.bankwif, config.appName, req.account, parseFloat(req.amount / 1000) + " " + cointype, req.memo, async function (fuckeduptransfer, senttransfer) {
            if (fuckeduptransfer) {
              console.log("Refund Fucked Up: " + fuckeduptransfer);
              t.rollback();
              return cb('Withdraw Send RPC Command Failed... Please Try Again!', {token: userTokens[socket.request.session['user']]});
            }
            if (senttransfer) {
              log(senttransfer);
              log(`Withdraw Transfer to ${user} of ${req.amount} ${cointype} Sent!`);
              await WithdrawData.create({userId: userData.id, coin: cointype, username: user, sentto: req.account, amount: req.amount, txid: senttransfer.id, confirmed: true});                    canUserTransact[user] = true;
              t.commit();
              return cb(null, {balance: userData.hbdbalance, token: userTokens[socket.request.session['user']]});
            }
          }); //end refund transfer
        }
        await sendTransfer();
      }).catch(function(error) {
        t.rollback();
        console.log(error);
        canUserTransact[user] = true;
        return cb('Withdraw Transaction Failed... Please Try Again!', {token: userTokens[socket.request.session['user']]});
      });
    });
  }

}); //END socket.on('withdraw')

socket.on("loginopen", function(req, cb) {
  var token = crypto.randomBytes(64).toString('base64');
  var user;
  var session = socket.request.session;
  if (req.username) user = req.username;
  if(typeof user !== undefined){
    log(`loginopen: ${JSON.stringify(user)}`);
    return cb(null,  );
  } else {
    log(`loginopen user undefined`);
    return cb('Username was not present', null);
  }

});


socket.on("login", async function(req, cb) {
  log(req);
  if (typeof canUserTransact[req.username] !== undefined && canUserTransact[req.username] == true) canUserTransact[req.username] = false;
  if (typeof cb !== 'function') return socket.emit('muppet', 'You fucking muppet, you need a callback for this call');
  if (typeof req.username !== 'string') return cb('Username must be a string', null);
  if (typeof req.password !== 'string') return cb('Password must be a string', null);
  if (typeof req['2fa'] !== 'undefined') {
    if (typeof req['2fa'] !== 'string') return cb('2fa must be a string', null);
    if (req['2fa'].length > 32) return cb('What shit you trying to pull?', null);
  }
  var login = {username: req.username};

  let loginData;
  let userNameCheck = await UserData.findOne({where:{username:login.username}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
  if (userNameCheck === null) {
    return cb('Login Failure - Please Check Your Username & Password!', null);
  } else {
    loginData = JSON.parse(JSON.stringify(userNameCheck));
    if (isPasswordCorrect(loginData.password.passwordHash, loginData.password.salt, login.password)){
      if (typeof data['2fa'] !== 'undefined'){
        if (typeof req['2fa'] === 'undefined') return cb('specify 2fa passcode', null);
        if (!is2FACorrect(req['2fa'], data['2fa'])) return cb('2fa incorrect', null);
      }

      var token = crypto.randomBytes(64).toString('base64');
      var chattoken = crypto.randomBytes(64).toString('base64');
      socket.request.session['moderator'] = loginData.moderator;
      socket.request.session['user'] = login.username;
      socket.request.session['token'] = token;
      socket.request.session['chattoken'] = chattoken;
      userTokens[login.username] = token;
      userSockets[login.username] = socket;
      userRawSockets[socket.id] = socket;
      var userident = login.username;
      if(userident === owner){
        log("Admin Login Detected: " + userident);
        socket.emit("adminlogin", userident);
      }

      var chatHist = await ChatData.findAll({
        limit: 50,
        order: [[ 'createdAt', 'DESC' ]],
        raw: true
      });

      socket.emit('chatHistory', {chathist: chatHist, newmsg: "0"});

      return cb(null, {token: userTokens[socket.request.session['user']], invest: usersInvest[socket.request.session['user']], balance: details.balance, ssHash: details.ssHash, cs: details.cs, lastbet: lastbet, chatToken: chattoken});
    }else{
      return cb('Incorrect Password', null);
    }
  }
});


socket.on("openskclink", async function(data, cb) {
  if(debug == true) log(`socket.on("adminskipsync")`);
  var datasave;
  log(`openskclink 'data' var:`);
  log(data);
  if(!data.username) return cb('Login Username Undefined', null);
  if(!data.password) return cb('Login Password Undefined', null);
  if(!data.agree) return cb('Disclaimer Agreement Undefined', null);
  if(!data.oauthtype) return cb('Login Oauth Type Undefined', null);
  if(!data.date) return cb('Login Date Undefined', null);
  if(!data.sec) return cb('Login Security ID Undefined', null);

  log(`data.oauthtype`);
  log(`${data.oauthtype}`);

  var user = data.username.toLowerCase();
  if (typeof canUserTransact[user] !== undefined && canUserTransact[user] == true) canUserTransact[user] = false;
  var usersocketcheck = socket.request.session['user'];
  var agree = data.agree;

  log(`usersocketcheck`);
  log(usersocketcheck);
  log(`user`);
  log(user);

  if(usersocketcheck != undefined) {
      if(user != usersocketcheck) return cb('Invalid User Login Request', null);
  }

  if (user == "hive.loans"){
    log(`Idiot tried to log in`);
    return cb(`You don't have proper e-peen for this account.`, null);
  }

  var encryptMsg = data.password;
  var login = {
    username: data.username,
    password: data.password
  }
  var clientIp = socket.handshake.headers['x-forwarded-for'];
  var req = data;

  hive.api.getAccounts([user], async function(err, result) {
    if (err) {
      canUserTransact[user] = true;
      console.error(err);
      return cb('Hive Keychain Login Failed!', null);
    }
    if (result) {
      result = result[0];
      result = result['posting'];
      result = result['key_auths'];
      result = result[0][0];
      pubPostingKey = result;

      recoveredPubKey = Signature.fromString(encryptMsg).recover(cryptoUtils.sha256(`#Signed Hive.Loans @${user} Identity Verification - disclaimerAgree: ${data.agree} - Date: ${data.date} - SecKey: ${data.sec}`));

      if (pubPostingKey == recoveredPubKey.toString()) {
        log(`LOGIN: User Logged In`)
        if (typeof data['2fa'] !== 'undefined') {
          if (typeof req['2fa'] === 'undefined') return cb('Specify 2FA Passcode', null);
          if (!is2FACorrect(req['2fa'], data['2fa'])) return cb('2FA Incorrect', null);
        }
        if(canUserTransact.includes(user) == false){
          canUserTransact.push(user);
          canUserTransact[user] = true;
        } else {
          changeToken(user);
          canUserTransact[user] = true;
        }
        try {
          var geoLocate = geoip.lookup(clientIp);
          var geoCity = geoLocate.city;
          var geoState = geoLocate.region;
          var geoCountry = geoLocate.country;
          log(`LOGIN: @${login.username} - ${geoCity}, ${geoState}, ${geoCountry} - ${clientIp}`);
        } catch(e){
          log(`LOGIN: Error Geo-Locating IP Address: ${clientIp}`)
        }
        log(`LOGIN: Client Verified HIVE ID.. Checking if User Exists!`);
        let loginData;

        let userNameCheck = await UserData.findOne({where:{username:user}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
        if (userNameCheck === null) {
          var noobrank = 'user';
          var founderslist = await founders();
          if (user == 'coininstant') noobrank = 'benefactor';
          log(`user not found! Creating user!`);
          if (founderslist.includes(user)){
            noobrank = 'founder';
          }
          if (backerlist.includes(user)){
            noobrank = 'backer';
          }


          var newUserArray = {
            username: user,
            rank: noobrank,
            hivebalance: 0,
            hbdbalance: 0,
            hiveprofit: 0,
            activeloans: 0,
            activelends: 0,
            closedloans: 0,
            closedlends: 0,
            totalloans: 0,
            totallends: 0,
            flags: 0,
          };

          let loginData;
          let uid;
          sequelize.transaction().then(async function(t) {
            await UserData.create(newUserArray)
            .then(async function() {
              t.commit();
              log(`SOCKET: User ${user} Registered!`);
              let userNameCheck = await UserData.findOne({where:{username:user}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
              if (userNameCheck === null) {
                log(`Registration Failure - Unable to Locate Newly Registered Account: ${user}`);
              } else {
                loginData = JSON.parse(JSON.stringify(userNameCheck));
                uid = loginData.id;
                if(typeof loginData.userId !== 'number'){
                  log(`loginData.userId is undefined! Updating now!`);
                  await UserData.update({userId:uid},{where:{id:uid}});
                }
                if(typeof loginData.rank !== 'string'){
                  await UserData.update({rank:'user'},{where:{id:uid}});
                }
                var newAddyHash = crypto.randomBytes(16).toString('hex');
                if(loginData.address === '0'){
                  log(`loginData.address is undefined! Updating now!`)
                  await UserData.update({address:newAddyHash},{where:{id:uid}});
                }
                if(loginData.disclaimer == true){
                    UserData.update({disclaimer:data.agree},{where:{id:uid}});
                    jsonBreadCrumb('accounts', 'acceptdisclaimer', {username: user, agree: data.agree}, simpleStringify(socketid));
                } else if (loginData.disclaimer == false){
                    UserData.update({disclaimer:data.agree},{where:{id:uid}});
                    jsonBreadCrumb('accounts', 'acceptdisclaimer', {username: user, agree: data.agree}, simpleStringify(socketid));
                } else {
                  loginData.disclaimer = false;
                  UserData.update({disclaimer:false},{where:{id:uid}});
                  jsonBreadCrumb('accounts', 'acceptdisclaimer', {username: user, agree: false}, simpleStringify(socketid));
                }

                var token = crypto.randomBytes(64).toString('base64');
                var chattoken = crypto.randomBytes(64).toString('base64');

                socket.request.session['user'] = user;
                socket.request.session['token'] = token;
                socket.request.session['chattoken'] = chattoken;
                socket.request.session['uid'] = uid;
                socket.request.session['moderator'] = loginData.moderator;
                socket.request.session['rank'] = loginData.rank;
                socket.request.session['socketid'] = socket.request.session.id;
                userTokens[login.username] = token;
                userSockets[login.username] = socket;
                userRawSockets[socket.id] = socket;

                var getLoginHivePower = await getHivePower(user).then(result => {return result}).catch(error => log(error));
                var getLoginHiveDelegation = await getHiveDelegations(user).then(result => {return result}).catch(error => log(error));
                var getActualHiveDelegated = getLoginHiveDelegation[getthedelegation.length - 1]['hivedelegated'];
                var totalDelegation = function() {
                  getLoginHiveDelegation.forEach((item, i) => {
                    log(item);
                      log(item.vesting_shares);
                  });
                }

                log(`getLoginHivePower:`);
                log(getLoginHivePower);

                log(`getLoginHiveDelegation:`);
                log(getLoginHiveDelegation);

                log(`getActualHiveDelegated:`);
                log(getActualHiveDelegated);

                var chatHist = await ChatData.findAll({
                  limit: 100,
                  order: [[ 'createdAt', 'DESC' ]],
                  raw: true
                });

                onlineCounter.inc();

                socket.emit('chatHistory', {chathist: chatHist, newmsg: "0"});

                return cb(null, {
                  token: userTokens[socket.request.session['user']],
                  chatToken: socket.request.session['chattoken'],
                  userId: socket.request.session['uid'],
                  moderator: socket.request.session['moderator'],
                  username: socket.request.session['user'],
                  rank: socket.request.session['rank'],
                  socketid: socket.request.session['socketid'],
                  hivebalance: loginData.hivebalance,
                  hbdbalance: loginData.hbdbalance,
                  hiveprofit: loginData.hiveprofit,
                  address: newAddyHash,
                  activeloans: loginData.activeloans,
                  activelends: loginData.activelends,
                  closedloans: loginData.closedloans,
                  closedlends: loginData.closedlends,
                  totalloans: loginData.totalloans,
                  totallends: loginData.totallends,
                  flags: loginData.flags
                });
              }
              jsonBreadCrumb('accounts', 'newuser', {userId: loginData.id, username: loginData.username});
              return cb(null, "Account Registered! Please Login Now!");
            }).catch(function(error) {
              t.rollback();
              console.log(error);
              return cb('Error: Unable to Create Account', null);
            });
          });
        } else if(userNameCheck !== null){

          var newloginData;

          try {
            newloginData = JSON.parse(JSON.stringify(userNameCheck));
          }catch(e){
            log(e);
            newloginData = userNameCheck;
          }
          if(newloginData.disclaimer == true){
              //jsonBreadCrumb('accounts', 'acceptdisclaimer', {agree: data.agree}, simpleStringify(socketid));
          } else if (newloginData.disclaimer == false){
              jsonBreadCrumb('accounts', 'acceptdisclaimer', {id: newloginData.id, agree: agree, socketid: simpleStringify(socket.id)});
              await UserData.update({disclaimer:agree},{where:{id:newloginData.id}});
          }
          if(typeof newloginData.userId !== 'number'){
            await UserData.update({userId:newloginData.id},{where:{id:newloginData.id}});
          }
          if(typeof newloginData.rank !== 'string'){
            await UserData.update({rank:'user'},{where:{id:newloginData.id}});
          }
          if(newloginData.address === '0'){
            log(`loginData.address is undefined! Updating now!`);
            var newAddyHash = crypto.randomBytes(16).toString('hex');
            await UserData.update({address:newAddyHash},{where:{id:newloginData.id}});
          }
          var token = crypto.randomBytes(64).toString('base64');
          var chattoken = crypto.randomBytes(64).toString('base64');

          socket.request.session['user'] = user;
          socket.request.session['token'] = token;
          socket.request.session['chattoken'] = chattoken;
          socket.request.session['uid'] = newloginData.id;
          socket.request.session['moderator'] = newloginData.moderator;
          socket.request.session['rank'] = newloginData.rank;
          socket.request.session['socketid'] = socket.request.session.id;
          userTokens[login.username] = token;
          userSockets[login.username] = socket;

          var getLoginHivePower = await getHivePower(user).then(result => {return result}).catch(error => log(error));
          var getLoginHiveDelegation = await getHiveDelegations(user).then(result => {return result}).catch(error => log(error));
          var getActualHiveDelegated = getLoginHiveDelegation[getLoginHiveDelegation.length - 1]['hivedelegated'];
          var totalDelegation = function() {
            getLoginHiveDelegation.forEach((item, i) => {
              log(item);
                log(item.vesting_shares);
            });
          }

          log(`getLoginHivePower:`);
          log(getLoginHivePower);

          log(`getLoginHiveDelegation:`);
          log(getLoginHiveDelegation);

          log(`getActualHiveDelegated:`);
          log(getActualHiveDelegated);

          var chatHist = await ChatData.findAll({
            limit: 100,
            order: [[ 'createdAt', 'DESC' ]],
            raw: true
          });

          socket.emit('chatHistory', {chathist: chatHist, newmsg: "0"});
          //usersHivePower.push(user[getHivePower(user)]);

          return cb(null, {
            token: userTokens[socket.request.session['user']],
            chatToken: socket.request.session['chattoken'],
            userId: socket.request.session['uid'],
            moderator: socket.request.session['moderator'],
            username: socket.request.session['user'],
            rank: socket.request.session['rank'],
            socketid: socket.request.session['socketid'],
            hivebalance: newloginData.hivebalance,
            hbdbalance: newloginData.hbdbalance,
            hiveprofit: newloginData.hiveprofit,
            hivepower: getLoginHivePower,
            address: newloginData.address,
            activeloans: newloginData.activeloans,
            activelends: newloginData.activelends,
            closedloans: newloginData.closedloans,
            closedlends: newloginData.closedlends,
            totalloans: newloginData.totalloans,
            totallends: newloginData.totallends,
            flags: newloginData.flags
          });

        }
      } else {
        log(`openskclink WRONG PASSWORD`);
        return cb('Failed to Login!', null);
      }
    }
    //log(result);
  })
});

socket.on("adminskipsync", function(data, cb) {
  log(`socket.on("adminskipsync")`);
  var requser = socket.request.session['user'];
  //data = JSON.stringify(data);
  if (requser == owner && socket.request.session['moderator'] == 1) {
    log(`SOCKET: ADMIN: adminskipsync owner & moderator detected. Skipping Sync!`);
    socketid: simpleStringify(socketList[socket.id])
    var rpcpayload = JSON.stringify({type:'skipsync', username: requser, socketid: simpleStringify(socketList[socket.id])});
    rpcThread.send(rpcpayload);
    return cb(null, 'adminskipsync fired!');
  } else {
    log(`SOCKET: ADMIN - ERROR: ${requser} tried to adminskipsync!`);
    return cb("Insufficient Privileges!", {user: requser});
  }
}); //END adminskipsync

socket.on("chatmenu", function(data, cb) {

  var source = socket.request.session['user'];
  log(`socket.on("chatmenu" from ${source}`);
  //data = JSON.stringify(data);
  if (source === owner) {
    menu = "admin";
    return cb(null, {
      menu: menu,
      user: data.username,
      source: source
    });
  }

  if (socket.request.session['moderator'] === 1) {
    menu = "moderator";
    return cb(null, {
      menu: menu,
      user: data.username,
      source: source
    });
  } else {
    menu = "user";
    return cb(null, {
      menu: menu,
      user: data.username,
      source: source
    });
  }
}); //END chatmenu

socket.on("loanmenu", function(data, cb) {
  log(`socket.on("loanmenu")`);
  try {
    data = JSON.parse(data.data);
  } catch(e) {
    log(`Failed to parse loanmenu data!`);
  }
  log(data)
  var source = socket.request.session['user'];
  if (source == owner) {
    menu = "admin";
    return cb(null, {
      menu: menu,
      user: data.username,
      loanId: data.loanId,
      state: data.state
    });
  }
  if (socket.request.session['moderator'] === 1) {
    menu = "moderator";
    return cb(null, {
      menu: menu,
      user: data.username,
      loanId: data.loanId,
      state: data.state
    });
  } else {
    menu = "user";
    return cb(null, {
      menu: menu,
      user: data.username,
      loanId: data.loanId,
      state: data.state
    });
  }
}); //END chatmenu

socket.on('getuserdata', async function(req, cb){
  if(!req) return cb('Request Data was Undefined!', null);
  if(!req.username) return cb('Request UserName was Undefined!', null);
  log(`socket.on('getuserdata'`);
  log(req)
  var user = socket.request.session['user'];
  if(user !== owner) {
    if(req.username != user) return cb('Requesting User Lacks Privileges to Fetch Data', null);
  }
  let userData;
  let userNameCheck = await UserData.findOne({where:{username:`${user}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
  if (userNameCheck === null) {
    return cb('User was not found in DB', null);
  } else {
    userData = userNameCheck;
    return cb(null, {data: userNameCheck});
  }
});

socket.on('getfounders', async function(req, cb){
  return cb(null, {founders:founderslist});
})

socket.on('changenode', function(req) {
  var user = socket.request.session['user'];
  if(user !== owner) return log(`${user} tried to change nodes!`);
  if(user == owner){
    var ltpayload = JSON.stringify({type: 'changenode', username: user});
    rpcThread.send(ltpayload);
  }
});

socket.on('closecfd', async function(req, cb){
  if(debug === true) {
    log(`socket.on('closecfd'`);
    log(req);
  }
  if(!req.id) return cb('No Contract ID was Specified!', {token: req.token});
  var user = socket.request.session['user'];
  log(req)
  var cfdpayload = JSON.stringify({type:'close', username: user, id: req.id, token: req.token, socketid: simpleStringify(socketList[socket.id])});
  futuresThread.send(cfdpayload);
  return cb(null, {msg: `Trying to Cancel CFD Contract ID #${req.id}.. Please Wait`, token: req.token});
});

socket.on('createloan', async function(req, cb){
  if(debug === true) {
    log(`socket.on('createloan',`);
    log(req);
  }
  if(!req.amount && typeof req.amount != 'number' || req.amount < 0) return cb('Amount Variable Undefined, Invalid or a Non-Number Type', {token: req.token});
  if(!req.days && typeof req.days != 'number' || req.days < 7 || req.days > 91) return cb('Days Variable Undefined, Invalid or a Non-Number Type', {token: req.token});
  if(!req.interest && typeof req.interest != 'number' || req.interest < 0) return cb('Fee Variable Undefined, Invalid or a Non-Number Type', {token: req.token});
  if(!req.funded) req.funded = 0;
  if(req.funded == 0) req.funded = false;
  if(req.funded == 1) req.funded = true;
  var sitefee;
  var user = socket.request.session['user'];
  var amount = parseInt(req.amount * 1000);
  var days = req.days;
  var fee = req.interest;
  var interest = req.interest;
  var funded = req.funded;
  if (typeof cb !== 'function') return socket.emit('muppet', {message:'You fucking muppet, you need a callback for this call', token: req.token});
  if (typeof amount != 'number') return cb('Amount Must be a Number!', {token: req.token});
  if (amount < 0) return cb('Amount Must be a Positive Number!', {token: req.token});
  if (typeof fee != 'number') return cb('Fee Must be a Number!', {token: req.token});
  if (typeof user != 'string') return cb('Username Specified was Not a String?!', {token: req.token});


  if (fee < 10 ) return cb('Fee Must be a over 10%!', {token: req.token});
  if (typeof days != 'number') return cb('Days Must be a Number!', {token: req.token});
  if (days < 7) return cb('Duration Must be 7 or over!', {token: req.token});
  if (days > 91) return cb('Duration Must less than 91!', {token: req.token});
  let userData;
  let userNameCheck = await UserData.findOne({where:{username:user}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
  if (userNameCheck === null) {
    return cb('User was not found in DB', {token: req.token});
  } else {
    userData = JSON.parse(JSON.stringify(userNameCheck));
    switch(userData.rank) {
      case 'backer':
      if (fee > 35 ) return cb('Fee Must be a under 35%!', {token: req.token});
      break;
      case 'founder':
      if (fee > 30 ) return cb('Fee Must be a under 30%!', {token: req.token});
      break;
      case 'owner':
      if (fee > 100 ) return cb('GODMODE: Fee Must be a under 100%!', {token: req.token});
      break;
    }
    if(funded == false);
    if(amount <= userData.hivebalance){
      log(`LENDING: ${user} creating a new loan - ${amount / 1000} HIVE at ${interest}% for ${days} days!`);
      var ltpayload = JSON.stringify({type:'newloan', userId: userData.id, username: userData.username, amount: amount, funded: funded, days: days, interest: interest, token: req.token, socketid: simpleStringify(socketList[socket.id])});
      loanThread.send(ltpayload);



      return cb(null, {message:`Created New Loan: ${amount / 1000} HIVE at ${interest}% for ${days} days!`, token: req.token});
    } else {
      log(`LENDING: ${user} balance too low to create loan!`);
      return cb('Not Enough Balance to Create Loan!', {token: req.token});
    }
  }
});//END socket.on createloan

socket.on('acceptloan', async function(req, cb) {
  var user = socket.request.session['user'];
  //req = JSON.parse(req);
  var gottenHP = await getHivePower(user).then(result => {return result}).catch(error => log(error));
  log(gottenHP);
  if(gottenHP < 10) return cb("Not Enough Hive Power for this Loan!", {token: req.token});
  var loanId;
  var loanFee;
  try {
    req = JSON.parse(JSON.stringify(req));
    loanId = req.loanId;
  } catch (e){
    log(e);
  }
  var userCheckRecovery = async(user) => {
    log(`userCheckRecovery(${user})`);
  await hive.api.getAccounts([user], async function(err, result) {
     if(err){console.log(err)}
     if(result) {
       result = JSON.parse(JSON.stringify(result));
       result = result[0];
       var recoverAcct = await result.recovery_account;
       log(recoverAcct)
       if(recoverAcct !== 'hive.loans' && recoverAcct !== 'anonsteem' && recoverAcct !== 'beeanon' && recoverAcct !== 'blocktrades' && recoverAcct !== owner) {
         return cb("Your Recovery Account isn't Supported!", {token: req.token});
       } else {
         log(`ACCEPT CONTRACT: Recovery Account Fine`);



           log(`socket.on('acceptloan', async function(req, cb){`)
             log(req);
             let loanData;
             let loanCheck = await LoanData.findOne({where:{loanId:loanId}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
             if (loanCheck === null) {
               return cb("Loan ID was not Found!", {token: req.token});
             } else if (typeof loanCheck !== undefined){
               log(loanCheck);
               loanData = JSON.parse(JSON.stringify(loanCheck));
               log(loanData);
               if(typeof loanData != undefined) log(`loanData != Undefined`);
               if (user == loanData.username) return cb("Are you Trying to Lend to Yourself?", {token: req.token});
               loanData = JSON.parse(JSON.stringify(loanCheck));
               var loanAmount = parseInt(loanData.amount / 1000);
               var pubpgpkey = await pgpKeygenAsync(user);
               gottenHP = await getHivePower(user).then(result => {
                 log(`Users HP:`);
                 log(result);
                 var firstpass = parseFloat(usersHivePower[user] * 0.7);
                 log(`loanAmount:`);
                 log(loanAmount + " HIVE");
                log(`ACCEPT-LOAN: User can Loan up to ${(firstpass).toFixed(3)} HIVE`);
                 if(loanAmount <= firstpass){
                   log(`ACCEPT-LOAN: Loan is Suitable! Sending Account Surrender Panel Now`);

                   return cb(null, {username: user, limit: firstpass, loanId: loanId, loanData: loanData, pgppublic: `${pubpgpkey}`, token: req.token});
                 } else {
                   log(`ACCEPT-LOAN: ERROR: Not enough HIVE Power in Account!`);
                   return cb("Not Enough Hive Power for this Loan!", {token: req.token});
                 }
                 return result
               }).catch(error => {console.log(error)});

             } else {
               log(`loanData.username ==`);
                log(`${loanData.username }`);
             }
       }
     }
   });
  }
  userCheckRecovery(user);
});//END Accept loan

  socket.on('loadaudit', async function(req, cb){
    var user = socket.request.session['user'];
    siteAudit();
  });

  socket.on('siteaudit', async function(req, cb){
    var user = socket.request.session['user'];
    if (user != owner) return cb("Invalid Permissions to Request Audit!", {token: req.token});
    siteAudit();
    return cb(null, {token: req.token});
  });

  socket.on('confirmloan', async function(req, cb){
    log(`confirm loan:`);
    log(req);
    var loanId = req.loanId;
    var user = socket.request.session['user'];
    var pgpdata = req.pgp;
    if (typeof cb !== 'function') return socket.emit('muppet', {message:'You fucking muppet, you need a callback for this call', token: req.token});
    if (typeof loanId != 'string') return cb('LoanID Must be a String!', {token: req.token});
    if (typeof user != 'string') return cb('Claiming User Must be a String!', {token: req.token});
    if (typeof pgpdata != 'string') return cb('PGP Encryption is Incorrect', {token: req.token});

    var ltpayload = JSON.stringify({type:'checkkey', username: user, loanId: loanId, pgp: pgpdata, token: req.token, socketid: simpleStringify(socketList[socket.id])});
    userThread.send(ltpayload);
    return cb(null, "Checking the Account Key Provided...");
  });//END socket.on createloan

      socket.on('infoloan', async function(req, cb){
        var loanId = req.loanId;
        var user = socket.request.session['user'];
        log(`socket.on('infoloan',`)
        log(req);
        var gottenHP = passdata;
        log(gottenHP);
        var firstpass = parseFloat((usersHivePower[user]) * 0.7);
        log(firstpass);
        var ltpayload = JSON.stringify({type:'infoloan', username: user, loanId: loanId, token: req.token, socketid: simpleStringify(socketList[socket.id])});
        loanThread.send(ltpayload);
        return cb(null, 'Contract Info Fetching in Progress')
      });//END socket.on createloan


      socket.on('cancelloan', async function(req, cb){
        log(`socket.on('cancelloan',`)
        log(req);
        var loanId = req.loanId;
        var user = socket.request.session['user'];

        //if (typeof cb !== 'function') return socket.emit('muppet', {message:'You fucking muppet, you need a callback for this call', token: req.token});
        //if (typeof loanId != 'string') return cb('LoanID Specified was Not a String?!', {token: req.token});
        //if (!testToken(socket, req.token)) return cb('incorrect token', {token: req.token});
        var ltpayload = JSON.stringify({type:'cancelloan', username: user, loanId: loanId, token: req.token, socketid: simpleStringify(socketList[socket.id])});
        loanThread.send(ltpayload);
        return cb(null, {contractID: loanId, token: req.token});
      });//END socket.on cancelloan

      socket.on("getmyactiveloans", function(req, cb) {
        var user = socket.request.session['user'];
        var ltpayload = JSON.stringify({type:'myloanlist', username: req.username, token: req.token, socketid: simpleStringify(socketList[socket.id])});
        loanThread.send(ltpayload);
        log(`Fetching users active loans loans`)
        //return cb(null, 'Fetching Users Loans');
      });

      socket.on("payLoanIdDirect", async function(req, cb) {
        //log(`socket.on("getmyloanlists"`)
        var user = socket.request.session['user'];
        let loanData;
        let loanCheck = await LoanData.findOne({where:{loanId:`${req.loanId}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
        if (loanCheck === null) {
          log(`LOANS: ERROR: Loan ${req.loanId} not found in DB!`);
          return cb(`Loan ${req.loanId} not found in DB!`, {token: req.token});
        } else {
          loanData = JSON.parse(JSON.stringify(loanCheck));
          var loanAmount = parseInt(loanData.amount);
          return cb(null, {username: req.username, loanId: req.loanId, loandata: loanData, token: req.token});
        }
      });

      socket.on("confirmpayLoanIdDirect", async function(req, cb) {
        log(`socket.on("getmyloanlists"`)
        var user = socket.request.session['user'];
        log(req)
        let loanData;
        var uData;
        var paymentAmt = parseInt(req.amount * 1000);
        var contractFinished = false;
        var overpay = 0;
        log(paymentAmt);
        if (typeof cb !== 'function') return socket.emit('muppet', {message:'You fucking muppet, you need a callback for this call', token: req.token});
        if (typeof paymentAmt != 'number') return cb('Amount Must be a Positive Number!', {token: req.token});
        if (paymentAmt < 0) return cb('Amount Must be a Positive Number!', {token: req.token});

        let loanCheck = await LoanData.findOne({where:{loanId:`${req.loanId}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
        if (loanCheck === null) {
          log(`LOANS: ERROR: Loan ${req.loanId} not found in DB!`);
          return cb(`Loan ${req.loanId} not found in DB!`, {token: req.token});
        } else {
          log(`LOANS: Loan ${req.loanId} Found! Grabbing stats`);
          try {
            loanData = JSON.parse(JSON.stringify(loanCheck));
          } catch (e){
            log(`LOANS: Failed to Parse User ${user} loanData!`);
            return cb(`Failed to Fetch Loan Contract Data`, {token: req.token});
          }
          if(user == loanData.user){
            return cb(`Did You Just Try and Accept Your Own Loan?`, {token: req.token});
          }
          var loanAmount = parseInt(loanData.amount);
          var newinterest = (loanData.interest / 100);
          var totalpayments = (loanData.days / 7);
          var totalrepay =  loanData.amount + (loanData.amount * newinterest);
          var outstandingDebt = (totalrepay - loanData.collected);

          let userCheck = await UserData.findOne({where:{username:`${user}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
          if (userCheck === null) {
            log(`LOANS: ERROR: Borrower ${req.loanId} not found in DB!`);
            return cb(`Borrower not found in DB!`, {token: req.token});
          } else {
            log(`LOANS: User ${user} Found! Grabbing stats`);
            uData = JSON.parse(JSON.stringify(userCheck));
            if(uData.hivebalance >=  paymentAmt){
              uData.hivebalance -= paymentAmt;
              loanData.collected += paymentAmt;
              await UserData.update({hivebalance: uData.hivebalance},{where:{username:`${user}`}});

            } else {
              log('Error: Not Enough HIVE Balance!');
              return cb('Not Enough HIVE Balance!', {token: req.token});
            }
            if (paymentAmt == outstandingDebt) {
              await LoanData.update({collected: loanData.collected, currentpayments: (loanData.currentpayments + 1), totalpayments: (loanData.totalpayments + 1), active: false, completed: true},{where:{loanId:`${req.loanId}`}});
              log(`LOANS: Lending Contract #${req.loanId} Completed! Returning user ${user}'s Ownership Keys to them! IMPLEMENT THIS`);
              contractFinished = true;
            } else if (paymentAmt < outstandingDebt) {
              await LoanData.update({collected: loanData.collected, currentpayments: (loanData.currentpayments + 1), totalpayments: (loanData.totalpayments + 1), active: true, completed: false},{where:{loanId:`${req.loanId}`}});
              log(`LOANS: Lending Contract #${req.loanId} Updated!`);
            } else if (paymentAmt > outstandingDebt) {
              await LoanData.update({collected: loanData.collected, currentpayments: (loanData.currentpayments + 1), totalpayments: (loanData.totalpayments + 1), active: false, completed: true},{where:{loanId:`${req.loanId}`}});
              overpay = (paymentAmt - outstandingDebt);
              log(`LOANS: Lending Contract #${req.loanId} Completed! Returning user ${user}'s Ownership Keys to them! OVERPAID BY: ${(overpay / 1000)} HIVE`);
              contractFinished = true;
            }
            var lenderData;
            let lenderCheck = await UserData.findOne({where:{username:`${loanData.username}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
            if (lenderCheck === null) {
              log(`LOANS: ERROR: Lender ${req.loanId} not found in DB!`);
              return cb(`Lender not found in DB!`, {token: req.token});
            } else {
              lenderData = JSON.parse(JSON.stringify(lenderCheck));
              lenderData.hivebalance += paymentAmt;
              lenderData.hiveprofit += paymentAmt;
              if (contractFinished == true) {
                if(lenderData.activelends >= 1){
                  lenderData.activelends--;
                  lenderData.closedlends++;
                }
                await UserData.update({hivebalance: lenderData.hivebalance, hiveprofit: lenderData.hiveprofit, activelends: lenderData.activelends, closedlends: lenderData.closedlends, totallends: lenderData.totallends},{where:{username:`${loanData.username}`}});
              } else {
                await UserData.update({hivebalance: lenderData.hivebalance, hiveprofit: lenderData.hiveprofit,  currentpayments: (lenderData.currentpayments + 1), totalpayments: (loanData.totalpayments + 1), active: true, completed: false},{where:{username:`${loanData.username}`}});
              }
              return cb(null, {username: req.username, loanId: req.loanId, loandata: loanData, token: req.token});
            }
            //return cb(null, 'Fetching Users Loans');
          }
        }
      });

      socket.on("walletdata", function(req, cb) {
        var user = socket.request.session['user'];
        var username = req.username;
        if (user != owner){
          if(user != username) return cb('You Cannot Look Up That Wallet!', null);
        }
        var ltpayload = JSON.stringify({type:'walletdata', username: username, socketid: simpleStringify(socketList[socket.id])});
        userThread.send(ltpayload);
        log(`Fetching user ${user} wallet data`)
        return cb(null, 'Fetching Wallet Data');
      });

      socket.on("wallethistory", function(req, cb) {
        var user = socket.request.session['user'];
        var username = req.name;
        if (user != owner){
          if(user != username) return cb('You Cannot Look Up That Wallet!', null);
        }
        var payload = JSON.stringify({type:'wallethistory', username: user, socketid: simpleStringify(socketList[socket.id])});
        userThread.send(payload);
        log(`Fetching user ${user} wallet history`)
        return cb(null, 'Fetching Wallet History');
        //return cb(null, 'Fetching Users Loans');
      });

      socket.on("loadaallshares", function(req, cb) {
        return;
        var user = socket.request.session['user'];
        var payload = JSON.stringify({type:'wallethistory', username: user, socketid: simpleStringify(socketList[socket.id])});
        exchangeThread.send(payload);
        log(`Fetching user ${user} share holdings`)
        return cb(null, 'Fetching Share Exchange');
        //return cb(null, 'Fetching Users Loans');
      });

      socket.on("loadaallexchange", function(req, cb) {
        return;
        var user = socket.request.session['user'];
        var payload = JSON.stringify({type:'wallethistory', username: user, socketid: simpleStringify(socketList[socket.id])});
        exchangeThread.send(payload);
        log(`Fetching user ${user} share holdings`)
        return cb(null, 'Fetching Share Exchange');
        //return cb(null, 'Fetching Users Loans');
      });


      socket.on("loadmyfutures", function(req, cb) {
        var user = socket.request.session['user'];
        //var payload = JSON.stringify({type:'loadmyloans', username: user, socketid: simpleStringify(socketList[socket.id])});
        //loanThread.send(payload);
        var spread = spreadpercent / 100;
        longHIVEprice = parseFloat((hiveprice + (hiveprice * spread)).toFixed(6));
        shortHIVEprice = parseFloat((hiveprice - (hiveprice * spread)).toFixed(6));
        return cb(null, {hiveusdprice:hiveprice, hiveshortprice: shortHIVEprice, hivelongprice: longHIVEprice});
        log(`Fetching HIVE Spot Prices`)
        //return cb(null, 'Fetching Users Loans');
      });

      socket.on("loadmyloans", function(req) {
        if(debug === false) log(`socket.on("loadmyloans",`); log(req);
        var history;
        if(!req.history) history = false;
        if(req.history == true) {
          history = true;
        } else {
          history = false;
        }
        var user = socket.request.session['user'];
        var payload = JSON.stringify({type:'loadmyloans', username: user, history: history, socketid: simpleStringify(socketList[socket.id])});
        loanThread.send(payload);
        log(`Fetching users loans`)
        //return cb(null, 'Fetching Users Loans');
      });

      socket.on("loadmylends", function(req) {
        if(debug === false) log(`socket.on("loadmylends",`); log(req);
        var history;
        if(!req.history) history = false;
        if(req.history == true) {
          history = true;
        } else {
          history = false;
        }
        var user = socket.request.session['user'];
        var payload = JSON.stringify({type:'loadmyloans', username: user, history: history, socketid: simpleStringify(socketList[socket.id])});
        loanThread.send(payload);
        log(`Fetching users lends`)
        //return cb(null, 'Fetching Users Loans');
      });

      socket.on("loadallloans", function(req, cb) {
        if(debug === false) log(`socket.on("loadallloans",`); log(req);
        var history;
        if(!req.history) history = false;
        if(req.history == true) {
          history = true;
        } else {
          history = false;
        }
        var user = socket.request.session['user'];
        var ltpayload = JSON.stringify({type:'loadallloans', username: user, history: history, socketid: simpleStringify(socketList[socket.id])});
        loanThread.send(ltpayload);
        return cb(null, 'Loading All Lending Contracts');
        log(`Fetching all loans`)
        //return cb(null, 'Fetching Users Loans');
      });

      socket.on("useraudit", function(req, cb) {
        var user = socket.request.session['user'];
        var ltpayload = JSON.stringify({type:'statecheck', username: user, socketid: simpleStringify(socketList[socket.id])});
        loanThread.send(ltpayload);
        return cb(null, 'Loading All Lending Contracts');
        log(`Fetching all loans`)
        //return cb(null, 'Fetching Users Loans');
      });

      socket.on("chatmessage", function(msg, cb) {
        log(msg);
        var user = socket.request.session['user'];
        var uid = socket.request.session['uid'];
        var lvl = socket.request.session['lvl'];
        var rank = socket.request.session['rank'];
        var rando = crypto.randomBytes(6).toString('HEX');
        if (typeof cb !== 'function') return;
        if (typeof msg.message !== 'string') return cb('Send a string you fuck', null);
        if (msg.token !== socket.request.session['chattoken']) return cb('Incorrect Token', null);
        if (msg.message === '') return cb('No Chat Message', null);
        if (msg.message === undefined) return cb('No Chat Message', null);
        if (msg.message === null) return cb('No Chat Message', null);
        if (msg.message.length > 256) return cb('Message Too Long', null);
        if (socket.request.session['muted'] == 1) return cb('You Are Muted & Cannot Chat!', null);

        var m = {
          userId: uid,
          username: user,
          rank: rank,
          lvl: lvl,
          msg: msg.message,
          rng: rando,
          createdAt: (new Date).toUTCString()
        };

        if (m.msg.charAt(0).toLowerCase().indexOf("/") >= 0) {
          m = null;
          return cb(null, true);
        } else {
          if (m === null) {
            return cb(null, true);
          }
          ChatData.create(m);
          io.emit('chatmessage', m);
        }
        return cb(null, true);
      });

      socket.on('get2fa', function(req, cb){
        if (typeof cb !== 'function') return;
        if (!testToken(socket, req.token))  return cb('incorrect token', {token: 0});

        get2fa(socket.request.session['user'], function(err, code){
          if (err) return cb(err, null);

          if (code) return cb(null, {token: userTokens[socket.request.session['user']], set: true });
          var secret = speakeasy.generateSecret({length: 20});
          socket.request.session['2fa'] = secret.base32;
          QRCode.toDataURL("otpauth://totp/" + socket.request.session['user'] + "-nudies?secret=" + secret.base32, function(err, data_url) {

            return cb(err, {qrcode: data_url, secret: secret.base32, set: false, token: userTokens[socket.request.session['user']]});
          });
        })
      });

      socket.on('set2fa', function(req, cb){
        if (typeof cb !== 'function') return;
        if (typeof req.code !== 'string') return cb('send me a string you tool', {token: 0});
        if (req.code.length>32) return cb('What shit you trying to pull here?', {token: 0});
        if (!testToken(socket, req.token)) return cb('incorrect token', {token: 0});

        var verified = speakeasy.totp.verify({
          secret: socket.request.session['2fa'],
          encoding: 'base32',
          token: req.code
        });
        if (verified){
          save2fa(socket.request.session['2fa'], socket.request.session['user'], function(err, d){
            if (err) return cb('error saving', {token: userTokens[socket.request.session['user']]});
            return cb(null, {token: userTokens[socket.request.session['user']]});
          });

        }else{
          return cb('not correct', null);
        }
      });

      socket.on('del2fa', function(req, cb){
        if (typeof cb !== 'function') return;
        if (typeof req.code !== 'string') return cb('send me a string you tool', {token: 0});
        if (req.code.length>32) return cb('What shit you trying to pull here?', {token: 0});
        if (!testToken(socket, req.token)) return cb('incorrect token', {token: 0});
        var user = socket.request.session['user'];

        fs.readFile( __dirname + "/db/logins/" + user, function(err, data){ //read user data
          if (err) return cb('DB error', null);
          data = JSON.parse(data);
          if (typeof data['2fa'] === 'undefined') return cb('No 2fa set', {token: userTokens[socket.request.session['user']]});
          console.log(req.code, data['2fa']);
          var verified = is2FACorrect(req.code, data['2fa']);

          if (verified){
            delete data['2fa'];
            fs.writeFile(__dirname + "/db/logins/" + user, JSON.stringify(data), function(err,d){
              if (err) return cb('error deleting', {token: userTokens[socket.request.session['user']]});
              return cb(null, {token: userTokens[socket.request.session['user']]});
            });
          }else{
            return cb('not correct', null);
          }

        });
      });
      // END io
    };//END exports = module.exports

//==================================================
//--------------------------------------------------
//     Monitor & Cross Module
//--------------------------------------------------
rpcThread.on('message', function(m) {
      try {
        m = JSON.parse(m);
        if(debug === true){
          log(`rpcThread.on('message' message:`);
          log(m);
        }
      } catch(e) {
        log(e);
      }
      switch(m.type){
        case 'emit':
        var name = m.name.toString();
        var socketidparse = m.socketid;
        var socketid = m.socketid[0].id
        var newpayload = [];
        var incomingpayload = m.payload;
        var socketCorrect = socketList[m.socketid[0].id];
        incomingpayload.forEach((item, i) => {
          newpayload.push(item);
        });
        if (socketList[m.socketid[0].id]) socketCorrect.emit(`${name}`, newpayload[0]);
        break;//END case 'emit'
        case 'massemit':
        var name = m.name.toString();
        var newpayload = [];
        if(debug === true) log(m.payload);
        var incomingpayload = [m.payload];
        if(incomingpayload.length > 1){
          incomingpayload.forEach((item, i) => {
            if(item.username != -1) {
              delete item.username;
            }
            if(item.username != -1) {
              delete item.username;
            }
            auditWalletArray.push(item);
          });
        } else {
          auditWalletArray = m.payload;
        }
        switch(m.name){
          case 'sitewallets':
          if(debug === true){
            log(`auditWalletArray:`);
            log(auditWalletArray);
          }

          //auditArray.push({wallets: auditWalletArray});
          break;//END case sitewallets
        }
        var masskeys = Object.keys(socketList);
        for (var i = 0; i < masskeys.length; i++){
          if (socketList[masskeys[i]]) {
            socketList[masskeys[i]].emit(`${name}`, auditWalletArray);
          }
        }
        break;//END case 'massemit'
      }
      if (m.type === 'update'){
        usersInvest = m.users;
        maxWin = m.maxWin;
        bankRoll = m.BR;
        greedBR = m.greedBR;
        siteProfit = m.siteProfit;
        siteTake = m.sharesitetake;
        siteEarnings = m.sharesiteearnings;
        var updatekeys = Object.keys(userSockets);
        for (var i = 0; i< updatekeys.length;i++){
          if (userSockets[updatekeys[i]]) {
            userSockets[updatekeys[i]].emit('generalupdate', {siteProfit: siteProfit, sharesitetake: siteTake, sharesiteearnings: siteEarnings, totalwagered: m.totalwagered, totalBets: m.totalBets, greedBR: greedBR, bankroll: bankRoll, maxWin: maxWin, invested: usersInvest[keys[i]]});
          }
        }
      } else if (m.type === 'userRequest'){
        if (userSockets[m.user]) {
          userSockets[m.user].emit('investupdate', {invested: m.invested, greed: m.greed, balance: m.balance, error: null, token: userTokens[m.user]});
        }
      } else if(m.type === 'divest'){
        if (userSockets[m.user]) {
          userSockets[m.user].emit('divestupdate', {invested: m.invested, greed: m.greed, balance: m.balance, error: m.error, token: userTokens[m.user]});
        }
      } else if(m.type === 'greedupdate'){
        if (userSockets[m.user]) {
          userSockets[m.user].emit('greedupdate', {invested: m.invested, greed: m.greed, error: m.error, token: userTokens[m.user]});
        }
      } else if (m.type === 'blockupdate'){
        newCurrentBlock = m.block;
        synced = m.synced;
        /*
        var bupdkeys = Object.keys(userSockets);
        if(bupdkeys != undefined){
        for (var i = 0; i< bupdkeys.length;i++){
        if (userSockets[bupdkeys[i]]) {
        userSockets[bupdkeys].emit('latestblock', {block:m.block});
      }
    }
  }
  */
  socketListKeys = Object.keys(socketList);
  if(socketListKeys != undefined){
    socketListKeys.forEach((item, i) => {
      socketList[item].emit('latestblock', {block:m.block, behind: m.behind, synced:m.synced}); ///to(socketListKeys[i])
    });
  }
} else if (m.type === 'depositconfirmed'){
  if (userSockets[m.user]) {
    jsonBreadCrumb('wallet', 'deposit', {txid: m.txid});
    userSockets[m.user].emit('depositcredit', {balance: m.balance, amount: m.amount, coin: m.coin});
  }
} else if (m.type === 'grabacct') {

} else {

}

});//END rpcThread.on('message',

var auditWdFeeArray;
userThread.on('message', function(m) {
  try{
    m = JSON.parse(m);
    if(debug === true) {
      log(`userThread.on('message' message:`);
      log(m);
    }
  } catch(e){
    log(e)
  }
  switch(m.type){
    case 'emit':
    var name = m.name.toString();
    var socketidparse = m.socketid;
    var socketid = m.socketid[0].id
    var newpayload = [];
    var incomingpayload = m.payload;
    var socketCorrect = socketList[m.socketid[0].id];
    incomingpayload.forEach((item, i) => {
      newpayload.push(item);
    });
    if (socketList[m.socketid[0].id]) socketCorrect.emit(`${name}`, newpayload);
    break;
    case 'massemit':
    var name = m.name.toString();
    var newpayload = [];
    log(m.payload);
    var incomingpayload = [m.payload];
    if(incomingpayload.length > 1){
      incomingpayload.forEach((item, i) => {
        auditWdFeeArray.push(item);
      });
    } else {
      auditWdFeeArray = m.payload;
    }
    switch(m.name){
      case 'wdfeeaudit':
      log(`auditWdFeeArray:`);
      log(auditWdFeeArray);

      break;
    }
    var masskeys = Object.keys(socketList);
    for (var i = 0; i < masskeys.length; i++){
      if (socketList[masskeys[i]]) {
        socketList[masskeys[i]].emit(`${name}`, auditWalletArray);
      }
    }
    break;
  }
});//END userThread.on('message',

exchangeThread.on('message', function(m) {
  try{
    m = JSON.parse(m);
    if(debug === true){
      log(`exchangeThread.on('message' message:`);
      log(m);
    }
  } catch(e){
    log(e)
  }
});//END exchangeThread.on('message'

loanThread.on('message', function(m) {
  try{
    m = JSON.parse(m);
    if(debug === true){
      log(`loanThread.on('message' message:`);
      log(m);
    }
  } catch(e){
    log(e)
  }
  switch(m.type){
    case 'emit':
    var name = m.name.toString();
    var socketidparse = m.socketid;
    var socketCorrect = socketList[m.socketid[0].id];
    var socketid = m.socketid[0].id
    var newpayload = [];
    var incomingpayload = m.payload;
    if(incomingpayload != null) {
      if(incomingpayload.length > 1){
        incomingpayload.forEach((item, i) => {
          newpayload.push(item);
        });
      } else {
        if((m.payload).length == 0) m.payload = [];
        newpayload = m.payload;
      }

    }
    switch(m.name){
      case 'loadmyloans':
      //jsonBreadCrumb('contracts', m.name, m.payload);
      break;
      case 'newloanmade':
      jsonBreadCrumb('contracts', 'newloan', m.payload);
      break;//END case 'newloanmade'
      case 'loannuked':
      if(m.payload == undefined)
      jsonBreadCrumb('contracts', 'nukeloan', m.payload);
      break;
      default:
      //jsonBreadCrumb('contracts', m.name, m.payload);
    }
    if (socketList[m.socketid[0].id]) {
      socketCorrect.emit(`${name}`, newpayload);
    }
    break;
    case 'massemit':
    auditArray = [];
    var name = m.name.toString();
    switch(m.name){
      case 'loadmyloans':

      break;
      case 'siteaudit':
      if(auditWalletArray){

        m.payload.push({wallets: auditWalletArray});
        m.payload.push({wdfees: auditWdFeeArray});
        //jsonBreadCrumb('security', 'audit', [m.payload]);
        //log(auditArray);
      }
      break;
    }
    var newpayload = [];
    var incomingpayload = [m.payload];
    if(incomingpayload.length > 1){
      incomingpayload.forEach((item, i) => {
        auditArray.push(item);
      });
      //auditArray.push(auditWalletArray);
    } else {
      auditArray = m.payload;
      //auditArray.push(auditWalletArray);
    }

    if(auditArray != undefined){
      try{
        jsonBreadCrumb('security', 'audit', [auditArray]);
      } catch(e) {
        //log(e)
      }
      var masskeys = Object.keys(socketList);
      for (var i = 0; i < masskeys.length; i++){
        if (socketList[masskeys[i]]) {
          socketList[masskeys[i]].emit(`${name}`, auditArray);
        }
      }
    }
    break;
  }

  if (m.type === 'infoloandata'){
    //log(`MYLOANS FIRED`)
    //log(m);
    if (userSockets[m.username]) {
      userSockets[m.username].emit('infoloandata', {loandata: m.loandata, token: m.token});
    }
  } else if (m.type === 'depositconfirmed'){
    if (userSockets[m.username]) {
      jsonBreadCrumb('wallet', 'deposit', {txid: m.txid});
      userSockets[m.username].emit('depositcredit', {balance: m.balance, amount: m.amount, coin: m.coin});
    }
  } else if (m.type === 'statereply'){
    if (userSockets[m.username]) {
      userSockets[m.username].emit('statereply', {loanstates: m.loanstates, token: m.token});
    }
  }
});//END loanThread.on('message',

tickerThread.on('message', function(m) {
  try{
    m = JSON.parse(m);
    if(debug === true){
      log(`SOCKET: tickerThread.on('message' message:`);
      log(m);
    }
  } catch(e){
    m = JSON.parse(JSON.stringify(m));
  }
  switch(m.type){
    case 'emit':
    var name = m.name.toString();
    var socketidparse = m.socketid;
    var socketCorrect = socketList[m.socketid[0].id];
    var socketid = m.socketid[0].id
    var newpayload = [];
    var incomingpayload = m.payload;
    if(incomingpayload.length > 1){
      incomingpayload.forEach((item, i) => {
        newpayload.push(item);
      });
    } else {
      newpayload = m.payload;
    }
    switch(m.name){
      case 'priceshift':
      jsonBreadCrumb('contracts', 'priceshift', m.payload);
      break;//END case 'newloanmade'
      case 'price':
      jsonBreadCrumb('price', 'update', m.payload);
      break;
    }
    if (socketList[m.socketid[0].id]) socketCorrect.emit(`${name}`, newpayload);
    break;

    case 'massemit':
    var name = m.name.toString();
    var newpayload = [];
    var incomingpayload = [m.payload];
    if(incomingpayload.length > 1){
      incomingpayload.forEach((item, i) => {
        newpayload.push(item);
      });
    } else {
      newpayload = m.payload;
    }

    switch(m.name){
      case 'cgmarketfetch':
      log(`cgmarketfetch m.payload:`);
      log(m.payload);
      return;
      break;
    }

    var masskeys = Object.keys(socketList);
    for (var i = 0; i< masskeys.length;i++){
      if (socketList[masskeys[i]]) {
        socketList[masskeys[i]].emit(`${name}`, newpayload);
      }
    }
    break;
  }

  if (m.type === 'infoloandata'){
    //log(`MYLOANS FIRED`)
    //log(m);
    if (userSockets[m.username]) {
      userSockets[m.username].emit('infoloandata', {loandata: m.loandata, token: m.token});
    }
  } else if (m.type === 'priceerror'){
    if (userSockets[m.username]) {
      userSockets[m.username].emit('depositcredit', {balance: m.balance, amount: m.amount, coin: m.coin});
    }
  }
});//END tickerThread.on('message',

futuresThread.on('message', function(m) {
  try{
    m = JSON.parse(m);
    if(debug === true){
      log(`SOCKET: futuresThread.on('message' message:`);
      log(m);
    }
  } catch(e){
    m = JSON.parse(JSON.stringify(m));
  }

  switch(m.type){
    case 'emit':
    var name = m.name.toString();
    var socketidparse = m.socketid;
    var socketCorrect = socketList[m.socketid[0].id];
    var socketid = m.socketid[0].id
    var newpayload = [];
    var incomingpayload = m.payload;
    if(incomingpayload.length > 1){
      incomingpayload.activeOrders.forEach((item, i) => {
        newpayload.push(item);
      });
    } else {
      newpayload = m.payload;
    }
    switch(m.name){
      case 'newcfdmade':
      jsonBreadCrumb('cfd', 'open', m.payload);
      break;//END case 'newloanmade'
      case 'closecfd':
      jsonBreadCrumb('cfd', 'close', m.payload);
      break;
      case 'rektcfd':
      jsonBreadCrumb('cfd', 'rekt', m.payload);
      break;
      case 'updatecfd':
      jsonBreadCrumb('cfd', 'update', m.payload);
      break;
    }
    if (socketList[m.socketid[0].id]) socketCorrect.emit(`${name}`, newpayload);
    break;

    case 'massemit':
    var name = m.name.toString();
    var newpayload = [];
    var incomingpayload = [m.payload];
    var masskeys = Object.keys(socketList);
    var tradernames = [];
      incomingpayload.forEach((item, i) => {
        if(!tradernames.includes(item.username)){
          tradernames.push(item.username);
        }
        if(masskeys.includes(item.username)){
          tradernames[item.username].push()
        }
        newpayload.push(item);
      });
    if(name == 'validcheck'){
      for (var i = 0; i< tradernames.length;i++){
        if (userSockets[tradernames[i]]) {
          userSockets[tradernames[i]].emit(`${name}`, newpayload);
        }
      }
    } else {
      for (var i = 0; i< masskeys.length;i++){
        if (socketList[masskeys[i]]) {
          socketList[masskeys[i]].emit(`${name}`, newpayload);
        }
      }
    }
    break;

    case 'cfdupdate':
    log(`CFDUPDATE ON SOCKET.JS`);
    log(m.payload);
        log(`m.payload.activeOrders`)
    log(m.payload.activeOrders)
    var name = m.name.toString();
    var newpayload = [];
    var incomingpayload = m.payload.activeOrders;
    var masskeys = Object.keys(socketList);
    var tradernames = m.payload.activecfdusers;
    log(tradernames)
    var sockeytargets = [];
      incomingpayload.forEach((item, i) => {

        //if(item == 'activeorders'){
          if(tradernames.includes(item.username)){
            delete item.username;
            delete item.orderId;
            newpayload.push(item);
          }
        //}

      });
    if(name == 'validcheck'){
      for (var i = 0; i< tradernames.length;i++){
        log(tradernames[i])
        if (userSockets[tradernames[i]]) {
        //if (socketList[tradernames[i]]) {
        log(`${tradernames[i]} is online. sending update`)
          userSockets[tradernames[i]].emit(`${name}`, newpayload);
        }
        //}
      }
    } else {
      for (var i = 0; i< masskeys.length;i++){
        if (socketList[masskeys[i]]) {
          socketList[masskeys[i]].emit(`${name}`, newpayload);
        }
      }
    }
    break;

  }
});//END futuresThread.on('message',
//==================================================
//--------------------------------------------------
//     Password Functions & 2FA & Token
//--------------------------------------------------
function get2fa(user, cb){
  fs.readFile( __dirname + "/db/logins/" + user, function(err, data){ //read user data
    if (err) return cb(err, null);
    data = JSON.parse(data);
    if (typeof data['2fa'] === 'undefined') return cb(null, false);
    return cb(null, true);
  });
};//END get2fa
//save 2FA to users account
function save2fa(secret, user, cb){
  fs.readFile( __dirname + "/db/logins/" + user, function(err, data){ //read user data
    if (err) return cb(err, null);
    data = JSON.parse(data);
    data['2fa'] = secret;
    fs.writeFile(__dirname + "/db/logins/" + user, JSON.stringify(data), function(err,d){
      if (err) return cb(err, null);
      return cb(null, true);
    });
  });
};//END save2fa
//test if a 2FA attempt is valid
function is2FACorrect(code, secret){
  var verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: code
  });
  return verified;
};//END is2FACorrect
//test a token against a users current token
function testToken(socket, token){
  if ( userTokens[socket.request.session['user']] !== token) return false;
  var token = crypto.randomBytes(64).toString('base64');
  userTokens[socket.request.session['user']] = token;
  return true;
};//END testToken
//create a random base64 token
function changeToken(user){
  if(debug === false) log(`changeToken(${user})`);
  var token = crypto.randomBytes(64).toString('base64');
  if(debug === false) log(`old userTokens[user] = ${userTokens[user]}`);
  if (userTokens[user]) userTokens[user] = token;
  if(debug === false) log(`new userTokens[user] = ${userTokens[user]}`);
  return token;
};//END changeToken
//create salt and hash password
function hashPassword(password) {
  var salt = crypto.randomBytes(64).toString('base64');
  return sha512(password, salt);
};//END hashPassword
//sha512 of password and salt
var sha512 = function(password, salt){
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
  };
};//END sha512
//Check password
function isPasswordCorrect(savedHash, savedSalt, passwordAttempt) {
  var passwordHash = sha512(passwordAttempt, savedSalt);
  if (passwordHash.passwordHash === savedHash){
    return true;
  } else {
    return false;
  }
};//END isPasswordCorrect

//==================================================
//--------------------------------------------------
//     Utility & Function
//--------------------------------------------------
function returnTime(){
  var time = new Date();
  time.setHours(time.getHours() + 18);
  time = (time).toUTCString();
  time = time.slice(17, time.length - 4);
  return time;
};//END returnTime

function simpleStringify(object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return [simpleObject]; // returns cleaned up JSON
};//END simpleStringify

function alphanumeric(inputtxt) {
  var letterNumber = /^[0-9a-zA-Z]+$/;
  if(inputtxt.match(letterNumber)){
    return true;
  } else {
    return false;
  }
};//END alphanumeric

function splitOffVests(string){
  if(string){
    if(debug === true) log(`SOCKET: async function splitOffVests(${string})`);
    return parseFloat(string.split(' ')[0]);
  } else {
    return false;
  }
};//END splitOffVests

function largest(current, newL){
  if (current < newL){
    return newL;
  }
  return current;
};//END largest

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};//END timeout

function censor(censor) {
  var i = 0;
  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
      return '[Circular]';
    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';
    ++i; // so we know we aren't using the original object anymore
    return value;
  }
};//END censor

process.on('SIGINT', function () {
  if(!blockNum) {
    log(`Shutting down in 1 seconds, start again with block ${blockNum}, Halting the Application!`);
  } else {
    log(`Shutting down in 1 seconds, Halting the Application!`);
  }
  shutdown = true;
  setTimeout(bail, 1000);
});//END SIGINT
