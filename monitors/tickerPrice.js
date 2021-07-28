const { config } = require("../config/index.js");
let debug = config.debug;
const owner = config.owner;
const log = require('fancy-log');
const CoinMarketCap = require('coinmarketcap-api');
let Price = require("../snippets/priceCheck.js");
const fetch = require('node-fetch');
const apiKey = config.cmcapikey;
const nomicsapikey = config.nomicsapikey;
const client = new CoinMarketCap(apiKey);

function returnTime(){
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
}

var hivecmcqoute;
var hivefetchgo = false;
var hbdcmcqoute;
var hbdfetchgo = false;
let enablebackupticker = false;
let enablebackupbackupticker = false;
var userSockets = [];

var online = process.connected;
var pid = process.pid;

log(`TICKER: Connected: ${online} with PID: ${pid}`);

async function HiveNomicsMarketFetch() {
  if(debug == true) log(`HiveNomicsMarketFetch()`);
  try {
    await fetch(`https://api.nomics.com/v1/currencies/ticker?${nomicsapikey}&ids=HIVE&interval=1h,1d,7d,30d&convert=USD&per-page=100&page=1`)
    .then(res => res.json()).then(json => {
      console.log(`HiveNomicsMarketFetch data:`);
      console.log(json);
      //response = json["hive"];
      //var hiveprice = parseFloat(response["usd"]);
      var hourdata = json["1h"];
      var daydata = json["1d"];
      var weekdata = json["7d"];
      var monthdata = json["30d"];
      var pricepayload = { //json;
        name: json.currency,
        price: json.market_data.current_price['usd'],
        total_supply: json.circulating_supply,
        volume_24h: daydata.volume,
        percent_change_1h: hourdata.price_change_pct,
        percent_change_24h: daydata.price_change_pct,
        percent_change_7d: weekdata.percent_change_percentage_7d,
        percent_change_30d: monthdata.percent_change_30d,
        //percent_change_60d: json.percent_change_60d,
        //percent_change_90d: json.price_change_percentage_200d / 2,
        market_cap: json.market_cap,
        last_updated: returnTime,
        backup: true
      };

      process.send(JSON.stringify({
        type: 'massemit',
        name:'hivepriceupdate',
        error: null,
        payload: pricepayload
      }));

    }).catch(function(error) {
      enablebackupticker = false;
      enablebackupbackupticker = false;
      log("TICKER ERROR: " + error);
      log(`Switching to Backup Ticker Feed (CoinGecko.com)`);
    });
  } catch(e) {
    enablebackupticker = false;
    enablebackupbackupticker = false;
    log(`TICKER ERROR: ${e}`);
    log(`Switching to Backup Ticker Feed (CoinGecko.com)`);
  };
};

async function HiveCGMarketFetch() {
  if(debug == true) log(`HiveCGMarketFetch()`);
  try {
    await fetch('https://api.coingecko.com/api/v3/coins/hive?tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false')
    .then(res => res.json()).then(json => {
      if(debug == true) {
        console.log(`HiveCGMarketFetch data:`);
        console.log(json);
      }

      //response = json["hive"];
      //var hiveprice = parseFloat(response["usd"]);
      var pricepayload = { //json;
        name: json.symbol,
        price: json.market_data.current_price['usd'],
        total_supply: json.total_supply,
        volume_24h: json.volume_24h,
        percent_change_1h: json.percent_change_percentage_1h,
        percent_change_24h: json.percent_change_percentage_24h,
        percent_change_7d: json.percent_change_percentage_7d,
        percent_change_30d: json.percent_change_30d,
        percent_change_60d: json.percent_change_60d,
        percent_change_90d: json.price_change_percentage_200d / 2,
        market_cap: json.market_cap['usd'],
        last_updated: returnTime,
        backup: true
      };

      process.send(JSON.stringify({
        type: 'massemit',
        name:'hivepriceupdate',
        error: null,
        payload: pricepayload
      }));

    }).catch(function(error) {
      enablebackupticker = true;
      enablebackupbackupticker = false;
      log("TICKER ERROR: " + error);
      log(`Switching to Backup Ticker Feed (CoinMarketCap.com)`);
    });
  } catch(e) {
    enablebackupticker = true;
    enablebackupbackupticker = false;
    log(`TICKER ERROR: ${e}`);
    log(`Switching to Backup Ticker Feed (CoinMarketCap.com)`);
  };
};//END

HiveCGMarketFetch();

var coinGeckoMarketFetchTimer = setInterval(function(){
  if(enablebackupticker == false){
    HiveCGMarketFetch();
  } else if (enablebackupticker == true){
    hiveCMCprice();
  } else if(enablebackupbackupticker == true){
    HiveNomicsMarketFetch();
  }
}, 30000);

async function hiveCMCprice() {
  hivefetchgo = true;
  client.getQuotes({symbol: 'HIVE'}).then(data => {
    if(debug == true){
      console.log(`hiveCMCprice data:`);
      console.log(data);
    }
    data = data.data['HIVE'];
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

    process.send(JSON.stringify({
      type: 'massemit',
      name:'hivepriceupdate',
      error: null,
      payload: pricepayload
    }));

  }).catch(error => {
    log(`TICKER: ERROR: ${error}`);
    enablebackupticker = false;
    enablebackupbackupticker = true;
  });
}


process.on("message", function(m){
  var sendsocket;
  try {
      m = JSON.parse(m);
      log(`futuresPrice.js Message:`);
      log(m)
      if(m.socketid) {
        sendsocket = m.socketid;
        if(!userSockets.includes(sendsocket)){
          userSockets.push(sendsocket);
        }
      }
  } catch(e) {
    log(`TICKER: process.on("message") ERROR: ${e}`);
    return console.error(e);
  }
  switch(m.type) {
    case 'hivespotprice':
      hiveCMCprice();
    break;
    case 'hbdspotprice':
      hbdCMCprice();
    break;
  }
});

  /*
var backupfeed = async() => {
//return HiveCGMarketFetch();
  try {
    await fetch('https://api.coingecko.com/api/v3/simple/price?ids=hive&vs_currencies=usd%2Cbtc')
    .then(res => res.json()).then(json => {
      response = json["hive"];
      var hiveprice = parseFloat(response["usd"]);
      var pricepayload = {
        price: hiveprice,
      };
      process.send(JSON.stringify({
        type: 'massemit',
        name:'hivepriceupdatebackup',
        error: null,
        payload: pricepayload
      }));
    }).catch(function (error) {
      log("Error: " + error);
    });
  } catch(e) {
    log(`pricefetch error: ${e}`)
  }
};
*/

/*
function hbdCMCprice() {
  client.getQuotes({symbol: 'HBD'}).then(data => {data = JSON.stringify(data.data); log(data
  );}).catch(console.error);
  setTimeout(function() {
    hbdCMCprice();
  }, 300000)
};
*/
//hbdCMCprice();

process.send({

});
