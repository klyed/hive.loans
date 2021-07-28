const { config } = require("../config/index.js");
let debug = config.debug;
const owner = config.owner;
var crypto = require("crypto");
const log = require("fancy-log");
const DB = require("../database/models");
const sequelize = DB.sequelize;
const DataBase = sequelize;
const { Op } = require("sequelize");
const UserData = DataBase.models.Users;
const LeaseData = DataBase.models.Leases;

var online = process.connected;
var pid = process.pid;
log(`LEASE: Connected: ${online} with PID: ${pid}`);

var loadedLoans = [];
var userSockets = [];
var siteAudit = [];

var messageType;
var sendsocket;
let userData;
let userCheck;
var SeedID;
let loanData;
let loanCheck;
var loanFee;


function leaseCount() {
  LeaseData.count().then(c => {
    return c;
  })
};

function calculateAPR(duration, payment, amount) {
  if(!duration) return log(`calculateAPR: ERROR: duration is missing!`);
  if(!payment) return log(`calculateAPR: ERROR: duration is missing!`);
    if(!amount) return log(`calculateAPR: ERROR: duration is missing!`);
  var e = (365 / (7 * duration + 5) * (.9 * payment) / amount * 100).toFixed(2);
  return e;
}

process.on('message', async function(m) {
  var dateNow = (new Date).toUTCString();
  let loanData;
  try {
    m = JSON.parse(m);
    if(debug == false){
      log(`leaseEngine.js Message:`);
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
    case 'loadall':
    async function loadAllLease(){
      await LeaseData.findAll({
        limit: 1000,
        where: { },
        order: [[ 'createdAt', 'DESC' ]],
        raw: true
      }).then(function(entries){
        var loadedlease = [];
        let cleanedlease = entries.map(function(key) {
          if (key.id !== -1) {
              delete key.id;
          }
          if (key.updatedAt !== -1) {
            delete key.updatedAt;
          }
          if (key.createdAt !== -1) {
              delete key.createdAt;
          }
          return key;
        });
        cleanedlease.forEach((item, i) => {
          loadedlease.push(item);
        });
        //loadedBets.push(entries);
        process.send(JSON.stringify({
          type:'emit',
          name:'loadalllease',
          socketid: m.socketid,
          payload: loadedlease,
          token: m.token
        }));
        //process.send(JSON.stringify({type: 'loadallloans', username: m.username, loans: loadedLoans}));
      });
    }
    await loadAllLease();
    break;
    //END case 'loadallloans'
    case 'loadmyleases':
    async function loadMyLeases(){
      await Loandata.findAll({
        limit: 1000,
        where: {username: m.username},
        order: [[ 'createdAt', 'DESC' ]],
        raw: true
      }).then(function(entries){
        var loadedLease = [];
        let cleanedLease = entries.map(function(key) {
          if (key.id !== -1) {
            delete key.id;
          }
          if (key.updatedAt !== -1) {
            delete key.updatedAt;
          }
          if (key.createdAt !== -1) {
            delete key.createdAt;
          }
          return key;
        });
        cleanedLease.forEach((item, i) => {
          loadedLease.push(item);
        });
        process.send(JSON.stringify({
          type:'emit',
          name:'loadmyleases',
          socketid: m.socketid,
          payload: loadedLease,
          token: m.token
        }));
      });
    }
    await loadMyLeases();
    break;
    //END case 'loadmyloans'
    case 'newlease':
    m.amount =  parseInt(m.amount);
    if(m.funded == 0){
      m.funded = false;
    } else if (m.funded == 1){
      m.funded == true;
    }
    var loanFee;
    var cancelFee;
    userCheck = await UserData.findOne({where:{username:`${m.username}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
    if (userCheck === null) {
      return log(`LEASE: ERROR: User ${m.username} not found in DB!`);
    } else {
      userData = JSON.parse(JSON.stringify(userCheck));
      switch(userData.rank){
        case 'user':
        loanFee = parseInt((m.amount * 1) / 100);
        cancelFee = parseInt(((m.amount * (m.interest / 10)) * 1) / 100);
        break;
        case 'founder':
        loanFee = parseInt((m.amount * 0.5) / 100);
        cancelFee = parseInt(((m.amount * (m.interest / 10)) * 0.5) / 100);
        break;
        case 'backer':
        loanFee = parseInt((m.amount * 1) / 100);
        cancelFee = parseInt(((m.amount * (m.interest / 10)) * 1) / 100);
        break;
        case 'benefactor':
        loanFee = 0;
        cancelFee = 0;
        break;
        case 'owner':
        loanFee = 0;
        cancelFee = 0;
        break;
      }
      //log(`loanFee:`)
      //log(loanFee)
      //log(`cancelFee:`)
      //log(cancelFee)
      var deploytotalcost = m.amount + loanFee;
      //log(`deploytotalcost:`);
      //log(deploytotalcost);
      if(deploytotalcost <= userData.hivebalance) {
        SeedID = crypto.randomBytes(8).toString('hex');
        LoanID = crypto.randomBytes(16).toString('hex');
        sequelize.transaction().then(async function(t) {
          var freshloan;
          if(m.funded == true){
            freshloan = {userId: m.userId, loanId: LoanID, seedId: SeedID, funded: m.funded, username: m.username, amount: m.amount, days: m.days, interest: m.interest, deployfee: loanFee, cancelfee: cancelFee};
          } else {
            freshloan = {userId: m.userId, loanId: LoanID, seedId: SeedID, funded: m.funded, borrower: m.username, amount: m.amount, days: m.days, interest: m.interest, deployfee: loanFee, cancelfee: cancelFee};
          }
          LeaseData.create(freshloan)
          .then(async function() {
            userData.hivebalance -= deploytotalcost;
            userData.activelends++;
            userData.totallends++;
            await UserData.update({error:null, hivebalance:userData.hivebalance, activelends: userData.activelends, totallends:userData.totallends},{where:{id:userData.id}});
            t.commit();
            var loanPayload = {userId: m.userId, loanId: LoanID, seedId: SeedID, username: m.username, amount: m.amount, days: m.days, interest: m.interest, deployfee: loanFee, cancelfee: cancelFee};
            log(`LEASE: New Loan from ${m.username} - ${(m.amount / 1000).toFixed(3)} HIVE at ${m.interest}% for ${m.days} days!`);
            process.send(JSON.stringify({
              type: 'emit',
              name:'newloanmade',
              socketid: m.socketid,
              error:null,
              payload: loanPayload,
              token: m.token
            }));
          }).catch(function(error) {
            t.rollback();
            console.log(error);
          });
        });
      } else {
        log(`Not enough HIVE in Balance to lend!`);
      }
    }
    break;
    //END case 'newloan'

    case 'acceptlease':
    let loanCheck = await Loandata.findOne({where:{loanId:`${m.loanId}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
    if (loanCheck === null) {
      return log(`SOCKET: ERROR: Loan ${m.loanId} not found in DB!`);
    } else {
      loanData = JSON.parse(JSON.stringify(loanCheck));
      log(loanData);
      if(loanData.username == m.user) return log(`LEASE: ERROR: You Cannot Accept your Own Contracts.`);
      loanAmount = parseInt(loanData.amount);
    }
    userCheck = await UserData.findOne({where:{username:`${m.user}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
    if (userCheck === null) {
      return log('Error: Faucet failed to fetch users statistics!');
    } else {
      uData = JSON.parse(JSON.stringify(userCheck));//.map(function(userNameCheck){ return userNameCheck.toJSON()});
      log(`CONTRACT: Crediting ${(loanAmount / 1000)} HIVE for ${uData.username} Accepting ContractID #${m.loanId}`);
      uData.hivebalance += loanAmount;
    }//end ellse


    sequelize.transaction().then(async function(t) {
      await UserData.update({hivebalance: uData.hivebalance, activeloans:(uData.activeloans + 1),  totalloans:(uData.totalloans + 1)},{where:{username:`${user}`}})
      .then( async function() {

      }).catch(function(error) {
        t.rollback();
        console.log(error);
        canUserTransact[user] = true;
        return cb('Claiming Failed, Try again Later!', {token: req.token});
      });
    });
    break;
    //END case 'acceptloan'

    case 'cancellease':
    log(`cancellease:`);
    log(m);
    if(m.loanId == undefined){
      return log(`LEASE: Variable loanId is undefined!`);
    }
    if(m.seedId == undefined){
      log(`LEASE: Variable seedId is undefined!`);
    }
    if(m.username == undefined){
      return log(`LEASE: Variable username is undefined!`);
    }
    userCheck = await UserData.findOne({where:{username:`${m.username}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});
    if (userCheck === null) {
      return log(`LEASE: ERROR: User ${m.username} not found in DB!`);
    } else {
      userData = JSON.parse(JSON.stringify(userCheck));

      var loanChecker = await LeaseData.findOne({where:{loanId:`${m.loanId}`}, raw:true, nest: true}).then(result => {return result}).catch(error => {console.log(error)});

      if (loanChecker === null) {
        return log(`LEASE: ERROR: Loan ${m.loanId} not found in DB!`);
      } else {
        loanData = JSON.parse(JSON.stringify(loanChecker));
        if(m.username !== owner || m.username !== loanData.username) {
          process.send(JSON.stringify({
            type:'emit',
            name:'loannuked',
            socketid: m.socketid,
            error: 'Cannot Cancel Contract, User Privileges Invalid!',
            payload: null,
            token: m.token
          }));
          return log(`LEASE: @${m.username} Tried to Cancel a Loan Belonging to @${loanData.username}!`);
        } else if(m.username == owner){
          var loanAmount = parseInt(loanData.amount);
          if(loanData.active == 0 && loanData.cancelled == 0){
            log(`userData.username`);
            log(userData.username);
            log(`loanData.username`);
            log(loanData.username);
              loanAmount = parseInt(loanAmount - loanData.cancelfee);
              userData.hivebalance += loanAmount;
              userData.activelends--;
              await Loandata.update({completed: true, cancelled: true, state: 'cancelled'},{where:{loanId:`${m.loanId}`}});
              await UserData.update({hivebalance:userData.hivebalance, activelends: userData.activelends},{where:{username:m.username}});

              var loanPayload = {userId: loanData.userId, loanId: loanData.loanId, username: loanData.username, amount: loanData.amount, days: loanData.days, interest: loanData.interest, completed: true, cancelled: true, cancelfee: cancelFee};
              process.send(JSON.stringify({
                type:'emit',
                name:'loannuked',
                socketid: m.socketid,
                error: null,
                payload: loanPayload,
                token: m.token
              }));
          } else {
            log(`LEASE: Cannot Cancel Contract as it's Active or Cancelled`);
            process.send(JSON.stringify({
              type:'emit',
              name:'loannuked',
              socketid: m.socketid,
              error: 'Cannot Cancel Contract!',
              payload: null,
              token: m.token
            }));
          }
        }
        var loanAmount = parseInt(loanData.amount);
        if(loanData.active === 0 && loanData.cancelled === 0){
          log(`userData.username`);
          log(userData.username);
          log(`loanData.username`);
          log(loanData.username);

          if(loanData.username == userData.username) {
            loanAmount = parseInt(loanAmount - loanData.cancelfee);
            userData.hivebalance += loanAmount;
            userData.activelends--;
            await LeaseData.update({completed: true, cancelled: true, state: 'cancelled'},{where:{loanId:`${m.loanId}`}});
            await UserData.update({hivebalance:userData.hivebalance, activelends: userData.activelends},{where:{username:m.username}});

            var loanPayload = {userId: loanData.userId, loanId: loanData.loanId, username: loanData.username, amount: loanData.amount, days: loanData.days, interest: loanData.interest, completed: true, cancelled: true, cancelfee: cancelFee};
            process.send(JSON.stringify({
              type:'emit',
              name:'loannuked',
              socketid: m.socketid,
              error: null,
              payload: loanPayload,
              token: m.token
            }));
          } else {
            process.send(JSON.stringify({
              type:'emit',
              name:'loannuked',
              socketid: m.socketid,
              error: 'Cannot Cancel Contract!',
              payload: null,
              token: m.token
            }));
          }
        }
      }
    }
    break;
    //END case 'cancelloan'

    case 'leasehptotal':
    async function loadLeaseHP(){
      await LeaseData.findAll({
        limit: 1000,
        where: {state: 'available'},
        order: [[ 'createdAt', 'DESC' ]],
        raw: true
      }).then(function(entries){
        var loadedLease = [];
        let cleanedLease = entries.map(function(key) {
          if (key.id !== -1) {
            delete key.id;
          }
          if (key.updatedAt !== -1) {
            delete key.updatedAt;
          }
          if (key.createdAt !== -1) {
            delete key.createdAt;
          }
          return key;
        });
        cleanedLease.forEach((item, i) => {
          loadedLease.push(item);
        });
        process.send(JSON.stringify({
          type:'emit',
          name:'leasehptotal',
          socketid: m.socketid,
          payload: loadedLease,
          token: m.token
        }));
      });
    }
    await loadMyLeases();
    break;
    //END case 'infoloan'

    case 'myloanlist':
    var histvar;
    if(!m.history) histvar = false;
    var fetchUserLoans = async(history) => {
      if(!history || typeof history != 'boolean') history = false;
      loanCheck = await Loandata.findAll({
        limit: 200,
        where:{
          borrower:`${m.username}`,
          completed:`${history}`,
        },
        order: [ [ 'createdAt', 'DESC' ]],
        raw: true
      }).then(function(entries){

        let cleanedloans = entries.map(function(key) {
          if(history === true) {

          } else {
            if (key.active == 0) {
              delete key;
            }
            if (key.completed == 0) {
              delete key;
            }
          }

          return loadedLoans.push(key);
          //return key;
        });
      });
      if (loanCheck === null) {
        return log(`LEASE: ERROR: Loans not found in DB!`);
      } else {
        process.send(JSON.stringify({
          type:'emit',
          name:'myloanlist',
          socketid: m.socketid,
          error: null,
          payload: [{username: m.username, loandata: loadedLoans, token: m.token}]
        }));
      }
    };
    await fetchUserLoans(histvar);
    break;
    //END case 'myloanlist'

    case 'statecheck':
    var fetchUserState = await Loandata.findAll({
      where: {username: m.username},
      order: [ [ 'createdAt', 'DESC' ]],
      raw: true
    }).then(function(entries){
      var loanStates = [];
      let stateCheked = entries.map(function(key) {
        if (key.id !== -1) {
          delete key.id;
        }
        if (key.username !== -1) {
          delete key.username;
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
      stateCheked.forEach((item, i) => {
        loanStates.push(item);
      });
      if (loanStateCheckNow === null) {
        return log(`LEASE: ERROR: Loans not found in DB!`);
        process.send(JSON.stringify({
          type:'emit',
          name:'statereply',
          socketid: m.socketid,
          error: 'loans not found!',
          payload: [{username: m.username, loanstates: loanStates, token: m.token}]
        }));
      } else {
        process.send(JSON.stringify({
          type:'emit',
          name:'statereply',
          socketid: m.socketid,
          error: null,
          payload: [{username: m.username, loanstates: loanStates, token: m.token}]
        }));
      }
    });
    await fetchUserState();
    break;
    //END case 'statecheck'
    case 'leasecount':
    var leasecount = await leaseCount();
    process.send(JSON.stringify({
      type:'emit',
      name:'leasecount',
      socketid: m.socketid,
      error: null,
      payload: [{count: leasecount, token: m.token}]
    }));
    break;
  }
})//END process.on message
