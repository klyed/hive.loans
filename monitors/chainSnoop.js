const io = require("socket.io");
const socket = io();
const { config } = require("../config/index.js");
let debug = config.debug;
const owner = config.owner;
const hotwallet = config.hotwallet;
const coldwallet = config.coldwallet;
var refunds = config.refunds;
var verbose = config.verbose;
var stdoutblocks = config.stdoutblocks;
var voteclone = config.votemirror;
var unsupportedAutoRefund = config.unsupportautorefund;
var crypto = require("crypto");
var hive = require("@hiveio/hive-js");
var log = require("fancy-log");
var fetch = require("node-fetch");
const auth = require("../snippets/auth.js");
const DB = require("../database/models");
const sequelize = DB.sequelize;
const DataBase = sequelize;
const UserData = DataBase.models.Users;
const DepositData = DataBase.models.Deposits;
const LoanData = DataBase.models.Loans;
const ChainData = DataBase.models.Blockchain;

var online = process.connected;
var pid = process.pid;
var hotWalletData;
var coldWalletData;
let adminskipsync = false;
let skipsyncnow = false;

log(`CHAIN: Connected: ${online} with PID: ${pid}`);

Object.defineProperty(global, '__stack', {
get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__line', {
get: function() {
        return __stack[1].getLineNumber();
    }
});

Object.defineProperty(global, '__function', {
get: function() {
        return __stack[1].getFunctionName();
    }
});

//specify 24 hours / one day in milliseconds
const oneday = 60 * 60 * 24 * 1000;

let scanrate = 0;
let synced = false;
const version = config.version;
const apinodes = ["hived.privex.io", "api.hivekings.com", "api.deathwing.me", "api.hive.blog", "api.openhive.network", "hive.roelandp.nl", "hive-api.arcange.eu", "rpc.ausbit.dev", "anyx.io"];
//hive.api.setOptions({ url: "https://api.hivekings.com" });//http://185.130.44.165/
hive.api.setOptions({ url: "https://api.deathwing.me" });

let apiindex = 0;
let scanOn = false;
let wallet = hotwallet;
const wif = config.wif;
const mintransfer = 0.001;
let lastSafeBlock;
let lastHeadBlock;
let blockNum;
var recentblock;
var newCurrentBlock = 0;
var oldOpsCount = 0;

var bytesParsed = 0;
let parseOn = false;
const metadata = {
    app: `hive.loans`,
};

var fetchAccountHive = async (user) => {
    log(`CHAIN: fetchAccountHive(${user})`);
    if(!user) return "No User Specified";
      log(`getHivePower Called!`);
      var resultData = await hive.api.callAsync('condenser_api.get_accounts', [[`${user}`]]).then((res) => {
        return JSON.parse(JSON.stringify(res))
      }).catch((e) =>  {
        log(err);
        changenode();
      });
      return resultData;
};

var fetchAccountHbd = async (user) => {
    log(`CHAIN: fetchAccountHbd(${user})`);
    if(!user) return "No User Specified";
      log(`getHivePower Called!`);
      var resultData = await hive.api.callAsync('condenser_api.get_accounts', [[`${user}`]]).then((res) => {
        return JSON.parse(JSON.stringify(res))
      }).catch((e) =>  {
        log(err);
        changenode();
      });
      return resultData;
};

var dbconnect = async() => {
  await auth.startup().then(reply => {
    if(debug == true) log(reply);
      return reply;
    }).catch(e => {
   log(e)
  });
};//END dbconnect


//fetch the last saved block in database
var fetchLastBlockDB = async() => {
  log(`CHAIN: Connect to DB for Last Scanned Block`);
    var thedata = await ChainData.findOne({where:{id:1}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
    return thedata['siteblock'];
};//END fetchLastBlockDB

//fetch a specified database
var fetchUserDBQuery = async (table, name) => {
    log(`SOCKET: fetchUserDBQuery(${table}, ${name})`);
    await DataBase.query("SELECT `" + name + "` FROM `" + table + "`", { type: sequelize.QueryTypes.SELECT })
        .then((result) => {
            log(result);
            return result;
        })
        .catch((err) => {
            console.log(err);
        });
};//END fetchUserDBQuery

//fetch last safe or confirmed 100% block
var fetchSafe = async() => {
  hive.api.getDynamicGlobalProperties(await function (err, result) {
      if(err) {
        log(err);
        changenode();
      }
      if (result) {
        result = JSON.parse(JSON.stringify(result));
          lastSafeBlock = parseInt(result["last_irreversible_block_num"]);
          return lastSafeBlock;
          //return result["last_irreversible_block_num"];
      }
  });
};//END fetchsafe

//fetch absolute latest head block number
var fetchHead = async() => {
  hive.api.getDynamicGlobalProperties(await function (err, result) {
      if(err) {
        log(err);
        changenode();
      }
      if (result) {
          result = JSON.parse(JSON.stringify(result));
          lastHeadBlock = parseInt(result["head_block_number"]);
          return lastHeadBlock;
          //return result["last_irreversible_block_num"];
      }
  });
};//END fetchHead

//save the absolute latest head block number to database
var saveHeadBlock = async() => {
  hive.api.getDynamicGlobalProperties(await function (err, result) {
      if(err) {
        log(err);
        changenode();
      }
      if (result) {
          result = JSON.parse(JSON.stringify(result));
          return saveHead(result["head_block_number"]);
      }
  });
}

//write the specified block in the database
function saveBlock(blockSave) {
  ChainData.update({siteblock: blockSave, synced:synced},{where:{id:1}});
}

//write the sspecified head block to database
function saveHead(blockSent) {
  ChainData.update({headblock: blockSent, synced:synced},{where:{id:1}});
}

//return bytes as human readable strings
function formatByteSizeDisplay(bytes) {
    if(bytes < 1024) return bytes + " bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MB";
    else return(bytes / 1073741824).toFixed(3) + " GB";
};

//get the size of an array in bytes
function byteSize(obj) {
    var bytes = 0;
    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
      return bytes;
    };
    return formatByteSize(sizeOf(obj));
};//END bytesize

//fetch the current time as a human readable string
function returnTime(){
  var time = new Date();
  time.setHours(time.getHours() + 18);
  time = (time).toUTCString();
  time = time.slice(17, time.length - 4);
  return time;
}

async function skipsync() {
  if (blockNum < lastHeadBlock){
    log(`CHAIN: ADMIN: skipsync() set blockNum to lastHeadBlock`);
    recentblock = await fetchHead();
    blockNum = await fetchHead();
    //scanOn = false;
    //synced = true;
    newCurrentBlock = blockNum;
    blockNum = lastHeadBlock;
    skipsyncnow = true;
    adminskipsync = true;
    await saveHead(lastHeadBlock);
    await saveBlock(lastHeadBlock);
    parseOn = false;
    process.send(JSON.stringify({type: 'blockupdate', block: blockNum, behind: (lastHeadBlock - blockNum), synced:synced}));

    parseBlock(blockNum, true);

    return true;
  } else {
    log(`CHAIN: ADMIN: skipsync() blockNum >= lastHeadBlock`);
    return true;
  }
};

async function changenode() {
  if (apiindex < apinodes.length){
    apiindex++;
  } else if (apiindex == apinodes.length) {
    apiindex = 0;
  }
  log(`CHAIN: Changed API Node to ${apinodes[apiindex]}`);
  await hive.api.setOptions({ url: `https://${apinodes[apiindex]}` });
}

async function grabAcct(u) {
  var v = "";
  if (u == config.hotwallet){
    v = "Hot Wallet";
  }
  if (u == config.coldwallet){
    v = "Cold Wallet";
  }
  if(debug == true) log(`CHAIN: Fetching ${v} Account @${u}`);
  var acctData = await hive.api.callAsync('condenser_api.get_accounts', [[`${u}`]]).then((res) => {return JSON.parse(JSON.stringify(res))}).catch((e) => log(e));
  return acctData;
}
//changenode();

//DEPOSIT SHIT
var DepositToAccount = async(uid, depositamt, type, depositID, tx, block, transaction, promo) => {
  var uData;
  var txData;
  if(promo === true){
  DepositData.create({userId:'1', username: uid, block: block, txid: deposittxid, amount: depositamt, coin: type, confirms: 1, confirmed: false});

  } else if(promo === false){
    try {
      tx = JSON.parse(JSON.stringify(transaction));
      //log(`tx:`);
      //log(tx);
    } catch(e){
      log(`failed to parse tx!`);
      log(e);
    }
    var DepositID;

    var deposittxid = tx.trx_id;

    if (depositID === 'new'){
      DepositID = crypto.randomBytes(16).toString('hex');
    }

    log(`DepositToAccount(${uid}, ${depositamt}, ${type}, ${depositID}, ${tx}, ${block}, ${transaction}))`);
    log(tx);
    log(`deposittxid: ${deposittxid}`);

    let userCheck = await UserData.findOne({where:{address:`${uid}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
    if (userCheck === null) {
      return log('Error: Faucet failed to fetch users statistics!');
    } else {
      uData = JSON.parse(JSON.stringify(userCheck));//.map(function(userNameCheck){ return userNameCheck.toJSON()});
      log(`DEPOSIT: User ${uData.username} owns address ${uid}`);
    }

    let txCheck = await DepositData.findOne({where:{txid:`${deposittxid}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
    if (txCheck === null) {
      log('CHAIN: txCheck did not find a deposit with this txid! Creating one now!');
      await DepositData.create({userId:uData.id, username: uData.username, block: block, txid: deposittxid, amount: depositamt, coin: type, confirms: 1, confirmed: false});
        async function UpdateBalance(amount, type){
          log(`UpdateBalance(${amount}, ${type}) fired`);
          if(type == 'HIVE'){
            var newBalance = parseInt(uData.hivebalance + depositamt);
            sequelize.transaction().then(async function(t) {
                await UserData.update({hivebalance:newBalance},{where:{userId:`${uData.id}`}})
                .then(async function() {
                    t.commit();
                      await DepositData.update({confirmed: true},{where:{txid:deposittxid}});
                    log("CHAIN: Deposit of " + parseFloat(depositamt / 1000).toFixed(3) +  " " + type + " added to " + uData.username + " account");
                    return process.send(JSON.stringify({type:'depositconfirmed', balance:newBalance, user:uData.username, txid: deposittxid, amount: depositamt, coin: type}));
                }).catch(function(error) {
                    t.rollback();
                    console.log(error);
                });
            });
          }
          if (type == 'HBD'){
                  var newBalance = parseInt(uData.hbdbalance + depositamt);
            sequelize.transaction().then(async function(t) {
                await UserData.update({hbdbalance:newBalance},{where:{userId:`${uData.id}`}})
                .then(async function() {
                    t.commit();

                      await DepositData.update({confirmed: true},{where:{txid:deposittxid}});
                    log("CHAIN: Deposit of " + parseFloat(depositamt / 1000).toFixed(3) +  " " + type + " added to " + uData.username + " account");
                    return process.send(JSON.stringify({type:'depositconfirmed', balance:newBalance, user:uData.username, txid: deposittxid, amount: depositamt, coin: type}));
                }).catch(function(error) {
                    t.rollback();
                    console.log(error);
                });
            });
          }
        }
        UpdateBalance(depositamt, type);

    } else {
      return log(`CHAIN: ERROR: THIS DEPOSIT ALREADY EXISTS!`);
    }
  } else {
  log(`CHAIN: Deposit Promo status was not defined!`);
  }
};//END DepositToAccount


var stallBlock;

setInterval(function(){
  //log(stallBlock);
  //log(newCurrentBlock)
  if(synced == false) {
    if(!stallBlock) {
      stallBlock = newCurrentBlock;
    } else if(stallBlock == newCurrentBlock){
      log(`CHAIN: RPC STALL: SWITCHING NODES`);
      changenode();
      //parseBlock(blockNum)
    }
  } else if(synced == true) {
    if(!stallBlock) {
      stallBlock = blockNum;
    } else if(stallBlock == blockNum){
      stallBlock = blockNum;
      //log(`CHAIN: RPC STALL: SWITCHING NODES`);
      //changenode();
      //parseBlock(blockNum)
    } else if (stallBlock > blockNum) {

    }
  } else {
    if(!stallBlock) {
      stallBlock = blockNum;
    }
    stallBlock = blockNum;
  }
}, 15000);

let dailyOpScanArray = [];

let opscan = 0;
let transferscan = 0;
let votescan = 0;
let customjsonscan = 0;
let rewardclaimscan = 0;
let feedpubscan = 0;
let transferFound = 0;
let voteFound = 0;
let delayvotescan = 0;
let delegationscan = 0;
let returndelegationcan = 0;
let commentscan = 0;
let transfertovestingscan = 0;
let createclaimedaccountscan = 0;
let claimaccountscan = 0;
let witnesspayscan = 0;
let proposalpayscan = 0;
let updatepropscan = 0;
let consolidatescan = 0;
let spsfundscan = 0;
let curaterewardscan = 0;
let authorrewardscan = 0;
let commentbenerewardscan = 0;
let commentrewardscan = 0;
let commentpayoutscan = 0;
let commentoptionsscan = 0;
let changerecoveryscan = 0;
let accountupdatescan = 0;
let accountupdatetwoscan = 0;
let fillvestwdscan = 0;
let limitordercreatescan = 0;
let limitordercancelscan = 0;
let fillorderscan = 0;
let acctwitnessvotescan = 0;
let setwitpropscan = 0;
let convertscan = 0;
let fillconvertscan = 0;
let oldnonce = 0;
var nonce = 0;
let transfersavingsscan = 0;
let withdrawvestingscan = 0;
let interestscan = 0;
let deletecommentscan = 0;
let transferfrombankscan = 0;
let recoverscan = 0;
let filltransferfrombankscan = 0;
let createproposalscan = 0;

//searches blockchain for core operations used by the site
function coreOps(action, transaction){
  const data = transaction;
  let operation = transaction.op;
  const op = {
        action: action,
        data: data,
        };
  switch (action) {
    case 'transfer':
      transferscan++;
      var transferinfo = op.data["op"];
      var transfersender = transferinfo[1].to;
      //log(transfersender + " "  + transferscan);
      if (transfersender === config.appName) {
        process_transfer(transaction, transferinfo);
     }
    break;
    case 'vote':
      votescan++;
      if (operation.voter === config.owner) {
        //voteFound++;
        log(`VOTE FROM KLYE DETECTED`);
        process_vote(operation);
      }
    break;
    case 'proposal_pay':
      proposalpayscan++;
      if(operation.receiver === 'hive.loans') {
        log(`PROPOSAL PAY DETECTED - ROUTING TO KLYE`);
        routeProposalPay(operation);
      }
    break;
  }
};

//searches blockchian for all other operations
function blockOpFoo(action){
  switch (action) {
    case 'comment_reward':
       commentrewardscan++;
    break;
    case 'author_reward':
       authorrewardscan++;
    break;
    case 'curation_reward':
       curaterewardscan++;
    break;
    case 'comment_benefactor_reward':
       commentbenerewardscan++;
    break;
    case 'custom_json':
       customjsonscan++;
    break;
    case 'producer_reward':
       witnesspayscan++;
    break;
    case 'comment_payout_update':
       commentpayoutscan++;
    break;
    case 'comment_options':
       commentoptionsscan++;
    break;
    case 'claim_reward_balance':
       rewardclaimscan++;
    break;
    case 'feed_publish':
       feedpubscan++;
    break;
    case 'delegate_vesting_shares':
       delegationscan++;
    break;
    case 'return_vesting_delegation':
       returndelegationcan++;
    break;
    case 'comment':
       commentscan++;
    break;
    case 'fill_vesting_withdraw':
       fillvestwdscan++;
    break;
    case 'limit_order_create':
       limitordercreatescan++;
    break;
    case 'limit_order_cancel':
       limitordercancelscan++;
    break;
    case 'fill_order':
       fillorderscan++;
    break;
    case 'account_witness_vote':
       acctwitnessvotescan++;
    break;
    case 'witness_set_properties':
       setwitpropscan++;
    break;
    case 'convert':
       convertscan++;
    break;
    case 'fill_convert_request':
       fillconvertscan++;
    break;
    case 'REPLACE':
       replacescan++;
    break;
    case 'transfer_to_savings':
       transfersavingsscan++;
    break;
    case 'delayed_voting':
       delayvotescan++;
    break;
    case 'transfer_to_vesting':
       transfertovestingscan++;
    break;
    case 'create_claimed_account':
       createclaimedaccountscan++;
    break;
    case 'claim_account':
       claimaccountscan++;
    break;
    case 'account_update':
       accountupdatescan++;
    break;
    case 'account_update2':
       accountupdatetwoscan++;
    break;
    case 'update_proposal_votes':
       updatepropscan++;
    break;
    case 'consolidate_treasury_balance':
       consolidatescan++;
    break;
    case 'sps_fund':
       spsfundscan++;
    break;
    case 'change_recovery_account':
      changerecoveryscan++;
    break;
    case 'withdraw_vesting':
      withdrawvestingscan++;
    break;
    case 'transfer_from_savings':
      transferfrombankscan++;
    break;
    case 'delete_comment':
      deletecommentscan++;
    break;
    case 'interest':
      interestscan++;
    break;
    case 'recover_account':
      recoverscan++;
    break;
    case 'fill_transfer_from_savings':
      filltransferfrombankscan++;
    break;
    case 'create_proposal':
      createproposalscan++;
    break;
    default:
    if(action !== 'vote' && action !== 'transfer' && action !== 'proposal_pay') {
          log(`default case info: ${action}`);
    }
  }
}

//route block operations to the sorters
function blockRipper(blockdata, blocknumber) {
  oldnonce = nonce;
  for(var i = 0; i < blockdata.length; i++) {
    let transaction = blockdata[i];
    nonce++;
    opscan++;
    const action = transaction['op'][0];
    const data = transaction;
    const op = {
      action: action,
      data: data,
    };
    coreOps(action, transaction)
    if(scanOn === true) blockOpFoo(action);
  }
};

//parse a block and loop through it's operations
async function blockGrabber(blockNum, skipsync) {
  if(adminskipsync == true && skipsync == true) {
    blockNum = await fetchHead();
    saveBlock(blockNum);
    saveHead(blockNum);//lastSafeBlock = fetchSafe();
    adminskipsync = false;
    skipsyncnow = false;
    parseOn = true;
    return blockGrabber(blockNum);
  }
   hive.api.getOpsInBlock(blockNum, false, async function (err, block) {
    if(err){
      log(err);
      //log(`Ooops. Parsed too fast!`);
      synced = false;
      await timeout(3005);
      //log(`parseblock line 422`)
      return setTimeout(() => {return blockGrabber(blockNum)});
    }
    if (err !== null) return bail(err);
    if (block.length == 0) {
      //saveBlock(blockNum);
      if (stdoutblocks === true) {
        process.stdout.write(`[${returnTime()}] CHAIN: SYNCED! Block ${blockNum} / ${blockNum} (Waiting for Block) (Block Size: None / ${formatByteSizeDisplay(bytesParsed)} Total Session) (${opscan} Ops Scanned - ${opspersec} OpS) (${transferscan} transfer, ${votescan} vote, ${customjsonscan} custom_json, ${witnesspayscan} wtnessrewards)`);
        process.stdout.cursorTo(0);
      }
        synced = true;
        var headBlockCheck = await fetchHead();
        saveHead(lastSafeBlock);
        if(headBlockCheck < blockNum){
          log(`CHAIN: DeRailed While Fetching Next Block.. Fixing Now!`);//blockNum = lastSafeBlock;
          await timeout(3005);
          process.stdout.clearLine();
          parseOn = false;
          synced = true;
          return setTimeout(() => {return blockGrabber(blockNum)});
        }

        //process.stdout.clearLine();
        //log(`parseblock line 443`)
        parseOn = false;
        await timeout(1000);
        return setTimeout(() => {return blockGrabber(blockNum)});
    }//END if(block.length == 0)
    if(block){
      if((blockNum % 25) == 1) {
        saveBlock(blockNum);
        saveHead(lastHeadBlock);//lastSafeBlock = fetchSafe();
      }
      //newbytesParsed = byteSize(block);
      if(newbytesParsed != undefined){//log(`block byte size: ${newbytesParsed}`)
        bytesParsed += newbytesParsed;//log(`Total Byte size of session: ${bytesParsed}`);
      }
      blockRipper(block, blockNum);
      if (stdoutblocks === true) {
        process.stdout.write(`[${returnTime()}] CHAIN: Syncing Block ${blockNum} / ${lastHeadBlock} (${(lastHeadBlock - blockNum)} Blocks Left - (${timeest}s remain) ) (Block Size: ${formatByteSizeDisplay(newbytesParsed)} / ${formatByteSizeDisplay(bytesParsed)} Total) (${scansecondstepdown} BpS) (${opscan} Ops Scanned - ${opspersec} OpS) (${transferscan} transfer, ${votescan} vote, ${customjsonscan} custom_json, ${witnesspayscan} wtnessrewards)`);
        process.stdout.cursorTo(0);
      }
      blockNum++;
      recentblock = blockNum + 1;
      process.send(JSON.stringify({type: 'blockupdate', block: blockNum, behind: (lastHeadBlock - blockNum), synced:synced}));
      if (shutdown) {
        return bail();
      } else {
        parseOn = false;
        //process.send(JSON.stringify({type: 'blockupdate', block: blockNum, synced:synced}));
        //log(`parseblock line 592 Block number: #${blockNum} head block: ${lastHeadBlock}`)
        return blockGrabber(blockNum);
      }
    }
  });
};//END blockGrabber

var newbytesParsed;
async function parseBlock(blockNum) {
if(parseOn == true) {
   log(`CHAIN: Already parsing!`);
} else if(parseOn == false && skipsyncnow == true && adminskipsync == true){
   log(`CHAIN: ADMIN: Skipsync called!`);
   await blockGrabber(blockNum, true);
   log(`CHAIN: ADMIN: Skipsync Attempt Complete!`);
}

    parseOn = true;
    newbytesParsed = 0
    newCurrentBlock = blockNum;
    scanrate++;
    await blockGrabber(blockNum);
    if(verbose == true) return log(`CHAIN: Block #${blockNum} Parsed!`);
    return true;
};//END parseBlock

// Lets Start this script!
log("CHAIN: Starting HIVE Network Overwatch Daemon");

let shutdown = false;

var letsgo = async() => {
  var syncOutput = setInterval(function(){
    if(synced === false) {
      process.stdout.write(`[${returnTime()}] CHAIN: SYNCING - Block ${newCurrentBlock} / ${lastHeadBlock} (${(lastHeadBlock - newCurrentBlock)} Blocks Left - (${timeest}s remain)) (${scansecondstepdown} BpS) (${opscan} Ops Scanned - ${opspersec} OpS)`);
      process.stdout.cursorTo(0);
    }
    if(synced === true) clearInterval(syncOutput);
  }, 1000);

  if (!process.argv[2]) {
    blockNum = await fetchLastBlockDB();
      if(typeof blockNum !== 'number'){
        synced = false;
        log("CHAIN: Start Block Undefined! Fetching Last Irreversible Block - Please Wait.");
        hive.api.getDynamicGlobalProperties(function (err, result) {
            sleep(3000);
            if (result) {
                blockNum = result["last_irreversible_block_num"];
                parseBlock(blockNum);
            }
        });
      } else {
        synced = false;
        log("CHAIN: Previous Saved Block Height Found in DB!");
        parseBlock(blockNum);
      }
  } else {
      synced = false;
      blockNum = process.argv[2];
      parseBlock(blockNum);
  }
};//END letsgo

letsgo();

//calculate the current rate of operations scanned a second
var opspersec;
var scansecondstepdown;
var scanRateScanner = () => {
  oldOpsCount = opscan;
  scansecondstepdown = scanrate;
  scanrate = 0;
  setTimeout(function(){
    opspersec = (opscan - oldOpsCount);
    scanRateScanner();
  }, 1000);
};
scanRateScanner();

//calculate the time remaining to sync
var timeest;
var syncTimeEst = () => {
  setTimeout(function(){
    var blocksleft = (lastHeadBlock - blockNum);
    timeest = (blocksleft / opspersec).toFixed(1);
    syncTimeEst();
  }, 1000);
};
syncTimeEst();

//fetch the current head block
var fetchHeadScanner = async() => {
  var head = await fetchHead();
  //saveHead(head);
  setTimeout(function(){
    fetchHeadScanner();
  }, 5000);
};
fetchHeadScanner();

//DHF proposal routing to KLYE account (Depreciated)
var routeProposalPay = async (operation) => {
  hive.broadcast.transfer(config.bankwif, config.appName, 'klye', operation.payment, "Hive.Loans Proposal Payment Auto-Routing", await function (fuckeduptransfer, senttransfer) {
    if (fuckeduptransfer) log("Routing Payment Fucked Up: " + fuckeduptransfer);
    if (senttransfer) {
        log("Routing Payment Transfer Sent on Block #" + senttransfer.block_num);
        saveBlock(blockNum);
    }
  }); //end refund transfer
};//END routeProposalPay

//process a voting operation
var process_vote = async function(op) {
  log(op);
  await hive.broadcast.vote(config.bankwif, config.appName, op.author, op.permlink, op.weight, function(err, result) {
    if(err){
      log(`CHAIN: process_vote ERROR: ${err}`);
    }
    if(result){
      log(`CHAIN: process_vote Succesful!`);
      saveBlock(blockNum);
    }
  });
};//END process_vote

// Transfer operation found? Lets see if it is for us!
var process_transfer = async function (transaction, op) {
  log(transaction);
  log(op);
    var depositer = op[1].from;
    var currency = op[1].amount.lastIndexOf(" ") + 1;
    var depositmemo = op[1].memo;
    var depoamount = parseFloat(op[1].amount);
    var type;
    function parsetype(words) {
        var n = words.split(" ");
        return n[n.length - 1];
    }
    type = parsetype(op[1].amount);

    //Check if Deposit Memo is equal to an existing account
    let loginData;
    let userNameCheck = await UserData.findOne({where:{address:depositmemo}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
    if (userNameCheck === null) {
      if(refunds === true){
        hive.broadcast.transfer(config.bankwif, config.appName, depositer, op[1].amount, "Hive.Loans Deposit Refund - No Account is Linked to Specified Address!", function (fuckeduptransfer, senttransfer) {
            if (fuckeduptransfer) console.log("Refund Fucked Up: " + fuckeduptransfer);
            if (senttransfer) log("Refund of Deposit Transfer to " + depositer + " Sent!");
        }); //end refund transfer
      }
      log(`CHAIN: User Addressed in that Deposit is not in our Database - Assuming it's a Pledge!`);
      log(`CHAIN: Attempting to Add ${depoamount} ${type} to Account with Address: ${depositmemo}`)
      return DepositToAccount(depositer, parseInt(depoamount * 1000), type, 'new', op, recentblock, transaction, true);
    } else {
      log(`CHAIN: User Addressed in that Deposit has an Account!- Assuming it's an actual Deposit!`);
      // Look for hivejsit.com Link
      log(op[1].amount + " Deposit Detected from @" + depositer + " on block #" + recentblock);
      // See if the transfer was above minimum
      if (type.toLowerCase().indexOf("hive") >= 0) {
        log(`CHAIN: Attempting to Add ${depoamount} ${type} to Account with Address: ${depositmemo}`)
      return DepositToAccount(depositmemo, parseInt(depoamount * 1000), type, 'new', op, recentblock, transaction, false);//      DepositToAccount(depositmemo, parseInt(depoamount * 1000), type, 'new', op, recentblock, transaction);
      } else if (type.toLowerCase().indexOf("hbd") >= 0) {
        log(`CHAIN: Attempting to Add ${depoamount} ${type} to Account with Address: ${depositmemo}`)
      return DepositToAccount(depositmemo, parseInt(depoamount * 1000), type, 'new', op, recentblock, transaction, false); //      DepositToAccount(depositmemo, parseInt(depoamount * 1000), type, 'new', op, recentblock, transaction);
      } else {
        if (unsupportedAutoRefund == true){
          /*
          hive.broadcast.transfer(config.bankwif, config.appName, depositer, op.data.amount, "Hive.Loans Deposit Refund - Please Only Send HIVE / HBD!", function (fuckeduptransfer, senttransfer) {
              if (fuckeduptransfer) {
                  console.log("Refund Fucked Up: " + fuckeduptransfer);
              }
              if (senttransfer) {
                  log("Refund of Transfer to " + depositer + " Sent!");
              }
          }); //end refund transfer
          */
          return log(`CHAIN: Deposit Detected is NOT a Hive.Loans Supported Token from ${depositer}... Unsupported Auto Refund: true - REFUNDING`);
        } else {
          return log(`CHAIN: Deposit Detected is NOT a Hive.Loans Supported Token from ${depositer}... Unsupported Auto Refund: false`);
        }
      }
    }
}; //END process_transfer


//bail function triggered by SIGINT
async function bail(err) {
  switch (err) {
    case 'shutdown':
    log(`CHAIN: Shutting down in 1 seconds, start again with block ${blockNum}`);
    ChainData.update({siteblock: blockNum},{where:{id:1}});
    process.exit(err === 'Shutdown' ? 0 : 1);
    break;
  }
    log(`bail called on ${err}`);
    var errstring = err.toString();
    log(`errstring`);
    log(errstring)
    if(errstring.toLowerCase().indexOf("rpcerror") >= 0){
      log(`CHAIN: RPC ERROR: ${errstring} - SWITCHING NODES`);
      changenode();
      await timeout(500);
      return setTimeout(() => parseBlock(blockNum));
    } else {
      log(`CHAIN: ERROR: ${errstring} SWITCHING NODES`);
      changenode();
      await timeout(500);
      return setTimeout(() => parseBlock(blockNum));
    }
};//END bail


process.on('message', async function(m) {
  try {
      m = JSON.parse(m);
      if(config.debug == false) {
        log(`CHAIN: chainSnoop.js Message:`);
        log(m);
      }
  } catch(e) {
    log(`CHAIN: ERROR: ${e}`);
    return console.error(e);
  }

  switch(m.type){
    case 'changenode':
      if(m.username !== config.owner) {
        log(`CHAIN: ERROR: User ${m.username} Tried to Change API Node!`);
      } else if (m.username == config.owner) {
        changenode();
      } else {
        log(`CHAIN: ERROR: No User Was Specified!`);
      }
    break;
    case 'skipsync':
      log(`m.socketid:`)
      log(m.socketid)
      if(m.username != owner) {
        log(`CHAIN: ERROR: User ${m.username} Tried to skipsync!`);
      } else if (m.username == owner) {
        log(`CHAIN: ADMIN: Owner Attempting to SkipSync!`);
        adminskipsync = true;
        skipsyncnow = true;
        parseOn = false;
        await skipsync();
      } else {
        log(`CHAIN: ERROR: No User Was Specified!`);
      }
    break;
    case 'grabacct':
      log(`CHAIN: grabacct was called by ${m.username}`)
      if (m.username != config.owner && m.username != "siteaudit") {
        log(`CHAIN: ERROR: User ${m.username} Tried to Grab Accounts!`);
      } else if(m.username == undefined) {
        log(`CHAIN: ERROR: No User Was Specified!`);
      } else {
        //log(`CHAIN: Fetching @hive.loans Account for Audit`);
        hotWalletData = await grabAcct(hotwallet);
        //log(`CHAIN: Fetching @hive.loans.safe Account for Audit`);
        coldWalletData = await grabAcct(coldwallet);
          var walletData = [];
          walletData.push(hotWalletData[0]);
          walletData.push(coldWalletData[0]);
          return process.send(JSON.stringify({type:'massemit', name: "sitewallets", payload: walletData}));
      }
    break;
  }
});//END Process on Message

process.on("SIGINT", function () {
    shutdown = true;
    log(`CHAIN: Shutting down in 1 seconds, start again with block ${blockNum}`);
    ChainData.update({siteblock: blockNum, synced: synced},{where:{id:1}});
    setTimeout(bail('shutdown'), 1000);
});

//a hacky way to delay things
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

//----- SLEEP Function to unfuck some nodeJS things - NO modify
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if (new Date().getTime() - start > milliseconds) {
            break;
        }
    }
}
