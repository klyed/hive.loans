let version;
var output;
var token = '';
var keyclicks = 0;

var options = {
  useEasing : true,
  useGrouping : false,
  separator : '',
  decimal : '.',
  prefix : '',
  suffix : ''
};
var debug = false;

var blonkcount = 0;

var showsiteinfo = true;

let jsonshit;
let customJsonOp;

var skcLinkData;

let usersDataFetch;
let usersLoanDataFetch;
var founderlist = '';
var foundercount = 0;
var backerlist = [];
var hypertabletwo;
var backercount = 0;
var username = "";
var user;
let betaPassChecked = false;
var hkcLogin = false;
var depositDelaySec = 0;
var uHIVEbalance = 0;
var uHBDbalance = 0;
var swod = false;
var uAddress = '';
var uUsername = '';
var uIP = '';
var loginContent;
var manualPay = 0;
var oldhiveusdprice;
var oldhivebtcprice;
var sound = false;
var userDelegations = [];
var siteAudit = [];
var userWalletFetchData;

let hiveprice;
let hivechart;
let areaSeries;
let candlestickSeries = [];
let dataChart = [];
let currentBusinessDay;
let chartlength;
let currentIndex;
let lastIndex;
let lastClose;

let activecurrency = 'hive';

let tickercurrency = 'usd';
let lastHiveBTCPrice;
let lastHivePrice;

let exchangetype = 'hlshare';
let exchangebase = 'hive';

var total_vesting_shares;
var total_vesting_fund;

var lastHiveShortPrice;
var lastHiveLongPrice;
var pricecheckinit = false;

var arrow1;
var arrow7;
var arrow24;
var arrow30;

var pricechartInit = 0;
var scrollInit = false;
var old_percent_change_1h = 0;
var old_percent_change_24h = 0;
var old_percent_change_7d = 0;
var old_percent_change_30d = 0;

var blockssynced = '';


var theDATA = siteAudit;
var theWALLET;
var theWDFEES;
var newUpdateDate;
var siteAccts;
var siteAcctsActive;
var siteAcctsDormant;
var siteAcctsOwned;
var siteLoans;
var siteLoansArray;
var usersBal = 0;
var siteActiveLoans = 0;
var siteActiveLends = 0;
var siteActive = 0;
var siteAvailable = 0;
var siteCompleted = 0;
var siteCancelled = 0;
var siteTotalActive = 0;
var siteTotalAllTime = 0;
var siteTotalCollected = 0;
var siteDeployFee = 0;
var siteCancelFee = 0;
var siteFineFee = 0;
var siteCommissionFee = 0;
var siteTotalFee = 0;
var hotWalletBalance = 0;
var coldWalletBalance = 0;
var totalCustodial = 0;

var dl;
var cl;

var banlist = [];

var scrollspeed = 5;
var makeleasetoggle = false
var shmdftoggle = false

let navList = [];
let navIndex = 0;
let ourIndex = 0;

//const barSeries = loanchart.addBarSeries();

var context = new AudioContext();
var nyannyan = new Audio('./sound/nyan.mp3');

var memo_key;
var owner_key;
var active_key;
var posting_key;
var profiledata;
var dateCreated;
var witdeclaration;
var reputation;

let demLoadDots =
`<div class="preloader js-preloader flex-center">`+
  `<div class="dots">`+
    `<div class="dot"></div>`+
    `<div class="dot"></div>`+
    `<div class="dot"></div>`+
  `</div>`+
`</div>`;

var walletHistoryTable  = `<table class="" id="wht" style="">` +
`</table>`;

let walletContent = `<center>` +
`<table style="width:90%;">` +
`<tbody>` +
`<tr>` +
`<td>HIVE Balance</td>` +
`</tr>` +
`<tr>` +
`<td>` +
`<center>` +
`<div class="casperInput input-group" style="">` +
`<input type="number" id="userhivebalance" readonly aria-describedby="basic-addon2">` +
`<span class="input-group-append">` +
`<span class="input-group-text" id="basic-addon2">` +
`<b><i class="fab fa-hive" style="color:#E31337;"></i></b>` +
`</span>` +
`</span>` +
`</div>` +
`</center>` +
`</td>` +
`</tr>` +
`<tr>` +
`<td>` +
`<button type="button" style="" class="button" id="depositbuttonwallet" onClick="depositButtonWallet(\'${user}\', 'HIVE')" title="Click here to begin a deposit to Hive.Loans">` +
`DEPOSIT ` +
`<span class="activeName">HIVE</span> ` +
`<span class="activeLogo"><i class="fab fa-hive" style="color:#E31337;"></i></span>` +
`</button>` +
`<button type="button" style="" class="button" id="withdrawhiveshithere" onClick="withdrawButtonWallet(user, 'HIVE')" title="Click here to begin a Withdraw from Hive.Loans">` +
`WITHDRAW ` +
`<span class="activeName">HIVE</span> ` +
`<span class="activeLogo"><i class="fab fa-hive" style="color:#E31337;"></i></span>` +
`</button>` +
`</td>` +
`</tr>` +
`</tbody>` +
`</table>` +
`</center>` +
`<center>` +
`<h4>` +
`Manual Deposit Information` +
`<br>` +
`<sub>` +
`Include the Address and Memo below in your Transfer` +
`</sub>` +
`</h4>` +
`Address:` +
`<br>` +
`<input type="text" id="depositName"  title="click to copy to clipboard" onmouseover="this.select()" onclick="copyStringToClipboard(this.value)" readonly>` +
`<br>` +
`Memo:` +
`<br>` +
`<input type="text" id="depositMemo" onmouseover="this.select()" onclick="copyStringToClipboard(this.value)" onload="$(this.val(uAddress))" readonly>` +
`<hr class="allgrayeverythang">` +
`<sub><span id="withhistswitch" class="paintitwhite">Withdrawals</span> - <a href="#" id="showWalletHistory" onClick="showWalletHistory();">Click Here to Show Your Wallet History</a> - <span id="depohistswitch" class="paintitwhite">Deposits</span></sub>` +
`<br>` +
`<span id="wallethistoryspan">` +
`<div id="walletHistoryInset" class=" hidden">` +
`<span id="walletHistoryTableHolder">` +
`</span>` +
`</div>` +
`</span>` +
`</center>`;

var lendMax;
var hpFloat;
let loansContent =`<span id="loadAllLoans" style="width:100% !important; height:100% !important; overflow-y:scroll;">` +
`</span>` +
`<table id="header-fixed" style="max-height:30% !important;">` +
`</table>`+ //<span id="contractcount"></span>Available HIVE Lending Contracts</b><br>
`<b>Lending Contract Information:</b>` +
`<span id="loadloaninfo"></span>` +
`<br>` +
`<br>` +
`<table style="text-align: center; width: 100%;">` +
`<tbody>` +
`<tr>` +
`<td>` +
`<b>Your Current HIVE Power Level:</b>` +
`<br>` +
`<span id="loansHPdisplay"></span>` +
`</td>` +
`<td>` +
`<code><span id="loanEnabled"></span></code>` +
`</td>` +
`<td>` +
`<b>Lending Credit Maximum:</b>` +
`<br>` +
`<span id="loanMax" value=""></span> HIVE` +
`<br>` +
`<br>` +
`<b>Currently Delegated:</b>` +
`<br>` +
`<span id="loanDelegation"></span> HIVE` +
`<br>` +
`<br>` +
`<b>Max Weekly Powerdown:</b>` +
`<br>` +
`<span id="loanMax7"></span> HIVE` +
`</td>` +
`</tr>` +
`<tr>` +
`<td>` +
`<b>Active Loan Browser:</b>` +
`<br>` +
`<span id="loadActiveloans"></span>` +
`</td>` +
`</tr>` +
`</tbody>` +
`</table>` +
`<br>`+
`<br>`+
//`<b>Leverage your HIVE account as collateral and get liquid HIVE into your Hive.Loans Account in less than 30 seconds!</b><br>` +
`<br><br>`+
`<br></center>`;

var hyperdatatable = `<table id="hyperdatatable" id="loadloans" class=" " style="background: #212121; border-radius: 10px; border: inset 2px #212121; width: 100% !important; height: 5% !important;"><tbody><tr><td><code>Loan ID</code><br>~</td><td><code>Lender</code><br>~</td><td><code>Amount</code><br>~</td><td><code>Interest Rate</code><br>~</td><td><code>Repayment Total</code><br>~</td><td><code>Duration</code><br>~</td><td><code>Borrower</code><br>~</td><td><code>Payments</code><br>~ / ~</td><td><code>Active</code><br>~</td></tr></tbody></table>`; //<td><code>Completed</code><br>~</td><td><code>Created</code><br>~</td>
$('#loadloaninfo').html(`${hyperdatatable}`);

var activeLoanTable = `<table class="ourloans" id="ourloans" style="background: #444444; border-radius: 10px; border: inset 2px grey; width: 100% !important; height: 10% !important;"><tbody><tr><td><code>Loan ID</code><br>~</td><td><code>Lender</code><br>~</td><td><code>Amount</code><br>~</td><td><code>Interest Rate</code><br>~</td><td><code>Repayment Total</code><br>~</td><td><code>Duration</code><br>~</td><td><code>Borrower</code><br>~</td><td><code>Payments</code><br>~ / ~</td><td><code>Active</code><br>~</td><td><code>Completed</code><br>~</td><td><code>Created</code><br>~</td></tr></tbody></table>`;
$('#loadActiveloans').html(`${activeLoanTable}`);

let sharesContent = `` +
`<table style="width:80%;">` +
`<tbody>` +
`<tr>` +
`<td><b>Purchase HLSHARE:</b>` +
`<br>` +
  `<div class="casperInput input-group">` +
  `<input type="number" onchange="$('#newamount').val(this.value); createLoanPreview();" onkeyup="$('#newamount').val(this.value); createLoanPreview();" id="newLendAmount" min="10" max="30" step="1" placeholder="10 to 30" required="" aria-label="Interest Rate" aria-describedby="basic-addon2">` +
    `<span class="input-group-append">` +
      `<span class="input-group-text" id="basic-addon2">` +
        `<b><i class="fab fa-hive" style="color:#E31337;"></i></b>` +
      `</span>` +
    `</span>` +
  `</div>` +
`</td>` +
`<td>` +
`<b>Duration</b>` +
`<br>` +
`<select onchange="$('#newdays').val(this.value); createLoanPreview();" class="casperInput" style="width:4vw !important;" onchange="$('#newdays').val(this.value);" value="7" id="newLendDays" min="7" max="91" step="7" name="newLendDays" placeholder="7 to 91" required>` +
`<option value="7">7 Days</option>` +
`<option value="14">14 Days</option>` +
`<option value="21">21 Days</option>` +
`<option value="28">28 Days</option>` +
`<option value="35">35 Days</option>` +
`<option value="42">42 Days</option>` +
`<option value="49">49 Days</option>` +
`<option value="56">56 Days</option>` +
`<option value="63">63 Days</option>` +
`<option value="70">70 Days</option>` +
`<option value="77">77 Days</option>` +
`<option value="84">84 Days</option>` +
`<option value="91">91 Days</option>` +
`</select>` +
`</td>`+
`<td>` +
`<b>Interest Rate</b>` +
`<br>` +
`<div class="casperInput input-group">` +
`<input type="number" onchange="$('#newfee').val(this.value); createLoanPreview();" onkeyup="$('#newfee').val(this.value); createLoanPreview();" id="newLendFee" min="10" max="30" step="1" placeholder="10 to 30" required placeholder="Interest Rate" aria-label="Interest Rate" aria-describedby="basic-addon2">` +
`<span class="input-group-append">` +
`<span class="input-group-text" id="basic-addon2">` +
`<b>%</b>` +
`</span>` +
`</span>` +
`</div>` +
`</td>` +
`</tr>` +
`<tr><td><code>Contract Preview:</code><br><span id="createLoanPreview">Select Some Values above to see Preview</span></td></tr>` +
`<tr><td><button type="button" style="font-size:larger;font-weight:900;" class="button" id="createNewLend" onClick="createNewLendCont();" title="Click here to create a new lending contract">Create Contract <i class="fas fa-fw fa-vote-yea" style="color:lawngreen;"></i></button></td></tr></tbody></table><br>`;


    /*
    let lendingContent =`<center><span id="activeLendView"></span>` +
    `<table id="header-fixed" style="max-height:30% !important;"></table><br>` +
    `<b>Create New Lending Contract</b>` +
    `<table style="width:80%;"><tbody><tr>` +
    `<td><b>Amount of HIVE:</b><br>` +
    `<div class="casperInput input-group"><input type="number" onchange="$('#newamount').val(this.value); createLoanPreview();" onkeyup="$('#newamount').val(this.value); createLoanPreview();" id="newLendAmount" min="10" max="30" step="1" placeholder="10 to 30" required="" aria-label="Interest Rate" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text" id="basic-addon2"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></span></div></td>` +
    `<td><b>Duration</b><br><select onchange="$('#newdays').val(this.value); createLoanPreview();" class="casperInput" style="width:4vw !important;" onchange="$('#newdays').val(this.value);" value="7" id="newLendDays" min="7" max="91" step="7" name="newLendDays" placeholder="7 to 91" required><option value="7">7 Days</option> <option value="14">14 Days</option> <option value="21">21 Days</option> <option value="28">28 Days</option> <option value="35">35 Days</option> <option value="42">42 Days</option> <option value="49">49 Days</option> <option value="56">56 Days</option> <option value="63">63 Days</option> <option value="70">70 Days</option> <option value="77">77 Days</option> <option value="84">84 Days</option> <option value="91">91 Days</option></select></td>`+
    `<td><b>Interest Rate</b><br><div class="casperInput input-group"><input type="number" onchange="$('#newfee').val(this.value); createLoanPreview();" onkeyup="$('#newfee').val(this.value); createLoanPreview();" id="newLendFee" min="10" max="30" step="1" placeholder="10 to 30" required placeholder="Interest Rate" aria-label="Interest Rate" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text" id="basic-addon2"><b>%</b></span></span></div></td></tr>` +
    `<tr><td><code>Contract Preview:</code><br><span id="createLoanPreview">Select Some Values above to see Preview</span></td></tr>` +
    `<tr><td><button type="button" style="font-size:larger;font-weight:900;" class="button" id="createNewLend" onClick="derp();" title="Click here to create a new lending contract">Create Contract <i class="fas fa-fw fa-vote-yea" style="color:lawngreen;"></i></button></td></tr></tbody></table><br>` +
    `<br><hr class="allgrayeverythang">`+
    `Your HIVE Balance:<br><span id="loanPreviewBalance">0.000</span> HIVE`+
    `<br><br>`+
    //`<table style="align-items: center !important; padding: 0px; margin: 0px; width: 100%;"><tbody><tr><td><h4><b>Active HIVE Lending Contracts</b></h4></td><td><h4><b>Completed HIVE Lending Contracts</b></h4></td></tr><tr><td><span id="activeLendView" class=""></span><table id="header-fixed"></table></td><td><div id="oldLendView">Loading Completed HIVE Lending Contracts</div></td></tr></tbody></table>`+
    `</center>`;

    */

    let newLendingContent = `<center><span id="activeLendView"></span><table id="header-fixed" style="max-height:30% !important;"></table><br>` +
    `<b>Create New Lending Contract</b><br><br>` +
    `<b>Amount of HIVE to Lend:</b><br>` +
    `<div class="casperInput input-group"><input type="number" onchange="$('#newamount').val(this.value); createLoanPreview();" onkeyup="$('#newamount').val(this.value); createLoanPreview();" id="newLendAmount" min="10" max="30" step="1" placeholder="10 to 30" required="" aria-label="Interest Rate" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text" id="basic-addon2"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></span></div>` +
    `<b>Duration of Contract:</b><br><select onchange="$('#newdays').val(this.value); createLoanPreview();" class="casperInput" style="width:4vw !important;" onchange="$('#newdays').val(this.value);" value="7" id="newLendDays" min="7" max="91" step="7" name="newLendDays" placeholder="7 to 91" required><option value="7">7 Days</option> <option value="14">14 Days</option> <option value="21">21 Days</option> <option value="28">28 Days</option> <option value="35">35 Days</option> <option value="42">42 Days</option> <option value="49">49 Days</option> <option value="56">56 Days</option> <option value="63">63 Days</option> <option value="70">70 Days</option> <option value="77">77 Days</option> <option value="84">84 Days</option> <option value="91">91 Days</option></select><br>` +
    `<b>Lending Interest Rate</b><br><div class="casperInput input-group"><input type="number" onchange="$('#newfee').val(this.value); createLoanPreview();" onkeyup="$('#newfee').val(this.value); createLoanPreview();" id="newLendFee" min="10" max="30" step="1" placeholder="10 to 30" required placeholder="Interest Rate" aria-label="Interest Rate" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text" id="basic-addon2"><b>%</b></span></span></div><br>` +
    `<code>Contract Preview:</code><br><span id="createLoanPreview">Select Some Values above to see Preview</span><br>` +
    `<button type="button" style="font-size:larger;font-weight:900;" class="button" id="createNewLend" onClick="createNewLendCont();" title="Click here to create a new lending contract">Create Contract <i class="fas fa-fw fa-vote-yea" style="color:lawngreen;"></i></button><br>` +
    `` +
    `</center>`;


let versiontext;

if(version){
  versiontext = `${version} Beta Version Phase I - By @KLYE`;
} else {
  versiontext = ``;
}

let hiveloanslogo = `<span style="color:white;">
██╗░░██╗██╗██╗░░░██╗███████╗░░░██╗░░░░░░█████╗░░█████╗░███╗░░██╗░██████╗
██║░░██║██║██║░░░██║██╔════╝░░░██║░░░░░██╔══██╗██╔══██╗████╗░██║██╔════╝
███████║██║╚██╗░██╔╝█████╗░░░░░██║░░░░░██║░░██║███████║██╔██╗██║╚█████╗░
██╔══██║██║░╚████╔╝░██╔══╝░░░░░██║░░░░░██║░░██║██╔══██║██║╚████║░╚═══██╗
██║░░██║██║░░╚██╔╝░░███████╗██╗███████╗╚█████╔╝██║░░██║██║░╚███║██████╔╝
╚═╝░░╚═╝╚═╝░░░╚═╝░░░╚══════╝╚═╝╚══════╝░╚════╝░╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░\n<br>\n<br>${versiontext}`;

var versionwarning = `========================================================================\n<br>
   ***WARNING*** This is an Online Beta Test and Likely contains BUGS\n<br>
   There almost certainly is things missing, issues, bugs and whatever else\n<br>
   By continuing using the site infers the site holds zero liability\n<br>
========================================================================
</span>`;
