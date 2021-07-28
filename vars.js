const { config } = require(__dirname + "/config/index.js");
let version = config.version;
//==================================================
//--------------------------------------------------
//     Chat
//--------------------------------------------------
  let chatHist = [];
  let canUserTransact = []; //stores users logged in and if they are permitted to transact - stops a potential to tip and bet at the same time to overwrite balance

//==================================================
//--------------------------------------------------
//     Fees
//--------------------------------------------------
  let enableLenderUSDcost = 1.01;
  let withdrawUSDcost = 0.25; // $0.10 USD withdraw fee
  let contractDeployUSDcost = 0.50;// $0.50 USD contract creation fee
  let cancelContractFeePercent = 1;

//==================================================
//--------------------------------------------------
//     User & Socket & Token
//--------------------------------------------------
  let userSockets = {};
  let socketList = [];
  let userRawSockets = [];
  let userTokens = {};
  let socketListKeys = Object.keys(socketList);
  let usersHivePower = {};
  let pingArray = [];

//==================================================
//--------------------------------------------------
//     Audit
//--------------------------------------------------
  let auditArray = [];
  let auditWalletArray = [];

//==================================================
//--------------------------------------------------
//     Wallet & Banking & Deposit & Withdraw
//--------------------------------------------------
let hotWalletBalance = 0;
let coldWalletBalance = 0;
let hotWalletData;
let coldWalletData;

//==================================================
//--------------------------------------------------
//     Investors & Backers & Shareholders
//--------------------------------------------------
  let founderslist = [];
  let backerslist = [];
  let usersInvest = {};
  let hlspreholderlist = [];
  let maxWin = 0;
  let bankRoll = 0;
  let greedBR = 0;
  let siteProfit = 0;
  let siteTake = 0;
  let siteEarnings;

//==================================================
//--------------------------------------------------
//     Blocks
//--------------------------------------------------
  let newCurrentBlock = 0;
  let synced;
  let blockNum = 0;

//==================================================
//--------------------------------------------------
//     Price & Futures & Ticker
//--------------------------------------------------
  let btcprice;
  let hivebtcprice;
  let hiveprice;
  let hbdbtcprice;
  let hbdprice;
  let hivePriceData = [];
  //bn == binance.com | cm == coinmarketcap.com | wc == worldcoinindex.com | cg == coingecko.com | bx == bittrex
  let priceSourceNameArray = ["bn", "cm", "wc", "cg", "bx"];
  let priceSourceArray = [{bn:0}, {cm:0}, {wc:0}, {cg: 0}];
  let priceSourceIndex = 3;
  let priceSourceActive = "cg";
  let oldprice;
  let lastprice;
  let spotprice;
  let spreadpercent = config.cfdspread;
  let longHIVEprice;
  let shortHIVEprice;
  let priceNonce = 0;
  let cgData;
  let bncData;
  let cmcData;
  let wcData;
  let pricecheckinit = false;
  let pricechecklast = 0;
  let labelstack = [];
  let datas = [];

//==================================================
//--------------------------------------------------
//     Hidden Content
//--------------------------------------------------
  let loginContent = `<center style="font-weight: 600;"><h3 class="pagehead" style="color:white;">HIVE Account Identity Verification</h3>` + //Accessing Hive.Loans Requires a Quick
  `<b id="acctflash1">To Access this Service Specify an Account Below:</b><br>` + //o Login or Register Type a HIVE Account Below
  `<br>` +
  `<div class="casperInput input-group">` +
  `<span class="input-group-prepend">` +
  `<i class="fas fa-fw fa-user"></i>` +
  `</span>` +
  `<input type="text" id="usernameinput" readonly onkeyup="$(this).val(this.value);" style="">` +
  `<span class="input-group-append" id="saveUser">` +
  `<span class="input-group-text">` +
  `<span class="fa-stack fa-1x saveLogin" onclick="loginUserName($('#usernameinput').val());" style="">` +
  `<i class="far fa-save fa-stack-1x"></i>` +
  `<i class="fas fa-ban fa-stack-1x  hidden" id="saveLoginBan" style="color:red"></i>` +
  `</span>` +
  `</span>` +
  `</span>` +
  `</div>` +
  `<code><span id="loginfuckery"></span></code><br>`+
  `<a href="#" onClick="$('#2fa').removeClass('hidden'); $(this).hide();" style="color:white !important;text-decoration: none !important;" class="dottybottom">` +
  `<sub>` +
  `Click here if you have 2FA enabled` +
  `</a>` +
  `</sub>` +
  `<br>` +
  `<input type='text' onload="$('#2fa').hide();" style="background: white;color: black;text-align: center;width: 9vw;height: 3vh;font-size: large; border-radius:10px;" class="hidden" placeholder="2FA Code Here" id='2fa'>` +
  `<br>` +
  `Choose a Verification Method:` +
  `<br><br>` +
  `<center>` +
  `<table>` +
  `<tbody>` +
  `<tr>` +
  `<td id="loginhivesigner" style="">` +
  `<button type="button" class="button disabledImg" style="" id="hivesignerlogin" onclick="/*login();*/ showErr('HiveSigner Login Currently Disabled!')" title="Click here to verify identify with Hive KeyChain"><img src="/img/hivesigner.svg" class="hivesignerlogo diabledImg" style="width:89%"></button></td>` +
  //`<!--<td id="loginspin">` +
  //`</td>-->` +
  `<td id="loginkeychain" style="">` +
  `<button type="button" style="" class="button" id="skclogologin" onclick="skclogologinclick(); showSuccess('Initializing Keychain.. Please Wait'); dotdotdotmaker($('#skclogologin')); skcusersocket($('#usernameinput').val());" title="Click here to verify identify with Hive KeyChain"><img src="/img/keychaintext.png" class="keychainlogo" style="width:69%"></button></td></tr></tbody></table></center>`+ // $('#skclogologin').html(demLoadDots);
  `<br><br>` +
  `<span style="font-size: smaller;">` +
  //`<i class="fa fa-exclamation-triangle sexyblackoutline" style="color:gold;" aria-hidden="true"></i> ` +
  `By Logging in you also Agree to our <a href="#" style="color:white !important;" class="dottybottom" id="rtos" onClick="termsOfService();">Terms of Service</a>` +
  `</span>`+
  `<hr class="allgrayeverythang">` +
  `<a style="color:white;" class="doubleunderurl" href="https://hivesigner.com/" target="_blank">HiveSigner</a> and <a style="color:white;" class="doubleunderurl" href="https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep?hl=en" target="_blank">Hive Keychain</a><br>are Accepted for Verification<br><br>`+
  `<br>` +
  `We'll never ask for government ID or implement` +
  `<br>` +
  `any Form of KYC Record Keeping Compliance` +
  `<br><br><br>`+
  `<br>` +
  `<sub style="position: absolute; bottom: 0; width: 100%; left: 0; text-shadow: none !important; color: black;">` +
  `<br><br>` +
  `<b style="color:white;" class="sexyblackoutline">Our servers are hosted by an extremely privacy savvy company</b> <a style="color:white !important;" class="sexyblackoutline doubleunderurl" target="_blank" rel="noopener" href="https://pay.privex.io/order?r=klye"><b><u>Privex.io</u></b> <img src="/img/privex.svg" style="max-width: 25px !important; max-height: 25px !important; bottom: 0; right: 0; position: absolute; "></a></sub>`+
  `<script>$('#jumboTitle').html('Hive.Loans&nbsp;' + 'v${version}');</script>`;

//==================================================
//--------------------------------------------------
//     Final variable export
//--------------------------------------------------
  module.exports = {
   version,
   chatHist,
   canUserTransact,
   usersInvest,
   userSockets,
   socketList,
   userRawSockets,
   socketListKeys,
   usersHivePower,
   auditArray,
   auditWalletArray,
   pingArray,
   founderslist,
   backerslist,
   hlspreholderlist,
   enableLenderUSDcost,
   withdrawUSDcost,
   contractDeployUSDcost,
   cancelContractFeePercent,
   userTokens,
   hotWalletBalance,
   coldWalletBalance,
   hotWalletData,
   coldWalletData,
   maxWin,
   bankRoll,
   greedBR,
   siteProfit,
   siteTake,
   siteEarnings,
   newCurrentBlock,
   synced,
   blockNum,
   btcprice,
   hivebtcprice,
   hiveprice,
   hbdbtcprice,
   hbdprice,
   hivePriceData,
   priceSourceNameArray,
   priceSourceArray,
   priceSourceIndex,
   priceSourceActive,
   oldprice,
   lastprice,
   spotprice,
   spreadpercent,
   longHIVEprice,
   shortHIVEprice,
   priceNonce,
   cgData,
   bncData,
   cmcData,
   wcData,
   pricecheckinit,
   pricechecklast,
   labelstack,
   datas,
   loginContent
  };
