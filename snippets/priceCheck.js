const { config } = require("../config/index.js");
let debug = config.debug;
let verbose = config.verbose;
const owner = config.owner;
const fetch = require('node-fetch');
const log = require('fancy-log');
const wcapikey = config.worldcoinkey;
const cmcapikey = config.cmcapikey;
const bncapikey = config.binanceapikey;
const bncapisec = config.binanceapisec;
const Binance = require('node-binance-api');
const BinanceAPI = new Binance().options({
  APIKEY: bncapikey,
  APISECRET: bncapisec,
  useServerTime: true,
  recvWindow: 60000, // Set a higher recvWindow to increase response timeout
  verbose: true, // Add extra output when subscribing to WebSockets, etc
  log: log => {
    console.log(log); // You can create your own logger here, or disable console output
  }
});


BinanceAPI.websockets.candlesticks(['HIVEUSDT'], "1m", (candlesticks) => {
  let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
  let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
  if(debug == true) console.info("Binance "+symbol+" "+interval+" Candlestick Update");
  /*
  console.info("open: "+open);
  console.info("high: "+high);
  console.info("low: "+low);
  console.info("close: "+close);
  console.info("volume: "+volume);
  console.info("isFinal: "+isFinal);
  */
  if(parseFloat(close) == lastBNCHivePrice) {
    if(verbose === true) log(`priceCheck.js: STREAM Same Price - No Update`);
    //lastHaP = hiveAveragePrice;
  } else {
    lastBNCHivePrice = parseFloat(close);
    if(verbose === true) log(`priceCheck.js: STREAM Updated Binance HIVE/USDT Price: $${close}`);
  }
});


const CoinMarketCap = require('coinmarketcap-api');
const cmcClient = new CoinMarketCap(cmcapikey);
const coinWhitelist = require("../config/coinWhitelist.json");

function returnTime(){
  if(debug === true) console.trace(`priceCheck.js returnTime()`);
  var time = new Date();
  /*
  time.toUTCString();
  time = time.toUTCString();
  time = time.slice(17, time.length - 4);
  time = Math.floor(time.getTime() / 1000)
  time.setHours(time.getHours());
  time.setMo(time.getHours());
  time = time.toUTCString();
  time = time.slice(17, time.length - 4);
  */
  return time;
};//END returnTime()

let lastBTCUSDPrice;
let hiveAveragePrice;
let lastBNCHivePrice;
let lastCMCHivePrice;
let lastWCHivePrice;
let lastCGHivePrice;
let lastBTXHivePrice;

//bn == binance.com | cm == coinmarketcap.com | wc == worldcoinindex.com | cg == coingecko.com | bx == bittrex
let priceSourceNameArray = ["bn", "cm", "wc", "cg", "bx"];

let coin;
let lastMarketHivePrice;

var vc = 0

function lastMarketHivePriceAverageCalc() {
  if(debug === true) console.trace(`priceCheck.js lastMarketHivePriceAverageCalc`);
  vc = 0;
  var ap = 0;
  lastMarketHivePrice = [lastBNCHivePrice, lastCMCHivePrice, lastWCHivePrice, lastCGHivePrice, lastBTXHivePrice];
  if(debug == true || verbose == true) {
    log(`lastMarketHivePrice:`);
    log(lastMarketHivePrice);
  }
  lastMarketHivePrice.forEach((item, i) => {
    if(!item || item === undefined) return;
    item = parseFloat(item);
    if(typeof item === 'number' && item != NaN){
      if(debug === true) log(item);

      vc++;
      ap += item;
      if(i === lastMarketHivePrice.length - 1) {
        ap = ap / vc;
        if(debug == true) {
          log(`priceCheck.js: lastMarketHivePriceCalc Average HIVE/USD Price: (Sources: ${vc}): ${ap}`);
        }
        hiveAveragePrice = ap;
        return ap;
      }
    }
  });
};//END lastMarketHivePriceAverageCalc

lastMarketHivePriceAverageCalc();

/*
setInterval(function() {
  hiveAveragePrice = lastMarketHivePriceAverageCalc();
}, 1000);
*/

var lastHaP;
module.exports.HIVEUSDMarketsAverage = () => {
  if(debug === true) console.trace(`priceCheck.js HIVEUSDMarketsAverage`);
  lastMarketHivePriceAverageCalc();
  var ourDate = returnTime();
  if(lastHaP == hiveAveragePrice) {
    lastHaP = hiveAveragePrice;
    if(debug == true || verbose == true) log(`priceCheck.js: HIVEUSDMarketsAverage - SAME PRICE: ${hiveAveragePrice} - Sources: ${vc}`);
    return {price: hiveAveragePrice, sourcecount: vc, date: ourDate};//JSON.stringify(hiveAveragePrice);
  } else {
    lastHaP = hiveAveragePrice;
    if(debug == true || verbose == true) log(`priceCheck.js: HIVEUSDMarketsAverage - hiveAveragePrice: ${hiveAveragePrice} - Sources: ${vc}`);
    return {price: hiveAveragePrice, sourcecount: vc, date: ourDate};//JSON.stringify(hiveAveragePrice);
  }
};

async function bpc() {
  if(debug === true) console.trace(`priceCheck.js bpc()`);
  var coin = 'HIVE';
  var bncURL = `https://api.binance.com/api/v3/avgPrice?symbol=${coin}USDT`;
    await fetch(bncURL).then(res => res.json()).then(json => {
      if(debug === true) log(json);
      if(debug === true) log(`priceCheck.js: bpc: ${JSON.parse(json)}`)
      if(lastBNCHivePrice != parseFloat(json.price)) {
        lastBNCHivePrice = parseFloat(json.price);
        if(verbose === true) log(`priceCheck.js: 'bpc()' Updated Binance HIVE/USD Price: $${lastBNCHivePrice}`);
      } else {
        if(verbose === true) log(`priceCheck.js: 'bpc()' SAME PRICE DETECTED HIVE/USD. No Update!`);
      }
    }).catch(function (error) {
      if(debug === true) log("priceCheck.js: bpc ERROR: " + error);
      return false;
    });
};
bpc();

async function cmcpc() {
  if(debug === true) console.trace(`priceCheck.js cmcpc()`);
  var coin = 'HIVE';
  cmcClient.getQuotes({symbol: `${coin}`}).then(data => {
    data = data.data[`${coin}`];
    if(debug === true) console.log(data);
    var quoteData = data.quote;
    quoteData = quoteData['USD'];
    if(lastCMCHivePrice != parseFloat(quoteData.price)) {
      lastCMCHivePrice = parseFloat(quoteData.price);
      if(verbose === true) log(`priceCheck.js: 'cmcpc()' Updated CoinMarketCap HIVE/USD Price: $${lastCMCHivePrice}`);
    } else {
      if(verbose === true) log(`priceCheck.js: 'cmcpc()' SAME PRICE DETECTED HIVE/USD. No Update!`);
    }
  }).catch(error => {
    if(debug === true) log(`priceCheck.js: cmcpc ERROR: ${error}`);
    return false;
  });
};
cmcpc();

async function cwpc() {
  if(debug === true) console.trace(`priceCheck.js cwpc()`);
  var coin = 'hive';
  var coinworldURL = `https://www.worldcoinindex.com/apiservice/ticker?key=${wcapikey}&label=${coin}usdt-${coin}btc&fiat=usdt"`;
  await fetch(coinworldURL).then(res => res.json()).then(json => {
    json = JSON.parse(JSON.stringify(json));
    json = json.Markets;
    if(debug === true) log(`priceCheck.js: wcpricecheck ${json}`);
    if(lastWCHivePrice != parseFloat(json[0].Price)) {
      lastWCHivePrice = parseFloat(json[0].Price);
      if(verbose === true) log(`priceCheck.js: 'cwpc()' Updated CoinWorldIndex HIVE/USD Price: $${lastWCHivePrice}`);
    } else {
      if(verbose === true) log(`priceCheck.js: 'cwpc()' SAME PRICE DETECTED HIVE/USD. No Update!`);
    }
  }).catch(function (error) {
    if(debug === true) log("priceCheck.js: cwpc ERROR: " + error);
    return false;
  });
};
cwpc();

async function cgpc() {
  if(debug === true) console.trace(`priceCheck.js cgpc()`);
  coin = "hive%2Chive_dollar%2Cbitcoin";
  var coingeckoURL = "https://api.coingecko.com/api/v3/simple/price?ids=" + coin + "&vs_currencies=usd%2Cbtc";
  await fetch(coingeckoURL).then(res => res.json()).then(json => {
    if(debug === true) log(json);
    if(lastCGHivePrice != parseFloat(json.hive.usd)) {
      lastCGHivePrice = parseFloat(json.hive.usd);
      if(verbose === true) log(`priceCheck.js: 'cgpc()' Updated CoinGecko HIVE/USD Price: $${lastCGHivePrice}`);
    } else {
      if(verbose === true) log(`priceCheck.js: 'cgpc()' SAME PRICE DETECTED HIVE/USD. No Update!`);
    }
    if(parseFloat(lastBTCUSDPrice) != parseFloat(json.bitcoin.usd)) {
      lastBTCUSDPrice = json.bitcoin.usd;
      if(verbose === true) log(`priceCheck.js: 'cgpc()' Updated CoinGecko BTC/USD Price: $${lastBTCUSDPrice}`);
    } else {
      if(verbose === true) log(`priceCheck.js: 'cgpc()' SAME PRICE DETECTED BTC/USD. No Update!`);
    }
  }).catch(function (error) {
  if(debug === true) log("priceCheck.js: cgpc ERROR: " + error);
    return false;
  });
};
cgpc();

async function btxpc() {
  if(debug === true) console.trace(`priceCheck.js btxpc()`);
  coin = "HIVE-BTC";
  var coingeckoURL = "https://api.bittrex.com/v3/markets/" + coin + "/ticker";
  await fetch(coingeckoURL).then(res => res.json()).then(json => {
    if(debug === true) log(json);
    if(!lastBTCUSDPrice) return false;
    var hivePrice = parseInt(lastBTCUSDPrice) * parseFloat(json.lastTradeRate);
    if(lastBTXHivePrice != parseFloat(hivePrice)) {
      lastBTXHivePrice = parseFloat(hivePrice);
        if(verbose === true) log(`priceCheck.js: 'btxpc()' Updated Bittrex HIVE/USD Price: $${lastBTXHivePrice}`);
    } else {
      if(verbose === true) log(`priceCheck.js: 'btxpc()' SAME PRICE DETECTED. No Update!`);
    }
  }).catch(function (error) {
  if(debug === true) log("priceCheck.js: cgpc ERROR: " + error);
    return false;
  });
};
btxpc();

var priceScraperFast = setInterval(function(){
  //bpc();
  bpc();
  btxpc();
}, 1000);

var priceScraperNormal = setInterval(function(){
  cgpc();
  //btxpc();
}, 5000);

var priceScraperSlow = setInterval(function(){
//btxpc();
}, 15000);

var priceScraperOneMin = setInterval(function(){
  cmcpc();
}, 60000);

var priceScraperFiveMin = setInterval(function(){
  cwpc();
}, 300000);


// https://api.bittrex.com/v3/markets/{marketSymbol}
// https://api.bittrex.com/v3/markets/{marketSymbol}/summary


module.exports.bncpricecheck = async(coin) => {
  if(debug === true) console.trace(`priceCheck.js module.exports.bncpricecheck()`);
  var response = [];
  if(coin == undefined) {
    coin = "hive";
  } else {
    coin = coin.toLowerCase();
    //log(coinWhitelist);
    //log(coin);
    if(!coinWhitelist.includes(coin)){
      if(debug === true) log(`priceCheck.js: module.exports.bncpricecheck ${coin} type NOT whitelisted!`);
      return false;
    }
  }
  coin = coin.toUpperCase();
  var bncURL = `https://api.binance.com/api/v3/avgPrice?symbol=${coin}USDT`;
    await fetch(bncURL).then(res => res.json()).then(json => {
      if(debug === true) log(json);
      response.push(json, {date: returnTime()});
      if(debug === true) log(`priceCheck.js: module.exports.bncpricecheck: ${JSON.parse(json)}`)
      lastBNCHivePrice = parseFloat(json.price);
    }).catch(function (error) {
      if(debug === true) log("priceCheck.js: module.exports.bncpricecheck ERROR: " + error);
      return false;
    });
    if(response){
      return response;
    }
};

module.exports.cmcpricecheck = async(coin) => {
  if(debug === true) console.trace(`priceCheck.js module.exports.cmcpricecheck()`);
  var response = [];
  if(coin == undefined) {
    coin = "HIVE";
  } else {
    if(debug === true) log(coinWhitelist);
    if(!coinWhitelist.includes(coin)){
      if(debug === true) log(`priceCheck.js: module.exports.cmcpricecheck ${coin} type NOT whitelisted!`);
      return false;
    }
  }
coin = coin.toUpperCase();
  hivefetchgo = true;
  cmcClient.getQuotes({symbol: `${coin}`}).then(data => {
    data = data.data[`${coin}`];
    console.log(data);
    var quoteData = data.quote;
    quoteData = quoteData['USD'];
  //console.log(quoteData);
    var pricepayload = {
      name: data.symbol,
      price: quoteData.price,
      total_supply: data.total_supply,
      volume_24h: quoteData.volume_24h,
      percent_change_1h: quoteData.percent_change_1h,
      percent_change_24h: quoteData.percent_change_24h,
      percent_change_7d: quoteData.percent_change_7d,
      percent_change_30d: quoteData.percent_change_30d,
      percent_change_60d: quoteData.percent_change_60d,
      percent_change_90d: quoteData.percent_change_90d,
      market_cap: quoteData.market_cap,
      last_updated: quoteData.last_updated
    };
    response.push(pricepayload);
    lastCMCHivePrice = quoteData.price;
  }).catch(error => {
    if(debug === true) log(`priceCheck.js: module.exports.cmcpricecheck ERROR: ${error}`);
    return false;
  });
  if(response) {
     if(debug === true) log(response)
    return response;
  }
};

module.exports.wcpricecheck = async(coin) => {
  if(debug === true) console.trace(`priceCheck.js module.exports.wcpricecheck()`);
    var response = [];
      if(debug === true) log(`priceCheck.js: WorldCoinIndex.com module.exports.wcpricecheck Price Check of ${coin} Called...`);
      if(coin == undefined) {
        coin = "hive";
      } else {
        if(!coinWhitelist.includes(coin)){
          if(debug === true) log(`priceCheck.js: module.exports.wcpricecheck ${coin} type NOT whitelisted!`);
          return false;
        }
        coin = coin.toLowerCase();
      }
    //`https://www.worldcoinindex.com/apiservice/ticker?key=${wcapikey}&label=${coin}btc-${coin}btc&fiat=btc`;
    var coinworldURL = `https://www.worldcoinindex.com/apiservice/ticker?key=${wcapikey}&label=${coin}usdt-${coin}btc&fiat=usdt"`;
    await fetch(coinworldURL).then(res => res.json()).then(json => {
      json = JSON.parse(JSON.stringify(json));
      json = json.Markets;
      if(debug === true) log(`module.exports.wcpricecheck ${json}`);
      response.push(json, {date: returnTime()});
      lastWCHivePrice = json[0].Price;
    }).catch(function (error) {
      if(debug === true) log("priceCheck.js: module.exports.wcpricecheck ERROR: " + error);
      return false;
    });
    if(response){
      return response;
    }
};

module.exports.cgpricecheck = async(coin) => {
  if(debug === true) console.trace(`priceCheck.js module.exports.wcpricecheck()`);
  var response = [];
  if(coin == undefined) {
    coin = "hive%2Chive_dollar%2Cbitcoin";
  } else {
    coin = coin.toLowerCase();
    if(!coinWhitelist.includes(coin)){
      if(debug === true) log(`priceCheck.js: module.exports.cgpricecheck  ${coin} type NOT whitelisted!`);
      return false;
    }
  }
    //coin = coin.toLowerCase();
    var coingeckoURL = "https://api.coingecko.com/api/v3/simple/price?ids=" + coin + "&vs_currencies=usd%2Cbtc";
    await fetch(coingeckoURL).then(res => res.json()).then(json => {
      if(debug === true) log(json);
      response.push(json, {date: returnTime()});
      lastCGHivePrice = json.hive.usd;
    }).catch(function (error) {
    if(debug === true) log("priceCheck.js: module.exports.cgpricecheck  ERROR: " + error);
      return false;
    });
    if(response){
      return response;
    }
};
