const { config } = require("../config/index.js");
let {canUserTransact, userSockets, socketList, socketListKeys, hiveprice, longHIVEprice, shortHIVEprice, spreadpercent} = require("../vars.js");
const crypto = require('crypto');
const debug = config.debug;
const owner = config.owner;
const log = require('fancy-log');
let Price = require("../snippets/priceCheck.js");
const DB = require('../database/models');
const sequelize = DB.sequelize;
const DataBase = sequelize;
const { Op } = require("sequelize");
const Userdata = DataBase.models.Users;
const CFDdata = DataBase.models.Futures;
const coinWhitelist = require("../config/coinWhitelist.json");

userSockets = [];

var ActiveCFDContracts = [];

var online = process.connected;
var pid = process.pid;
log(`FUTURES: Connected: ${online} with PID: ${pid}`);

var previousHIVEPrice;
var currentHIVEPrice;

var arrays = {
  activeOrders: [],
  activecfdusers: []
};

/*//NOTES
Hive Balance Decimals:
1 HIVE = 1000

Profit Decimals:
1 HIVE = 100000000
*/

function addToArray(name, index, value, num) {
  log(`addToArray(${name}, ${index}, ${value}, ${num})`)
  if(name == "activecfdusers"){
     if(!arrays[name].includes(value)) {
       arrays[name].push(value);
       //arrays.activeOrders.push(`${value}`);
     }
  }
  if(name == "activeOrders") {
    //if(!arrays[name].includes(index)) {
    //value = JSON.stringify(value);
    //}
    arrays.activeOrders.push(value);
      //arrays.activeOrders[`${index}`].push(value);
  }

  /*
  //log(value)
  if(array == "users") {
    if(activecfdusers.includes(`${name}`) == false || typeof activecfdusers[`${name}`] == undefined){
      log(`activecfdusers.includes(name) == false`)
      activecfdusers.push(`${name}`);
      activeOrders.push(name);
    }
    log(`activecfdusers:`);
    log(activecfdusers)
  }

  if(array == "orders") {
      //activeOrders[`${name}`].push(index);
      log(activeOrders[name])

      activeOrders[`${name}`].push(value);
      //activeOrders[`${name}`][`${index}`] = value;
      //activeOrders[`${name}`].push({value});
  }
  */
};//END addToArray

var newId = async function() {
  return crypto.randomBytes(16).toString('hex');
};

var canTransactCheck = async(user) => {
  log(`canUserTransact:`);
  log(canUserTransact);
  if(canUserTransact.includes(user) == false){
    canUserTransact.push(user);
    canUserTransact[user] = false;
    return canUserTransact[user];
  } else {
    return canUserTransact[user];
  }
};//END canTransactCheck

var priceChange = function(price) {
  if(!currentHIVEPrice) currentHIVEPrice = price;
  if(!previousHIVEPrice) previousHIVEPrice = price;
  if(currentHIVEPrice < previousHIVEPrice || currentHIVEPrice > previousHIVEPrice) {
    currentHIVEPrice = price;
    hiveprice = price;
    previousHIVEPrice = currentHIVEPrice;
    return true;
  } else {
    return false;
  }
}

var cfdCount = async function() {
  await CFDdata.count().then(c => {
    return c;
  });
};//END activeCFDCount

var cfdActiveCount = async function() {
  await CFDdata.count({ where: {'active': true}}).then(c => {
    log(`There are ${c} Active/Open CFD contracts`);
    return c;
  });
};//END cfdActiveCount

var cfdClosedCount = async function() {
   await CFDdata.count({ where: {'active': false}}).then(c => {
    log(`There are ${c} Closed/Finished CFD contracts`);
    return c;
  })
};//END cfdClosedCount

var userBalanceCheck = async(u) => {
  var userCheck = await Userdata.findOne({where:{username:`${u}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
  if (userCheck === null) {
    log(`FUTURES: ERROR: Failed to Fetch ${u} Balance!`);
    return false;
  } else {
    var uData = JSON.parse(JSON.stringify(userCheck));//.map(function(userNameCheck){ return userNameCheck.toJSON()});
    var qwikdata = {
      userId:uData.userId,
      username:uData.username,
      balance: uData.hivebalance,
      activecfd:uData.activecfdtrade,
      totalcfd:uData.totalcfdtrade
    };
    return qwikdata;
  }//end ellse
};//END userBalanceCheck



var loadAllActiveFutures = async() => {
  await CFDdata.findAll({
     //limit: 200,
     where: {active: true},
     order: [[ 'createdAt', 'DESC' ]],
     raw: true
  }).then(async function(entries){
      let allFutures = entries.map(await function(key) {
          return key;
      });
      await allFutures.forEach((item, i) => {
        if(!ActiveCFDContracts.includes(item)){
          ActiveCFDContracts.push(item);
        }
      });
  });
  //allFutures = JSON.parse(JSON.stringify(allFutures));
  //return allFutures;
  //log(`ActiveCFDContracts:`);
  //log(ActiveCFDContracts);
};//END loadAllActiveFutures
loadAllActiveFutures();

var liquidationCheck = function(data) {
  //if(!data) return false;
  var rekt = false;
  if(debug == true) {
    log(`liquidationCheck:`);
    log(data);
  }
  var killprice = parseFloat(data.liquidation);
  var type = data.type.toLowerCase();
  if(type == 'long'){
    if(killprice > hiveprice) rekt = true;
  } else if (type =='short'){
    if(killprice < hiveprice) rekt = true;
  }
  return rekt;
};//END liquidationCheck

var stopLossCheck = (data) => {
  if(!data) return false;
  if(!currentPrice) return false;
  if(typeof currentPrice !== 'number') return false;
  if(data.stoploss){
    if(data.type === 'long'){
      if(data.stoploss >= hiveprice) return true;
    } else if (data.type === 'short'){
      if(data.stoploss <= hiveprice) return true;
    }
    if(data.stoploss <= hiveprice) return true;
  } else {
    return false;
  }
};//END stopLossCheck

function resetarrays() {
  arrays.activeOrders = [];
  arrays.activecfdusers = [];
};

var cfdpayload = {};
var checkValidity = async() => {
resetarrays();
  await CFDdata.findAll({
     //limit: 200,
     where: {active: true},
     order: [[ 'createdAt', 'DESC' ]],
     raw: true
  }).then( async function(entries){
      let validPositions = entries.map(await function(key) {
            delete key.userId;
            delete key.coin;
            delete key.spreadfee;
            delete key.closePrice;
            if(key.stoploss == null) delete key.stoploss;
            delete key.commissionfee;
            delete key.overnightfee;
            delete key.active;
            delete key.createdAt;
            delete key.updatedAt;
            key.current = (parseInt(key.amount) + (parseFloat(key.profit) / 10000));
            key.close = `<button class="smolcfdbutton" onClick="closeCFDButton('${key.id}')"><code>Close</code></button>`;

          return key;
      });
      var rekt;
      var ai = 0;
      var oi = 0;

      await validPositions.forEach((item, i) => {
        rekt = liquidationCheck(item);
        if(rekt == false){
          var u = item.username;
            addToArray('activecfdusers', i, u, ai);
            ai++;
            addToArray('activeOrders', u, item, oi);
            oi++;

          //(activeOrders.u).push(item);

          var newprofit = profitCalc(item.openPrice, hiveprice, item.amount, item.margin, item.type);
          if(debug == true){
            log(`newprofit:`);
            log(newprofit);
            log(`Actual HIVE Profit:`);
            log(newprofit / 10000);
          }
          CFDdata.update({profit:newprofit},{where:{id: item.id}});
        } else if (rekt == true){
          CFDdata.update({profit:newprofit, active: false},{where:{id: item.id}});
        }

      });
      process.send(JSON.stringify({
        type:'cfdupdate',
        name:'validcheck',
        payload: JSON.parse(JSON.stringify(arrays))
      }));
  });
  //activeOrders = JSON.parse(JSON.stringify(activeOrders));


  //return resetarrays();
};//END checkValidity

var getFuturesByID = async(id) => {
  if(!id) return false;
  id = parseInt(id);
  var userFutures = [];
  await CFDdata.find({
     //limit: 200,
     where: {id: id},
     order: [[ 'createdAt', 'DESC' ]],
     raw: true
  }).then( async function(entries){
      let userCFD = entries.map(await function(key) {
          return key;
      });
  });
  userCFD = JSON.parse(JSON.stringify(userCFD));
  return userCFD;
};//END getUsersFutures

var getUsersFutures = async(username, active) => {
  if(!username) return false;
  if(!active) active = false;
  var userFutures = [];
  await CFDdata.findAll({
     //limit: 200,
     where: {username: username},
     order: [[ 'createdAt', 'DESC' ]],
     raw: true
  }).then( async function(entries){
      let userPositions = entries.map(await function(key) {
          if (key.id !== -1) {
              delete key.id;
          }
          if (key.userId !== -1) {
              delete key.userId;
          }
          if (key.updatedAt !== -1) {
              delete key.updatedAt;
          }
          if (key.createdAt !== -1) {
              delete key.createdAt;
          }
          if(active === true) {
            if(key.active == false) {
              delete key;
            }
          } else {
            if(key.active == true) {
              delete key;
            }
          }
          return key;
      });

      await userPositions.forEach((item, i) => {
        userFutures.push(item['username']);
      });
  });
  userFutures = JSON.parse(JSON.stringify(userFutures));
  return userFutures;
};//END getUsersFutures

var openCFDContract = async(data) => {
  if(!data) return false;
  if(!data.username || !data.amount || !data.margin || !data.type) return false;
  var cando = canTransactCheck(data.username);
  if(cando == true) {
    canUserTransact[user] = false;
  } else if (cando == false) {
    canUserTransact[user] = false;
  }
  var udata = await userBalanceCheck(data.username);
  log(udata);
  var ubal = udata.balance;
  if(data.amount < 1) return false;
  if(data.amount > ubal) return false;
  if(data.margin < 1 || data.margin > 10) return false;
  data.type = data.type.toLowerCase();
  var pricelongshort;
  if(data.type == 'long'){
    pricelongshort = longHIVEprice;
  } else if (data.type == 'short') {
    pricelongshort = shortHIVEprice;
  } else {
    return false;
  }
  var liquidatePrice = killCalc(pricelongshort, data.amount, data.margin, data.type);
  var spreadfeePrice = spreadProfitCalc(pricelongshort, data.amount, data.margin, data.type);

  var newCFDdata = {userId: udata.userId, orderId: newId(), coin: 'hive', amount: data.amount, openprice: pricelongshort, margin: data.margin, liquidation: liquidatePrice, profit: 0, active: true, spreadfee: spreadfeePrice, commissionfee: 0, overnightfee: 0};

  CFDdata.create(newCFDdata)
  .then(async function() {
    udata.balance -= data.amount;
    await UserData.update({hivebalance: udata.balance, activecfdtrade: udata.activecfdtrade + 1, totalcfdtrade: udata.totalcfd + 1},{where:{name:data.username}});
    t.commit();
    var cfdPayload = {userId: udata.userId, orderId: newId(), username: data.username, coin: 'hive', amount: data.amount, openprice: pricelongshort, margin: data.margin, liquidation: liquidatePrice};
    log(`FUTURES: New CFD Contract from ${data.username} - ${(m.amount / 1000).toFixed(3)} HIVE at $${pricelongshort} with ${m.interest}x Margin with Liquidation Price of ${liquidatePrice}`);
    process.send(JSON.stringify({
      type: 'emit',
      name:'newcfdmade',
      socketid: data.socketid,
      error:null,
      payload: loanPayload,
      token: data.token
    }));
    canUserTransact[user] = true;
  }).catch(function(error) {
    t.rollback();
    console.log(error);
    canUserTransact[user] = true;
  });

};//END openCFDContract;

var closeCFDContract = async(data) => {
  if(!data) return false;
  if(!data.id) return false;
  if(!data.username) return false;
  var fetchedCFDdata = await getFuturesByID(data.id);
  if(fetchedCFDdata == false) return false;
  if(fetchedCFDdata.username != data.username) return false;
  var udata = await userBalanceCheck(fetchedCFDdata.username);
  var contractProfit = (parseFloat(fetchedCFDdata.profit) / 10000);
  log(`contractProfit`)
  log(contractProfit)

CFDdata.update({active: false},{where:{id: data.id}})
  .then(async function() {
    udata.balance -= contractProfit;
    CFDdata.update({hivebalance: udata.balance, activecfdtrade: udata.activecfdtrade + 1, totalcfdtrade: udata.totalcfd + 1},{where:{name:data.username}});

    t.commit();
    var cfdPayload = {userId: udata.userId, orderId: fetchedCFDdata.id, username: fetchedCFDdata.username, coin: 'hive', amount: fetchedCFDdata.amount, profit: contractProfit};
    log(`FUTURES: Close CFD Contract #${data.id} from ${data.username} - ${(m.amount / 1000).toFixed(3)} HIVE at $${pricelongshort} with ${m.interest}x Margin with Liquidation Price of ${liquidatePrice}`);
    process.send(JSON.stringify({
      type: 'emit',
      name:'closecfd',
      socketid: data.socketid,
      error:null,
      payload: cfdPayload,
      token: data.token
    }));
    canUserTransact[user] = true;
  }).catch(function(error) {
    t.rollback();
    console.log(error);
    canUserTransact[user] = true;
  });

};//END closeCFDContract

//calculate the liquidationCheck
function killCalc(open, amount, margin, type){
  if(debug == true) log(`killCalc(${open}, ${amount}, ${margin}, ${type})`)
  var liquidationPrice
  if(!open) return false;
  if(typeof open !='number') return false;
  if(open < 0.000001) return false;
  if(!amount) return false;
  if(typeof amount != 'number') return false;
  if(amount < 1) return false;
  if(!margin) return false;
  if(typeof margin != 'number') return false;
  if(margin < 1 && margin > 10) return false;
  if(!type) return false;
  type = type.toLowerCase();
  if(type != 'long' && type != 'short') return false;
  if(type == 'long') {
    liquidationPrice = (open * margin) / ((margin + 1) + (0.01 * margin));
  } else if (type == 'short') {
    liquidationPrice = (open * margin) / ((margin - 1) + (0.01 * margin));
  } else {
    return false;
  }
  liquidationPrice = liquidationPrice.toFixed(10);
  return liquidationPrice;
};//END killCalc

//calculate the profit for opened contract on spread
function spreadProfitCalc(price, amount, margin, type){
  if(debug == true) log(`spreadProfitCalc(${price}, ${amount}, ${margin}, ${type})`)
  var pricediff;
  var profit;
  if(!price) return false;
  if(typeof price !== 'number') return false;
  if(price < 0.000001) return false;
  if(!amount) return false;
  if(typeof amount !== 'number') return false;
  if(amount < 0.001) return false;
  if(!margin) return false;
  if(typeof margin !== 'number') return false;
  if(margin < 1 || margin > 10) return false;
  if(!type) return false;
  if(type !== 'long' || type !== 'short') return false;

  if(type === 'long') {
    pricediff = price * 0.01;
    profit = pricediff * (amount / 1000);
  } else if (type === 'short') {
    pricediff = price * 0.01;
    profit = pricediff * (amount / 1000);
  } else {
    return false;
  }
  return profit;
};//END spreadProfitCalc

//calculate the profit on a contract
var profitCalc = function(open, close, amount, margin, type){
  if(debug == true) log(`profitCalc(${open}, ${close}, ${amount}, ${margin}, ${type})`)
  var pricediff;
  var profit;
  if(!open) return false;
  open = parseFloat(open);
  if(typeof open != 'number') return false;
  if(open < 0.000001) return false;
  if(!close) return false;
  close = parseFloat(close);
  if(typeof close != 'number') return false;
  //if(close < 0.000001) return false;
  if(!amount) return false;
  amount = parseInt(amount);
  if(typeof amount != 'number') return false;
  if(amount < 1) return false;
  if(!margin) return false;
  margin = parseInt(margin);
  if(typeof margin !== 'number') return false;
  if(margin < 1 || margin > 10) return false;
  //if(!type) return false;
  //if(type != 'long' || type != 'short') return false;

  if(type == 'long') {
    pricediff = close - open;
  } else if (type == 'short') {
    pricediff = open - close;
  } else {
    return false;
  }
    profit = ((pricediff * (amount)) * margin) * 1000;
  //profit = profit.toFixed(8);
  //log(`profitCalc: ${profit}`);
  return profit;
};//END profitCalc

var priceVerify = async(orderPrice, coin) => {
  if(!orderPrice) return false;
  if(typeof orderPrice !== 'number') return false;
  if(orderPrice < 0.000001) return false;
  if(!coin) return false;
  coin = coin.toLowerCase();
  if(!coinWhitelist.includes(coin)){
    log('FUTURES: priceVerify coin type NOT whitelisted!');
    return false;
  };
  var marketPrice = Price.HIVEUSDMarketsAverage();
  marketPrice = marketPrice.price;
  hiveprice = fhap;
  var spread = spreadpercent / 100;
  longHIVEprice = parseFloat((fhap + (fhap * spread)).toFixed(8));
  shortHIVEprice = parseFloat((fhap - (fhap * spread)).toFixed(8));
  if(orderPrice === marketPrice) {
    return true;
  } else {
    return false;
  }
};//END priceVerify



process.on('message', async function(m) {
  var dateNow = (new Date).toUTCString();
  let loanData;
  try {
      m = JSON.parse(m);
      if(debug === false){
        log(`cfdEngine.js Message:`);
        log(m)
      }
      if(m.socketid) {
        sendsocket = m.socketid;
        if(!userSockets.includes(sendsocket)){
          userSockets.push(sendsocket);
        }
      }
  } catch(e) {
    log(`ERROR: ${e}`);
    return console.error(e);
  }
  switch(m.type){
    case 'price':
      if(!m.price) return;
      var PriceChange = priceChange(m.price);
      hiveprice = m.price;
      currentHIVEPrice = m.price;
      checkValidity();

    break;
    case 'update':

    break;
    case 'stats':

    break;
    case 'overnightcheck':

    break;
    case 'open':
      openCFDContract(m.data);
    break;
    case 'close':
      var returnmsg;
      var isclosed = await closeCFDContract(m.data);
      if(isclosed == false){
        returnmsg = "Failed to Close Contract!";
      } else if (isclosed == true){
        returnmsg = `Contract #${m.data.id} Closed Succesfully!`;
      } else {
        returnmsg = "Failed to Close Contract! Unknown Error Occured!";
      }
      process.send(JSON.stringify({
        type: 'emit',
        name:'closecfd',
        socketid: data.socketid,
        error:null,
        payload: loanPayload,
        token: data.token
      }));
    break;
    case 'invest':

    break;
    case 'divest':

    break;
    case 'history':

    break;
    case 'active':

    break;
    case 'total':
    cfdCount();
    break;
    case 'admin':
    if (!m.name) return;
      switch(m.name){
        case 'lock':

        break;
        case 'unlock':

        break;
      }
    break;
  }
});
