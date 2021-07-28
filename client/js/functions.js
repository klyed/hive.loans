//--------------------------------------------------
//     Utility & Function
//--------------------------------------------------
var showSuccess = function (text) {
    alertify.success('<i class="fas fa-1x fa-check-circle circle-background-white" style="float: left;height:20px;width:20px;padding:0px;display:inline-flex;font-size:38px;margin-top:-11px;margin-left:-11px;"></i> ' + text + ' <i class="ajs-close" style=""></i>').dismissOthers();
};//END showSuccess
var showErr = function (text) {
    alertify.error('<i class="fa fa-1x fa-exclamation-circle circle-background-white" style="float:left;height:20px;width:20px;padding:0px;display:inline-flex;font-size:38px;margin-top:-11px;margin-left:-11px;"></i> ' + text + ' <i class="ajs-close" style=""></i>').dismissOthers();//<i class="fa fa-2x fag-2x fa-exclamation-circle" style="color:red;float:left;    margin-left: 0.5vw;"></i>
};//END showErr

var headLight = (e) => {
  if(!e) return;
    if(cl != e){
        cl = e;
        return $(`${e}`).css({'background':'rgba(28, 28, 28, 0.90)'});
    }
};//END headLight

var headDim = (e) => {
  if(!e) return;
    if(dl != e){
        dl = e;
        return $(`${e}`).css({'background':'rgba(28, 28, 28, 1)'});
    }
};//END headDim

var vhd = function(e) {
  var t = e.value;
  e.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 4)) : t;
};//END vhd

function checkExchangeWarning(){
  if (showCFDWarning !== true){
    $('#cfdWarning').fadeOut();
  } else {
    $('#cfdWarning').fadeIn();
  }
};//END checkExchangeWarning

function closeCFDButton(id){
  console.log(`closeCFDButton(${id})`)
  if(!id) return showErr('No Contract ID was Specified!');
  socket.emit('closecfd', {id:id, token: token}, function(err, data){
    if(err) return(showErr('Something Went Wrong! Please Try Again!'));
    if(data) {
      console.log(data);
      showSuccess(`${data.msg}`);
    }
  });
};//END checkExchangeWarning

function checkCFDWarning(){
  if (showCFDWarning !== true){
    $('#cfdWarning').fadeOut();
  } else {
    $('#cfdWarning').fadeIn();
  }
};//END checkCFDWarning

function checkTVWarning(){
  if (showTVWarning !== true){
    $('#tradingviewfooter').fadeOut();
  } else {
    $('#tradingviewfooter').fadeIn();
  }
};//END checkTVWarning

function ValidateEmail() {
    var inputVal = $("#newEmail").val().toString();
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputVal.match(mailformat)) {
        $('#passerror').html('');
    } else {
        $('#passerror').html('<b style="color:red;">Email Address is Invalid!</b>');
    }
};//END ValidateEmail

function fixToPlaces(p) {
    if (p < 1) return parseInt(this);
    for (var s = "", i = 0; i < p; i++) s += "0";
    var x = (this + '.').split('.')
    return x[0] + "." + (x[1] + s).substr(0, p);
};//END fixToPlaces

function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n;
};//END minTwoDigits

function getNumber(theNumber) {
    if(theNumber > 0){
      return "+" + theNumber;
    } else {
      return "&nbsp;" + theNumber;
    }
};//END getNumber

var showPopup = function(text, type){
  var color;
  var title;
  if(type == 'error') {color = 'red'; title = "An Error has Occured!";}
  if(type == 'success') {color = 'lawngreen'; title = "Important Information!";}
  var loadingContent = `<center><h3 style="color:${color}">${title}</h3><b style="color:${color};">${text}</b><br><br><button id="popupClose" class="push_button4">Close</button></center>`;
      var loadingContent = `${title}\n${text}`;
      showErr(loadingContent);
      /*
      //$("#jumbotron").html(loadingContent);
      //$("#jumbotron").css({'height':'fit-content','width':'auto'});
      //$("#jumbotron").center();
      //$("#jumbotron").fadeIn('slow');
      */
};//END showPopup

var flashsec = function(elements) {
  $(elements).css({'color':'#CC0000 !important'});
  $(elements).animate({'color':'#000000 !important'}, 300);
  $(elements).css({'color':'#000000 !important'});
};//END flashsec

var flashwin = function(elements, ms) {
  if(!ms) ms = 800;
  $(elements).css({'color':'#00FF00 !important'});
  $(elements).animate({'color':'#FFFFFF !important'}, ms);
  $(elements).css({'color':'#FFFFFF !important'});
};//END flashwin

var flashlose = function(elements, ms) {
  if(!ms) ms = 800;
  $(elements).css({'color':'#CC0000 !important'});
  $(elements).animate({'color':'#FFFFFF !important'}, ms);
  $(elements).css({'color':'#FFFFFF !important'});
};//END flashlose

var updateQRCODE = function(v){
    $('#qrcode').qrcode({render: "table", text	: v});
    $("#qrtext").text(v);
};//END updateQRCODE

var floor = function(n, decimalPlaces){
    var m = Math.pow(10,decimalPlaces);
    return (Math.floor(n*m)/m).toFixed(decimalPlaces);
};//END floor

var ceil = function(n, decimalPlaces){
    var m = Math.pow(10,decimalPlaces);
    return (Math.ceil(n*m)/m).toFixed(decimalPlaces);
};//END ceil

var round = function(n, decimalPlaces){
    var m = Math.pow(10,decimalPlaces);
    return (Math.round(n*m)/m).toFixed(decimalPlaces);
};//END round

function simpleJSONstringify(obj) {
    var prop, str, val, isArray = obj instanceof Array;
    if (typeof obj !== "object") return false;
    str = isArray ? "[" : "{";
    function quote(str) {
        if (typeof str !== "string") str = str.toString();
        return str.match(/^\".*\"$/) ? str : '"' + str.replace(/"/g, '\\"') + '"'
    }
    for (prop in obj) {
        if (!isArray) {
            // quote property
            str += quote(prop) + ": ";
        }
        // quote value
        val = obj[prop];
        str += typeof val === "object" ? simpleJSONstringify(val) : quote(val);
        str += ", ";
    }
    // Remove last colon, close bracket
    str = str.substr(0, str.length - 2)  + ( isArray ? "]" : "}" );
    return str;
};//END simpleJSONstringify

async function splitOffVests(a){
  if(a){
    return parseFloat(a.split(' ')[0]);
  }
};//END splitOffVests

function startScrollbar() {
  var items, scroller = $('#scroller');
  var width = 0;
  scroller.children().each(function(){
      width += $(this).outerWidth(true);
  });
  scroller.css('width', width);
  function scroll(){
      items = scroller.children();
      var scrollWidth = items.eq(0).outerWidth();
      scroller.animate({'left' : 0 - scrollWidth}, scrollWidth * 100 / scrollspeed, 'linear', changeFirst);
      $('#scroller').hover(function(){
      scroller.animate({'left' : 0 - 0}, 0 * 100 / scrollspeed, 'linear', changeFirst);
      }, function(){
        scroller.animate({'left' : 0 - scrollWidth}, scrollWidth * 100 / scrollspeed, 'linear', changeFirst);
    });
  }
  function changeFirst(){
      scroller.append(items.eq(0).remove()).css('left', 0);
      scroll();
  }
  scroll();
};//END startScrollbar

function commaNumber(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};//END commaNumber

function toThree(n) {
    var number = n.toString().substring(0, n.toString().indexOf(".") + 4);
    parseFloat(number);
    return number;
};//END toThree

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        showErr("Numbers & Decimals Only!");
        return false;
    }
    return true;
};//END isNumberKey

function isNearSeven(val) {
  if(val % 7){
    return Math.round(val / 7);
  } else {
    console.log(`not multiple of 7`);
  }
};//END isNearSeven

function between(value, start, end){
  if(value < start){
    return 10;
  } else if (value > end){
    return 30;
  }
};//END between

async function encrypt(contractID, pgp){
console.log(`function encrypt(${contractID}, ${pgp})`);
  $("#surrenderKeysTable").hide();
  $("#afterSurrenderButtonClick").removeClass('hidden');
  $("#afterSurrenderButtonClick").text(`Awaiting Account Key Manager Response...`)
  const { data: encrypted } = await openpgp.encrypt({
      message: openpgp.message.fromText(`[{"${uUsername}":{"passdata":"${$('#masterAcctPass').val()}"}}]`),                 // input as Message object
      publicKeys: (await openpgp.key.readArmored(pgp)).keys});
  return finalizeLoan(`${contractID}`, `${encrypted}`);
};//END encrypt

var loginKey = function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == "13"){
        submitLogin();
    }
};//END

var hiveAmountChecker = async(amount, asset) => {
  var response = await hive.formatter.amount(_amount, asset);
  return response;
};//END

function changenode(){
  console.log(`changenode!`);
  socket.emit('changenode', {token: token}, function(err, data){
    if(err) {
      console.log(`changenode ERROR:`);
      console.log(err);
    }
    if(data){
      console.log(data);
    }
  });
};//END changenode

function handsBlink(side) {
  var flipped = '';
  var flash;
  var hand;
  var handselector = Math.floor(Math.random() * (5 - 1) + 1);
  if(side == 'left') {
    flipped = ' fa-flip-horizontal ';
    flash = 'leftflash';
    hand = 'lefthand';
  } else {
    flash = 'rightflash';
    hand = 'righthand';
  }
  switch(handselector){
    case 1:
    string = `<i class="fas fa-2x fa-hand-holding-medical ${flipped} ${hand}"></i>`;
    break;
    case 2:
    string = `<i class="fas fa-2x fa-hand-holding-heart ${flipped} ${hand}"></i>`;
    break;
    case 3:
    string = `<i class="fas fa-2x fa-hand-holding-usd ${flipped} ${hand}"></i>`;
    break;
    case 4:
    string = `<i class="fas fa-2x fa-hand-holding-water ${flipped} ${hand}"></i>`;
    break;
    case 5:
    string = `<i class="fas fa-2x fa-hand-holding ${flipped} ${hand}"></i>`;
    break;
  }
  $(`#${flash}`).hide();
  $(`#${flash}`).html(`${string}`);
  $(`#${flash}`).fadeIn('slow');
};//END handsBlink

var blonker = setInterval(function(){
    blonkcount++;
    if(blonkcount % 2 == 0){
        handsBlink('left');
    } else {
        handsBlink('right');
    }
}, 3000);//END blonker

function togglesiteinfo() {
  if(showsiteinfo == true) {
    $('#settings-siteinfo').val('Hide');
    $('.siteinfo').removeClass('hidden');
    showsiteinfo == false;
  } else if(showsiteinfo == false) {
    $('#settings-siteinfo').val('Show');
    $('.siteinfo').addClass('hidden');
    showsiteinfo == true;
  } else {
    $('#settings-siteinfo').val('Hide');
    $('.siteinfo').removeClass('hidden');
    showsiteinfo = true;
  }
};//END togglesiteinfo

//==================================================
//--------------------------------------------------
//     Nav & Navigation buttons & Navber
//--------------------------------------------------
function navbarBlitz(data) {
  console.log(`navbarBlitz:`);
  clearInterval(blonker);
  var screenWidth = window.innerWidth;
  if((screenWidth / $('.navbar').width()) < 3 ){
    $('.navbar').css({"width":"20%"});
    $('#thenavbarthing').css({"width":"10%"});
    //$('li').animate({"margin-left":"3px"}, 900);
    $('#arrowin').html('<i class="fas fa-chevron-right" title="Click here to Grow Menu"></i>');
    $('#coloricon').addClass('hidden');
    $("#acct").addClass('hidden');
    $("#loans").addClass("hidden");
    $("#lend").addClass("hidden");
    $("#tools").addClass("hidden");
    $("#faq").addClass("hidden");
    $("#wallet").addClass("hidden");
    $("#profile").addClass("hidden");
    $("#futures").addClass("hidden");
    $("#login").addClass('hidden');
    $("#logout").addClass('hidden');
    $("#bugs").addClass('hidden');
    $("#loansmenu").addClass("hidden");
    $("#joinmenu").addClass("hidden");
    $("#profilemenu").addClass('hidden');
    $("#futuresmenu").addClass('hidden');
    $("#jumbotron").css({'height':`'${($("#jumbotron").height() + 5)}%'`});
    return true;
  } else if ((screenWidth / $('.navbar').width()) > 3 ) {
    $('.navbar').css({"width":"99%"});
    $('#thenavbarthing').css({"width":"50%"});
    //$('li').animate({"margin-left":"40px"}, 900);
    $('#arrowin').html('<i class="fas fa-chevron-left" title="Click here to Shrink Menu"></i>');
    setTimeout(function(){
      $('#coloricon').removeClass('hidden');
      $("#acct").removeClass('hidden');
      $("#loans").removeClass("hidden");
      $("#lend").removeClass("hidden");
      $("#tools").removeClass("hidden");
      $("#faq").removeClass("hidden");
      $("#wallet").removeClass("hidden");
      $("#profile").removeClass("hidden");
      $("#futures").removeClass("hidden");
      //$("#login").addClass('hidden').fadein('fast');
      $("#logout").removeClass('hidden');
      $("#bugs").removeClass('hidden');
      $("#loansmenu").removeClass("hidden");
      $("#joinmenu").removeClass("hidden");
      $("#profilemenu").removeClass('hidden');
      $("#futuresmenu").removeClass('hidden');
      $("#jumbotron").css({'height':`'${($("#jumbotron").height() - 5)}%'`});
    }, 900)
    return true;
  } else {
    return false;
  }
};//END navbarBlitz

function navCheck() {
    if(navList){
      if(navList.length >= 100) {
        navList.pop();
        return true;
      } else {
        return true;
      }
    } else {
      console.log(`No Navigation History!`);
      //navList = [];
      return false;
    }
};//END navCheck

async function navLast(u) {
    var lastNav = navList[navList.length - 1];
    if(navList){
      if(u == lastNav){
        return true;
      } else {
        return navList[navList.length - 1];
      }
    } else {
      console.log(`No Navigation History!`);
      //navList = [];
      return false;
    }
};//END navLast

async function navAdd(u) {
    if(navList){
      console.log(`Adding ${u} to Navigation!`)
      if(u){
        var isLast = await navLast(`${u}`);
        if(isLast !== true){
          navList.push(`${u}`);
          navIndex = navList.length - 1;
          if(ourIndex = (navList.length - 1)) {
            ourIndex++;
            navIndex = ourIndex;
            console.log(`ourIndex: ${ourIndex}`)
          } else if((navList.length - 1) <= ourIndex){
            ourIndex = (navList.length - 1);
          } else {
            ourIndex = (navList.length - 1);
          }
          console.log(`ourIndex: ${ourIndex}`)
        } else {
          console.log(`Already Last Nav Entry!`)
        }
        console.log(navList);
        return true;
      } else {
        console.log(`Failed to Add Navigation!`);
        return false;
      }
    } else {
      console.log(`No Navigation History, Adding ${u}!`);
      navList.push(`${u}`);
      return false;
    }
};//END navAdd

function navBack() {
    if(navList){
      if(navList.length < 1) {
        $('#jumboBack').css({"color":"grey"});
        $('#jumboForward').css({"color":"grey"});
        console.log(`No Navigation History!`);
        return false;
      } else {
        $('#jumboBack').css({"color":"white"});
        $('#jumboForward').css({"color":"white"});
        if(ourIndex > 0) {
          ourIndex--;
          console.log(`ourIndex: ${ourIndex}`)
        }
        if(ourIndex == (navList.length - 1)) {
          ourIndex = (navList.length - 2);
          console.log(`ourIndex: ${ourIndex}`)
        }
        $(`#${navList[ourIndex]}`).click();
        return true;
      }
    } else {
      console.log(`No Navigation History!`);
      navList = [];
      return false;
    }
};//END navBack

async function navForward() {
    if(navList){
      if(navList.length < 1) {
        console.log(`No Navigation History!`);
        return false;
      } else {
        if(ourIndex < (navList.length - 1)) {
          ourIndex++;
          console.log(`ourIndex: ${ourIndex}`)
        }
        var isLast = await navLast(`${navList[ourIndex]}`);
        if(isLast == true){
          return navList.pop();
        }
        if(isLast != false){
          return navList.pop();
        }
        $(`#${navList[ourIndex]}`).click();
        return true;
      }
    } else {
      console.log(`No Navigation History!`);
      navList = [];
      return false;
    }
};//END navForward

//==================================================
//--------------------------------------------------
//     Keychain
//--------------------------------------------------
function keychainSend(from, to, amount, memo, coin){
  hive_keychain.requestTransfer(from, to, amount, memo, coin.toUpperCase(), function(response) {
      console.log(response);
      if (response.success == true) {
          showSuccess(`Deposit Transfer Success!<br><sup><sub><a target="_blank" style="color: white !important;" href="https://hiveblocks.com/tx/${response.result.id}">${response.result.id}</a></sub></sup>`);
          //$('#depositView').click();
          setTimeout(function(){
            depositButtonWallet(uUsername, coin);
          },5000);

          bootbox.hideAll();
      } else {
        showErr(`Deposit Failed to Send!`);
        console.log(response.error);
      }
  }, true);
};//END keychainSend

//==================================================
//--------------------------------------------------
//     Hive Power Lease & Leasing
//--------------------------------------------------
function calculateAPR() {
  var e;
  var duration = parseFloat($('#hpleaseduration').val());
  var payment = parseFloat($('#hpleasepayment').val());
  var amount = parseFloat($('#hpleaseamount').val());
  if(!duration) {
    $('#createNewLeaseButton').addClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
    return $('#showCreateLeaseWarning').html(`Please Fill in Above Inputs`);
  }
  if(!payment) {
    $('#createNewLeaseButton').addClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
    return $('#showCreateLeaseWarning').html(`Please Fill in Above Inputs`);
  }
  if(!amount)  {
    $('#createNewLeaseButton').addClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
    return $('#showCreateLeaseWarning').html(`Please Fill in Above Inputs`);
  }
  console.log(`duration: ${duration}`);
  console.log(`payment: ${payment}`);
  console.log(`amount: ${amount}`);
  if(duration > 52){
    $('#hpleaseduration').val(52);
  }
  if(duration < 1) {
    $('#hpleaseduration').val(1);
  }
  if(amount < 1) {
    $('#hpleaseamount').val(1);
  }
  var totalCost = duration * payment;
  console.log(`totalCost: ${totalCost}`)
  var userBal = parseFloat(uHIVEbalance / 1000);


  try {
    e = (365 / (7 * duration + 5) * (.9 * payment) / amount) * 100;
    console.log(e)
  } catch(fuck) {
    e = fuck;
    $('#showCreateLeaseWarning').html(`Please Fill in Above Inputs`);
    $('#createNewLeaseButton').addClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
  }

  if(typeof e !== "number" && typeof e !== NaN) {
    $('#showCreateLeaseWarning').html(`Please Fill in Above Inputs`);
    $('#createNewLeaseButton').addClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
  } else {
    $('#showCreateLeaseWarning').html(`<b>${e.toFixed(4)}</b>% APR - Cost: <b id="boldLeaseTotal">${(totalCost).toFixed(3)} <span class="basetype">HIVE</span> <span class="logospan"><i class="fab fa-hive" style="color:#E31337;"></i></span>`);
    $('#createNewLeaseButton').removeClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
  }
  if(totalCost > userBal){
    console.log(`ERMAGERD WAY TOO MUCH`)
    $('#boldLeaseTotal').css({'color':'#FF0000 !important'});
    $('#createNewLeaseButton').addClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
  } else {
    $('#boldLeaseTotal').css({'color':'#FFFFFF !important'});
    $('#createNewLeaseButton').removeClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', false);
  }
};//END calculateAPR

function leaseMakeShow() {
  console.log(`leaseMakeShow() - ${makeleasetoggle}`)
  if(makeleasetoggle == true) {
    makeleasetoggle = false;

    $('#showCreateLease').text('Show Request Lease');
    $('#createHPLeasewrapper').fadeOut(100);
    $('#createHPLeasewrapper').addClass('hidden');

    $('#leaseholdertd').css({'height':'87%'});
    $('#jumbotron').css({'height':'auto'});
  } else {
    makeleasetoggle = true;
    $('#showCreateLease').text('Hide Request Lease');
    $('#createHPLeasewrapper').fadeIn(100);
    $('#createHPLeasewrapper').removeClass('hidden');
    $('#leaseholdertd').css({'height':'61.5%'});
    $('#jumbotron').css({'height':'auto'});
  }
};//END leaseMakeShow

function createNewLease() {
  var e;
  var duration = parseFloat($('#hpleaseduration').val());
  var payment = parseFloat($('#hpleasepayment').val());
  var amount = parseFloat($('#hpleaseamount').val());
  if(!duration) {
    $('#createNewLeaseButton').addClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
    return $('#showCreateLeaseWarning').html(`Please Fill in Above Inputs`);
  }
  if(!payment) {
    $('#createNewLeaseButton').addClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
    return $('#showCreateLeaseWarning').html(`Please Fill in Above Inputs`);
  }
  if(!amount)  {
    $('#createNewLeaseButton').addClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
    return $('#showCreateLeaseWarning').html(`Please Fill in Above Inputs`);
  }
  console.log(`duration: ${duration}`);
  console.log(`payment: ${payment}`);
  console.log(`amount: ${amount}`);
  if(duration > 52){
    $('#hpleaseduration').val(52);
  }
  if(duration < 1) {
    $('#hpleaseduration').val(1);
  }
  if(amount < 1) {
    $('#hpleaseamount').val(1);
  }
  var totalCost = duration * payment;
  console.log(`totalCost: ${totalCost}`)
  var userBal = parseFloat(uHIVEbalance / 1000);


  try {
    e = (365 / (7 * duration + 5) * (.9 * payment) / amount) * 100;
    console.log(e)
  } catch(fuck) {
    e = fuck;
    $('#showCreateLeaseWarning').html(`Please Fill in Above Inputs`);
    $('#createNewLeaseButton').addClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
  }

  if(typeof e !== "number" && typeof e !== NaN) {
    $('#showCreateLeaseWarning').html(`Please Fill in Above Inputs`);
    $('#createNewLeaseButton').addClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
  } else {
    $('#showCreateLeaseWarning').html(`<b>${e.toFixed(4)}</b>% APR - Cost: <b id="boldLeaseTotal">${(totalCost).toFixed(3)} <span class="basetype">HIVE</span> <span class="logospan"><i class="fab fa-hive" style="color:#E31337;"></i></span>`);
    $('#createNewLeaseButton').removeClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
  }
  if(totalCost > userBal){
    console.log(`ERMAGERD WAY TOO MUCH`)
    $('#boldLeaseTotal').css({'color':'#FF0000 !important'});
    $('#createNewLeaseButton').addClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', true);
  } else {
    $('#boldLeaseTotal').css({'color':'#FFFFFF !important'});
    $('#createNewLeaseButton').removeClass('disabledImg');
    $('#createNewLeaseButton').prop('disabled', false);
  }
};//END createNewLease

//==================================================
//--------------------------------------------------
//     Charts & Chart Data Update
//--------------------------------------------------
function addData(data, chart) {
    if(data == undefined) return;
    if(typeof hivechart == undefined) return;
    console.log(`addData data:`);
    console.log(data);
    var datasets = [{data:data}];
    dataChart.push(datasets);
};//END addData

function removeData(chart) {
      chart.data.labels.pop();
      chart.data.datasets.forEach((dataset) => {dataset.data.pop()});
      chart.update();
};//removeData


//==================================================
  var loansHistoryShow = false;
  function loansHistorySwitch() {
  console.log(`loansHistorySwitch Called! loansHistoryShow: ${loansHistoryShow}`);
  if(loansHistoryShow == false){
    $('#openLoansHistoryType').text(`Open Contracts`);
    $('#centerLoanTableType').text(`Previous`);
    $('#centerExchangeTable').html(`Your Closed Past <span class="loanbase">HIVE</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> Contracts`);
    loansHistoryShow = true;
  } else {
    $('#openLoansHistoryType').text(`Closed Contracts`);
    $('#centerLoanTableType').text(`Current`);
    $('#centerExchangeTable').html(`Your Current Open <span class="loanbase">HIVE</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> Contracts`);
    loansHistoryShow = false;
  }
};//END

  var exchageHistoryShow = false;
  function exchangeHistorySwitch() {
    console.log(`exchangeHistorySwitch Called! exchageHistoryShow: ${exchageHistoryShow}`);
    if(exchageHistoryShow == false){
      $('#openExchangeHistoryType').text(`Open Orders`);
      $('#centerExchangeTable').html(`Your Closed Past <span class="exchangetype">HLSHARE</span> Orders`);
      exchageHistoryShow = true;
    } else {
      $('#openExchangeHistoryType').text(`Your Current Open <span class="exchangetype">HLSHARE</span> Orders`);
      $('#centerExchangeTable').html(``);
      exchageHistoryShow = false;
    }
  };//END

  var cfdHistoryShow = false;
  function cfdHistorySwitch() {
    console.log(`cfdHistorySwitch Called! cfdHistoryShow: ${cfdHistoryShow}`);
    if(cfdHistoryShow == false){
      $('#openFutureHistoryType').text(`Open Positions`);
      $('#centerFuturesTable').html(`Your Closed Past <span class="cfdtype">HIVE</span> Positions`);
      cfdHistoryShow = true;
    } else {
      $('#openFutureHistoryType').text(`Position History`);
      $('#centerFuturesTable').html(`Your Current Open <span class="cfdtype">HIVE</span> Positions`);
      cfdHistoryShow = false;
    }
  };//END cfdHistorySwitch

  function shmdf() {
    console.log(`shmdf() - ${shmdftoggle}`)
    if(shmdftoggle == true) {
      shmdftoggle = false;
      $('#showHideManDep').html('Show');
      $('#mandepinfo').fadeOut();
    } else {
      shmdftoggle = true;
      $('#showHideManDep').html('Hide');
      $('#mandepinfo').fadeIn();
    }
  };//END

  function cmcpricecheck() {
    try {
       fetch(`https://api.coingecko.com/api/v3/coins/listings/latest?vs_currency=usd&ids=hive`)
        .then(res => res.json()).then(json => {
          console.log(json);
        }).catch(e => {console.log(e)});

      } catch(error) {
        console.log(error);
      }
    };//END

var tickerCurrency = function() {
  if(tickercurrency == 'usd'){
    $('#pricecheckcurrencypre').html('<i class="fab fa-bitcoin" style="color:#f2a900;"></i>');
    tickercurrency = 'btc';
    console.log(`tickerCurrency: ${tickercurrency}`);
    $('#footerprice').html(lastHiveBTCPrice.toFixed(8));
    $('#footerprice').val(lastHiveBTCPrice.toFixed(8));
    $('#pricetype').html(tickercurrency.toUpperCase());
  } else if(tickercurrency == 'btc'){
    $('#pricecheckcurrencypre').html('$');
    tickercurrency = 'usd';
    console.log(`tickerCurrency: ${tickercurrency}`);
    $('#footerprice').html(lastHivePrice.toFixed(6));
    $('#footerprice').val(lastHivePrice.toFixed(6));
    $('#pricetype').html(tickercurrency.toUpperCase());
  }
};//END

var btcCurrency = function() {
    $('#pricecheckcurrencypre').html('<i class="fab fa-bitcoin" style="color:#f2a900;"></i>');
    tickercurrency = 'btc';
    console.log(`tickerCurrency: ${tickercurrency}`);
    $('#footerprice').html(lastHiveBTCPrice.toFixed(8));
    $('#footerprice').val(lastHiveBTCPrice.toFixed(8));
    $('#pricetype').html(tickercurrency.toUpperCase());
};//END

var usdCurrency = function() {
    $('#pricecheckcurrencypre').html('$');
    tickercurrency = 'usd';
    console.log(`tickerCurrency: ${tickercurrency}`);
    $('#footerprice').html(lastHivePrice.toFixed(6));
    $('#footerprice').val(lastHivePrice.toFixed(6));
    $('#pricetype').html(tickercurrency.toUpperCase());
};//END


function getSiteStats() {
  $("#sitestatsBal").html(`<b>HIVE Balance</b>:<br>Loading<br>`);
  $("#recName").css({"color":"black"});
  $("#recName").html(`Loading`);
  $("#recAlert").html(``);
  hive.api.getAccounts(['hive.loans'], function(err, result) {
    if(err){return alert(`Failed to fetch site stats!\n${err}`)}
    if(result){
      console.log(result);
      var res = result[0];
      var statsName = res.name;
      console.log(statsName)
      var acct = res.account;
      var statsBal = res.balance;
      var statsHBDBal = res.hbd_balance;
      var hivePower = parseInt(res.vesting_shares);
      $("#sitestatsName").html(`@${statsName}`);
      $("#sitestatsBal").html(`<b>HIVE Balance</b>:<br>${statsBal}<br>`);
    }
  /*
  <div style="font-size:1.5em;width:100%;"><span id="sitestatssMove" title="Click and Drag to Move Window"><i class="fas fa-arrows-alt"></i></span><span id="sitestatsName" style="display: inline-block">Site Statistics</span><span id="refreshSiteStats" style-"float:right" title="Click to Refresh" onClick="getSiteStats();"><i class="fas fa-sync"></i></span></div><hr class="allgrayeverythang">
  <span id="sitestatsWrapper">
  <span id="sitestatsBal"><b>Available HIVE Pool</b>:<br>Loading<br></span>
  <span id="siteLoaned"><b>HIVE Loaned Out</b>:<br>Loading<br></span><br>
  <span id="sitePaid"><b>HIVE Repaid</b>:<br>Loading<br></span><br>
  <span id="siteOnLoan"><b>HIVE Outstanding</b>:<br></span><br>
  */
});
};//END



async function getAcct() {
  console.log(`getAcct called`);
  if(hkcLogin == true){
     await hive.api.getAccounts([user], async function(err, result) {
      if(err){ console.log(err)}
      if(result){
      //result = JSON.parse(JSON.stringify(result));
      resultData = result
      //var hivePowerCalc = await hive.formatter.estimateAccountValue(result);
      //console.log(`hivePowerCalc`)
      //console.log(hivePowerCalc)
      var total_vesting_shares;
      var total_vesting_fund;
      resultData = resultData[0];
      var statsName = result.name;
      var acct = result.account;
      var statsBal = result.balance;
      var statsBalTop = result.balance;
      var statsHBDBal = result.hbd_balance;
      var recoverAcct = result.recovery_account;
      var hivePower = parseInt(result.vesting_shares);
      $("#userouthivebalance").text(`${statsBalTop}`);
      $("#userouthbdbalance").text(`${statsHBDBal}`);
      $("#statsName").text(`@${statsName}`);
      $("#statsBal").html(`<b>HIVE Balance</b>:<br>${statsBal}<br>`);
      $("#lendingBalance").html(`${statsBal} HIVE`);
      $("#statsBalTop").html(`<b>${statsBalTop} ${statsHBDBal}</b>`);
      $("#statHBDsBal").html(`<b>HBD Balance</b>:<br>${statsHBDBal}<br>`);
      $("#recoverAcct").html(`<b>Recovery Account</b>:<span id="recName">${recoverAcct}</span><br>`);
      $("#profileRecoverAcct").html(`<span id="precacct">${recoverAcct}</span>`);
      $("#showRecAcct").text(`@${recoverAcct}`);
      await hive.api.getDynamicGlobalProperties( await function(err, result) {
        if(err){console.log(err)}
        total_vesting_shares = parseInt(result.total_vesting_shares);
        total_vesting_fund = parseInt(result.total_vesting_fund_hive);
        hiveVested = ( Number(total_vesting_fund) *  Number(hivePower) ) / Number(total_vesting_shares);
        $("#hivePowerHeld").html(`<b>HIVE Power</b>:<br>${toThree(hiveVested)}<br>`);
        $("#loansHPdisplay").html(`<span id="hplevel">${toThree(hiveVested)}</span> HP<br>`);
        loanMax = parseFloat(hiveVested * 0.7);
        if(recoverAcct !== 'hive.loans' && recoverAcct !== 'anonsteem' && recoverAcct !== 'beeanon' && recoverAcct !== 'blocktrades' && recoverAcct !== 'someguy123') {
          $("#recName").css({"color":"red"});
          $("#precacct").css({"color":"red"});
          $("#loanEnabled").css({"color":"red"});
          $("#prawarn").css({"color":"red"});
          $("#showRecAcct").css({"color":"red"});
          $("#prawarn").html(`❌ Incompatible Recovery Account! <b><a href="#" id="changeRecoveryAcct" style="color:white !important; text-decoration:none !important;" onClick="showRecoveryPanel();">Change Recovery Account</a></b>`);
          $("#loanEnabled").html(`<i class="fa fa-exclamation-triangle" style="color:gold;" aria-hidden="true"></i> Incompatible Recovery Account!<br><center><b><a href="#" id="changeRecoveryAcct" style="color:white !important; text-decoration:none !important;" onClick="showRecoveryPanel();"><sup><i class="fas fa-fw fa-users-cog"></i> Click Here to Change Recovery Account</sup></a></b></center>`);
          $("#recAlert").html(`<sub><b style="color:red;">Recovery Account Invalid!</b><br>Please set @hive.loans as recovery account!<br><br>Click here to change recovery account<br><sub>( This will take 30 days to complete )</sub></sub>`);
        } else {
          $("#recName").css({"color":"lawngreen"});
          $("#precacct").css({"color":"lawngreen"});
          $("#loanEnabled").css({"color":"lawngreen"});
          $("#prawarn").css({"color":"white"});
          $("#showRecAcct").css({"color":"lawngreen"});
          $("#prawarn").text(`✔️`);
          $("#loanEnabled").html(`Your Account is Cleared to Accept Lending Contracts! ✔️<br>`);
          $("#recAlert").html(`<sub><b style="color:lawngreen;">Recovery Account Valid!</b><br><code onclick="showLoans()">You're ready to borrow! Remember to follow the site guidelines while lending..</code></sub>`);
        }
      });
    };
    });
  } else {
    hivesignerclient.me(function (err, res) {
      if(err){
        console.log(err);
      }
      //var link = client.getLoginURL(state);
      var total_vesting_shares;
      var total_vesting_fund;
      var hiveVested;
      console.log(res);
      var statsName = res.name;
      var acct = res.account;
      var statsBal = acct.balance;
      var statsBalTop = acct.balance;
      var statsHBDBal = acct.hbd_balance;
      var recoverAcct = acct.recovery_account;
      var hivePower = parseInt(acct.vesting_shares);
      hive.api.getDynamicGlobalProperties(function(err, result) {
        if(err){console.log(err)}
        total_vesting_shares = parseInt(result.total_vesting_shares);
        total_vesting_fund = parseInt(result.total_vesting_fund_hive);
        hiveVested = ( Number(total_vesting_fund) *  Number(hivePower) ) / Number(total_vesting_shares);
        $("#hivePowerHeld").html(`<b>HIVE Power</b>:<br>${toThree(hiveVested)}<br>`);
        $("#loansHPdisplay").html(`<span id="hplevel">${toThree(hiveVested)}</span> HP<br>`);
        loanMax = parseFloat(hiveVested * 0.7);
        if(recoverAcct !== 'hive.loans' && recoverAcct !== 'anonsteem' && recoverAcct !== 'beeanon' && recoverAcct !== 'blocktrades' && recoverAcct !== 'someguy123') {
          $("#recName").css({"color":"red"});
          $("#precacct").css({"color":"red"});
          $("#loanEnabled").css({"color":"red"});
          $("#prawarn").css({"color":"red"});
          $("#showRecAcct").css({"color":"red"});
          $("#prawarn").html(`Incompatible Recovery Account!<br><center><b><a href="#" id="changeRecoveryAcct" style="color:white !important; text-decoration:none !important;" onClick="showRecoveryPanel();">Click Here to Change Recovery Account</a></b></center>`);
          $("#loanEnabled").html(`<i class="fa fa-exclamation-triangle" style="color:gold;" aria-hidden="true"></i> Incompatible Recovery Account!<br><center><b><a href="#" id="changeRecoveryAcct" style="color:white !important; text-decoration:none !important;" onClick="showRecoveryPanel();"><sup><i class="fas fa-fw fa-users-cog"></i> Click Here to Change Recovery Account</sup></a></b></center>`);
          $("#recAlert").html(`<sub><b style="color:red;">Recovery Account Invalid!</b><br>Please set @hive.loans as recovery account!<br><br>Click here to change recovery account<br><sub>( This will take 30 days to complete )</sub></sub>`);
        } else {
          $("#recName").css({"color":"lawngreen"});
          $("#precacct").css({"color":"lawngreen"});
          $("#loanEnabled").css({"color":"lawngreen"});
          $("#prawarn").css({"color":"white"});
          $("#showRecAcct").css({"color":"lawngreen"});
          $("#prawarn").text(`Compatible Recovery Account!`);
          $("#loanEnabled").html(`Your Account is Cleared to Accept Lending Contracts! ✔️<br>`);
          $("#recAlert").html(`<sub><b style="color:black;">Recovery Account Valid!</b><br>You're ready to borrow! Remember to follow the site guidelines while lending.<br><sub>( Attempts to cheat the system have fees )</sub></sub>`);
        }
      });
      $("#statsName").text(`@${statsName}`);
      $("#statsBal").html(`<b>HIVE Balance</b>:<br>${statsBal}<br>`);
      $("#statsBalTop").html(`<b>${statsBalTop} ${statsHBDBal}</b>`);
      $("#lendingBalance").text(`${statsBal} HIVE`);
      $("#statHBDsBal").html(`<b>HBD Balance</b>:<br>${statsHBDBal}<br>`);
      $("#recoverAcct").html(`<b>Recovery Account</b>:<span id="recName">${recoverAcct}</span><br>`);
      $("#profileRecoverAcct").html(`<span id="precacct">${recoverAcct}</span>`);
      $("#showRecAcct").text(`@${recoverAcct}`);
  });
  }
};//END

function deposit(amount, type, memo){
  const op = ['transfer', {
    from: '__signer',
    to: 'hive.loans',
    amount: amount + " " + type.toUpperCase(),
    memo: memo
  }];
  hivesigner.sendOperation(op, {}, function(err, result) {
    if(err){showErr("Transfer Failed to Send!")}
    if(result){
      return console.log(result);
    }
  });
};//END

function sendPopup(type, addess){
  var dep = window.prompt(`How Much ${type} do You Wish to Deposit?`, "");
  if (!dep) {
    console.log(`User Cancelled the Deposit`);
  }
  if(dep <= 0){
    showErr("Your Deposit Must be Greater Than 0!");
  } else if (isNaN(dep)) {
    showErr("Invalid Deposit Amount!");
  } else {
    deposit(dep, type, uAddress);
  }
};//END

// time rewuired format: 'MM/DD/YYYY 0:0 AM'
//CountDownTimer('02/19/2012 10:1 AM', 'countdown');
//CountDownTimer('02/20/2012 10:1 AM', 'newcountdown');
//<div id="countdown"></div>
//<div id="newcountdown"></div>

function reloadPricePopup() {
  $('#alertPriceWrapper').html(`<iframe id="alertPriceIframe" onload="$('#alertpricepanel').hide();" src="https://www.worldcoinindex.com/widget/renderWidget?size=large&from=HIVE&to=usd&name=Hive&clearstyle=false"></iframe>`);
};//END

function getUserProfile(user) {
  //showSuccess(`Fetching ${user}'s Profile'`);
  viewUserProfile(user);
  window.open(`https://peakd.com/@${user}`);
};//END


function getUserBlog(user) {
  showSuccess(`Opening ${user}'s Blog on Peakd.com '`);
  window.open(`https://peakd.com/@${user}`);
};//END

async function withdrawButton() {
  socket.emit('withdrawopen', {user: $('#usernamestore').val()}, function(err, data){
    if(err) {
      console.log(`socket.emit('withdrawopen' err:`)
      console.log(err);
      showErr(`Something Went Wrong! Reloading!`);
      logout();
    }
    if(data) {
      console.log(`socket.emit('withdrawopen' data:`)
      console.log(data);
      if(data.twofactor){

      } else {

      }
    }
  })
};//END

/*
function CountDownTimer(dt, id) {
    var end = new Date(dt);
    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var timer;
    function showRemaining() {
        flashsec($('#countdown'));
        var now = new Date();
        var distance = end - now;
        if (distance < 0) {
            clearInterval(timer);
            var winnner = $('#currentWinner').val();
            document.getElementById(id).innerHTML = "Winner is: " + winnner;
            return;
        }
        var days = Math.floor(distance / _day);
        var hours = Math.floor((distance % _day) / _hour);
        var minutes = Math.floor((distance % _hour) / _minute);
        var seconds = Math.floor((distance % _minute) / _second);
        document.getElementById(id).innerHTML = days + 'days ';
        document.getElementById(id).innerHTML += hours + 'hrs ';
        document.getElementById(id).innerHTML += minutes + 'mins ';
        document.getElementById(id).innerHTML += seconds + 'secs';
    }
    timer =setInterval(showRemaining, 1000);
}
*/

//========================================================================


//==================================================
//--------------------------------------------------
//     Loan Contracts & Borrowing
//--------------------------------------------------
function acceptContract(contractID) {
  showSuccess(`Grabbing Contract #${contractID}`);
  socket.emit('acceptloan', {loanId: contractID, token: token}, function(err, data){

      if(err) {
        showPopup(err, 'error');
        token = data.token;
        console.log(err)
        return showErr(err);
      }
      if(data) {
        console.log(`acceptContract(contractID):`);
        console.log(data);
        token = data.token;
        showAcctSurrenderPanel(data.username, data.loanData.loanId, data.limit, data.loanData, data.pgppublic);
        return showSuccess(`Get Contract #${contractID}`);
        //showErr(`ERROR: Cannot Complete Lending Contract Request!\nThis site is under construction and not yet fully operational!\n\nWith your current Hive Power you could borrow up to ${data.limit} HIVE!\n\nLooking forward to launch, hope to see you there!`);
      }
  })
};//END acceptContract

function cancelContract(contractID, seedID) {
  if(debug) console.log(`cancelContract(${contractID}, ${seedID});`);
  if(!contractID){
    if(debug) console.log(`ERROR: Variable loanId is Undefined!`);
    contractID = 'none';
  }
  if(!seedID){
    if(debug) console.log(`ERROR: Variable seedID is Undefined!`);
    seedID = 'none';
  }
  /*
  if(state === undefined){
    return showErr(`ERROR: Variable state is Undefined!`);
  }
  if(state == 'accepted') return showErr(`Cannot Cancel Active Contract!`);
  if(state == 'finished') return showErr(`Cannot Cancel Finished Contract!`);
  if(state == 'cancelled') return showErr(`Cannot Cancel Cancelled Contract!`);
  if(state == 'deployed') showSuccess(`Attempting to Cancel Deployed Contract`);
  */
  socket.emit('cancelloan', {loanId: contractID, seedId: seedID, token: token}, function(err, data){
      if(err) {
        console.log(err)
        showErr(err);
        //showPopup(err, 'error');
        token = data.token;
        console.log(err)
      }
        console.log(data)
        token = data.token;
        showSuccess(`Attempting to Cancel Contract #${data.contractID}`);
  })
};//END cancelContract

var processState = async(data, history) => {
  console.log(`var processState = async(data, history)`);
    console.log(`data:`);
  console.log(data);
    console.log(`history:`);
  console.log(history);
  if(!data) return false;
  if(!history) history = false;
  var loans = data;
  var ourloans = [];
 loans.map(function(key) {
   if(key.borrower == uUsername && key.completed == 0 && key.active == 1){
     if (key.cancelled !== -1) {
         delete key.cancelled;
     }
     if (key.id !== -1) {
         delete key.id;
     }
     if (key.active !== -1) {
         delete key.active;
     }
     if (key.createdAt !== -1) {
         delete key.createdAt;
     }
       ourloans.push(key);
   } else {
     if(history == false){
       if(key.completed == 1) {
        return delete key;
       }
       delete key.id;
       delete key.userId;
       delete key.txid;
       delete key.endtxid;
       delete key.collected;
       delete key.nextcollect;
       delete key.currentpayments;
       delete key.totalpayments;
       delete key.payments;
       //delete key.createdAt;
       delete key.updatedAt;
       ourloans.push(key);
     }
      /*
      delete key.createdAt;
      delete key.nextcollect;
            delete key.genesis;
                  delete key.borrower;
                        delete key.username;
                        delete key.endblock;
                                                delete key.endblocktxid;
      delete key.fine;
      delete key.deployfee;
      delete key.cancelfee;
      delete key.updatedAt;
      delete key.txid;
      */
   }
  });
  /*
  if(!data) {data = []};
  if(!ourloans) {ourloans = []};
  function CreateTableFromJSON(data, name, elementid, tablename, tableheadname) {
  */
  return CreateTableFromJSON(ourloans, 'loans', 'loanChartHolder', 'loanMixedChartTable', 'loanMixedChartHead');
};//END processState

function loanCreateInterestWrangler(){
  if(!usersDataFetch.rank) return;
  var feemax;
  var feemin;
  switch(usersDataFetch.rank){
    case 'user':
    feemin = 10;
    feemax = 30;
    break;
    case 'founder':
    feemin = 10;
    feemax = 30;
    break;
    case 'backer':
    feemin = 10;
    feemax = 35;
    break;
    case 'benefactor':
    feemin = 10;
    feemax = 30;
    break;
    case 'owner':
    feemin = 0;
    feemax = 1000;
    break;
    default:
    feemin = 10;
    feemax = 30;
  }
  setTimeout(function(){
    if($("#loanCreateInterest").val() <= feemin) {
     $("#loanCreateInterest").val(feemin.toFixed(0));
      return $("#loanCreateInterest").keyup();
    } else if ($("#loanCreateInterest").val() >= feemax) {
       $("#loanCreateInterest").val(feemax.toFixed(0));
      return $("#loanCreateInterest").keyup();
    } else {
      var isAmt = $("#loanCreateInterest").val();
      isAmt = parseInt(isAmt);
      $("#loanCreateInterest").val(isAmt);
      return $("#loanCreateInterest").keyup();
    }
  },666);

};//END loanCreateInterestWrangler

function createMainLoanPreview() {
  var newAmount;
  var newDays;
  var newFee;
  newAmount = parseFloat($('#loanCreateAmount').val());
  newDays = parseInt($('#loanCreateDuration').val());
  newFee =  parseInt($('#loanCreateInterest').val());
  console.log(newAmount);
  console.log(newDays);
  console.log(newFee);
  if ((newDays % 7) !== true){
    $('#loanCreateDuration').css({'color':'red'});
  } else {
    $('#loanCreateDuration').css({'color':'white'});
  }
  if(newAmount < 1){
  //  $('#newLendAmount').val(1);
  }
  if(newAmount > $('#statsBal').val()){
  //  $('#createLoanWarning').val(`Deposit More HIVE to Afford Loan Creation of This Size!`);
  }
  if(newFee < 10){
    //$('#newLendFee').val(10);
  }
  if(newFee > 10){
    //$('#newLendFee').val(30);
  }

  var feerank;
  switch(usersDataFetch.rank){
    case 'user':
    feerank = 1;
    break;
    case 'founder':
    feerank = 0.5;
    break;
    case 'backer':
    feerank = 1;
    break;
    case 'benefactor':
    feerank = 0;
    break;
    case 'owner':
    feerank = 1;
    break;
    default:
    feerank = 1;
  }
  console.log(`feerank:`);
  console.log(feerank);
  newFee = (newFee / 100);
  var feedown = ((newAmount / feerank) / 100);
  console.log(`feedown: ${feedown}`);
  var preview = (newAmount * newFee);
  var deployfee = (preview * 0.01);
  console.log(`deployfee: ${deployfee}`);

  var cancelfee = ((preview * (newFee / 10) * feerank));
  console.log(`cancelfee: ${cancelfee}`);
  var commission = (preview / 10);
  var dailypreview = (preview / newDays);
  var daysrepays = (newDays / 7);
  var weeklyrepay = (dailypreview * 7);
  preview = ((newAmount * newFee) + newAmount);
  if (daysrepays == 1) weeklyrepay = preview;
  var previewparse = parseFloat(preview);
  previewparse = previewparse.toString();
   console.log(previewparse)
  if(previewparse != 'NaN' ) {
    $('#loanCreateFeedbackReturn').html(`${preview.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i> <i class="fas fa-fw fa-info-circle" title="( minus a ${commission.toFixed(3)} HIVE site commission fee (10%) )"></i> over ${newDays} Days`);
    $('#loanCreateFeedbackDaily').html(`${(weeklyrepay).toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
    //$('#loanCreateFeedbackCommission').html(``)
    $('#difee').val(`${commission.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
    $('#difee').html(`${commission.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
    $('#clfee').val(`${cancelfee.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
    $('#clfee').html(`${cancelfee.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
    $('#dlfee').val(`${deployfee.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
    $('#dlfee').html(`${deployfee.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
  } else {
    //$('#loanCreateFeedback').html(`<center>Fill in Above Inputs</center>`);
  }
};//END createMainLoanPreview

function createMainBorrowPreview() {
  var newAmount;
  var newDays;
  var newFee;
  newAmount = parseFloat($('#borrowCreateAmount').val());
  newDays = parseInt($('#borrowCreateDuration').val());
  newFee =  parseInt($('#borrowCreateInterest').val());
  console.log(newAmount);
  console.log(newDays);
  console.log(newFee);
  if ((newDays % 7) !== true){
    $('#borrowCreateDuration').css({'color':'red'});
  } else {
    $('#borrowCreateDuration').css({'color':'white'});
  }
  if(newAmount < 1){
  //  $('#newLendAmount').val(1);
  }
  if(newAmount > $('#statsBal').val()){
  //  $('#createLoanWarning').val(`Deposit More HIVE to Afford Loan Creation of This Size!`);
  }
  if(newFee < 10){
    //$('#borrowCreateInterest').val(10);
  }
  if(newFee > 30){
    //$('#borrowCreateInterest').val(30);
  }

  var feerank;
  switch(usersDataFetch.rank){
    case 'user':
    feerank = 1;
    break;
    case 'founder':
    feerank = 0.5;
    break;
    case 'backer':
    feerank = 1;
    break;
    case 'benefactor':
    feerank = 0;
    break;
    case 'owner':
    feerank = 1;
    break;
    default:
    feerank = 1;
  }

  console.log(`feerank:`);
  console.log(feerank);
  newFee = (newFee / 100);
  var feedown = ((newAmount / feerank) / 100);
  console.log(`feedown: ${feedown}`);
  var preview = (newAmount * newFee);
  var deployfee = (preview * 0.01);
  console.log(`deployfee: ${deployfee}`);

  var cancelfee = ((preview * (newFee / 10) * feerank));
  console.log(`cancelfee: ${cancelfee}`);
  var commission = (preview / 10);
  var dailypreview = (preview / newDays);
  var daysrepays = (newDays / 7);
  var weeklyrepay = (dailypreview * 7);
  preview = ((newAmount * newFee) + newAmount);
  if (daysrepays == 1) weeklyrepay = preview;
  var previewparse = parseFloat(preview);
  previewparse = previewparse.toString();
   console.log(previewparse)
  if(previewparse != 'NaN' ) {
    $('#borrowCreateFeedbackReturn').html(`${preview.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i> <i class="fas fa-fw fa-info-circle" title="( minus a ${commission.toFixed(3)} HIVE site commission fee (10%) )"></i> over ${newDays} Days`);
    $('#borrowCreateFeedbackDaily').html(`${(weeklyrepay).toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
    //$('#loanCreateFeedbackCommission').html(``)
    $('#dbfee').val(`${commission.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
    $('#dbfee').html(`${commission.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
    $('#cbfee').val(`${cancelfee.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
    $('#cbfee').html(`${cancelfee.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
    $('#dpfee').val(`${deployfee.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
    $('#dpfee').html(`${deployfee.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i>`);
  } else {
    //$('#loanCreateFeedback').html(`<center>Fill in Above Inputs</center>`);
  }
};//END createMainBorrowPreview

function createLoanPreview() {
  var newAmount;
  var newDays;
  var newFee;
  newAmount = parseInt($('#newLendAmount').val());
  newDays = parseInt($('#newLendDays').val());
  newFee =  parseInt($('#newLendFee').val());
  if ((newDays % 7) !== true){
    $('#newLendDays').css({'color':'red'});
  } else {
    $('#newLendDays').css({'color':'white'});
  }
  if(newAmount < 1){
  //  $('#newLendAmount').val(1);
  }
  if(newAmount > $('#statsBal').val()){
  //  $('#createLoanWarning').val(`Deposit More HIVE to Afford Loan Creation of This Size!`);
  }
  if(newFee < 10){
    //$('#newLendFee').val(10);
  }
  if(newFee > 10){
    //$('#newLendFee').val(30);
  }
  var feerank;
  switch(usersDataFetch.rank){
    case 'user':
    feerank = 1;
    break;
    case 'founder':
    feerank = 0.5;
    break;
    case 'backer':
    feerank = 1;
    break;
    case 'benefactor':
    feerank = 0;
    break;
    case 'owner':
    feerank = 0;
    break;
  }

  newFee = (newFee / 100);
  var feedown = ((newAmount / feerank) / 100);
  console.log(`feedown: ${feedown}`);
  var preview = (newAmount * newFee);
  var deployfee = ((newAmount * feedown) / 100);
  console.log(`deployfee: ${deployfee}`);
  var cancelfee = ((newAmount * feedown) / 100);
  console.log(`cancelfee: ${cancelfee}`);
  var commission = (preview / 10);
  var dailypreview = (preview / newDays);
  var daysrepays = (newDays / 7);
  var weeklyrepay = (dailypreview * 7);
  preview = ((newAmount * newFee) + newAmount);
  var previewparse = parseFloat(preview);
  previewparse = previewparse.toString();
   console.log(previewparse)
  if(previewparse != 'NaN' ) {
    $('#createLoanPreview').html(`<center>This Lending Contract will Return ${preview.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i> <i class="fas fa-fw fa-info-circle" title="( minus a ${commission.toFixed(3)} HIVE site commission fee (10%) )"></i> over ${newDays} Days.<br>Yielding Roughly ~ ${dailypreview.toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i> Profit per Day.</center>`);
  } else {
    $('#createLoanPreview').html(`<center>Please enter valid amounts in the fields above to get a preview of the loan contract</center>`);
  }
};//END createLoanPreview

//==================================================
//--------------------------------------------------
//     Audit & Security
//--------------------------------------------------
function siteAuditData(data) {
  console.log(`siteAuditData Fired!`);
  if(data) console.log(data);
  if(typeof siteAudit[0] != undefined && typeof siteAudit[1] != undefined && typeof siteAudit[2] != undefined){
    try {
      console.log(`siteAudit:`);
      console.log(siteAudit);
      theDATA = siteAudit[0];
      console.log(`theDATA:`);
      console.log(theDATA);
      theWALLET = siteAudit[1].wallets;
      console.log(`theWALLET:`);
      console.log(theWALLET);
      theWDFEES = siteAudit[2].wdfees;
      hotWalletBalance = parseFloat(theWALLET[0].balance);
      coldWalletBalance = parseFloat(theWALLET[1].balance);
      newUpdateDate = theDATA.date;
      siteAccts = theDATA.usersstate;
      console.log(`siteAccts:`);
      console.log(siteAccts);
      siteLoans = theDATA.loansstate;
      siteLoansArray = theDATA.loansstate;
      console.log(`siteLoans:`);
      console.log(siteLoans);
      siteActiveLoans = 0;
      siteActiveLends = 0;
      usersBal = 0;
      //siteAccts = siteAccts.length;
      siteAcctsActive = 0;
      siteAcctsDormant = 0;
      siteAcctsOwned = 0;
      //siteLoans = siteLoans.length;
      siteActive = 0;
      siteAvailable = 0;
      siteCompleted = 0;
      siteCancelled = 0;
      siteActiveLoans = 0;
      siteActiveLends = 0;
      siteTotalCollected = 0;
      siteDeployFee = 0;
      siteCancelFee = 0;
      siteFineFee = 0;
      siteCommissionFee = 0;
      siteTotalFee = 0;
      siteTotalActive = 0;
      siteTotalAllTime = 0;
      var userIndex = [];
      for(i in siteAccts){
        if(debug == true){
          console.log(siteAccts[i]);
        }
        var userID = siteAccts[i].userId;
        userIndex.push(userID);
        userIndex[userID] = theDATA.usersstate[i];
        var userActiveDate = new Date(theDATA.usersstate[i].updatedAt);
        var dateNow = new Date();
        dateNow.setDate(dateNow.getDate() - 30);
        if(dateNow > userActiveDate){
          siteAcctsDormant++;
        } else {
          siteAcctsActive++;
        }
        usersBal += (theDATA.usersstate[i].hivebalance / 1000);
        siteActiveLoans += theDATA.usersstate[i].activeloans;
        siteActiveLends += theDATA.usersstate[i].activelends;
        siteAcctsOwned += theDATA.usersstate[i].activeloans;
      }
      if(debug == true){
        console.log(`userIndex:`);
        console.log([userIndex]);
      }
      //console.log(userIndex[userID]);
      for(k in siteLoans){
        var interestPercentage = siteLoansArray[k]['interest'] / 100;
        var rankModifier = 0;
        var loanUser = siteLoans[k].userId;
        var userState = userIndex[loanUser];
        if(debug == true){
          console.log(`loanUser: ${loanUser}`);
          console.log(`userState: ${userState}`);
        }
        var userRank = userState.rank;
          switch(userRank){
            case 'user':
              rankModifier = 1;
            break;
            case 'founder':
              rankModifier = 0.5;
            break;
            case 'backer':
              rankModifier = 1;
            break;
            case 'benefactor':
              rankModifier = 0;
            break;
            case 'owner':
              rankModifier = 0;
            break;
          }

        siteCommissionFee += (((interestPercentage * (siteLoans[k].amount / 1000))) * rankModifier);
        siteDeployFee += parseFloat((siteLoansArray[k].deployfee / 1000).toFixed(3));
        siteFineFee += parseFloat((siteLoansArray[k].fine / 1000).toFixed(3));
        switch(siteLoans[k].state){
          case "finished":
            siteCompleted++;
            siteTotalCollected += (siteLoansArray[k].collected / 1000);
            //siteTotalActive -= parseFloat((theDATA.loansstate[k].amount / 1000).toFixed(3));
            siteTotalAllTime += parseFloat((siteLoansArray[k].amount / 1000).toFixed(3));
          break;
          case "deployed":
            siteAvailable++;
            siteTotalActive += parseFloat((siteLoansArray[k].amount / 1000).toFixed(3));
            siteTotalCollected += parseFloat((siteLoansArray[k].collected / 1000).toFixed(3));
            siteTotalAllTime += parseFloat((siteLoansArray[k].amount / 1000).toFixed(3));
          break;
          case "cancelled":
            siteCancelled++;
            siteCancelFee += parseFloat((siteLoansArray[k].cancelfee / 1000).toFixed(3));
            //siteTotalActive -= parseFloat((theDATA.loansstate[k].amount / 1000).toFixed(3));
          break;
          case "accepted":
            siteActive++;
            siteTotalActive += parseFloat((siteLoansArray[k].amount / 1000).toFixed(3));
            siteTotalCollected += parseFloat((siteLoansArray[k].collected / 1000).toFixed(3));
            siteTotalAllTime += parseFloat((siteLoansArray[k].amount / 1000).toFixed(3));
          break;
        }
      }

      siteTotalFee = parseFloat(siteDeployFee) + parseFloat(siteCancelFee) + parseFloat(siteFineFee) + parseFloat(siteCommissionFee) + parseFloat(theWDFEES);
      totalCustodial = hotWalletBalance + coldWalletBalance;
      var totalNeededCustodial = siteTotalActive + usersBal;
      var totalExtra = totalCustodial - totalNeededCustodial;
      $('#audit-hot').val(hotWalletBalance.toFixed(3));
      $('#audit-cold').val(coldWalletBalance.toFixed(3));
      $('#audit-extras').val(totalExtra.toFixed(3));
      if(parseFloat(totalExtra) < 0){
        var alert = `<i class="fa fa-exclamation-triangle sexyblackoutline" style="color:gold;" title="AUDIT FAILED! Value is Less Than Expected!" aria-hidden="true"></i>`;
        $('#audit-extras').css({"color":"red !important"});
      } else if (parseFloat(totalExtra) >= 0) {
        $('#audit-extras').css({"color":"lawngreen !important"});
      }
      $('#audit-lockedtotal').val(siteTotalActive.toFixed(3));
      $('#audit-sitebal').val(totalCustodial.toFixed(3));
      $('#audit-accounts').val(siteAccts.length);
      $('#audit-activeaccts').val(siteAcctsActive);
      $('#audit-dormant').val(siteAcctsDormant);
      $('#audit-collateral').val(siteAcctsOwned);
      $('#audit-update').val(newUpdateDate);
      $('#audit-userbal').val(usersBal.toFixed(3));
      $('#audit-active').val(siteActive);
      $('#audit-available').val(siteAvailable);
      $('#audit-completed').val(siteCompleted);
      $('#audit-cancelled').val(siteCancelled);
      $('#audit-loantotal').val(siteTotalActive.toFixed(3));
      $('#audit-returntotal').val(siteTotalCollected.toFixed(3));
      $('#audit-createfee').val((siteDeployFee / 1000).toFixed(3));
      $('#audit-interestfee').val((siteCommissionFee / 1000).toFixed(3));
      $('#audit-cancelfee').val((siteCancelFee / 1000).toFixed(3));
      if(typeof theWDFEES != null) {
        console.log(`theWDFEES`);
        console.log(theWDFEES);
        //$('#audit-withdrawfee').val((theWDFEES[0] / 1000).toFixed(3));
      }
      $('#audit-finesfee').val((siteFineFee / 1000).toFixed(3));
      $('#audit-totalfee').val((siteTotalFee / 1000).toFixed(3));

    } catch(e) {
      console.log(`siteAudit ERROR:`);
      console.log(e);
      //showErr(e);
    }
  } else {
    console.log(`siteAudit Data Undefined!`);
  }
};//END siteAuditData

function fetchAudit(data) {
  socket.emit('loadaudit', {token: token}, function(err, data){
    if(err) {
      console.log(err);
      showErr(err);
    }
    if(data) {
      siteAudit = data;
      siteAuditData();
    }
  });
};//END fetchAudit

async function payContract(contractID) {
  socket.emit('payLoanIdDirect', {
      loanId: contractID,
      token: token
  }, await function(err, data) {
    if(err){
       console.log(err);
       showErr(err);
    }
    if(data){
      console.log(data);
      showRepayWindow(data.loandata);
    }
  })
};//END payContract

async function payloan(user, contractID, sendamount) {
  socket.emit('confirmpayLoanIdDirect', {
    username: user,
    loanId: contractID,
    amount: sendamount,
    token: token}, await function(err, data) {
      if(err){
        showErr(err);
        console.log(err);
      }
      if(data){
        showSuccess(data);
        console.log(data);
      }
    });

};//END payloan

function infoContract(data) {
    data = JSON.parse(data);
    console.log(data);
    var newinterest = (data.interest / 100);
    data.totalpayments = (data.days / 7);
    var totalrepay =  data.amount + (data.amount * newinterest);
    var paymentSum = totalrepay / data.totalpayments;
    if(data.borrower == null){
      data.borrower = null;
    }
    if(data.active == 0){
      if(data.completed === 0){
        if(data.username != uUsername){
          data.active = `<center><button class="button" style="float:left;font-size:small;" id="acceptButton" onclick="acceptContract('${data.loanId}');">Accept <i class="fas fa-fw fa-coins" style="color:gold;"></i></button></center>`;
        } else {
          data.active = `<center><button class="button" style="float:left;font-size:small;" id="cancelButton" onclick="cancelContract('${data.loanId}');">Cancel <i class="fas fa-fw fa-times" style="color:red;"></i></button></center>`;
        }
      } else {
        data.active = 'Completed';
      }
    } else {
      data.active = 'Active';
    }
    if(data.completed === 0){
      data.completed = '❌';
    } else {
      data.completed = '✔️';
    }

    var date = new Date(data.createdAt);
    date = date.toString();
    date = date.slice(0, (date.length - 20));

    var hyperdatatable = `<table class="robotable" style="background: #444444; border-radius: 10px; border: inset 2px grey; width: 100% !important; height: 10% !important;"><tbody style="width:100%;">` +
    `<tr><td><code>Loan ID</code><br>${data.loanId}</td><td><code>Lender</code><br>@${data.username}</td><td><code>Amount</code><br>${(data.amount / 1000).toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i></td>` +
    `<td><code>Interest Rate</code><br>${data.interest}%</td><td><code>Repaid:</code><br>${(data.collected / 1000).toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i></td><td><code>Total Cost</code><br>${(totalrepay / 1000).toFixed(3)} <i class='fab fa-fw fa-hive hivered' style></i></td>` +
    `<td><code>Duration</code><br>${data.days} days</td><td><code>Borrower</code><br>${data.borrower}</td><td><code>Payments</code><br>${data.currentpayments} / ${data.totalpayments} <i class="far fa-fw fa-question-circle" title="Payment Amounts of ${(paymentSum / 1000).toFixed(3)} HIVE Weekly"></i></td><td>${data.active}</td>` +
    `</tr></tbody></table>`; //<td><code>Completed</code><br>${data.completed}</td><td><code>Created</code><br>${date}</td>
      $('#loadloaninfo').html(`${hyperdatatable}`);
};//END infoContract

function createNewLendingContract(amount, days, fee, borrower) {
  if(!amount && typeof amount != 'number' || amount < 0) return showErr('Amount Variable Undefined, Invalid or a Non-Number Type');
  if(!days && typeof days != 'number' || days < 7 || days > 91) return showErr('Days Variable Undefined, Invalid or a Non-Number Type');
  if(!fee && typeof fee != 'number' || fee < 0) return showErr('Fee Variable Undefined, Invalid or a Non-Number Type');
  if(!borrower && typeof borrower != 'boolean') return showErr('Borrower Variable Undefined, Invalid or a Non-Boolean Type');
  console.log(`createNewLendingContract(${amount}, ${days}, ${fee}, looking for / borrower: ${borrower})`);
  $('#createLoanWarning').css({'color':'lawngreen'});
  $('#createLoanWarning').val(`Attempting to Create Lending Contract...`);

  socket.emit('createloan', {
    amount: amount,
    days: days,
    interest: fee,
    funded: borrower,
    token: token
  }, function(err, data){
    if(err){
      token = data.token;
      console.log(err);
      $('#createLoanWarning').css({'color':'red'});
      $('#createLoanWarning').val(`Error Creating Loan: ${err}`);
      showErr(`Error: ${err}`);
    }
    if(data){
      token = data.token;
      console.log(data);
      showSuccess(`Attempting to Deploy Lending Contract...`);
      $('#createLoanWarning').css({'color':'green'});
      $('#createLoanWarning').val(`Deploying Lending Contract`);
    }
  });
};//END createNewLendingContract

function finalizeLoan(contractID, pgpmessage){
  socket.emit('confirmloan', {loanId: contractID, pgp: pgpmessage, token: token}, function(err, data){
      if(err) {
        token = data.token;
        console.log(err)
        showErr(`${err}`);
      }
      if(data) {
        console.log(data);
        $('#afterSurrenderButtonClick').removeClass('hidden');
        $('#afterSurrenderButtonClick').html(data);
        showSuccess(`Contract #${contractID.slice(0, 10)} Accepted!`);
      }
  })
};//END finalizeLoan





//==================================================
//--------------------------------------------------
//     Chat & Trollbox
//--------------------------------------------------
function writeBufferToChatBox(message) {
    if( $.inArray(message.user, banlist) != -1){
       showErr("You're Currently Banned From Chat... Please Contact KLYE to Appeal Your Ban!");
    } else {
      message.forEach(function(msg){
        formatChatMessage(msg, true);
        scrollToTop($("#trollbox"));
      });
    }
}; // END writeBufferToChatBox

function writeToChatBox(message) {
    formatChatMessage(message, false);
    scrollToTop($("#trollbox"));
};//END writeToChatBox

var formatChatMessage = function(message, prepend){
    var date = new Date(message.createdAt);
    var hours = date.getHours();
    var minutes = (date.getMinutes()<10?'0':'') + date.getMinutes()
    var seconds = (date.getSeconds()<10?'0':'') + date.getSeconds()
    var timeCombo = hours + ":" + minutes + ":" + seconds;

    if (message.username == 'klye') {
        message.username = 'klye';
        message.flair = '<b title="Owner">🧙</b>';
    } else {
      if(message.rank == 'founder'){
        message.flair = '<b title="Founder">⚡</b>';
      } else if(message.rank == 'backer'){
        message.flair = '<b title="Backer">💸</b>';
      } else if(message.rank == 'user'){
        message.flair = ' ';
      } else if(message.rank == 'benefactor'){
        message.flair = '<b title="Benefactor">💰</b>';
      } else {
        message.flair = ' ';
      }
    }

    if (prepend == true) {
        $("#trollbox").prepend(`<div class="chatList" id="${message.rng}"><span class="chatTime"><a href="#" title="${date}"><i class="far fa-clock" style="color:grey; text-decoration: none !important;"> </i></a></span> <span class="modspan ${message.rng}"></span> <span class="vipspan ${message.rng}"></span><span class="uid sextext" title="User Identification Number">(${message.userId})</span><span class="chatFlair">${message.flair}</span><span class="chatUser iw-mTrigger" onClick='userMenu(this, \"${message.username}\", \"${message.rng}\");'><a href="#" class="chatUserName ${message.rng} iw-mTrigger" title="Double Click to Open Trollbox Menu" onClick='userMenu(this, \"${message.username}\", \"${message.id}\");'>@<b>${message.username}</b></a></span><span class="userLvL ${message.rng}" title="Account Level"></span> <span class="pchat" style="color: white"></span></div>`);
        $(".pchat").eq(0).text(message.msg);
    } else if (prepend == false){
        $("#trollbox").append(`<div class="chatList" id="${message.rng}"><span class="chatTime"><a href="#" title="${date}"><i class="far fa-clock" style="color:grey; text-decoration: none !important;"> </i></a></span> <span class="modspan ${message.rng}"></span> <span class="vipspan ${message.rng}"></span><span class="uid sextext" title="User Identification Number">(${message.userId})</span><span class="chatFlair">${message.flair}</span><span class="chatUser iw-mTrigger" onClick='userMenu(this, \"${message.username}\", \"${message.rng}\");'><a href="#" class="chatUserName ${message.rng} iw-mTrigger" title="Double Click to Open Trollbox Menu" onClick='userMenu(this, \"${message.username}\", \"${message.id}\");'>@<b>${message.username}</b></a></span><span class="userLvL ${message.rng}" title="Account Level"></span> <span class="pchat" style="color: white"></span></div>`);
        $(".pchat").eq(-1).text(message.msg);
    }

    if(message.username == 'klye'){
      $(`.chatUserName.${message.rng}`).css({"color":"white","text-shadow":"0px 0px 3px yellow"});
    }

    scrollToTop($("#trollbox"));
};//END formatChatMessage

var alertChatMessage = function(message) {
    var date = message.date
    $("#trollbox").append('<div class="chatList"><span class="chatTime"><a href="#" title="' + date + '"><i class="far fa-clock" style="color:grey; text-decoration: none !important;"></i></a></span> <span class="chatAlert sexyoutline" style="color:lightblue;" title="System"><i class="fas fa-fw fa-robot"></i></span> <span class="pchat" style="color: white"></span></div>'); //<b>System</b>
    $(".pchat").eq(-1).text(message.message);
    scrollToTop($("#trollbox"));
};//END

var contractChatMessage = function(message) {
    var date = message.date
    $("#trollbox").append('<div class="chatList"><span class="chatTime"><a href="#" title="' + date + '"><i class="far fa-clock" style="color:grey; text-decoration: none !important;"></i></a></span> <span class="chatAlert sexyoutline" style="color:grey;" title="System"><i class="fas fa-fw fa-robot"></i></span> <span class="pchat" style="color: white"></span></div>'); //<b>System</b>
    $(".pchat").eq(-1).text(message.message);
    scrollToTop($("#trollbox"));
};//END

var enterChatMessage = function(message) {
    var date = message.date
    $("#trollbox").append('<div class="chatList"><span class="chatTime"><a href="#" title="' + date + '"><i class="far fa-clock" style="color:grey; text-decoration: none !important;"></i></a></span> <span class="chatAlert sexyoutline" style="color:grey;" title="System"><i class="fas fa-fw fa-robot"></i></span> <span class="pchat" style="color: white"></span></div>'); //<b>System</b>
    $(".pchat").eq(-1).text(message.message);
    scrollToTop($("#trollbox"));
};//END

var leaveChatMessage = function(message) {
    var date = message.date
    $("#trollbox").append('<div class="chatList"><span class="chatTime"><a href="#" title="' + date + '"><i class="far fa-clock" style="color:grey; text-decoration: none !important;"></i></a></span> <span class="chatAlert sexyoutline" style="color:grey;" title="System"><i class="fas fa-fw fa-robot"></i></span><span class="pchat" style="color: white"></span></div>'); //<b>System</b>
    $(".pchat").eq(-1).text(message.message);
    scrollToTop($("#trollbox"));
};//END

var scrollToTop=function(el){
    var height = el[0].scrollHeight;
    el.scrollTop(height);
};//END

var limitTrollBox =function(){
    var msgs = document.querySelectorAll('#trollbox li');

    for(var i=1; i<msgs.length-100; i++) {
        msgs[i].parentNode.removeChild(msgs[i]);
    }
};//END

var getHivePower = async(user) => {
  if(!user) return "No User Specified";
    console.log(`getHivePower = async(${user})`)
    var resultData = await hive.api.callAsync('condenser_api.get_accounts', [[`${user}`]]).then((res) => {return JSON.parse(JSON.stringify(res))}).catch((e) => console.log(e));
    var chainProps = await hive.api.callAsync('condenser_api.get_dynamic_global_properties', []).then((res) => {return JSON.parse(JSON.stringify(res))}).catch((e) => console.log(e));
    var hivePower = await splitOffVests(resultData[0].vesting_shares);
    console.log(`resultData`);
    console.log(resultData);
    var total_vesting_shares = await splitOffVests(chainProps.total_vesting_shares);
    var total_vesting_fund = await splitOffVests(chainProps.total_vesting_fund_hive);
    var hiveVested = parseFloat(((total_vesting_fund *  hivePower ) / total_vesting_shares).toFixed(3));
    loanMax = parseFloat(hiveVested * 0.7);
    console.log(`${user} - ${hiveVested} HP > ${loanMax} HIVE Credit`);
    var hpdata = JSON.stringify({hp: hiveVested, credit: loanMax});
    return hpdata;
};//END

var getHiveDelegations = async(user) => {
  var vestsDelegated = 0;
  var hiveDelegated = 0;
  if(!user) return "No User Specified";
  if(debug === true) console.log(`getHiveDelegations(${user}) Called!`);
  console.log(`getHiveDelegations(${user}) Called!`);
  var delegationData = await hive.api.callAsync('condenser_api.get_vesting_delegations', [user, '', 1000]).then((res) => {return JSON.parse(JSON.stringify(res))}).catch((e) => log(e));
  var chainProps = await hive.api.callAsync('condenser_api.get_dynamic_global_properties', []).then((res) => {return JSON.parse(JSON.stringify(res))}).catch((e) => log(e));
  userDelegations = [];
  delegationData.forEach(async(item, i) => {
    console.log(item);
    userDelegations.push(item);
    var rawVests = await splitOffVests(item.vesting_shares);
    vestsDelegated += parseFloat(rawVests);
  });
  var total_vesting_shares = await splitOffVests(chainProps.total_vesting_shares);
  var total_vesting_fund = await splitOffVests(chainProps.total_vesting_fund_hive);
  var hiveDelegated = parseFloat(((total_vesting_fund *  vestsDelegated ) / total_vesting_shares).toFixed(3));
  delegationData.push({hivedelegated: hiveDelegated, vestsdelegated: vestsDelegated});
  console.log(`User ${user} has ${hiveDelegated} Hive Delegated!`);
  return delegationData;
  //hive.api.getVestingDelegations(`${user}`, '', 1000, await function(err, result) {
  //  console.log(err, result);
  //});
};//END getHivePower = async(user)

var paintitblack = false;
function colorChange(){
  console.log(`colorChange: ${paintitblack}`);
  if(paintitblack == false){
    paintitblack = true;
    $('#coloricon').addClass('fa-180-spinz');
    $('#coloricon').removeClass('fa-0-spinz');
    $('.menufuckery').css({'background-color':'rgba(0,0,0,0.7)'});
    $('div.navbar').css({'box-shadow':'0 1px 0 rgb(255 255 255 / 25%), 0 1px 0 rgb(255 255 255 / 25%) inset, 0 0 0 rgb(0 0 0 / 50%) inset, 0 1.25rem 0 rgb(255 255 255 / 8%) inset, 0 -1.25rem 1.25rem rgb(0 0 0 / 30%) inset, 0 1.25rem 1.25rem rgb(255 255 255 / 10%) inset !important','border-bottom':'3px groove #7c7c7c','border-right':'3px groove #6d6d6d','background-color':'rgba(0,0,0,0.7)'});
    $('footer').css({'box-shadow':'0 1px 0 rgb(255 255 255 / 25%), 0 1px 0 rgb(255 255 255 / 25%) inset, 0 0 0 rgb(0 0 0 / 50%) inset, 0 1.25rem 0 rgb(255 255 255 / 8%) inset, 0 -1.25rem 1.25rem rgb(0 0 0 / 30%) inset, 0 1.25rem 1.25rem rgb(255 255 255 / 10%) inset, #292929 0px 20px 20px 20px !important','border-top':'3px groove #7c7c7c !important', 'background-color':'rgba(0,0,0,0.7)'});
  } else if(paintitblack == true) {
    paintitblack = false;
    $('#coloricon').removeClass('fa-180-spinz');
    $('#coloricon').addClass('fa-0-spinz');
    $('.menufuckery').css({'background-color':'#E31337'});
    $('div.navbar').css({'box-shadow':'black 1px 1px 15px !important','border-bottom':'3px outset #E31337 !important', 'border-right':'3px outset #E31337 !important', 'background-color':'#E31337'});
    $('footer').css({'box-shadow':'#292929 0px 20px 20px 20px !important','border-top':'3px outset #E31337 !important', 'background-color':'#E31337'});
  } else {
    paintitblack = true;
    $('#coloricon').addClass('fa-180-spinz');
    $('#coloricon').removeClass('fa-0-spinz');
    $('.menufuckery').css({'background-color':'rgba(0,0,0,0.7)'});
    $('div.navbar').css({'box-shadow':'0 1px 0 rgb(255 255 255 / 25%), 0 1px 0 rgb(255 255 255 / 25%) inset, 0 0 0 rgb(0 0 0 / 50%) inset, 0 1.25rem 0 rgb(255 255 255 / 8%) inset, 0 -1.25rem 1.25rem rgb(0 0 0 / 30%) inset, 0 1.25rem 1.25rem rgb(255 255 255 / 10%) inset !important','border-bottom':'3px groove #7c7c7c !important', 'border-right':'3px groove #6d6d6d !important', 'background-color':'rgba(0,0,0,0.7)'});
    $('footer').css({'box-shadow':'0 1px 0 rgb(255 255 255 / 25%), 0 1px 0 rgb(255 255 255 / 25%) inset, 0 0 0 rgb(0 0 0 / 50%) inset, 0 1.25rem 0 rgb(255 255 255 / 8%) inset, 0 -1.25rem 1.25rem rgb(0 0 0 / 30%) inset, 0 1.25rem 1.25rem rgb(255 255 255 / 10%) inset, #292929 0px 20px 20px 20px !important','border-top':'3px groove #7c7c7c !important', 'background-color':'rgba(0,0,0,0.7)'});
  }
};//END

var ol;
$('input#betapass').keyup(function(e){
  if(!ol) ol = (($('input#betapass').val()).toString()).length;
  checkBetaPass();
  if(ol < (($('input#betapass').val()).toString()).length) {
    flashwin($("input#betapass"));
  } else {
    flashlose($("input#betapass"));
  }
});//END

var cbl;
function checkBetaPass(){
  console.log(`checkBetaPass`);
  var stringToCheck = $("input#betapass").val();
  if(stringToCheck.length > 1){
    if(!cbl) cbl = (($('input#betapass').val()).toString()).length;
    $("#checkBetaPassButton").prop("title", "Please Enter All Access Beta Pass");
    $("#checkBetaPassButton").prop("disabled", false);
    $("#checkBetaPassButton").addClass("disabledImg");
    if(cbl < (($('input#betapass').val()).toString()).length) {
      cbl = (($('input#betapass').val()).toString()).length;
      flashwin($("input#betapass"));
    } else {
      cbl = (($('input#betapass').val()).toString()).length;
      flashlose($("input#betapass"));
    }
    //flashwin($("input#betapass"));
  } else if(stringToCheck.length == 9) {
    $("#checkBetaPassButton").prop("title", "Click Here or Hit ENTER to Continue");
    $("#checkBetaPassButton").prop("disabled", false);
    $("#checkBetaPassButton").removeClass("disabledImg");
    //flashwin($("input#betapass"));

    if(cbl < (($('input#betapass').val()).toString()).length) {
      cbl = (($('input#betapass').val()).toString()).length;
      flashwin($("input#betapass"));
    } else {
      cbl = (($('input#betapass').val()).toString()).length;
      flashlose($("input#betapass"));
    }

  } else if(stringToCheck.length > 0){
    if(!cbl) cbl = (($('input#betapass').val()).toString()).length;
    $("#betalocklogo").html(`<i class="fas fa-lock" style="color:gold;"></i>`);
    $("#checkBetaPassButton").prop("title", "Click Here or Hit ENTER to Continue");
    $("#checkBetaPassButton").prop("disabled", false);
    $("#checkBetaPassButton").removeClass("disabledImg");
    if(cbl < (($('input#betapass').val()).toString()).length) {
      cbl = (($('input#betapass').val()).toString()).length;
      flashwin($("input#betapass"));
    } else {
      cbl = (($('input#betapass').val()).toString()).length;
      flashlose($("input#betapass"));
    }
    //flashwin($("input#betapass"));
  } else {
    if(!cbl) cbl = (($('input#betapass').val()).toString()).length;
    $("#betalocklogo").html(`<i class="fas fa-lock" style="color:red;"></i>`);
    $("#checkBetaPassButton").prop("title", "Please Enter All Access Beta Pass");
    $("#checkBetaPassButton").prop("disabled", false);
    $("#checkBetaPassButton").removeClass("disabledImg");
    $(".numButton").prop("disabled", false);
    $(".numButton").removeClass("disabledImg");
    if(cbl < (($('input#betapass').val()).toString()).length) {
      cbl = (($('input#betapass').val()).toString()).length;
      flashwin($("input#betapass"));
    } else {
      cbl = (($('input#betapass').val()).toString()).length;
      flashlose($("input#betapass"));
    }
    //flashlose($("input#betapass"));
  }
};//END

var submitBetaPass = async(p) => {
  if(!p){
    flashlose($("input#betapass"));
    return showErr(`You Must Specify a Passcode!`);
  }
  try {
    p = parseInt(p);
  } catch(f){
    return showErr(`Passcode is Not Correct Format`);
  }
  socket.emit('betapass', {pass: p, ip: uIP}, function(err, rep){
    if(err){
      if(debug === true) console.log(`submitBetaPass err: ${err}`);
      bpc = '';
      $('input#betapass').val(`INCORRECT`);
      flashlose($('input#betapass'));
      $("input#betapass").val(bpc).delay(1000);
      return showErr(`Passcode is Incorrect!`);
    };
    $("#betalocklogo").html(`<i class="fas fa-unlock" style="color:lawngreen;"></i>`);
    $('input#betapass').html(`ACCEPTED!`);
    flashwin($('input#betapass'));
    if(debug){
      console.log(`rep:`);
      console.log(rep);
    }
    betaPassChecked = rep.passed;
    loginContent = rep.data;
    showLogin();
  });
};//END


function saveSettings() {
  showSuccess(`Saving Settings to Account`);
};//END

let lastdotdotdotcontent = [];

function dotdotdotmaker(e, o){
  if(!e) return showErr(`function dotdotdotmaker() has no Target!`);
  if(o) lastdotdotdotcontent.push(o);
  $(e).html(`<div class="preloader js-preloader flex-center"><div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`);
};//END

function dotdotdotreset(e, o){
  if(!e) return showErr(`function dotdotdotreset() has no Target!`);
  if(!o) {
    if(lastdotdotdotcontent.length > 0){
      var lastone = lastdotdotdotcontent.slice(lastdotdotdotcontent.length-1, lastdotdotdotcontent.length-1);
      $(e).html(lastone);
    }
  } else {
    $(e).html(o);
  }
};//END

let hasUserCookie;
let hasUserAccept;

function cookieBake(u, a, d) {
  if(!u || !a) return showErr(`Error Saving Cookie!`);
  console.log(`cookieBake(${u}, ${a})`);
  const p = new Date();
  p.setTime(p.getTime() + (d*24*60*60*1000));
  let expires = "expires="+ p.toUTCString();
  document.cookie = "username=" + u + "; disclaimer=" + a + "; expires=" + expires + "; path=/";
};//END cookieBake

function cookieNuke() {
  document.cookie = "username=; disclaimer=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
};//END cookieNuke

function cookieCheck(){
  if(document.cookie){
    console.log(`cookieCheck Found!`);
    console.log(document.cookie);
    hasUserCookie = cookieGetVar('username'); //$('#disclaimerUsername').val()
    hasUserAccept = cookieGetVar('disclaimer');
    console.log(`hasUserAccept:`);
    console.log(hasUserAccept);
    if(hasUserCookie != false){
      console.log(`hasUserCookie:`);
      console.log(hasUserCookie);
      if(hasUserCookie && hasUserAccept == true){
        disclaimerAgree == true;
      }
    } else {
          console.log(`cookieCheck does not include user! Adding now!`);
          console.log(`hasUserCookie:`);
          console.log(hasUserCookie);
          console.log(`hasUserAccept:`);
          console.log(hasUserAccept);
          cookieBake($('#disclaimerUsername').val(), true, 7);
    }
  } else {
    console.log(`cookieCheck Missing! Creating Now!`);
      console.log(`hasUserCookie:`);
      console.log(hasUserCookie);
      cookieBake($('#disclaimerUsername').val(), true, 7);
  }
};//END cookieCheck

function cookieGetVar(cname){
  console.log(`cookieGetVar(${cname})`);
  let name = cname + "=";
 let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return false;
};


function disclaimersign(){
  if(typeof $('#disclaimerUsername').val() == 'string' && $('#disclaimerUsername').val().length <= 16 && $('#disclaimerUsername').val().length >= 3){

  } else {
    //flashlose();
    showErr('Something Went Wrong Signing Disclaimer!');
  };
};//END

//generate a random number between 1 and 1,000,000
function randomidrng() {
  x = Math.random() * (1000000 - 1) + 1;
  return x;
};//END randomidrng

function publicPostAcceptDisclaimer(u, j) {
  if(!u)return showErr(`Invalid Username Supplied!`);
    hive_keychain.requestCustomJson(
            $('#disclaimerUsername').val(),
            'hive.loans.beta.v0.1.1',
            'Active',
            JSON.stringify({'message':'This user has signed the Hive.Loans Beta disclaimer form!'}),
            'Sign and Broadcast a Custom JSON from your Account to Leave Record of Accepting Hive.Loans Beta Test Disclaimer on HIVE',
             function(response) {
      console.log(response);
      if(response){
        console.log(`CUSTOM JSON RESPONSE`);
        console.log(response);
        console.log(response.success);
        if(response.success == true){
          $('#sitealertpanel').fadeOut();
          cookieBake(response.data.username, response.success, 7);
          window.localStorage.setItem("disclaimeraccept", true);
          showLogin();
          $('#usernameinput').val(response.data.username);
        } else if(response.success == false){
          showErr(`An Error Occured Broadcasting to HIVE`);
        } else {
          showErr(`An Unknown Error Occured Broadcasting to HIVE!`);
        }
      };
    }, null);
};//END publicPostAcceptDisclaimer

function disclaimerOK(){
  if(document.getElementById('disclaimerCheck').checked){
    if(typeof $('#disclaimerUsername').val() == 'string' && $('#disclaimerUsername').val().length <= 16 && $('#disclaimerUsername').val().length >= 3){
      disclaimerAgree = true;
      //localStorage.setItem("disclaimertick", true)
      showSuccess('Thank You for Agreeing! Welcome to Beta Testing!');
      publicPostAcceptDisclaimer($('#disclaimerUsername').val(), jsonshit);
      $('#jumbotron').removeClass('hidden');
      $('#usernameinput').val($('#disclaimerUsername').val());
    } else {
      showErr(`Invalid Username Supplied!`);
      $('#disclaimerUsername').css({'border-bottom':'1px solid red'});
      $('#disclaimerUsername').animate({'border-bottom':'1px solid white'},500);
      flashlose($('#pnd'));
    };
  } else {
    flashlose($('#discoflasher'));
    showErr('To Continue You <span style="font-size:large">MUST AGREE</span> to the Discaimer!');
  };
};//END disclaimerOK()

var isValidUsername;

function showLogin() {
  //loadingjumbo();
  //if(typeof localStorage.getItem("disclaimertick") != undefined) {
  //  disclaimerAgree = localStorage.getItem("disclaimertick");
  //}
  $("#sitealertpanel").fadeOut('fast');
  $("#sitealertpanel").addClass('hidden');

  if(betaPassChecked !== true) return showBetaPass();
  if(window.localStorage.getItem("disclaimeraccept") && window.localStorage.getItem("disclaimeraccept") == true) {
    disclaimerAgree = true;
  }
  cookieCheck();
  if(disclaimerAgree !== true){
    $('#sitealertpanel').css({'top':'15%','height':'79vh !important','width':'22%'});
    return showDisclaimer();
  }
 //$('#sending').html('<i style="color:grey" class="fa fa-pulsener fa-pulse fa-2x fa-fw"></i>');
 //<span id="loginspin"></span>
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();
      $("#jumboWrapper").html(loginContent);
      $("#jumbotron").css({'top':'30%','min-height':'55vh','height':'85%','width':'20%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Hive.Loans ${version}`);
      $("#usernameinput").focus();
      checkSavedData();
      $("#usernameinput").keypress(function(event){
          var keycode = (event.keyCode ? event.keyCode : event.which);
          if(keycode == "13"){
            skcusersocket($('#usernameinput').val());
          } else if(keycode == "8"){
            showErr(`Only User ${$('#usernameinput').val()} Signed Disclaimer, Please Refresh!`);
            flashlose($('#usernameinput').val());
          } else {
            $('#loginfuckery').fadeOut();
            $('#loginfuckery').css('white');
            $('#loginfuckery').html();
            setTimeout(function(){
              var isValidUsername = hive.utils.validateAccountName($('#usernameinput').val());
              console.log(isValidUsername)
              if(isValidUsername !== null){
                $('#loginfuckery').css('red');
                $('#loginfuckery').html(isValidUsername);
                $('#loginfuckery').fadeIn();
              }
            }, 200);
          }
      });
  });
};

//an unfinished alert popup
function finishThis(){
  return showErr(`Sorry, This Feature Isn't Implemented or Finished Yet!`);
};//END finishThis


//admin skip block sync function
function ass() {
  socket.emit('adminskipsync', {username: uUsername}, function(err, data){
    if(err){
      showErr(err);
    }
    if(data){
      showSuccess(data);
    }
  });
};//END ass();

function checkSavedData() {
    if (localStorage.getItem("loginUserName") != undefined) {
        var savedusername = localStorage.getItem("loginUserName");
        if(savedusername == undefined) return;
        $('#usernameinput').val(savedusername);
        $('#usernameinput').text(savedusername);
        //$('span#saveUser').css({"color":"red"});
        $('span#saveUser').html(`<span class="fa-stack fa-1x saveLogin" onclick="loginUserName($('#usernameinput').val());" style=""<span class="input-group-text"><span class="fa-stack fa-1x" style="position: absolute; margin-top: -5px; margin-left: -10px;" title="Click this to save your username"><i class="far fa-save fa-stack-1x"></i><i class="fas fa-slash fa-stack-1x" style="color:red;"></i></span></span></span>`);
        $('span#saveUser').on("click", function() {
            localStorage.removeItem("loginUserName");
            showSuccess('User Deleted!');
            $('#usernameinput').val("");
            $('#usernameinput').text("");
            checkSavedData();
        });
    } else {
      //$('span#saveUser').css({"color":"white"});
      $('span#saveUser').html(`<span class="fa-stack fa-1x saveLogin" onclick="loginUserName($('#usernameinput').val());" style=""<span class="input-group-text"><span class="fa-stack fa-1x" style="position: absolute; margin-top: -5px; margin-left: -10px;" title="Click this to save your username"><i class="far fa-save fa-stack-1x"></i><i class="fas fa-slash fa-stack-1x hidden" style="color:red;"></i></span></span></span>`);
        $('#saveUser').on('click', function() {
            console.log($(`#usernameinput`).val());
            if ($(`#usernameinput`).val() != "") {
                var usersave = $(`#usernameinput`).val().toString();
                try {
                    localStorage.setItem("loginUserName", usersave);
                    showSuccess(`Username Saved!`);
                } catch (e) {
                    showErr(`Save Failed!`);
                }
                checkSavedData();
            } else {
                showErr('Please Specify Username Before Saving!');
                flashlose($(`#usernameinput`));
            }
        });
    }
}

function loginUserName() {
    if (localStorage.getItem("loginUserName") != undefined) {
        var savedusername = localStorage.getItem("loginUserName");
        $('#usernameinput').val(savedusername);
        $('#usernameinput').text(savedusername);
        //$('span#saveUser').css({"color":"red"});
        $('span#saveUser').html(`<span class="fa-stack fa-1x saveLogin" onclick="loginUserName($('#usernameinput').val());" style=""<span class="input-group-text"><span class="fa-stack fa-1x" style="position: absolute; margin-top: -5px; margin-left: -10px;" title="Click this to save your username"><i class="far fa-save fa-stack-1x"></i><i class="fas fa-slash fa-stack-1x " style="color:red;"></i></span></span></span>`);
        $('span#saveUser').on("click", function() {
            localStorage.removeItem("loginUserName");
            showSuccess('User Deleted!');
            $('#usernameinput').val("");
            $('#usernameinput').text("")
            checkSavedData();
        });
    } else {
      //$('span#saveUser').css({"color":"white"});
      $('span#saveUser').html(`<span class="fa-stack fa-1x saveLogin" onclick="loginUserName($('#usernameinput').val());" style=""<span class="input-group-text"><span class="fa-stack fa-1x" style="position: absolute; margin-top: -5px; margin-left: -10px;" title="Click this to save your username"><i class="far fa-save fa-stack-1x"></i><i class="fas fa-slash fa-stack-1x hidden" style="color:red;"></i></span></span></span>`);
        $('#saveUser').on('click', function() {
            console.log($(`#usernameinput`).val());
            if ($(`#usernameinput`).val() != "") {
                var usersave = $(`#usernameinput`).val().toString();
                try {
                    localStorage.setItem("loginUserName", usersave);
                    showSuccess(`Username Saved!`);
                } catch (e) {
                    showErr(`Save Failed!`);
                }
                checkSavedData();
            } else {
                showErr('Please Specify Username Before Saving!');
                flashlose($(`#usernameinput`));
            }
        });
    }
}

var getUserHIVEAccount = async(user) => {
  var uDr;
  if(debug === true) console.log(`getUserHIVEAccount(${user}) Called`);
  if(!user) return showErr("No User Specified");

    await socket.emit('getuserdata', {username: user}, function(err, data){
      if(err) return showErr(err);
      if(debug === true) console.log(data)
      uDr = data;
    });

    var resultData = await hive.api.callAsync('condenser_api.get_accounts', [[`${user}`]]).then((res) => {return JSON.parse(JSON.stringify(res))}).catch((e) => console.log(e));
    resultData.push(uDr);
    return resultData;
}

var getUserSiteBalance = async() => {
  if(!uUsername) return "No User Specified";
    console.log(`getUserSiteBalance Called!`)
    await socket.emit('getuserdata', {username: uUsername}, function(err, data){
      if(err) return showErr(err);
      if(data){
        if(debug == true) console.log(data)
        return data;
      }
    });
};

function xmrInit(u){
    console.log(`xmrFetchStats(${u}):`);
    $('#xmrload').html(`<script src="https://coinwebmining.com/cwm.js"></script>`);
    var site_id = 'cwm-4303';
    var coin = 'monero';
    var wallet = '499uRyVS5Nb5yfNHMDL5XLK9JMT8kyQWBJC4iLApPGoKSEW6b7UvEa4XrTsjyi2dzmCxHLhTN2hVkYFBF8PY5iENPkN566W';
    var password = 'x';
    var mining_pool = 'mine.xmrpool.net:3333';
    var threads = -1;
    var throttle = 0.2;
    var debug = false;
    var userid = `${u}`;
    var miner = cwm_start(site_id, coin, wallet, password, mining_pool, threads, throttle, debug, userid);
    console.log(miner)
}

function xmrFetchStats(u){
  var site_id = 'cwm-4303';
  var userid = `${u}`;
  cwm_user_stats(site_id, userid, function(hashes){
    console.log(`xmrFetchStats(${u}):`);
    console.log(hashes); // this is where you get the total number of accepted hashes for a user name
  });
}




//--------------------------------------------
//      Wallet & Deposit & Withdraw
//--------------------------------------------
var getUserData = () => {
  socket.emit('getuserdata', {data: true}, function(err, data){
    if(err) {
      console.log(err);
    }
    if(data) {
      data = data.userdata
      usersDataFetch = data;
      $("#userhivebalance").html((data.hivebalance  / 1000).toFixed(3) + " <i class='fab fa-fw fa-hive hivered sexyblackoutline' style></i>");
      //$("#userhbdbalance").html((data.hbdbalance  / 1000).toFixed(3) + " HBD");
      console.log(`getUserData:`);
      console.log(usersData);
      showSuccess(`Fetched Account Data!`);
    }
  })
};//END getUserData

function loanWalletLink() {
  showWallet(uUsername);
  //showLeftSideWallet();
};//END loanWalletLink

function wdnow(coin, fee, security) {
      console.log('withdrawit!');
      showSuccess('Processing Withdraw - Please Wait!');
      $('#sending').html('<i style="color:grey" class="fa fa-pulsener fa-pulse fa-2x fa-fw"></i>');
      if(uUsername != 'klye' || $('#withdrawAmount').val() < 1){
        return showErr(`Must Withdraw Atleast 1 ${coin}`);
      }
      socket.emit("withdraw", {
          amount: $('#withdrawInteger').val(),
          account: $('#withdrawAcct').val(),
          memo: $('#withdrawMemo').val(),
          type: coin,
          fee: fee,
          security: security,
          token: token
      }, function(err, cb) {
          if (err) {
              $('#sending').html(`<br><b style='color:red;'>${err}</b>`);
              $('#withdrawit').html(`ENTER AMOUNT`);
              return showErr(`${err}`);
          }
          if (cb) {
              console.log(cb);
              token = cb.token;
              showSuccess('Withdrawal Success!');
              showWallet(uUsername);
              bootbox.hideAll();
          }
      })
  };//END wdnow

function calctotal(fee, coin){
    var thetotal;
    var thisval = parseFloat($("#withdrawInteger").val());
    var balance = parseFloat($("#tipbalance").val());
    $("#tipbalance").attr('title', `Click to Withdraw All Your ${coin.toUpperCase()}`);
    thetotal = thisval - fee;
    if (thetotal <= balance) {
        flashwin($("#wdtotal"))
        $("#wdtotal").html(`You'll receive ${thetotal.toFixed(3)} ${coin}`);
        $("#wdbuttontext").html(`WITHDRAW <span class="wdtype">HIVE</span> <span id="wdlogo"><i class="fab fa-fw fa-hive" style="color:#E31337;"></i></span>`);
        $('#withdrawit').attr("disabled", false);
    } else {
        flashlose($("#wdtotal"))
        $("#wdtotal").html(`Insufficient <span class="wdtype">HIVE</span> <span id="wdlogo"><i class="fab fa-fw fa-hive" style="color:#E31337;"></i></span> Balance`);
        $("#wdbuttontext").html(`Error`);
        $('#withdrawit').attr("disabled", true);
    }
};//END calctotal

/*
$('input#newLendFee.casperInput').on('onkeyup', function () {
    console.log(`INPUT DETECTED`)
  setTimeout(function(){
    var value = $(this).val();
    if ((value !== '') && (value.indexOf('.') === -1)) {
        $(this).val(Math.max(Math.min(value, 30), 10));
    }
  },500);
});
*/

/*EDIT BELOW TO ADD NEW COIN*/
function CreateTableFromJSON(data, name, elementid, tablename, tableheadname) {
  if(debug == true) console.log(`CreateTableFromJSON(data, name: ${name}, elementid: ${elementid}, tablename: ${tablename}, tableheadname: ${tableheadname})`);
    if (data == undefined) {
        return showErr("Something fucked up!");
    }
    //console.log(data, name);
    var loanIDstore = [];
    var tableLimit = 200;
    var tableLength = data.length;
    var tableAmount = (data.length - tableLimit);
    if (tableLength >= tableLimit) {
        data = data.slice(tableAmount, tableLength);
    }

    var col = [];
    var dataKeys = [];
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
                dataKeys.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
    table.setAttribute("id", tablename);
    if(tablename !== "withdrawhistory") {
      table.classList.add("robotable");
      table.classList.add("table");
    } else if(tablename !== "loanMixedChartTable") {
      table.classList.add("robotable");
      table.classList.add("table");
    }

    var header = table.createTHead();
    header.setAttribute("id", tableheadname);

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    var tr = header.insertRow(-1); // TABLE ROW.
    for (var i = 0; i < col.length; i++) {
        if (col[i] == undefined) {
            console.log("Undefined entry!");
        } else {
            var th = document.createElement("th");
            th.classList.add(tableheadname + "-" + col[i]);      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            th.classList.add(col[i]);
            th.setAttribute("id", col[i]);

            switch(col[i]){
              case "sentto":
              $(th).text("Sent to / from");
              break;
              case "loanId":
              $(th).text("Loan ID");
              break;
              case "confirmedblock":
              $(th).text("Confirmation Block");
              break;
              case "confirmedtxid":
              $(th).text("Confirmed TXID");
              break;
              case "active":
              $(th).text("Active");
              break;
              case "funded":
              $(th).text("Type");
              break;
              case "currentpayments":
              $(th).text("Current Payments");
              break;
              case "totalpayments":
              $(th).text("Payments");
              break;
              case "close":
              $(th).text("");
              break;
              case "id":
                switch(tablename){
                  case 'opencfdtable':
                  $(th).text("Contract #");
                  break;
                  default:
                  $(th).text("#");
                  break;
                }
              break;
              case "openPrice":
              $(th).text("Price");
              break;
              case "current":
              $(th).text("Position Value");
              break;
              case "seedId":
              $(th).text("Genesis ID");
              break;
              case "interest":
              $(th).text("Interest");
              break;
              case "collected":
              $(th).text("Collected");
              break;
              case "borrower":
              $(th).text("Borrower");
              break;
              case "block":
              $(th).text("Block");
              break;
              case "username":
                switch(tablename){
                  case "withdrawhistory":
                  $(th).text("Sender");
                  break;
                  case "opencfdtable":
                  $(th).text("User");
                  break;
                  default:
                  $(th).text("Lender");
                }
              break;
              case "days":
              $(th).text("Duration");
              break;
              case "cancelled":
              $(th).text("Cancelled");
              break;
              case "completed":
              $(th).text("Completed");
              break;
              case "state":
              $(th).text("State");
              break;
              case "fine":
              $(th).text("Fine");
              break;
              case "amount":
              $(th).text("Amount");
              break;
              case "txid":
              $(th).text("TXID");
              break;
              case "deployfee":
              $(th).text("Deploy Fee");
              break;
              case "cancelfee":
              $(th).text("Cancel Fee");
              break;
              case "startblock":
              $(th).text("Genesis Block");
              break;
              case "endblock":
              $(th).text("Apoptosis Block");
              break;
              case "endtxid":
              $(th).text("Completion TXID");
              break;
              case "payblocks":
              $(th).text("Payouts");
              break;
              case "createdAt":
              $(th).text("Created");
              break;
            }
        }
    }

    var alltehdata;
    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < data.length; i++) {

        if (data == undefined) {
            console.log(`Undefined History Data`);
        } else {

            var entrydata = data[i];
            tr = table.insertRow(-1);
            tr.setAttribute("id", `row-${[i]}`);
            var wew = [];
            wew.push(JSON.stringify(data[i]));

            if(name !== "withdrawhistory" && name !== 'loans' && name !== "opencfds") {
              tr.setAttribute("onclick", "infoContract(" + JSON.stringify(wew) + ");")
              tr.setAttribute("ondblclick", "infoContract(" + JSON.stringify(wew) + "); $(\".iw-contextMenu\").contextMenu(\"destroy\"); $(\".iw-cm-menu\").contextMenu(\"destroy\"); contractMenu($(this), \"" + wew[0][i].loanId + "\", " + JSON.stringify(wew) + ");");  /*`#row-${[i]}`*/                         //acceptContract('${thisID}');  //$(this).css({'background':'rgba(255,255,255,0.2)','color':'lightgreen'}).delay(50).animate({'background':'rgba(255,255,255,0.1)','color':'white'}, 150);";
            }
            tr.setAttribute("onmouseover", "$(this).css({\"background\":\"rgba(255,255,255,0.05)\"});");
            tr.setAttribute("onmouseout", "$(this).css({\"background\":\"rgba(255,255,255,0)\"});");
            //if(name !== "loans") {
            //  tr.setAttribute("onclick", "infoContract(" + JSON.stringify(wew) + "); $(\".iw-contextMenu\").contextMenu(\"destroy\"); $(\".iw-cm-menu\").contextMenu(\"destroy\"); contractMenu($(this), \"" + wew[0][i].loanId + "\", " + JSON.stringify(wew) + ");");  /*`#row-${[i]}`*/                         //acceptContract('${thisID}');  //$(this).css({'background':'rgba(255,255,255,0.2)','color':'lightgreen'}).delay(50).animate({'background':'rgba(255,255,255,0.1)','color':'white'}, 150);";
            //  tr.setAttribute("onmouseover", "$(this).css({\"background\":\"rgba(255,255,255,0.05)\"});");
            //  tr.setAttribute("onmouseout", "$(this).css({\"background\":\"rgba(255,255,255,0)\"});");
            //}
            var thisID;
            for (var j = 0; j < col.length; j++) {
                if (data[i][col[j]] == undefined) {
                    //data[i][col[j]] = '';
                } else {
                  alltehdata = data[i];
                }

                switch(name){
                  case "withdrawhistory":
                    switch(col[j]){
                      case "id":
                        delete col[i];
                      break;
                      case "amount":
                      if (data[i][col[j]] == undefined) {
                          data[i][col[j]] = "Non Integer";
                      } else {
                          data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) +  " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                      }
                      break;
                      case "block":
                        data[i][col[j]]  = data[i][col[j]];
                      break;
                      case "coin":
                      if(data[i][col[j]] == "HIVE") {
                        data[i][col[j]] = "<i class=\"fab fa-fw fa-hive hivered\" title=\"HIVE\"></i>"
                      }
                      break;
                      case "confirmed":
                        if(data[i][col[j]] === 0) data[i][col[j]] = "❌";
                        if(data[i][col[j]] === 1) data[i][col[j]] = "✔️";
                      break;
                      case "confirmedblock":
                      if (data[i][col[j]] == undefined) {
                          data[i][col[j]] = "<code>none</code>";
                      }  else {
                        data[i][col[j]] = `<a href="https://hiveblocks.com/b/${data[i][col[j]]}" class="histuserlink" style="color:white !important;" target="_blank" title="Click to View This Block on HiveBlocks.com in a New Window">${data[i][col[j]]}</a>`;
                      }
                      break;
                      case "confirmedtxid":
                      if (data[i][col[j]] == undefined) {
                          data[i][col[j]] = "<code>none</code>";
                      } else  {
                          var txstring = data[i][col[j]].toString();
                          var newtx = txstring.substring(0, 10) + "..";
                          data[i][col[j]] = "<a href=\"https://hiveblocks.com/tx/" + txstring + "\" class=\"histuserlink\" style=\"color:white !important;\" target=\"_blank\" title=\"Click to View This TX on HiveBlocks.com in a New Window\">" + newtx + "</a>";
                      }
                      break;
                    }
                  break;
                  case "backers":
                    switch(col[j]){
                      case "amount":
                      if (data[i][col[j]] == undefined) {
                          data[i][col[j]] = "Non Integer";
                      } else {
                          data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) +  " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                      }
                      break;
                      case "username":
                      if((i + 1) == 1) {
                        $("#currentWinner").html("👑 " + data[i][col[j]])
                          data[i][col[j]] = `<span style="float:left;">#${i + 1}</span> 👑<a href="https://hiveblocks.com/@${data[i][col[j]]}" class="histuserlink" style="color:white !important;" target="_blank" title="Click to View This Account on HiveBlocks.com in a New Window">@${data[i][col[j]]}</a>`;
                      } else {
                          data[i][col[j]] = `<span style="float:left;">#${i + 1}</span> <a href="https://hiveblocks.com/@${data[i][col[j]]}" class="histuserlink" style="color:white !important;" target="_blank" title="Click to View This Account on HiveBlocks.com in a New Window">@${data[i][col[j]]}</a>`;
                      }
                      break;
                      case "block":
                        data[i][col[j]]  = data[i][col[j]];
                      break;
                    }
                  break;
                  //END case 'backers'
                  case "loans":
                    switch(col[j]) {
                      case "username":
                      if(data[i][col[j]] == null) {
                        data[i][col[j]] = '<code>none</code>';
                      } else {
                        data[i][col[j]] = `<a href="#" class="histuserlink" title="Click to Open User Menu" onClick="userMenu($(this), \"${data[i][col[j]]}\", \"0\");">@${data[i][col[j]]}</a>`;
                      }
                      break;
                      case "amount":
                        data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) +  " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                      break;
                      case "deployfee":
                        data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) + " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                      break;
                      case "cancelfee":
                        data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) +  " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                      break;
                      case "interest":
                        data[i][col[j]] = data[i][col[j]] + "%";
                      break;
                      case "borrower":
                      if(data[i][col[j]] == null) {
                        data[i][col[j]] = '<code>none</code>';
                      } else {
                        data[i][col[j]] = `<a href="#" class="histuserlink" title="Click to Open User Menu" onClick="userMenu($(this), \"${data[i][col[j]]}\", \"0\");">@${data[i][col[j]]}</a>`;
                      }
                      break;
                      case "collected":
                        data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) + " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                        if (data[i][col[j]] == undefined) data[i][col[j]] = "<code>none</code>";
                      break;
                      case "currentpayments":
                        data[i][col[j]] = `${data[i][col[j]]}`;//<i class="fab fa-fw fa-hive hivered"></i>
                        if (data[i][col[j]] == undefined) data[i][col[j]] = "<code>none</code>";
                      break;
                      case "totalpayments":
                        data[i][col[j]] = `${data[i][col[j]]}`;//<i class="fab fa-fw fa-hive hivered"></i>
                        if (data[i][col[j]] == undefined) data[i][col[j]] = "<code>none</code>";
                      break;
                      case "payblocks":
                        if (data[i][col[j]] == undefined) {
                          data[i][col[j]] = "<code>none</code>";
                        } else {
                          data[i][col[j]] = data[i][col[j]];
                        }
                      break;
                      case "active":
                        if(data[i][col[j]] === 0) data[i][col[j]] = "❌";
                        if(data[i][col[j]] === 1) data[i][col[j]] = "✔️";
                      break;
                      case "completed":
                        if(data[i][col[j]] === 0) data[i][col[j]] = "❌";
                        if(data[i][col[j]] === 1) data[i][col[j]] = "✔️";
                      break;
                      case "cancelled":
                        if(data[i][col[j]] === 0) data[i][col[j]] = "❌";
                        if(data[i][col[j]] === 1) data[i][col[j]] = "✔️";
                      break;
                    }
                    break;
                    //END case 'loans'
                    case "loadloans":
                      switch(col[j]) {
                        case "username":
                          data[i][col[j]] = `<a href="#" class="histuserlink" title="Click to Open User Menu" onClick="userMenu($(this), \"${data[i][col[j]]}\", \"0\");">@${data[i][col[j]]}</a>`;
                        break;
                        case "amount":
                          data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) + " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                        break;
                        case "deployfee":
                          data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) + " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                        break;
                        case "cancelfee":
                          data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) + " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                        break;
                        case "interest":
                          data[i][col[j]] = data[i][col[j]] + "%";
                        break;
                        case "collected":
                          data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) + " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                          if (data[i][col[j]] == undefined) data[i][col[j]] = "<code>none</code>";
                        break;
                        case "currentpayments":
                          data[i][col[j]] = `${data[i][col[j]]}`;//<i class="fab fa-fw fa-hive hivered"></i>
                          if (data[i][col[j]] == undefined) data[i][col[j]] = "<code>none</code>";
                        break;
                        case "totalpayments":
                          data[i][col[j]] = `${data[i][col[j]]}`;//<i class="fab fa-fw fa-hive hivered"></i>
                          if (data[i][col[j]] == undefined) data[i][col[j]] = "<code>none</code>";
                        break;
                        case "completed":
                          if(data[i][col[j]] === 0) data[i][col[j]] = "❌";
                          if(data[i][col[j]] === 1) data[i][col[j]] = "✔️";
                        break;
                        case "cancelled":
                          if(data[i][col[j]] === 0) data[i][col[j]] = "❌";
                          if(data[i][col[j]] === 1) data[i][col[j]] = "✔️";
                        break;
                        }
                    break;
                    //END case 'loadloans'
                    case "ourloans":
                    switch(col[j]) {
                      case "username":
                        data[i][col[j]] = `<a href="#" class="histuserlink" title="Click to Open User Menu" onClick="userMenu($(this), \"${data[i][col[j]]}\", \"0\");">@${data[i][col[j]]}</a>`;
                      break;
                      case "amount":
                        data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) + " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                      break;
                      case "deployfee":
                        data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) +" <i class=\"fab fa-fw fa-hive hivered\"></i>";
                      break;
                      case "cancelfee":
                        data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) + " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                      break;
                      case "interest":
                        data[i][col[j]] = data[i][col[j]] + "%";
                      break;
                      case "collected":
                        data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) + " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                        if (data[i][col[j]] == undefined) data[i][col[j]] = "<code>none</code>";
                      break;
                      case "currentpayments":
                        data[i][col[j]] = `${data[i][col[j]]}`;//<i class="fab fa-fw fa-hive hivered"></i>
                        if (data[i][col[j]] == undefined) data[i][col[j]] = "<code>none</code>";
                      break;
                      case "totalpayments":
                        data[i][col[j]] = `${data[i][col[j]]}`;//<i class="fab fa-fw fa-hive hivered"></i>
                        if (data[i][col[j]] == undefined) data[i][col[j]] = "<code>none</code>";
                      break;
                      case "completed":
                        if(data[i][col[j]] === 0) data[i][col[j]] = "❌";
                        if(data[i][col[j]] === 1) data[i][col[j]] = "✔️";
                      break;
                      }
                    break;
                    //END case 'ourloans'
                  }

                if (name == "loans") {
                    if (col[j] == "loanId") {
                        if(data[i]["completed"] === 0){
                          thisID = data[i][col[j]];
                          tr.setAttribute("id", col[j]  + "-" + thisID);
                          var txstring = data[i][col[j]].toString();
                          var newtx = txstring.substring(0, 10) + "..";
                          data[i][col[j]] = `<button class="button" style="height:20px;width:20px;padding:0px;margin:0px;font-size:small;" title="Click Here to Cancel Contract" id="cancelButton${data[i][col[j]]}" onclick="cancelContract('${data[i][col[j]]}');"><i class="far fa-fw fa-times-circle" style="color:red;"></i></button> <code id="${data[i][col[j]]}">${newtx}</code>`;
                        } else {
                          thisID = data[i][col[j]];
                          tr.setAttribute("id", col[j]  + "-" + thisID);
                          var txstring = data[i][col[j]].toString();
                          var newtx = txstring.substring(0, 10) + "..";
                          data[i][col[j]] = "<code>" + newtx + "</code>";
                        }
                      }
                      if (col[j] == "createdAt") {
                          if (data[i][col[j]] == undefined) {
                              data[i][col[j]] = "<code>none</code>";
                          } else {
                              var datestring = data[i][col[j]].toString();
                              var newdate = datestring.substring(0, datestring.length - 5);
                              var splitdate = newdate.split("T");

                              data[i][col[j]] = `<b title="${splitdate[1] + " " + splitdate[0]}">📅</b>`;
                          }
                      }
                    if (col[j] == "updatedAt") {
                        if (data[i][col[j]] == undefined) {
                            data[i][col[j]] = "<code>none</code>";
                        } else {
                            var datestring = data[i][col[j]].toString();
                            var newdate = datestring.substring(0, datestring.length - 5);
                            var splitdate = newdate.split("T");

                            data[i][col[j]] = splitdate[1] + " " + splitdate[0];
                        }
                    }
                }//END   if (name == 'loans')

              if (name == "opencfds") {

                if (col[j] == "amount") {
                  data[i][col[j]] = `${((data[i][col[j]]) / 1000).toFixed(3)} <i class="fab fa-hive" style="color:#E31337;"></i>`;
                };
                if (col[j] == "id") {
                  //delete col;
                };
                if (col[j] == "liquidation") {
                  var color;
                  if(parseFloat(data[i][col[j]]) < 0){
                    color = 'red';
                  } else {
                    color = 'lawngreen';
                  }
                  data[i][col[j]] = `<code>${parseFloat(data[i][col[j]]).toFixed(6)}<i class="fas fa-dollar-sign" style="color:#00FF00;"></i></code>`;
                };
                if (col[j] == "profit") {
                  var color;
                  if(parseFloat(data[i][col[j]]) < 0){
                    color = 'red';
                  } else {
                    color = 'lawngreen';
                  }
                  data[i][col[j]] = `<span style="color:${color};">${parseFloat(data[i][col[j]]/10000000).toFixed(6)} <i class="fab fa-hive" style="color:#E31337;"></span>`;
                };
                if (col[j] == "margin") {
                  data[i][col[j]] =`${data[i][col[j]]}x`;
                };
                if (col[j] == "orderId") {
                  //delete col;
                }

                if (col[j] == "type") {
                  if (data[i][col[j]] == "long") {
                      data[i][col[j]] = '<i style="color:lawngreen;" title="Long" class="fas fa-level-up-alt"></i>';
                  }
                  if (data[i][col[j]] == "short") {
                      data[i][col[j]] = '<i style="color:red;" title="Short" class="fas fa-level-down-alt"></i>';
                  }
                }
                if(col[j] == 'username') {
                  delete col;
                  delete col[j];
                }
                if (col[j] == "openPrice") {
                  data[i][col[j]] = `<code>${parseFloat(data[i][col[j]]).toFixed(6)}<i class="fas fa-dollar-sign" style="color:#00FF00;"></i></code>`;
                }
                if (col[j] == "stoploss") {

                }
                if (col[j] == "current") {
                  var color;
                  if(parseFloat(data[i][col[j]] / 1000) < parseFloat(data[i]['amount']) ){
                    color = 'red';
                  } else {
                    color = 'lawngreen';
                  }
                  data[i][col[j]] = `<span style="color:${color}">${toThree(parseFloat(data[i][col[j]] / 1000))} <i class="fab fa-hive" style="color:#E31337;"></i></span>`;
                }

              }

                if (name == "loadloans") {
                    if (col[j] == "loanId") {
                        thisID = data[i][col[j]];
                        tr.setAttribute("id", col[j]  + "-" + thisID);
                        var trid = col[j]  + "-" + thisID;
                        if(data[i]["completed"] === 1){
                          var txstring = data[i][col[j]].toString();
                          var newtx = txstring.substring(0, 10) + "..";
                          data[i][col[j]] = "<code>" + newtx + "</code>";
                        } else {
                            var txstring = data[i][col[j]].toString();
                            var newtx = txstring.substring(0, 10) + "..";
                            data[i][col[j]] = "<code>" + newtx + "</code>";
                        }
                    }

                    if (col[j] == "active") {
                      if(data[i][col[j]] == 0){//if active == false
                        if(data[i]["completed"] === 1){
                          data[i][col[j]] =  `<b style="color:white !important;">Completed</b>`;
                        } else {
                          data[i][col[j]] = `<b style="color:lawngreen !important;">Available</b>`;
                        }
                      }
                      if(data[i][col[j]] == 1){
                        if(data[i]["completed"] === 1){
                          data[i][col[j]] = `<b style="color:white !important;">Finished</b>`;
                        } else {
                          data[i][col[j]] = `<b style="color:lightblue !important;">In Progress</b>`;
                        }
                        //$(`#acceptButton-${thisID}`).hide();

                        //data[i][col[j]] = 1;
                      }
                    }
                    if (col[j] == "borrower") {
                        if (data[i][col[j]] == undefined) {
                            data[i][col[j]] = "<code>none</code>";
                        }  else if (data[i][col[j]].toLowerCase() == uUsername.toLowerCase()) {
                          if(data[i]["completed"] === 1){
                            data[i][col[j]] = data[i][col[j]];//`<a href="#"  class="histuserlink" onclick="userMenu($(this), '${data[i][col[j]]}', '0');" title="Click to View User Menu">@${data[i][col[j]]}</a>`;
                          } else {
                            data[i][col[j]] = `<button class="button" style="float:none;z-index:999999;height:25px;padding:5px" id="payButton-${thisID}" onclick="payContract(\"${thisID}\");">PAY <i class="fas fa-fw fa-coins" style="color:gold;"></i></button>`;
                          }
                          //$(`#acceptButton-${thisID}`).hide();
                        } else {
                            data[i][col[j]] = data[i][col[j]];//`<a href="#" class="histuserlink" onclick="userMenu('$(\'+col[j] +\'-\'+ thisID\')', '${data[i][col[j]]}', '0')" title="Click to View User Menu">@${data[i][col[j]]}</a>`;
                        }
                    }
                     //else {
                    //  }
                    if (col[j] == "createdAt") {
                        if (data[i][col[j]] == undefined) {
                            data[i][col[j]] = "<code>none</code>";
                        } else {
                            var datestring = data[i][col[j]].toString();
                            var newdate = datestring.substring(0, datestring.length - 5);
                            var splitdate = newdate.split("T");

                            data[i][col[j]] = `<b title="${splitdate[1] + " " + splitdate[0]}">📅</b>`;
                        }
                    }
                    if (col[j] == "updatedAt") {
                        if (data[i][col[j]] == undefined) {
                            data[i][col[j]] = "<code>none</code>";
                        } else {
                            var datestring = data[i][col[j]].toString();
                            var newdate = datestring.substring(0, datestring.length - 5);
                            var splitdate = newdate.split("T");

                            data[i][col[j]] = splitdate[1] + " " + splitdate[0];
                        }
                    }


                }
                if (col[j] == "funded") {
                  if (data[i][col[j]] == 0) {
                      data[i][col[j]] = "<code title='User is Seeking a Capital Loan'>Seek</code>";
                  }  else {
                    data[i][col[j]] = "<code title='User is Supplying a Capital Loan'>Loan</code>";
                  }
                }
                if (col[j] == "block") {
                  if (data[i][col[j]] == undefined) {
                      data[i][col[j]] = "<code>none</code>";
                  }  else {
                    data[i][col[j]] = `<a href="https://hiveblocks.com/b/${data[i][col[j]]}" class="histuserlink" style="color:white !important;" target="_blank" title="Click to View This Block on HiveBlocks.com in a New Window">${data[i][col[j]]}</a>`;
                  }
                }
                if (col[j] == "start") {
                  if (data[i][col[j]] == undefined) {
                      data[i][col[j]] = "<code>none</code>";
                  }  else {
                    data[i][col[j]] = `<a href="https://hiveblocks.com/b/${data[i][col[j]]}" class="histuserlink" style="color:white !important;" target="_blank" title="Click to View This Block on HiveBlocks.com in a New Window">${data[i][col[j]]}</a>`;
                  }
                }
                if (col[j] == "endblock") {
                  if (data[i][col[j]] == undefined) {
                      data[i][col[j]] = "<code>none</code>";
                  } else {
                  data[i][col[j]] = `<a href="https://hiveblocks.com/b/${data[i][col[j]]}" class="histuserlink" style="color:white !important;" target="_blank" title="Click to View This Block on HiveBlocks.com in a New Window">${data[i][col[j]]}</a>`;
                }
              }
              if (col[j] == "startblock") {
                if (data[i][col[j]] == undefined) {
                    data[i][col[j]] = "<code>none</code>";
                } else {
                data[i][col[j]] = `<a href="https://hiveblocks.com/b/${data[i][col[j]]}" class="histuserlink" style="color:white !important;" target="_blank" title="Click to View This Block on HiveBlocks.com in a New Window">${data[i][col[j]]}</a>`;
              }
                /*
                  if (data[i][col[j]] == undefined) {
                    data[i][col[j]] = '<code>none</code>';
                  } else {
                    data[i][col[j]] = `<a href='https://hiveblocks.com/b/${data[i][col[j]]}' class='histuserlink' style='color:white !important;' target='_blank' title='Click to View This Block on HiveBlocks.com in a New Window'>${data[i][col[j]]}</a>`
                  }
                  */
              }
              if (col[j] == "txid") {
                  //data[i][col[j]] = data[i][col[j]];
                  if (data[i][col[j]] == undefined) {
                      data[i][col[j]] = "<code>none</code>";
                  } else {
                      var txstring = data[i][col[j]].toString();
                      var newtx = txstring.substring(0, 10) + "..";
                      data[i][col[j]] = "<a href=\"https://hiveblocks.com/tx/" + txstring + "\" class=\"histuserlink\" style=\"color:white !important;\" target=\"_blank\" title=\"Click to View This TX on HiveBlocks.com in a New Window\">" + newtx + "</a>";

                  }

              }
              if (col[j] == "seedId") {
                  //data[i][col[j]] = data[i][col[j]];
                  if (data[i][col[j]] == undefined) {
                      data[i][col[j]] = "<code>none</code>";
                  } else {
                      var txstring = data[i][col[j]].toString();
                      var newtx = txstring.substring(0, 10) + "..";
                      data[i][col[j]] = `<code>${newtx}</code>`;

                  }

              }
              if (col[j] == "endtxid") {
                  if (data[i][col[j]] == undefined) {
                      data[i][col[j]] = "<code>none</code>";
                  } else  {
                      var txstring = data[i][col[j]].toString();
                      var newtx = txstring.substring(0, 10) + "..";
                      data[i][col[j]] = "<a href=\"https://hiveblocks.com/tx/" + txstring + "\" class=\"histuserlink\" style=\"color:white !important;\" target=\"_blank\" title=\"Click to View This TX on HiveBlocks.com in a New Window\">" + newtx + "</a>";
                  }
              }

              if (col[j] == "state") {
                  if (data[i][col[j]] == undefined) {
                      data[i][col[j]] = "<code>none</code>";
                  } else {
                    data[i][col[j]]
                    switch(data[i][col[j]]){
                      case "finished":
                      data[i][col[j]] = `<i class="fas fa-fw fa-file-invoice-dollar" style="color:lawngreen;" title="Completed"></i>`;
                      break;
                      case "deployed":
                      data[i][col[j]] = `<i class="fas fa-fw fa-file-medical" style="color:lightblue;" title="Deployed"></i>`;
                      break;
                      case "cancelled":
                      data[i][col[j]] = `<i class="fas fa-fw fa-file-excel" style="color:red;" title="Cancelled"></i>`;
                      break;
                      case "accepted":
                      data[i][col[j]] = `<i class="fas fa-fw fa-file-code" style="color:lightgreen;" title="Active"></i>`;
                      break;
                    }

                    ///  var txstring = data[i][col[j]].toString();
                      //var newtx = txstring.substring(0, 6) + "..";
//                      data[i][col[j]] = `<a href="https://hiveblocks.com/tx/${txstring}" class="histuserlink" style="color:white !important;" target="_blank" title="Click to View This TX on HiveBlocks.com in a New Window">${newtx}</a>`

                  }
              }
              if (col[j] == "fine") {
                  if (data[i][col[j]] == 0) {
                      data[i][col[j]] = "<code>none</code>";
                  } else {
                    data[i][col[j]] = (data[i][col[j]] / 1000).toFixed(3) + " <i class=\"fab fa-fw fa-hive hivered\"></i>";
                  }
              }


    /*
                if (col[j] == 'completed') {
                  if(data[i][col[j]] === 0){
                    data[i][col[j]] = '❌';
                  }
                  if(data[i][col[j]] === 1){
                    data[i][col[j]] = '✔️';
                  }
                }

                if (col[j] == 'account') {
                    if (data[i][col[j]] == undefined) {
                        data[i][col[j]] = "Unknown";
                    } else {
                        data[i][col[j]] = `<a href="https://hiveblocks.com/@${data[i][col[j]]}" class="histuserlink" target="_blank" title="Click to View This Account on HiveBlocks.com in a New Window">@${data[i][col[j]]} <i class="fas fa-external-link-alt"></i></a>`;
                    }
                }

                if (col[j] == 'date') {
                  if (data[i][col[j]] == undefined) {
                      data[i][col[j]] = "No Date on Record";
                  } else {
                      var datestring = data[i][col[j]].toString();
                      var newdate = datestring.substring(0, datestring.length - 4);
                      data[i][col[j]] = newdate;
                  }
                }
                */
                var tabCell = tr.insertCell(-1);


                tabCell.innerHTML = data[i][col[j]];//"<button style=\"background:none;border:none;color:white;\">" + data[i][col[j]] + "</button>";
            }
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById(elementid);
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

    var tableOffset = $(`#${tablename}`).offset().top;
    var $header = $(`#${tablename} > #${tableheadname}`).clone();
    var $fixedHeader = $(`#${tableheadname}-fix`).append($header);

    $(window).bind("scroll", function() {
        var offset = $(this).scrollTop();

        if (offset >= tableOffset && $fixedHeader.is(":hidden")) {
            $fixedHeader.show();
        } else if (offset < tableOffset) {
            $fixedHeader.hide();
        }
    });

}

var getFounders = async() => {
  founderlist = '';
  socket.emit('getfounders', {data:true}, await function(err, data){
    if(err){
      console.log(err)
    }
    data = JSON.parse(JSON.stringify(data.founders));
    for(var c = 0; c < data.length; c++){
      founderlist += `<a href="https://peakd.com/@${data[c]}" style="text-decoration:none !important; color:white;">@${data[c]}</a>, `;
      if (c == data.length - 2) {
      founderlist += `<a href="https://peakd.com/@${data[c++]}" style="text-decoration:none !important; color:white;">@${data[c++]}</a>`;
      }
    }
    foundercount = data.length;
  })
    return founderlist;
}

console.log(hiveloanslogo);

//JS generated sound shit
var context = new AudioContext();
var o = null;
var g = null;

function soundgen(frequency, type){
  o = context.createOscillator()
  g = context.createGain()
  o.type = type
  o.connect(g)
  o.frequency.value = frequency
  g.connect(context.destination)
  o.start(0)

  g.gain.exponentialRampToValueAtTime(
    0.000001, context.currentTime + 0.25
  )
}//END JS sound shit


/*
<div class="priceChartContainer"><canvas id="myChart"></canvas></div>

var myChart;
var renderChart = (data, labels, element) => {

  var ctx = document.getElementById("myChart").getContext('2d');
  if(data == undefined) return;
  //labels = JSON.parse(JSON.stringify(labels));
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
          lineTension: 0,
            labels: labels,
            datasets: [{
                label: 'Hive Price USD',
                data: data,
                backgroundColor:"white",
                fill: true,
                pointRadius: 0,
              }],
        },
        options: {
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem) {
                  return "1 HIVE = $" + tooltipItem.yLabel.toFixed(4) + " USD";
                }
              }
            },
          scales: {
            yAxes: [{
              label: function(label){
                return;
              },
              legend: {
                display: false
              },
              gridLines: {
                display: false
              },
              ticks: {
                //beginAtZero: true,
              },

            }],
            xAxes: [{
              label: function(label){
                return;
              },
              gridLines: {
                display: false
              },
              ticks: {
                //beginAtZero: true,
                display: false
              }
            }],
          }
        }
    });
  }
  */
