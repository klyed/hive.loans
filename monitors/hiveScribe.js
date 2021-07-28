const { config } = require("../config/index.js");
const hive = require('@hiveio/hive-js');
var dhive = require("@hiveio/dhive");
var dhiveclient = new dhive.Client(["https://api.hive.blog", "https://api.hivekings.com", "https://anyx.io", "https://api.openhive.network"]);
let debug = config.debug;
const owner = config.owner;
const hotwallet = config.hotwallet;
const coldwallet = config.coldwallet;
const sidechain = config.sidechainId;
const auditwrite = config.auditwrite;
const cid = config.sidechainId;
const log = require("fancy-log");
const DB = require("../database/models");
const getStringByteSize = require('../snippets/getStringByteSize.js');
const manaBar = require('../snippets/manaBar.js');
const pm2 = require('../snippets/pm2MetricsHost.js');
const sequelize = DB.sequelize;
const DataBase = sequelize;
const UserData = DataBase.models.Users;
const DepositData = DataBase.models.Deposits;
const WithdrawData = DataBase.models.Deposits;
const AuditData = DataBase.models.Audits;
const LoanData = DataBase.models.Loans;

var online = process.connected;
var pid = process.pid;
log(`WRITE: Connected: ${online} with PID: ${pid}`);

let writeArray = [];
let writing = false;
let userSockets = [];
let head_block_id;
let ref_block_num;

var writeArrayLengthMetric = pm2.writeArrayLengthMetric;
var isWritingMetric = pm2.isWritingMetric;
var auditseshtotal = 0;

//==================================================
//--------------------------------------------------
//     CustomJSON Array & JSON HIVE Block Write
//--------------------------------------------------
class ChainCrumb {
  constructor(name, action, payload) {
    if(!name) return false;
    if(!action) return false;
    if(!payload) return false;
    this.contractName = name;
    this.contractAction = action;
    this.contractPayload = payload;
    if(payload) {
      //payload = JSON.parse(payload);
      var payloadBytes = getStringByteSize.getStringByteSize(payload.contractPayload);
      if(debug == true){
        log(payload);
        log(`SCRIBE: ChainCrumb - bytes: ${payloadBytes}`);
      }
      if(payloadBytes > 8192) {//8192
        log(`SCRIBE: ChainCrumb - itemPayload Bytes > 8196b`);
        return false;
      } else {
        return this;
      }
    }
  }
};//END ChainCrumb

class ChainOp {
  constructor(ref_block_num, ref_block_prefix, expiration, operations) {
    this.ref_block_num = ref_block_num;
    this.ref_block_prefix = Buffer.from(head_block_id, 'hex').readUInt32LE(4),
    this.expiration = new Date(Date.now() + 60000).toISOString().slice(0, -5),
    this.operations = [operations], //opertations syntax: ['opName', {atrribute1: var, attribute2: etcetc}]
    this.extensions = []
  }
};//END ChainOp

var arrayPacker = (name, action, payload) => {
  if(debug == true) log(`arrayPacker = (${name}, ${action}, ${payload})`);
  var createdCrumb;
  if(!name) log(`WRITE: ERROR: arrayPacker Missing name!`);
  if(!action) log(`WRITE: ERROR: arrayPacker Missing action!`);
  if(action !== 'nukeloan') {
      if(!payload) log(`WRITE: ERROR: arrayPacker Missing payload!`);
      log(payload);
  }
  if(!payload) payload = "none";

  //if(payload)
  createdCrumb = new ChainCrumb(name, action, payload);
  if(createdCrumb == false) {
    //log('createdCrumb: FALSE');
    return;
  } else {
    //log('createdCrumb:');
    //log(createdCrumb);
    createdCrumb = JSON.stringify(createdCrumb);
    writeArray.push(createdCrumb);
  }
  delete createdCrumb;
};//END arrayPacker

var jsonHiveWrite = async(writeArray) => {
  if (debug === false) log(`jsonHiveWrite = async(${writeArray})`);
  if(!writeArray) return log(`WRITE: ERROR: jsonHiveWrite Missing writeArray!`);
  if(writing == true) return;
  var oldArrayItem;
  writing = true;
  var al = writeArray.length;
  //log(`al`);
  //log(al);
  var nal = 0;
  for(item in writeArray){
    //log(`nal`);
    //log(nal);
    if(al <= nal) return;
    if(oldArrayItem){
      if(oldArrayItem == writeArray[item]) {
        log(`Duplicate DETECTED`)
        return;
      }
    } else {
      oldArrayItem = writeArray[item];
    }
    var itemPayload = writeArray[item];
    nal++;
      var preswitchoutpayload;
      itemPayload = JSON.parse(itemPayload);
      if(debug == true) {
        log(`SCRIBE: ${item} - itemPayload:`);
        log(itemPayload);

        log(`SCRIBE: itemPayload.contractAction:`);
        log(itemPayload.contractAction);
      }
      if(auditwrite !== true && itemPayload.contractAction == 'audit'){
        if(debug) log(`SCRIBE: AUDIT FOUND - REMOVING`);
        preswitchoutpayload = itemPayload;
        itemPayload.contractPayload = {audit: 'view latest audit as https://hive.loans/api?audit'};
        itemPayload = {audit: 'view latest audit as https://hive.loans/api?audit'};
        return writeArray = writeArray.shift();
      }

    var payloadBytes = getStringByteSize.getStringByteSize(itemPayload.contractPayload);
    log(`SCRIBE: payloadBytes: ${payloadBytes}b`);
    if(payloadBytes > 8192) {//8192
      log(`itemPayload Bytes > 8196b`);
      if((writeArray.length - 1) == 0) {
        writing = false;
        writeArray = [];
      }
      //writeArray.shift();

      writeArray = writeArray.shift();
    } else {

      /*
      var newOp = {
          ref_block_num: head_block_number,
          ref_block_prefix: Buffer.from(head_block_id, 'hex').readUInt32LE(4),
          expiration: new Date(Date.now() + expireTime).toISOString().slice(0, -5),
          operations: [['vote', {
              voter: account,
              author: 'test',
              permlink: 'test',
              weight: 10000
          }]],
          extensions: [],
      }

      var signedOp = dhiveclient.broadcast.sign(newOp, privateKey)
      */
      /*
      var headData = await fetchHead().then((res) => {
        return res;
      }).catch(errors => log(errors));
      */
      /*
      hive.auth.signTransaction({
        extensions: [],
        ref_block_num: headData['head_block_number'],
        ref_block_prefix: headData['head_block_id'],
        operations: [
          ['custom_json', {
            required__auths: 'hive.loans',
            required_posting_auths: [],
            id: `${config.sidechainId}.hive.loans`,
            json: JSON.stringify(itemPayload.contractPayload)
          }]
        ]}, [config.bankwif], (err, result) => {
        return console.log(err, result);
      });
      log(headData);
      */

      //var newOP = await new ChainOp(`${fetchHead}`,);



      //hive.auth.signTransaction(trx, keys);
     await hive.broadcast.customJson(config.bankwif, ['hive.loans'], [], `${cid}.hive.loans`, JSON.stringify(itemPayload), async function(err, result) {
      if(err){
        log(err)
        return writing = false;
      }
      if(result) {
        log(`WRITE: Blockchain Record Left Proof of ${itemPayload.contractAction.toUpperCase()} at TXID ${result.id} on HIVE Block ${result.block_num}`);
        if(debug === false) log(result);
        if(itemPayload.audit == 'view latest audit as https://hive.loans/api?audit') itemPayload = preswitchoutpayload;
          switch(`${itemPayload.contractAction}`){
            case 'audit':
            log(`auditwrite: ${auditwrite}`)
            if(auditwrite == false) {
              return log(`WRITE: auditwrite is FALSE. No Audit Writing!`);
              break;
            } else {

            }
              log(`audit case detected! Total in Session: ${auditseshtotal++}`);
              var auditUpdate = await AuditData.create({data: [itemPayload.contractPayload], txid:result.id, block:result.block_num}).then((res) => {
                if(debug === true) log(auditUpdate);
                  if(al <= nal) {
                    writing = false;
                    return res;
                    writeArray.pop();
                  } else {
                    return res;
                  }
              }).catch((e) => {
                return e;
              });
            break;//END case 'audit'

            case 'acceptdisclaimer':
              UserData.update({disclaimer:writeArray[item].payload.agree},{where:{id:itemPayload['contractPayload'].id}}).then((res) => {return res}).catch((e) => {return e});
              if((writeArray.length - 1) == 0) writing = false;
              return writeArray.pop();
            break;//END case 'acceptdisclaimer'
            case 'newloan':
              LoanData.update({txid: result.id, startblock: result.block_num, state:'deployed'},{where:{seedId:itemPayload['contractPayload'].seedId}}).then((res) => {return res}).catch((e) => {return e});
              userSockets[itemPayload.username].emit(`${itemPayload.contractAction}`, writeArray[item]);
              if((writeArray.length - 1) == 0) writing = false;
              return writeArray.pop();
            break;//END case ''
            case 'nukeloan':
              LoanData.update({endblock: result.block_num, endtxid: result.id, state:'cancelled', completed: true, cancelled: true},{where:{loanId:itemPayload['contractPayload'].loanId}}).then((res) => {return res}).catch((e) => {return e});
              userSockets[itemPayload.username].emit(`${itemPayload.contractAction}`, writeArray[item]);
              if((writeArray.length - 1) == 0) writing = false;
              return writeArray.pop();
            break;//END case ''
            case 'startloan':
              LoanData.update({startblock:result.block_num, txid:result.id, state:'accepted'},{where:{loanId:itemPayload['contractAction'].userId}}).then((res) => {return res}).catch((e) => {return e});
              if((writeArray.length - 1) == 0) writing = false;
              return writeArray.pop();
            break;//END case ''
            case 'endloan':
              LoanData.update({endblock:result.block_num, txid:result.id, state:'completed'},{where:{loanId:itemPayload['contractAction'].userId}});
              if((writeArray.length - 1) == 0) writing = false;
              return writeArray.pop();
            break;//END case ''
            case 'newuser':
              UserData.update({flags: JSON.stringify([{"genesis":result.block_num, "birthtxid":result.id}])},{where:{userId: itemPayload['contractAction'].userId}}).then((res) => {return res}).catch((e) => {return e});
              if((writeArray.length - 1) == 0) writing = false;
              return writeArray.pop();
            break;//END case ''
            case 'withdraw':
              log(result);
              WithdrawData.update({confirmed: true, confirmedblock:result.block_num, confirmedtxid:result.id},{where:{txid:itemPayload['contractPayload'].txid}}).then((res) => {return res}).catch((e) => {return e});
              if((writeArray.length - 1) == 0) writing = false;
              return writeArray.pop();
            break;//END case ''
            case 'deposit':
              log(result);
              DepositData.update({confirmed: true, confirmedblock:result.block_num, confirmedtxid:result.id},{where:{txid:itemPayload['contractPayload'].txid}}).then((res) => {return res}).catch((e) => {return e});
              if((writeArray.length - 1) == 0) writing = false;
              return writeArray.pop();
            break;//END case ''
            case 'payment':
              LoanData.update({startblock:result.block_num, txid:result.id},{where:{loanId:writeArray[item]['contractPayload'].loanId}}).then((res) => {return res;}).catch((e) => {return e});
              if((writeArray.length - 1) == 0) writing = false;
              return writeArray.pop();
            break;//END case ''
            case 'completed':
              await LoanData.update({startblock:result.block_num, txid:result.id},{where:{loanId:writeArray[item]['contractPayload'].loanId}}).then((res) => {return res;}).catch((e) => {return e});
              if((writeArray.length - 1) == 0) writing = false;
              return writeArray.pop();
            break;//END case ''
            default:
            if((writeArray.length - 1) == 0) writing = false;
            return writeArray.pop();
          }
          //writeArray = writeArray.pop();
          if((writeArray.length - 1) == 0) writing = false;
          return writeArray.pop();
        }
      });//END Broadcast



    }
  }
};//END jsonHiveWrite

async function writeDaemon() {
  if(debug === true) {
    log(`async function writeDaemon()`);
    log(`writeArray.length: ${writeArray.length}`);
  }
  if(writeArray.length > 0 && writing !== true){
    await jsonHiveWrite(writeArray);
  }
};//END writeDaemon

if(debug === true) {
  var writeArrayCheck = function(){
    setInterval(function(){
      log(`var writeArrayCheck = function()`);
      log(`writeArray:`);
      log(writeArray);
    }, 15000);
  };//END writeArrayCheck
  writeArrayCheck();
};//END debug checkwritearray

var writeRobot = function(){
  var roboInterval = setInterval(function(){
    if(writing === true) {
      if(debug === true){
        log(`writeArray:`);
        log(writeArray);
      }
      if(writeArray.length == 0){
        writing = false;
      } else {
        return log(`WRITE: Blockchain Record Writing in Progress!`);
      }
    } else if(writing === false) {
      writeDaemon();
    }
  }, 3000);
};//END writeRobot

writeRobot();

//==================================================
//--------------------------------------------------
//     Utility & Function
//--------------------------------------------------
//fetch the head HIVE Block
var fetchHead = async() => {
  log(`fetchHead()`);
  hive.api.getDynamicGlobalProperties(await function (err, result) {
      if(err) {
        log(err);
        return false;
      }
      if (result) {
          result = JSON.parse(JSON.stringify(result));
          log(result);
          result = parseInt(result["head_block_number"]);
          head_block_id = result["head_block_id"];
          ref_block_num = result["ref_block_num"];
          return result;
          //return result["last_irreversible_block_num"];
      }
  });
};//END fetchHead
//fetch the sites Resource Credits
var fetchSiteRC = async() => {
  var hotwalletRC = await manaBar.fetchRC(hotwallet);
  log(`hotwalletRC: ${hotwalletRC}%`);
  log(hotwalletRC);
};//END fetchSiteRC
//fetch count of loans ???
function loanCount() {
  Loandata.count().then(c => {
    return c;
  })
};//END loanCount
//==================================================
//--------------------------------------------------
//     Socket Messages
//--------------------------------------------------
process.on("message", async function(m){
  var sendsocket;
  try {
      m = JSON.parse(m);
      if(debug === false){
        log(`hiveScribe.js Message:`);
        log(m);
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
  switch(m.type) {
    case 'jsonbreadcrumb':
      arrayPacker(m.name, m.action, m.payload);
    break;
  }
});
