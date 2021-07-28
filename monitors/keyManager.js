var fs = require("fs");
var cp = require("child_process");
var crypto = require("crypto");
var hivejs = require("@hiveio/hive-js");
const { Client, Signature, cryptoUtils } = require("@hiveio/dhive");
const steemClient = new Client("https://api.hive.blog");
var log = require("fancy-log");
var userSockets = [];
var fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();
var bankwif = process.env.ACTIVE_PRIVKEY;
var appName = process.env.SITE_ACCOUNT;
var owner = process.env.OWNER_ACCOUNT;
var votemirror = process.env.VOTE_MIRROR;
const pgppassword = env.process.SECHASH;
const DB = require("../database/models");
const sequelize = DB.sequelize;
const DataBase = sequelize;
const Userdata = DataBase.models.Users;
const Depositdata = DataBase.models.Deposits;
const Loandata = DataBase.models.Loans;
const Chaindata = DataBase.models.Blockchain;



process.on('message', async function(m) {
  var sendsocket;
  try {
      m = JSON.parse(m);
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

});


(async() => {
    await openpgp.initWorker({ path: '../node_modules/openpgp/openpgp.worker.js' }); // set the relative web worker path

    // put keys in backtick (``) to avoid errors caused by spaces or tabs
    const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----
...
-----END PGP PUBLIC KEY BLOCK-----`;
    const privateKeyArmored = `-----BEGIN PGP PRIVATE KEY BLOCK-----
...
-----END PGP PRIVATE KEY BLOCK-----`; // encrypted private key
    const passphrase = pgppassword; // what the private key is encrypted with


    const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
    await privateKey.decrypt(passphrase);


    const { data: encrypted } = await openpgp.encrypt({
        message: openpgp.message.fromText('Hello, World!'),                 // input as Message object
        publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys, // for encryption
        privateKeys: [privateKey]                                           // for signing (optional)
    });
    console.log(encrypted);

     // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
    const { data: decrypted } = await openpgp.decrypt({
        message: await openpgp.message.readArmored(encrypted),              // parse armored message
        publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys, // for verification (optional)
        privateKeys: [privateKey]                                           // for decryption
    });
    console.log(decrypted); // 'Hello, World!'
}
();



console.log(`getWithdrawRoutes:`);
await hive.api.getWithdrawRoutes(`${user}`, 1, function(err, data) {
  console.log(err, data);
});

console.log(`setWithdrawVestingRoute:`);
await hive.broadcast.setWithdrawVestingRoute(wif, fromAccount, toAccount, percent, autoVest, function(err, result) {
  console.log(err, result);
});


/* Used to check a public key account owner
console.log(`getKeyReferences:`);
await hive.api.getKeyReferences([owner_key], function(err, result) {
  console.log(err, result);
});
*/



hive.broadcast.accountUpdate(wif, account, owner, active, posting, memoKey, jsonMetadata, function(err, result) {
  console.log(err, result);
});
