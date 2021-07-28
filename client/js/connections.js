//--------------------------------------------------
//     Socket & Debug
//--------------------------------------------------
var socket = io();

if(debug === true){
  var onevent = socket.onevent;
  socket.onevent = function (packet) {
      var args = packet.data || [];
      onevent.call (this, packet);    // original call
      packet.data = ["*"].concat(args);
      onevent.call(this, packet);      // additional call to catch-all
  };

  socket.on("*",function(event, data) {
    //Add/uncomment entry below to filter from debug console output
      //if(event === 'latestblock') return;
      //if(event === 'priceupdate') return;
      console.log(`===============================\nName: ${event}`);
      console.log(data);
      console.log(`===============================`);
  });
}

//--------------------------------------------------
//     Connect & Debug & Token
//--------------------------------------------------
socket.on('connect', function(){
  if(debug) console.log(`Browser Client SocketID: ${socket.id}`);
  bootbox.hideAll();
  //jumbo left title buttons
  $("#jumboBack").hide();
  $("#jumboForward").hide();
  $("#jumboMove").hide();
  //pricechart bottom left buttons
  $("#alertPriceMove").hide();
  //site Alert Buttons
  $("#siteAlertMove").hide();
  $("#chatMove").hide();
  $("#scrollerWrapper").hide();
  $("#alertpanel").css({'left':'0.5%','top':'7%','height':'85%','width': '18%'});
  $("#alertpricepanel").css({'left':'12%','bottom':'6%','height':'85%','width': '18%'});
  $("#alertpricepanel").fadeIn();
  $("#jumbotron").center();

  socket.emit('connectinit', function(data){
    if(data){
      showSuccess(`Welcome to the Hive.Loans v${data}`);
      console.log(data);
      version = data;
      document.title = `Hive.Loans - v${data}`;
      $(".versionclass").html(`v${data}`);
      $("#jumboVersion").html(`v${data}`);
      $("#footerV").html(`v${data}`);
    };
  });
  $('#loadingscreenblack').fadeOut('slow');
  if($(`#usernamestore`).val().length > 0) logout();
});//END connect


socket.on('token', function(data){
  token = data.token;
});//END token

socket.on('validcheck', function(data){
  if(navList[navList.length-1] == "futures"){
       CreateTableFromJSON(data, 'opencfds', 'openFutureOrders', "opencfdtable", "opencfdhead");
  }
});

//--------------------------------------------------
//     Shares & Dividends & Backers & Investing
//--------------------------------------------------
socket.on('sharesitetake', function(data){
  if(debug == true) console.log(data);
  var siteshare = (data/100000000).toFixed(3);
$('#sitetake').val(siteshare);
});//END sharesitetake

socket.on('backersupdate', function(data){
  return;
  try {
    data = data.deposits;
  } catch(e) {
    console.log(`Error: ${e}`);
  }
  data.forEach((item, i) => {
    if(!backerlist.includes(item.username)){
      backerlist.push(item.username)
    }
  });
  backercount = backerlist.length;
  $('.lendingtable').css({'width':'100%'})
  //CreateTableFromJSON usage flow is commented below
  //(data, name, elementid, tablename, tableheadname)
  CreateTableFromJSON(data, 'backers', 'activeBackerView', 'activeBackerTable', 'activeBackerHead');
});//END backersupdate

//--------------------------------------------------
//     Loans & Lending & Borrowing
//--------------------------------------------------
socket.on('infoloandata', function(data){
  try {
    token = data.token
    data = data.loandata;
  } catch(e) {
    console.log(`Error: ${e}`);
  }
  console.log(data);
  //{"id":7,"userId":1,"loanId":"e15f732fdfaf1324e4d4bb0b15c26105","username":"klye","amount":1000,"days":7,"interest":10,"borrower":null,"nextcollect":"2021-02-09T18:41:20.000Z","collected":0,"currentpayments":0,"totalpayments":0,"active":0,"completed":0,"createdAt":"2021-02-09T18:41:20.000Z","updatedAt":"2021-02-09T18:41:20.000Z"}
  var newinterest = (data.interest / 100);
  data.totalpayments = (data.days / 7);
  var totalrepay =  data.amount + (data.amount * newinterest);
  var paymentSum = totalrepay / data.totalpayments;
  if(data.borrower == null){
    data.borrower = 'none';
  }
  if(data.active == 0){
    data.active = `<center><button class="acceptButton push_button4" style="float:left;" id="acceptButton" onclick="acceptContract('${data.loanId}');">Accept <i class="fas fa-fw fa-coins" style="color:gold;"></i></button></center>`;
  } else {
    data.active = 'In Progress';
  }
  if(data.completed === 0){
    data.completed = 'Waiting';
  }

  var date = new Date(data.createdAt);
  date = date.toString();
  date = date.slice(0, (date.length - 20));

  var hyperdatatable = `<table class=" " style="background: #212121; border-radius: 10px; border: inset 2px #212121; width: 100% !important; height: 5% !important;"><tbody><tr><td><code>Loan ID</code><br>${data.loanId}</td><td><code>Lender</code><br>@${data.username}</td><td><code>Amount</code><br>${(data.amount / 1000)} HIVE</td><td><code>Interest Rate</code><br>${data.interest}%</td><td><code>Repaid:</code><br>${(data.collected / 1000)} HIVE</td><td><code>Contract Total Cost:</code><br>${(totalrepay / 1000)} HIVE</td><td><code>Duration</code><br>${data.days} days</td><td><code>Borrower</code><br>${data.borrower}</td><td><code>Payments</code><br>${data.currentpayments} / ${data.totalpayments} <i class="far fa-fw fa-question-circle" title="Payment Amounts of ${(paymentSum / 1000)} HIVE Weekly"></i></td><td><code>Active</code><br>${data.active}</td></tr></tbody></table>`; //<td><code>Completed</code><br>${data.completed}</td><td><code>Created</code><br>${date}</td>
    $('#loadloaninfo').html(`${hyperdatatable}`);
});//END infoloandata



socket.on('newloan', function(data){
  if(debug) console.log(data);
  showSuccess(`Loan ${data.loanId} Created!`);
  showLend()
});//END newloan

socket.on('newloanmade', function(data){
  showSuccess(`Attempting to Create Lending Contract...`);
});//END newloanmade

socket.on('nukeloan', function(data){
  if(debug)console.log(data);
  showSuccess(`Loan ${data.loanId} Cancelled!`);
  showLend()
});//EMD nukeloan

socket.on('loannuked', function(data){
  if(data.cancelled == true){
      showSuccess(`Succesfully Cancelled Lending Contract!`);
  }
});//END loannuked

socket.on('loadmyloans', async function(data){
  if(debug) console.log(data);
  if(data) {
    data = JSON.parse(JSON.stringify(data));
    usersLoanDataFetch = data;
    //showLendingTab();
    //showSuccess(data);
  }
});//END loadmyloans

socket.on('loadallloans', async function(data) {
  if(debug) console.log(data);
  if(data){
    var untappeddata = data;
      $("#jumbotron").promise().done(function(){
          $("#jumboWrapper").html(loansContent);
          $("#jumbotron").css({'top':'11%','height':'86vh','width':'60%'});
          $("#jumbotron").center();
          $("#jumboHead").show();
          $("#jumboTitle").text(`Lending Contract Pool Overview`);
                  //$(`#contractcount`).html(`${untappeddata.loans.length}`);
                  var loans;
                  var ourloans = [];
                  if(typeof untappeddata.loans == undefined){
                    untappeddata.loans = [];
                    loans = untappeddata.loans;
                  }
                 data.map(function(key) {
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
                   }
                  });
                  if(typeof untappeddata.loans == undefined) untappeddata.loans = [];
                  if(!ourloans) {ourloans = []};
                  CreateTableFromJSON(ourloans, 'ourloans', 'loadActiveloans', 'loadActiveTable', 'loadActiveHead');
                  CreateTableFromJSON(data, 'loadloans', 'loadAllLoans', 'loadAllLoansTable', 'loadAllLoansHead');
          //$('#loadloaninfo').html(`Select a lending contract to inspect above`);
          //$("#jumbotron").fadeIn();
      });
      var gettheaccount = await getHivePower(uUsername);
      var getthedelegation= await getHiveDelegations(uUsername);
      gettheaccount = JSON.parse(gettheaccount);
      getthedelegation = getthedelegation;
      var hiveDele = getthedelegation[getthedelegation.length - 1]['hivedelegated'];
      console.log(hiveDele);
      console.log(gettheaccount);
      console.log(getthedelegation);
      loanMax = Math.floor(gettheaccount.credit);
      var hpNow = gettheaccount.hp;
      $('span#loanMax').val(`${loanMax.toFixed(3)}`);
      $('span#loanMax').html(`${loanMax.toFixed(3)}`);
      $('span#loanMax7').val(`${(loanMax / 13).toFixed(3)}`);
      $('span#loanMax7').html(`${(loanMax / 13).toFixed(3)}`);
      $('#loansHPdisplay').html(`${(hpNow).toFixed(3)}`);
      $('span#loanDelegation').val(`${hiveDele.toFixed(3)}`);
      $('span#loanDelegation').html(`${hiveDele.toFixed(3)}`);
  }
});//END loadallloans

socket.on('loadedShares', async function(data){
  console.log(`socket.on('loadedShares', async`)
  if(data){
        //$("#jumbotron").fadeOut('fast');
        $("#jumbotron").promise().done(function(){
            $("#jumboWrapper").html(sharesContent); //lendingContent
            $("#jumbotron").css({'top':'11%','height':'86vh','width':'60%'});
            $("#jumbotron").center();
            //CreateTableFromJSON(data.loans, 'loans', 'activeLendView', 'activeLendTable', 'activeLendHead');
            //$("#jumbotron").fadeIn();
            if(dataGrab){
              $("#loanPreviewBalance").html((dataGrab.hivebalance / 1000));
            }
            $("#jumboTitle").text(`Hive.Loans Share Exchange`);
            $("#newLendAmount").keyup(function (e) {
                if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57 ) ) {
                    return false;
                } else {
                  if(parseFloat($("#newLendAmount").val()) < 0){
                    $("#newLendAmount").val(0);
                  }
                }
            });
        });
  }
});//END loadedShares

socket.on('loadedLoans', async function(data){
  if(data){
    var dataGrab = await getUserSiteBalance(uUsername).then(res => { return res }).catch(error => {console.log(error)});
    console.log(`loadedLoans`);
    usersLoanDataFetch = dataGrab;
    console.log(usersLoanDataFetch)
    if (data.loans.length == 0){
      showErr(`Fetched No Loans from History!`);
    } else if (data.loans.length == 1){
      //showSuccess(`Fetched ${data.loans.length} Loan from History!`);
    } else {
      //showSuccess(`Fetched ${data.loans.length} Loans from History!`);
    }
    //$("#jumbotron").fadeOut('fast');
    $("#jumbotron").promise().done(function(){
        $("#jumboWrapper").html(newLendingContent); //lendingContent
        $("#jumbotron").css({'top':'10%','height':'auto','width':'60%'});
        $("#jumbotron").center();
        CreateTableFromJSON(data.loans, 'loans', 'activeLendView', 'activeLendTable', 'activeLendHead');
        //$("#jumbotron").fadeIn();
        if(dataGrab){
          $("#loanPreviewBalance").html((dataGrab.hivebalance / 1000));
        }
        $("#jumboTitle").text(`Lending Contract Overview`);
        $("#newLendAmount").keyup(function (e) {
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57 ) ) {
                return false;
            } else {
              if(parseFloat($("#newLendAmount").val()) < 0){
                $("#newLendAmount").val(0);
              }
            }
        });
    });
  }
});//END loadedLoans

//--------------------------------------------------
//     State & Audit & Blocks
//--------------------------------------------------
socket.on('siteaudit', function(data){
  if(debug === true) console.log(`siteaudit data: ${JSON.parse(JSON.stringify(data))}`);
  data = JSON.parse(JSON.stringify(data));
  siteAudit = data;
  siteAuditData(data);
});//END siteaudit

socket.on('statereply', function(data){
  showErr(data);
  $('#blocknumber').html(`<a href="https://hiveblocks.com/b/${data.block}" target="_blank" title="Click this to view the block on HiveBlocks.com in a new window!" style="color:white !important; text-decoration: none !important;"><code>#</code>${data.block}</a>`);
  flashwin($('#blocknumber'));
});//END statereply

socket.on('latestblock', function(data){
  if(!data) return;
  if(debug === true) {
    console.log(`socket.on('latestblock', function(data)`);
    console.log(data);
  }
  if(data.behind) {
    depositDelaySec = (data.behind * 3);
    $('#depsecs').html(depositDelaySec);
  }
  if(data.synced === false){
    blockssynced = `<i class="fa fa-fw fa-exclamation-triangle sexyblackoutline" style="font-size:small !important;color:gold;" aria-hidden="true"></i>`;

  }
  if(data.synced === true){
    blockssynced = `<i class="far fa-fw fa-check-square sexyblackoutline" style="font-size:small !important;font-weight:100 !important; color:lawngreen;" aria-hidden="true"></i>`;
  }
  if(data.backup === true){
    console.log(`this is backup data`);
  }
  $('#blocknumber').html(`<a href="https://hiveblocks.com/b/${data.block}" target="_blank" title="Click this to view the block on HiveBlocks.com in a new window!" style="color:white !important; text-decoration: none !important;"><code>#</code>${data.block}</a> ${blockssynced}`);
});//END latestblock

//--------------------------------------------------
//     Price & Ticker
//--------------------------------------------------
socket.on('hivepriceupdate', function(data){
  if(!data) return;
  if(debug === false){
    console.log(`socket.on('hivepriceupdate', function(data) data:`);
    console.log(data);
  }
    console.log(`hivepriceupdate data:`);
    console.log(data);

  if(data.percent_change_1h > 0){
    arrow1 = "<i class='fas fa-caret-up' style='color:lawngreen;'></i>";
  } else {
    arrow1 = "<i class='fas fa-caret-down' style='color:red;'></i>";
  }

  if(data.percent_change_24h > 0){
    arrow24 = "<i class='fas fa-caret-up' style='color:lawngreen;'></i>";
  } else {
    arrow24 = "<i class='fas fa-caret-down' style='color:red;'></i>";
  }

  if(data.percent_change_7d > 0){
    arrow7 = "<i class='fas fa-caret-up' style='color:lawngreen;'></i>";
  } else {
    arrow7 = "<i class='fas fa-caret-down' style='color:red;'></i>";
  }

  if(data.percent_change_30d > 0){
    arrow30 = "<i class='fas fa-caret-up' style='color:lawngreen;'></i>";
  } else {
    arrow30 = "<i class='fas fa-caret-down' style='color:red;'></i>";
  }

  $('#pricepercentticker').html(commaNumber((data.total_supply).toFixed(3)) + "&nbsp;HIVE");
  $('#pricepercentticker1').html(commaNumber((data.market_cap).toFixed(2)) + "&nbsp;<code>USD</code>");
  $('#pricepercentticker2').html(commaNumber((data.volume_24h).toFixed(2)) + "&nbsp;<code>USD</code>");
  $('#pricepercentticker3').html((data.percent_change_1h).toFixed(2) + "%");
  $('#pricepercentticker4').html((data.percent_change_24h).toFixed(2) + "%");
  $('#pricepercentticker5').html((data.percent_change_7d).toFixed(2) + "%");
  $('#pricepercentticker6').html((data.percent_change_30d).toFixed(2) + "%");
  //$('#pricepercentticker3').html(arrow1 + $('#pricepercentticker3').html());
  //$('#two').html(arrow24);
  //$('#three').html(arrow7);
  //$('#four').html(arrow30);
  if(scrollInit != true){
    startScrollbar();
    scrollInit = true;
  }
});

socket.on('hivepriceupdatebackup', function(data){
  console.log(data);
  //$('#four').html(arrow30);
  if(scrollInit != true){
    startScrollbar();
    scrollInit = true;
  }
  $('#pricepercentticker').removeClass('hidden');
  $('#pricepercentticker').html(`Total Supply: --------.--- | Market Cap: $-------.-- USD | Daily Volume: $-.-- USD | Last Hour: -.--% | Last Day: -.--% | Past Week: -.--% | Past Month:-.--%`)
});//END hivepriceupdatebackup

var numAnim;
socket.on('priceupdate', function(data){
  if(debug === true) {
    console.log(`socket.on('priceupdate)`);
    console.log(data);
  }
  if(typeof hiveprice != undefined) oldhiveusdprice = 0;
  var type = tickercurrency.toUpperCase();
  if(!data.hiveusdprice) return;
  if(!data.hiveshortprice) return;
  if(!data.hivelongprice) return;

  /*
  if(pricechartInit == 0) {
    if(data.datasets == undefined) return;
    renderChart(data.datasets, 0, "myChart");
    pricechartInit++;
  } else {
    addData(data.datasets, data.labelssend, "myChart");
  }
  */

  //if(hivechart) {
    //mergeTickToBar(data.datasets);
    //dataChart = dataChart.slice(20, dataChart.length - 1);
    //var chartshitstuff = data.chart[0];
    //var newprice = chartshitstuff.close;
    //var newtimestuff = chartshitstuff.time;
    //var theAnswer = {time:newtimestuff, price:newprice};
    //if(dataChart != undefined && dataChart.length > 0){
    //  console.log(`currentBar`);
    //  console.log(currentBar);
    //  mergeNewTickToBar(theAnswer);
    //  console.log(`currentBar Now`);
    //  console.log(currentBar);
      //if (firstCFDrun == false) dataChart.push(dataChart);
    //}

  data.hiveusdprice = parseFloat((data.hiveusdprice).toFixed(6));
  data.hivebtcprice = parseFloat((data.hivebtcprice).toFixed(8));

  if(!lastHivePrice) lastHivePrice = data.hiveusdprice;
  if(!lastHiveShortPrice) lastHiveShortPrice = data.hiveshortprice;
  if(!lastHiveLongPrice) lastHiveLongPrice = data.hivelongprice;
  if(!lastHiveBTCPrice) lastHiveBTCPrice = data.hivebtcprice;

  if(lastHivePrice != data.hiveusdprice) {
    lastHivePrice = data.hiveusdprice;
    var numAnim = new CountUp("footerprice", lastHivePrice, data.hiveusdprice, 6, 2);
    numAnim.start();
    numAnim.update(data.hiveusdprice);
    //numAnim.start(someMethodToCallOnComplete);
  }

  if(lastHiveBTCPrice != data.hivebtcprice) {
    lastHiveBTCPrice = data.hivebtcprice;
  }

  if(lastHiveShortPrice != data.hiveshortprice) {
    lastHiveShortPrice = data.hiveshortprice;
  }

  if(lastHiveLongPrice != data.hivelongprice) {
    lastHiveLongPrice = data.hivelongprice;
  }

  $('#shortSpotPrice').val((data.hiveshortprice).toFixed(6));
  $('#longSpotPrice').val((data.hivelongprice).toFixed(6));
  if(lastHivePrice) oldhiveusdprice = lastHivePrice;


  if(pricecheckinit != true) {
    numAnim = new CountUp("footerprice", $('#footerprice').val(), data.hiveusdprice, 6, 0.9, options);
    $('#pricecheckcaret').html(`<i class="fas fa-caret-right hidden" style="color:lightblue;" title="This Price is Recently Fetched at - ${new Date(data.date)}"></i>`);
    if(tickercurrency == 'usd'){
      numAnim.start(updatebet($("#footerprice"), data.hiveusdprice));
      numAnim.update(data.hiveusdprice);
      //$('#footerprice').val(data.hiveusdprice);
      //$('#footerprice').html((data.hiveusdprice).toFixed(6));
    } else if (tickercurrency == 'btc') {
      $('#footerprice').val(data.hivebtcprice);
      $('#footerprice').html((data.hivebtcprice).toFixed(8));
    }
    oldhiveusdprice = data.hiveusdprice;
    pricecheckinit = true;
  } else {
    if($('#footerprice').val() == data.hiveusdprice) {
      if(debug ===true) console.log(`PRICES ARE EQUAL`);
      return;
    } else {
      if(debug ===true) console.log(`PRICES ARE NOT EQUAL`);
      if($('#footerprice').val() > data.hiveusdprice) {
        $('#pricecheckcaret').html(`<i class="fas fa-caret-down" style="color:red;" title="This Price is Lower Than Last Update - ${new Date(data.date)}"></i>`);
        if(tickercurrency == 'usd'){
          //var numAnim = new CountUp("footerprice", $('#footerprice').val(), data.hiveusdprice, 6, 5, options);
          numAnim.start(updatebet($("#footerprice"), data.hiveusdprice));
          numAnim.update(data.hiveusdprice);
          //$('#footerprice').val(data.hiveusdprice);
          //$('#footerprice').html((data.hiveusdprice).toFixed(6));
        } else if (tickercurrency == 'btc') {
          $('#footerprice').val(data.hivebtcprice);
          $('#footerprice').html((data.hivebtcprice).toFixed(8));
        }
        flashlose($('#footerprice'));
      } else {
        $('#pricecheckcaret').html(`<i class="fas fa-caret-up" style="color:lawngreen;" title="This Price is Higher Than Last Update - ${new Date(data.date)}"></i>`);
        if(tickercurrency == 'usd'){
          //var numAnim = new CountUp("footerprice", $('#footerprice').val(), data.hiveusdprice, 6, 5, options);
          numAnim.start(updatebet($("#footerprice"), data.hiveusdprice));
          numAnim.update(data.hiveusdprice);
          //$('#footerprice').val(data.hiveusdprice);
          //$('#footerprice').html((data.hiveusdprice).toFixed(6));
        } else if (tickercurrency == 'btc') {
          $('#footerprice').val(data.hivebtcprice);
          $('#footerprice').html((data.hivebtcprice).toFixed(8));
        }
        flashwin($('#footerprice'));
      }
    }
  }

/*
  if ($('#pricetype').val() == undefined) {
    type = 'USD';
    $('#pricecheck').html(`1 HIVE = $${data.hiveusdprice} <span id="pricetype">${type}</span>`);
    flashwin($('#pricecheck'));
  } else if($('#pricetype').val() == 'BTC'){
    type = 'BTC';
    $('#pricecheck').html(`1 HIVE = $${data.hivebtcprice} <span id="pricetype">${type}</span>`);
    flashwin($('#pricecheck'));
  } else {
    $('#pricecheck').html(`1 HIVE = $${data.hivebtcprice} <span id="pricetype">${type}</span>`);
    flashwin($('#pricecheck'));
  }
  */
});


//--------------------------------------------------
//     Tip
//--------------------------------------------------
socket.on('tip', function(data){
  $("#balance").val((data.balance/100000000).toFixed(8));
  $(".userhivebalancedisplay").html(data.balance);
  $(".userhivebalancedisplay").val(data.balance);
  showSuccess('Tip received from ' + data.fromuser + " for " + (data.amount/100000000).toFixed(8) + " HIVE");
});

socket.on('tipsent', function(data){
  data.amount = (data.amount/100000000).toFixed(8);
  data.balance = (data.balance/100000000).toFixed(8);
  alertChatMessage({message: "Tip from " + data.from + " for " + data.amount + " STEEM", time: data.time});
  showSuccess("TIP Recieved from " + data.from + " for " + data.amount);
  $("#balance").val(data.balance);
  $(".userhivebalancedisplay").html(data.balance);
  $(".userhivebalancedisplay").val(data.balance);
  token = data.token;
});

//--------------------------------------------------
//     Chat & Messages
//--------------------------------------------------
socket.on('chatmessage', function(message){
  console.log(message);
    writeToChatBox(message);
    limitTrollBox();
    scrollToTop($("#trollbox"));
});

socket.on('chatHistory', function(hist){
  console.log(`chatHistory`);
  console.log(hist);
  hist = hist.chathist;
  writeBufferToChatBox(hist);
});


//--------------------------------------------------
//     Balance & Wallet & Deposit & Withdraw
//--------------------------------------------------
socket.on('balupdate', function(data){
  if (data.error) return showErr(data.error);
  //console.log("balupdate data:");
  //console.log(data);
  $(".userhivebalancedisplay").html(data.balance);
  $(".userhivebalancedisplay").val(data.balance);
    $("#balance").val(data.balance);
});//END balupdate

socket.on('depositcredit', function(data){
  showSuccess(`Deposit of ${data.amount / 1000} ${data.coin} Arrived!`);
  if (data.coin == 'HIVE'){
    uHIVEbalance = data.balance;
    $('.userhivebalancedisplay').val(uHIVEbalance / 1000);
    $('#userhivebalance').val(uHIVEbalance / 1000);
    if(swod == true) showWallet(uUsername);
  } else {
    uHBDbalance = data.balance;
    //$('.userhbdbalancedisplay').val(uHIVEbalance / 1000);
    $('#userhbdbalance').val(uHBDbalance / 1000);
    if(swod == true) showWallet(uUsername);
  }
});//END depositcredit

socket.on('depositmemo', function(data){
$('#depositmemo').val(data.usernameid);
});//END depositmemo

socket.on('withdrawbalance', function(data){
$("#withdrawbalance").val(data.balance);
$(".userhivebalancedisplay").html(data.balance);
$(".userhivebalancedisplay").val(data.balance);
});//END withdrawbalance


socket.on('walletdata', function(data){
  if(data) {
    data = data[0];
    userWalletFetchData = data;
  } else {
    return;
  }
  console.log(`walletdata data:`)
  console.log(data);
  user = data.username;
  var address = data.address;
  $("#jumbotron").promise().done(function(){
    $("#jumboBack").show();
    $("#jumboMove").show();
    $("#jumboForward").show();
    $("#jumboHead").show();
    $("#jumboBack").removeClass("hidden");
    $("#jumboMove").removeClass("hidden");
    $("#jumboForward").removeClass("hidden");
    $("#jumboTitle").text(`Your Hive.Loans Wallet`);
    $("#jumboWrapper").html(walletContent);
    $('#loginDataSave').val(address);
    $('#userhivebalance').val((data.hivebalance / 1000).toFixed(3));
    $('#walletHistoryInset').fadeOut();
    //$('#userhbdbalance').val((data.hbdbalance / 1000).toFixed(3));
    $('#depositName').val('hive.loans');
    $('#depositMemo').val(data.address);
    $("#jumbotron").css({'top':'25%', 'min-height':'40vh','height':'auto','width':'25%'});
    $("#jumbotron").center();
    $("#jumbotron").fadeIn();
  });
});//END walletdata

socket.on('wallethistory', function(data){
  if(data) {
    console.log(`wallethistory data:`);
    console.log(data);
    $('#walletHistoryTableHolder').html(walletHistoryTable);
    CreateTableFromJSON(data, 'withdrawhistory', 'walletHistoryTableHolder', 'wht', 'whth');

  }
});//END wallethistory

//--------------------------------------------------
//     Admin & Mods
//--------------------------------------------------
socket.on('adminlogin', function(userident){
  showSuccess('Welcome Back Lord ' + userident);
  $('#adminpagetab').css({'display':'block'});
  socket.emit('populateadmintab', userident);
});//END adminlogin

socket.on('makeadmintab', function(admintabcontents){
  $('#adminTab').html(admintabcontents);

});//END makeadmintab
