//========================================================================================
// Page contents and whatnot
//========================================================================================
var loanMax;
let moverAddon =
`<span id="jumboBack" class="smolbutton" style="left:0.4em" title="Click to Navigate Back" onclick="navBack();"><i class="fas fa-fw fa-arrow-left"></i></span>`+
`<span id="jumboMove" class="smolbutton" style="left:2.75em" title="Click and Drag to Move Window" onclick="$("#jumbotron").draggable();"><i class="fas fa-fw fa-arrows-alt"></i></span>`+
`<span id="jumboForward" class="smolbutton" style="left:5.1em" title="Click to Navigate Forward" onclick="navForward();"><i class="fas fa-fw fa-arrow-right"></i></span>`+
`<center style="width:100%"><span id="jumboTitle" class="jumboTitle" style="max-width: 100%;"></span></center>`+
`<span id="jumboClose" class="smolbutton" title="Click to Close this Panel" onclick="$('#jumbotron').fadeOut();" onmouseover="$(this).css({'color':'red'})" onmouseout="$(this).css({'color':'white'})"><i class="fas fa-fw fa-times"></i></span>`;

 function loadingjumbo() {
  var loadingContent = `<center style="margin-top:-15px;"><b>LOADING</b><hr><i id="loadingring" style="color:limegreen;" class="fa fa fa-cog fa-pulse fa-3x fa-fw"></i><br></center>`;
      $("#jumboWrapper").html(loadingContent);
      $("#jumbotron").css({'min-height':'9vh','height':'9vh','min-width':'7vh','width':'7vh'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn('slow');
      //$("#jumboTitle").text(`Loading`);
      $("#jumboHead").hide();

}

if (window.hive_keychain) {
    hive_keychain.requestHandshake(function() {
        console.log("Handshake received!");
    });
}

//========================================================================================
// Legacy modals and whatnot
//========================================================================================


//Tip Modal
$("#tipdialog").on('click', function() {
    username = ('');
    bootbox.dialog({
        message:
            '<center><span class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style=""><i class="fa fa-at fa-2x"></i></span>' +
            '<b><input type="text" class="form-control" placeholder="User" aria-describedby="basic-addon1" id="tipto" style="" ></b><span class="input-group-addon addon-sexy" style="">User</span></span>' +
            '<br><span class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style=""><b>Tip</b></span>' +
            '<b><input type="number" class="form-control" placeholder="0.000" id="tipamount" aria-describedby="basic-addon1"></b>' +
            '<span class="input-group-addon addon-sexy currencychanger" style="padding:5px;"><i class="far fa-hive" style="color:31EE7E;"></i></span></span>' +
            `<sub>( Balance: <span id="tipbalance">0.0000000</span> <span id="tipBalspan"></span> )</sub>`,
        title: `<center><span id="sexymodaltitle">Hive.Loans</span><br>Tip Another User Instantly</center>`,
        buttons: {
            main: {
                label: "Send",
                className: "push_button2",
                callback: function() {
                    socket.emit('tip', {
                        amount: parseInt($("#tipamount").val() * 100000000),
                        to: $("#tipto").val(),
                        token: token
                    }, function(err, data) {
                        if (err) {
                            return showErr(`Tip Send Failed! Error: ${err}`);
                        }
                        console.log(data)
                        if (data.token !== 0) token = data.token; //token is always returned
                        $("#balance").val((data.balance / 100000000).toFixed(8));
                        showSuccess("Tip Sent!");
                    });
                }
            }
        }
    });
    $('#tipbalance').html(($('#balance').val()).toFixed(3));
});

function showChat() {
  $("#chatpanel").removeClass("hidden");
  $("#chatpanel").show();
  $("#chaticon").addClass("hidden");
};

$("#numClient").on('click', function(e) {
  socket.emit('userlist', {
      token: token
  }, function(err, data) {
      if (err) {showErr(err);}
      if (data) {
          let userslist;
          let usercount = 0;
          userslist = Object.keys(data.usersonline);
          var ulist = [];
          userslist.forEach((user, i) => {
            ulist.push(` ${user}`);
            usercount++;
          });
          bootbox.dialog({
              message:`<center>${ulist}</center><br>`,
              title: `<center><span id="sexymodaltitle">Hive.Loans</span><br>Users Currently Online: ${usercount}</center>`,
              buttons: {
                  main: {
                      label: "Close",
                      className: "push_button2"
                  }
              }
          });
      }
  });
});



/*
requestSendToken
Requests a token transfer

Parameters
account String Hive account to perform the request
to String Hive account to receive the transfer
amount String Amount to be transfered. Requires 3 decimals.
memo String Memo attached to the transfer
currency String Token to be sent
callback function Keychain's response to the request
rpc String Override user's RPC settings (optional, default null)



account String Hive account to perform the request
to String Hive account to receive the transfer
amount String Amount to be transfered. Requires 3 decimals.
memo String The memo will be automatically encrypted if starting by '#' and the memo key is available on Keychain. It will also overrule the account to be enforced, regardless of the 'enforce' parameter
currency String 'HIVE' or 'HBD'
callback function Keychain's response to the request
enforce boolean If set to true, user cannot chose to make the transfer from another account (optional, default false)
rpc String Override user's RPC settings (optional, default null)

*/

var withdrawButtonSideWallet = async(user, coin) => {
  console.log(`withdrawButtonSideWallet(${user}, ${coin})`)
  //var fromLength =
  //var toLength =
  socket.emit('withdrawopen', {
      coin: coin,
      token: token
  }, function(err, data) {
      if (err) {
          console.error(e);
          return showErr(`An Error Occured Fetching Account Data!`);
      }
      if (data) {
        console.log(data);
        let feefetch;
        feefetch = data.fee
          var rawHiveBalance;
          var userHiveBalance;
          var rawHbdBalance;
          var userHbdBalance;

          if(typeof coin == undefined){
            coin = 'HIVE';
          }

          coin = coin.toUpperCase();
          let moverAddon = `<div style="font-size:1.5em;width:100%;font-weight:500;"><span id="jumboMove" title="Click and Drag to Move Window"><i class="fas fa-arrows-alt"></i></span><span id="refreshJumboStats" style-"float:right" title="Click to Refresh" onClick="getJumboStats();"></div>`;
          function showSideSend() {



            let wdContent = `<center>` +
           `<h3 style="margin: none !important;">` +
           `<table style="width:100%;align-content:center;font-size: larger !important;">` +
           `<tbody>` +
           `<tr>` +
           `<td style="width:40%;">` +
           `<a href="https://hiveblocks.com/@hive.loans" target="_blank" style="text-decoration:none !important;" class="walletTopName">` +
           `hive.loans` +
           `</a>` +
           `</td>` +
           `<td>` +
           `<!--<i class="fas fa-long-arrow-alt-right" style="font-size:xx-large;" class="walletTopName"></i>-->` +
           `<span class="fa-stack fa-1x hivesend">` +
           `<i class="fab fa-hive fa-stack-2x" style="color:#E31337;"></i>` +
           `<i class="fas fa-arrow-right fa-stack-1x fa-inverse" class="walletTopName"></i>` +
           `</span>` +
           `</td>` +
           `<td style="width:40%;">` +
           `<a href="https://hiveblocks.com/@${uUsername}" style="text-decoration: none !important;"  class="walletTopName" target="_blank">` +
           `${uUsername}` +
           `</a>` +
           `</td>` +
           `</tr>` +
           `</tbody>` +
           `</table>` +
           `</h3>`+
         //  `<h3 style="margin: none !important;"><a href="https://hiveblocks.com/@${user}" style="text-decoration: none !important;" target="_blank">${user}</a> <i class="fas fa-long-arrow-alt-right"></i> <a href="https://hiveblocks.com/@hive.loans" target="_blank" style="text-decoration:none !important;">hive.loans</a></h3><br>`+
           `<b>Specify Amount of ${coin} to Withdraw:</b>` +
           `<br>` +
           `<input type="number" min="0" step="0.001" decimal="3" id="withdrawInteger" style="" min="0.001" placeholder="0.000" onkeyup="setTimeout(function(){var tothird = parseFloat(this.value);  $(this).val(tothird.toFixed(3))},5000); calctotal($('#rawfee').val(), '${coin}');" >` +
           `<br>` +
           `<sub>( Account Balance: <span id="tipbalance"  class="userhivebalancedisplay" placeholder="0.000" onClick="$('#withdrawInteger').val($('#tipbalance').val());calctotal(${data.fee}, '${coin}')"></span> ${coin} <span id="tipBalspan"></span> )</sub><br><br>`+
           `<span id="rawfee"></span><span id="wdfee">Calculating fee..</span><br><br>` +
           `<span id="wdtotal">Specify withdrawal amount above for preview</span><br><br>` +
           `<b>Account to Withdraw to:</b>` +
           `<br>` +
           `<input type="text" readonly id="withdrawSideAcct" style="" value="${user}" onkeyup="console.log($(this).val())" ><br>` +
           `<b>Transfer Memo:</b>` +
           `<br>` +
           `<input type="text" id="withdrawMemo" style="background: white;color: white;text-align: center;width: 18vw;height: 3vh;font-size: large; border-radius:10px;" placeholder="( optional )"><br><sub>( <span id="underAcctText"></span> )</sub><br>` +
           `<button type="button" class="button" id="withdrawit" style="font-size: larger; border-radius:5px;" onclick="if($(this).prop('disabled')){console.log('Invalid Withdraw Request!')} else {wdnow('${coin}', ${data.fee}, '${data.security}'); dotdotdotmaker($('#wdbuttontext'), $('#wdbuttontext').html());}" title="Click Here Withdraw from Hive.Loans"><span id="wdbuttontext">Enter Amount</span></button><br><br>` +
           `<sub><i class="fa fa-exclamation-triangle" style="color:gold;" aria-hidden="true"></i> Withdrawal Address <b><u>MUST</u></b> be Correct, We Cannot Refund ${coin} Sent to a Wrong Account!</sub></center>`;
            $("#sitealertpanel").fadeOut('fast');
            $("#sitealertpanel").promise().done(function(){
              $("#alertHead").show();
              $("#alertName").val(`Deposit`);
                $("#alertWrapper").html(wdContent);
                $('#withdrawSideAcct').val(uUsername);
                $("#tipbalance").val((usersDataFetch.balance).toFixed(3));
                $("#tipbalance").html((usersDataFetch.balance).toFixed(3));
                $("#rawfee").val(data.fee);
                if(data.fee != 0) {
                  if (usersDataFetch.rank == 'founder') {
                    $('#wdfee').html(`Account Type: ${(usersDataFetch.rank).toUpperCase} - -50% Withdraw Fee: ${data.fee} ${coin}`);
                  } else if (data.rank == 'user') {
                    $('#wdfee').html(`Account Type: ${(usersDataFetch.rank).toUpperCase} - Withdraw Fee: ${data.fee} ${coin}`);
                  }
                } else {
                  $('#wdfee').html(`Account Type: ${(usersDataFetch.rank).toUpperCase} - Zero Withdraw Fees`);
                }
                if (usersDataFetch.rank == 'user') {
                  $('#underAcctText').html(`Withdraw account has been locked in for security`);
                } else if (usersDataFetch.rank == 'owner') {
                  $('#underAcctText').html(`You're the fucking owner, do what you want man`);
                  $('#withdrawAcct').attr("readonly", false);
                } else if (usersDataFetch.rank == 'founder') {
                  $('#underAcctText').html(`As a founder you can edit your withdrawal account field`);
                  $('#withdrawAcct').attr("readonly", false);
                }
                $("#sitealertpanel").fadeIn();
            });
          }
        showSideSend();

          try{
            isVip = usersDataFetch.vip;
            fee = data.fee;
            balance = data.balance;
            security = data.security;

          } catch(e){
            showErr(`Error Fetching Withdraw Data! Please Try Again Shortly!`);
          }
          $('#wdfee').html(fee);
          $('#wdfee').val(fee);
          if(isVip == true){
            $('#vipfeesub').html(`<i class="fas fa-fire-alt" style="color:gold;" title="VIP Feature"></i> No Withdraw Fee for VIP Members!`);
          }
          $("#withdrawbalance").val((balance).toFixed(8));
          $('#addresstype').val('None');
          $('#addresstype').html('None');
      }
  });

}


var withdrawButtonWallet = async(user, coin) => {
  console.log(`withdrawButtonWallet(${user}, ${coin})`)
  //var fromLength =
  //var toLength =


  socket.emit('withdrawopen', {
      coin: coin,
      token: token
  }, function(err, data) {
      if (err) {
          console.error(e);
          return showErr(`An Error Occured Fetching Account Data!`);
      }
      if (data) {
        console.log(data);
        let feefetch;
        feefetch = data.fee
          var rawHiveBalance;
          var userHiveBalance;
          var rawHbdBalance;
          var userHbdBalance;

          if(typeof coin == undefined){
            coin = 'HIVE';
          }

          coin = coin.toUpperCase();
          let moverAddon = `<div style="font-size:1.5em;width:100%;font-weight:500;"><span id="jumboMove" title="Click and Drag to Move Window"><i class="fas fa-arrows-alt"></i></span><span id="refreshJumboStats" style-"float:right" title="Click to Refresh" onClick="getJumboStats();"></div>`;
          function showSend() {



            let sendingContent = `<center>` +
           `<h3 style="margin: none !important;">` +
           `<table style="width:100%;align-content:center;font-size: larger !important;">` +
           `<tbody>` +
           `<tr>` +
           `<td style="width:40%;">` +
           `<a href="https://hiveblocks.com/@hive.loans" target="_blank" style="text-decoration:none !important;" class="walletTopName" title="Clicking this will Open a New Window to the Hive.Loans Wallet">` +
           `hive.loans` +
           `</a>` +
           `</td>` +
           `<td>` +
           `<!--<i class="fas fa-long-arrow-alt-right" style="font-size:xx-large;" class="walletTopName"></i>-->` +
           `<span class="fa-stack fa-1x hivesend">` +
           `<i class="fab fa-hive fa-stack-2x" style="color:#E31337;"></i>` +
           `<i class="fas fa-arrow-right fa-stack-1x fa-inverse" class="walletTopName"></i>` +
           `</span>` +
           `</td>` +
           `<td style="width:40%;">` +
           `<a href="https://hiveblocks.com/@${uUsername}" style="text-decoration: none !important;"  class="walletTopName" target="_blank">` +
           `${uUsername}` +
           `</a>` +
           `</td>` +
           `</tr>` +
           `</tbody>` +
           `</table>` +
           `</h3>`+
         //  `<h3 style="margin: none !important;"><a href="https://hiveblocks.com/@${user}" style="text-decoration: none !important;" target="_blank">${user}</a> <i class="fas fa-long-arrow-alt-right"></i> <a href="https://hiveblocks.com/@hive.loans" target="_blank" style="text-decoration:none !important;">hive.loans</a></h3><br>`+
           `<b>Specify Amount of ${coin} to Withdraw:</b>` +
           `<br>` +
           `<input type="number" min="0" step="0.001" decimal="3" id="withdrawInteger" style="" min="0.001" placeholder="0.000" onkeyup="setTimeout(function(){var tothird = parseFloat(this.value);  $(this).val(tothird.toFixed(3))},5000); calctotal($('#rawfee').val(), '${coin}');" >` +
           `<br>` +
           `<sub>( Account Balance: <span id="tipbalance"  class="userhivebalancedisplay" placeholder="0.000" onClick="flashwin($('#withdrawInteger'));$('#withdrawInteger').val($('#tipbalance').val());calctotal(${data.fee}, '${coin}');"></span> ${coin} <span id="tipBalspan"></span> )</sub><br><br>`+
           `<span id="rawfee"></span><span id="wdfee">Calculating fee..</span><br><br>` +
           `<span id="wdtotal">Specify withdrawal amount above for preview</span><br><br>` +
           `<b>Account to Withdraw to:</b>` +
           `<br>` +
           `<input type="text" readonly id="withdrawAcct" style="" value="${user}" onkeyup="console.log($(this).val())" ><br>` +
           `<b>Transfer Memo:</b>` +
           `<br>` +
           `<input type="text" id="withdrawMemo" style="background: white;color: white;text-align: center;width: 18vw;height: 3vh;font-size: large; border-radius:10px;" placeholder="( optional )"><br><sub>( <span id="underAcctText"></span> )</sub><br>` +
           `<button type="button" class="button" id="withdrawit" style="font-size: larger; border-radius:5px;" onclick="if($(this).prop('disabled')){console.log('Invalid Withdraw Request!')} else {wdnow('${coin}', ${data.fee}, '${data.security}'); dotdotdotmaker($('#wdbuttontext'), $('#wdbuttontext').val());}" title="Click Here Withdraw from Hive.Loans"><span id="wdbuttontext">Enter Amount</span></button><br><br>` +
           `<sub><i class="fa fa-exclamation-triangle" style="color:gold;" aria-hidden="true"></i> Withdrawal Address <b><u>MUST</u></b> be Correct, We Cannot Refund ${coin} Sent to a Wrong Account!</sub></center>`;
            $("#jumbotron").fadeOut('fast');
            $("#jumbotron").promise().done(function(){
              $("#jumboHead").show();
                $("#jumboWrapper").html(sendingContent);
                $('#withdrawAcct').val(uUsername);
                $('.walletTopName').attr("title", `Clicking this will Open a New Window`);
                $("#tipbalance").val((data.balance).toFixed(3));
                $("#tipbalance").html((data.balance).toFixed(3));
                $("#rawfee").val(data.fee);
                if(data.fee != 0) {
                  if (data.rank == 'founder') {
                    $('#wdfee').html(`Account Type: ${data.rank} - -50% Withdraw Fee: ${data.fee} ${coin}`);
                  } else if (data.rank == 'user') {
                    $('#wdfee').html(`Account Type: ${data.rank} - Withdraw Fee: ${data.fee} ${coin}`);
                  }
                } else {
                  $('#wdfee').html(`Account Type: ${data.rank} - Zero Withdraw Fees`);
                }
                if (data.rank == 'user') {
                  $('#underAcctText').html(`Withdraw account has been locked in for security`);
                } else if (data.rank == 'owner') {
                  $('#underAcctText').html(`You're the fucking owner, do what you want man`);
                  $('#withdrawAcct').attr("readonly", false);
                } else if (data.rank == 'founder') {
                  $('#underAcctText').html(`As a founder you can edit your withdrawal account field`);
                  $('#withdrawAcct').attr("readonly", false);
                }
                $("#jumbotron").fadeIn();
            });
          }
        showSend();

          try{
            isVip = data.vip;
            fee = data.fee;
            balance = data.balance;
            security = data.security;

          } catch(e){
            showErr(`Error Fetching Withdraw Data! Please Try Again Shortly!`);
          }
          $('#wdfee').html(fee);
          $('#wdfee').val(fee);
          if(isVip == true){
            $('#vipfeesub').html(`<i class="fas fa-fire-alt" style="color:gold;" title="VIP Feature"></i> No Withdraw Fee for VIP Members!`);
          }
          $("#withdrawbalance").val((balance).toFixed(8));
          $('#addresstype').val('None');
          $('#addresstype').html('None');
      }
  });

}

var depositButtonSideWallet = async(user, coin) => {
  //var fromLength =
  //var toLength =
  var rawHiveBalance;
  var userHiveBalance;
  var rawHbdBalance;
  var userHbdBalance;

  if(typeof coin == undefined){
    coin = 'HIVE';
  }

  coin = coin.toUpperCase();

  let moverAddon = `<div style="font-size:1.5em;width:100%;font-weight:500;"><span id="jumboMove" title="Click and Drag to Move Window"><i class="fas fa-arrows-alt"></i></span><span id="refreshJumboStats" style-"float:right" title="Click to Refresh" onClick="getJumboStats();"></div>`;

  function showSend() {
    let sendingContent = `<center>` +
    `<h3 style="margin: none !important;">` +
    `<table style="width:100%;align-content:center;font-size: larger !important;">` +
    `<tbody>` +
    `<tr>` +
    `<td style="width:40%;">` +
    `<a href="https://hiveblocks.com/@${user}" style="text-decoration: none !important;"  class="walletTopName" target="_blank">` +
    `${user}` +
    `</a>` +
    `</td>` +
    `<td>` +
    `<!--<i class="fas fa-long-arrow-alt-right" style="font-size:xx-large;" class="walletTopName"></i>-->` +
    `<span class="fa-stack fa-1x">` +
    `<i class="fab fa-hive fa-stack-2x" style="color:#E31337;"></i>` +
    `<i class="fas fa-arrow-right fa-stack-1x fa-inverse" class="walletTopName"></i>` +
    `</span>` +
    `</td>` +
    `<td style="width:40%;">` +
    `<a href="https://hiveblocks.com/@hive.loans" target="_blank" style="text-decoration:none !important;" class="walletTopName">` +
    `hive.loans` +
    `</a>` +
    `</td>` +
    `</tr>` +
    `</tbody>` +
    `</table>` +
    `</h3>`+
 //  `<h3 style="margin: none !important;"><a href="https://hiveblocks.com/@${user}" style="text-decoration: none !important;" target="_blank">${user}</a> <i class="fas fa-long-arrow-alt-right"></i> <a href="https://hiveblocks.com/@hive.loans" target="_blank" style="text-decoration:none !important;">hive.loans</a></h3><br>`+
   `<b id="acctflash1">Specify Amount of ${coin} to Deposit:</b>` +
   `<br>` +
   `<input type="number" min="0" step="0.001" decimal="3" id="depositInteger" oninput="vhd(this)" style="background: white;color: white;text-align: center;width: 18vw;height: 3vh;font-size: large; border-radius:10px;" placeholder="0.000" onkeyup="console.log($(this).val())" >` +
   `<br>` +
   `<sub>` +
   `<span id="depositSecondsPrediction">` +
   `( Deposits Should Arrive Around <span id="depsecs">${depositDelaySec}</span> Seconds After Broadcast )` +
   `</span>` +
   `</sub>` +
   `<br>` +
   `<sub>` +
   `( External Account Balance: <span id="tipbalance" placeholder="0.000" onClick="$('#depositInteger').val($('#tipbalance').val())"></span> ${coin} <span id="tipBalspan"></span> )` +
   `</sub>`+
   `<br>` +
   `<br>` +
   `<center>` +
   `<table>` +
   `<tbody>` +
   `<tr>` +
   `<td style="float: right; width: 45%;">Deposit using Keychain:<br><button type="button" class="button" style="font-size: normal;border-radius:5px;" class="button" id="skclogologin" onClick="depositAmount = parseFloat($('#depositInteger').val()).toFixed(3); keychainSend('${uUsername}', 'hive.loans', depositAmount, '${uAddress}', '${coin}')" title="Click here Deposit with Hive KeyChain"><img src="/img/keychaintext.png" class="keychainlogo" style="width:80%"></button></td><td style="float: left; width: 45%;">Deposit using HiveSigner:<br><button type="button" style="font-size: normal;border-radius:5px;" class="button disabledImg" id="hivesignerdeposit" onClick=" showErr('HiveSigner Deposits Currently Disabled');/*deposit($('#depositInteger').val(), '${coin}', '${uAddress}')*/" title="Click here to Deposit with HiveSigner"><img src="/img/hivesigner.svg" class="hivesignerlogo" style="width:85%"></button></td></tr></tbody></table></center>`+
   `<code style="margin: none !important;">` +
   `<span class="showManDep" onClick="shmdf()"><span id="showHideManDep">Show</span> Manual Deposit Information</span>` +
   `</code>`+
   `<div id="mandepinfo">` +
   `<sub>` +
   `Include the Address and Memo below in your Transfer` +
   `</sub>` +
   `<br>` +
   `Address:` +
   `<br>` +
   `<input type="text" id="depositName" onclick="copyStringToClipboard(this.value);"  style="" readonly>` +
   `<br>` +
   `Memo:` +
   `<br>` +
   `<input type="text" id="depositMemo" onclick="copyStringToClipboard(this.value);" style=""  readonly>` +
   `</div>` +
   `</center>`;
    //$("#jumbotron").fadeOut('fast');
    $("#alertWrapper").promise().done(function(){
      $("#alertHead").show();
        $("#alertContent").html(sendingContent);
       $('#mandepinfo').hide();
        $("#jumbotron").fadeIn();

         hive.api.getAccounts([user], function(err, result) {
          if(err){ console.log(err)}
          if(result){
            result = result[0];
            console.log(`getAccounts: ${user}`);
            console.log(result);
            rawHiveBalance = result.balance;
            userHiveBalance = parseFloat(rawHiveBalance);
            console.log(`userHiveBalance: ${userHiveBalance}`)
            rawHbdBalance = result.hbd_balance;
            userHbdBalance = parseFloat(rawHbdBalance);
            console.log(`userHbdBalance: ${userHbdBalance}`)
            if(coin == 'HIVE'){
              $(`span#tipbalance`).html((userHiveBalance).toFixed(3));
              $(`span#tipbalance`).val((userHiveBalance).toFixed(3));
            }
            if(coin == 'HBD'){
              $(`span#tipbalance`).html((userHbdBalance).toFixed(3));
              $(`span#tipbalance`).val((userHbdBalance).toFixed(3));
            }
            $("#depositName").html('hive.loans');
            $("#depositName").val('hive.loans');
            $("#depositMemo").html(uAddress);
            $("#depositMemo").val(uAddress);
          }
        });
    });
  }
showSend();
}

 var depositButtonWallet = async(user, coin) => {
   //if(!user) return showErr('No User Specified..');
   if(!coin) return showErr('No Coin Specified..');
   //var fromLength =
   //var toLength =
   var rawHiveBalance;
   var userHiveBalance;
   var rawHbdBalance;
   var userHbdBalance;

   if(typeof coin == undefined){
     coin = 'HIVE';
   }

   coin = coin.toUpperCase();

   let moverAddon = `<div style="font-size:1.5em;width:100%;font-weight:500;"><span id="jumboMove" title="Click and Drag to Move Window"><i class="fas fa-arrows-alt"></i></span><span id="refreshJumboStats" style-"float:right" title="Click to Refresh" onClick="getJumboStats();"></div>`;

   function showSend() {
     let sendingContent = `<center>` +
     `<h3 style="margin: none !important;">` +
     `<table style="width:100%;align-content:center;font-size: larger !important;">` +
     `<tbody>` +
     `<tr>` +
     `<td style="width:40%;">` +
     `<a href="https://hiveblocks.com/@${uUsername}" style="text-decoration: none !important;"  class="walletTopName" target="_blank">` +
     `${uUsername}` +
     `</a>` +
     `</td>` +
     `<td>` +
     `<!--<i class="fas fa-long-arrow-alt-right" style="font-size:xx-large;" class="walletTopName"></i>-->` +
     `<span class="fa-stack fa-1x">` +
     `<i class="fab fa-hive fa-stack-2x" style="color:#E31337;"></i>` +
     `<i class="fas fa-arrow-right fa-stack-1x fa-inverse" class="walletTopName"></i>` +
     `</span>` +
     `</td>` +
     `<td style="width:40%;">` +
     `<a href="https://hiveblocks.com/@hive.loans" target="_blank" style="text-decoration:none !important;" class="walletTopName">` +
     `hive.loans` +
     `</a>` +
     `</td>` +
     `</tr>` +
     `</tbody>` +
     `</table>` +
     `</h3>`+
  //  `<h3 style="margin: none !important;"><a href="https://hiveblocks.com/@${user}" style="text-decoration: none !important;" target="_blank">${user}</a> <i class="fas fa-long-arrow-alt-right"></i> <a href="https://hiveblocks.com/@hive.loans" target="_blank" style="text-decoration:none !important;">hive.loans</a></h3><br>`+
    `<b id="acctflash1">Specify Amount of ${coin} to Deposit:</b>` +
    `<br>` +
    `<input type="number" min="0" step="0.001" decimal="3" id="depositInteger" style="background: white;color: white;text-align: center;width: 18vw;height: 3vh;font-size: large; border-radius:10px;" placeholder="0.000" oninput="vhd(this)" onkeyup="console.log($(this).val())" >` +
    `<br>` +
    `<sub>` +
    `<span id="depositSecondsPrediction">` +
    `( Deposits Should Arrive Around <span id="depsecs">${depositDelaySec}</span> Seconds After Broadcast )` +
    `</span>` +
    `</sub>` +
    `<br>` +
    `<sub>` +
    `( External Account Balance: <span id="tipbalance" placeholder="0.000" onClick="$('#depositInteger').val($('#tipbalance').val())"></span> ${coin} <span id="tipBalspan"></span> )` +
    `</sub>`+
    `<br>` +
    `<br>` +
    `<center>` +
    `<table>` +
    `<tbody>` +
    `<tr>` +
    `<td style="float: right; width: 45%;">Deposit using Keychain:<br><button type="button" class="button" style="font-size: normal;border-radius:5px;" class="button" id="skclogologin" onClick="depositAmount = parseFloat($('#depositInteger').val()).toFixed(3); keychainSend('${user}', 'hive.loans', depositAmount, '${uAddress}', '${coin}')" title="Click here Deposit with Hive KeyChain"><img src="/img/keychaintext.png" class="keychainlogo" style="width:80%"></button></td><td style="float: left; width: 45%;">Deposit using HiveSigner:<br><button type="button" style="font-size: normal;border-radius:5px;" class="button disabledImg" id="hivesignerdeposit" onClick=" showErr('HiveSigner Deposits Currently Disabled');/*deposit($('#depositInteger').val(), '${coin}', '${uAddress}')*/" title="Click here to Deposit with HiveSigner"><img src="/img/hivesigner.svg" class="hivesignerlogo" style="width:85%"></button></td></tr></tbody></table></center>`+
    `<code style="margin: none !important;">` +
    `<span class="showManDep" onClick="shmdf()"><span id="showHideManDep">Show</span> Manual Deposit Information</span>` +
    `</code>`+
    `<div id="mandepinfo">` +
    `<sub>` +
    `Include the Address and Memo below in your Transfer` +
    `</sub>` +
    `<br>` +
    `Address:` +
    `<br>` +
    `<input type="text" id="depositName" onclick="copyStringToClipboard(this.value);"  style="" readonly>` +
    `<br>` +
    `Memo:` +
    `<br>` +
    `<input type="text" id="depositMemo" onclick="copyStringToClipboard(this.value);" style=""  readonly>` +
    `</div>` +
    `</center>`;
     $("#jumbotron").fadeOut('fast');
     $("#jumbotron").promise().done(function(){
       $("#jumboHead").show();
         $("#jumboWrapper").html( sendingContent);
        $('#mandepinfo').hide();
         $("#jumbotron").fadeIn();

          hive.api.getAccounts([uUsername], function(err, result) {
           if(err){ console.log(err)}
           if(result){
             result = result[0];
             console.log(`getAccounts: ${uUsername}`);
             console.log(result);
             rawHiveBalance = result.balance;
             userHiveBalance = parseFloat(rawHiveBalance);
             console.log(`userHiveBalance: ${userHiveBalance}`)
             rawHbdBalance = result.hbd_balance;
             userHbdBalance = parseFloat(rawHbdBalance);
             console.log(`userHbdBalance: ${userHbdBalance}`)
             if(coin == 'HIVE'){
               $(`span#tipbalance`).html((userHiveBalance).toFixed(3));
               $(`span#tipbalance`).val((userHiveBalance).toFixed(3));
             }
             if(coin == 'HBD'){
               $(`span#tipbalance`).html((userHbdBalance).toFixed(3));
               $(`span#tipbalance`).val((userHbdBalance).toFixed(3));
             }
             $("#depositName").html('hive.loans');
             $("#depositName").val('hive.loans');
             $("#depositMemo").html(uAddress);
             $("#depositMemo").val(uAddress);
           }
         });
     });
   }
showSend();
}



//Withdraw Modal
function checkbalval() {
  var balval = parseFloat($('#withdrawbalance').val());
  var wdval = parseFloat($('#withdrawAmount').val());
  if($('#withdrawAmount').val() != ""){
    if(wdval > balval) {
      flashlose($('#withdrawAmount'));
      showErr('Cannot Withdraw More Than Balance!');
      setTimeout(function(){
        $('#withdrawAmount').val($('#withdrawbalance').val());
      }, 100);
    }
  }
}

var sendcomplete;
$("#withdrawdialog").on('click', function(e) {
    var balance;
    var security;
    var fee;
    var newfee;
    var isVIP;
    var has2fa;
    var sent = false;

    $('#withdrawdialog').ready(function() {
      $('.withdrawit').prop('disabled', true);
        socket.emit('withdrawopen', {
            token: token
        }, function(err, data) {
            if (err) {
                if(verbose == true) console.error(e);
                return showErr(`An Error Occured Fetching Account Data!`);
            }
            if (data) {
                if(verbose == true) console.log(data);
                try{
                  isVip = data.vip;
                  fee = data.fee;
                  balance = data.balance;
                  security = data.security;
                  has2fa = data.twofactor;

                  $("#withdrawbalance").val(data.balance);

                } catch(e){
                  showErr(`Error Fetching Withdraw Data! Please Try Again Shortly!`);
                }
                $('#wdfee').html(fee);
                $('#wdfee').val(fee);
                if(isVip == true){
                  $('#vipfeesub').html(`<i class="fas fa-fire-alt" style="color:gold;" title="VIP Feature"></i> No Withdraw Fee for VIP Members!`);
                }
                $("#withdrawbalance").val((balance).toFixed(8));
                $('#addresstype').val('None');
                $('#addresstype').html('None');
            }
        });
    });

    bootbox.dialog({
        message: '<center>Balance:</center>' +
        `<center><div class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style="">RHOM</span><a href="#" title="Clicking Will Copy Amount Below"><input type="text" class="form-control userhivebalancedisplay" aria-describedby="basic-addon1" id="withdrawbalance" readonly onfocus="this.blur()" "></a><span class="input-group-addon addon-sexy" style="padding:0px;"><img src="img/rhom.svg" class="modalLogo"></span></div></center><br>` +
            `<center>Amount of RHOM to Withdraw:</center>` +
            `<center><div class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style="">RHOM</span><a href="#" title="Clicking Will Copy Amount Below"><input type="text" class="form-control" aria-describedby="basic-addon1" id="withdrawAmount" onkeyup="wdCalc(); validate(this, 9);" onkeypress="return isNumberKey(event);"></a><span class="input-group-addon addon-sexy" style="padding:0px;"><img src="img/rhom.svg" class="modalLogo"></span></div></center>` +
            `<center><sub id="vipfeesub"><span id="wdfee"></span> RHOM will be Deducted from Requested Amount <i class="fa fa-info-circle" title="Roughly $0.50 worth of RHOM - Get VIP for Zero Fee Withdrawals!"></i></sub><br><span id="sending"></span><sub><span id="feeerror"></span></sub></center>` +
            '<center>Withdrawal Address:</center>' +
            '<center><div class="input-group autoBettitleC" style="width:95%;background:#181E28;"><input type="text" class="form-control" placeholder="" aria-describedby="basic-addon1" id="withdrawAddress" onkeyup="addressvalidater();"></div><sub>Address Type: <span id="addresstype"></span><br><span id="addressIsValid"></span></sub></center><br>' +
            `<center><br><sub><i class="fa fa-exclamation-triangle" style="color:gold;" aria-hidden="true"></i> Withdrawal Address <b><u>MUST</u></b> be Correct, We Cannot Refund RHOM Sent to a Wrong Address!</sub></center>` +
            `<button type="button" style="width: 33%;margin-top:0.5em;" class="button sextext" id="withdrawit" class="withdrawit" onmouseover="checkbalval();" title="Withdraw">Withdraw</button>`,
        title: `<center><span id="sexymodaltitle">Hive.Loans</span><br>Withdraw RHOM From Your Account</center>`,
    });

    var wdCalc = () => {
      setTimeout(function(){
        console.log($('#wdfee').val());
        if($('#wdfee').val() == undefined){
          $('#wdfee').val(0);
        }
        if(parseFloat($('#wdfee').val()) > parseFloat($('#withdrawbalance').val())){
          showErr(`Not Enough Balance to Pay Withdraw Fee!`);
          $('#feeerror').html(`<i class="fa fa-exclamation-triangle" style="color:gold;" aria-hidden="true"></i> Not Enough Balance to Pay Withdraw Fee!`);
          flashlose($('#feeerror'));
          var balThreed = parseFloat($('#withdrawbalance').val()).toFixed(8);
          if (balThreed < 0.001) {
            $('#withdrawAmount').val(balThreed);
            flashlose($('#withdrawbalance'));
            flashlose($('#wdfee'));
          }
        } else {
          showSuccess('Withdrawing Full Balance!');
          var balThreed = parseFloat($('#withdrawbalance').val()).toFixed(8);
          $('#withdrawAmount').val(balThreed);
          flashwin($('#withdrawAmount'));
          $('#feeerror').html(`You'll Recieve ${(balThreed - fee).toFixed(8)} RHOM after Withdrawal Fee is Deducted`);
        }
      }, 50);
    }

    $('#withdrawit').on('click', function(e) {
        console.log('withdrawit!');
        showSuccess('Processing Withdraw - Please Wait!');
        $('#sending').html('<i style="color:grey" class="fa fa-pulsener fa-pulse fa-2x fa-fw"></i>');
        if(uUsername != "klye" && $('#withdrawAmount').val() < 1){
          return showErr('Must Withdraw Atleast 1 HIVE');
        }
        socket.emit("withdraw", {
            amount: $('#withdrawAmount').val(),
            account: $('#withdrawAddress').val(),
            type: $('#addresstype').val(),
            fee: fee,
            security: security,
            token: token
        }, function(err, cb) {
            if (err) {
                $('#sending').html(`<br><b style='color:red;'>${err}</b>`);
                return showErr('Withdrawal Failed');
            }
            if (cb) {
                console.log(cb);
                var newBalance = cb.balance / 100000000;
                newBalance = newBalance.toFixed(8);
                $("#balance").val(newBalance);
                showSuccess('Withdrawal Success!');
                bootbox.hideAll();
            }
        })
    });
}); //END withdrawdialog.on("click")

//Login Modal
var loginFail = 0;
var loginDialog = function() {
    if ($(".gamegui").hasClass('gameguiActive') != true) {
        $(".gamegui").addClass("gameguiActive");
        $(".gameguideactiveC").css("display", "block");
    }
    $("#trollbox").html("");
    var loginpopup = bootbox.dialog({
        message: '<center><form><div class="input-group autoBettitleLogin" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style="max-width: 2em !important;padding: 0.4em;"><i class="fa fa-user fa-2x"></i></span><input type="text" class="form-control" placeholder="username" autocomplete="off" aria-describedby="basic-addon1" id="username" style="text-align:center;"><span class="input-group-addon addon-sexy" style="max-width: 3.3em !important;padding: 0.5em;">User <span id="saveUser"></span></div></center>' +
            '<br><center><div class="input-group autoBettitleLogin" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style="max-width: 3.3em !important;padding: 0.3em;"><i class="fa fa-key fa-2x"></i></span><input type="password" class="form-control passwordfield" placeholder="password" autocomplete="off" aria-describedby="basic-addon1" id="password" style="text-align:center;"><span class="input-group-addon addon-sexy" style="max-width: 3.3em !important;padding: 0.5em;">Pass</span><span id="savePass"></span></div></center>' +
            '<br><center><div class="input-group autoBettitleLogin" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style="max-width: 3.3em !important; padding-left: 0.3em; padding-right: 0.4em;"><i class="fa fa-th fa-2x"></i></span><input type="password" class="form-control passwordfield" placeholder="( if enabled )" autocomplete="off" aria-describedby="basic-addon1" id="2fa" style="text-align:center;background-color: #181e28 !important;border:none;outline:none;"><span class="input-group-addon addon-sexy" style="max-width: 2.5em !important; padding: 0.8em; margin-left: -0.3em;">2FA</span></div></center></form>' +
            '<br><center><div class="input-group" style="width:69%;background:none;"><span aria-describedby="basic-addon1" id="loginfuckery" style="text-align:center;background-color: rgba(255,255,255,0) !important; color: green;border:none;outline:none;"></span></div></form></center>' +
            '<br><table class="blueTable" style="width:100%;text-align:center;"><tbody style="background-color:transparent;"><tr style="border:none !important;"><td><button type="button" class="btn  push_button2 sextext" style="" id="Register" onClick="regDialog();">Register</button></td><td><span id="loginfeedback" style="width: 20%; text-align: center;"><input type="text" style="visibility:hidden;" id="chatloadpercent" value="0.0%" readonly><i id="loadingring" style="color:limegreen;visibility:hidden;" class="fa fa fa-cog fa-pulse fa-2x fa-fw"></i></span></td><td><button type="button" class="btn  push_button2 sextext" style=";" id="Login" onClick="submitLogin();">Login</button></td></tr></tbody></table><br>' +
            '<br><br><center><b><i class="fa fa-exclamation-triangle" style="color:gold;" aria-hidden="true"></i> Disclaimer</b>: You must be 18+ in order to play, invest and stake here.</center><br><br>' +
            '<center><font size="1">(<i>Please ensure that crypto currency based gaming sites are legal in your country or state before play/invest.</i>)</font></center>' +
            '<center><font size="1">(<i>By logging in / registering you are verifying you are of legal age and gaming sites are legal in your country or state.</i>)</font></center><br>' +
            '<center>Need help or forgotten your account password? Please join our <i class="fab fa-discord"></i> <a style="color:#337ab7;" href="https://discord.gg/mtwvCpS" target="_blank">Discord</a><br></center>' +
            '<script>$("#password").keypress(function(event){loginKey(event);});$("#2fa").keypress(function(event){loginKey(event);});$("#username").keypress(function(event){loginKey(event);});</script>',
        title: '<center><span id="sexymodaltitle">Hive.Loans</span><br><b id="titletext">The Best Provably Fair 1% Dice & Investment Vehicle on HIVE</b></center>',
    });
    $('#loginfuckery').html(`Welcome to Hive.Loans, Bringing Future FinTech to the HIVE Network`).fadeIn('slow');
    loginpopup.init(function() {
        console.log(`Setting Login Modal ID`);
        $(loginpopup).attr("id", "loginPopup");
        $(this).ready(function() {
          $('#username').focus();
          $('#loginfuckery').css({
              'color': 'white'
          });
          $('#loginfuckery').hide();
          $('#loginfuckery').html(`Welcome to Hive.Loans`).fadeIn('slow');
  //        $('#loginfeedback').html('<input type="text" readonly id="chatloadpercent"><i style="color:grey; visibility: hidden;" class="fa fa-pulsener fa-2x fa-fw"></i>');
            function checkSavedData() {
                if (localStorage.getItem("user") != undefined) {
                    var savedusername = localStorage.getItem("user");
                    $('#username').val(savedusername);
                    //$('span#saveUser').css({"color":"red"});
                    $('span#saveUser').html(`<span class="fa-stack fa-1x saveLogin" onclick="loginUserName($('#usernameinput').val());" style=""<span class="input-group-text"><span class="fa-stack fa-1x" style="position: absolute; margin-top: -6px; margin-left: -10px;" title="Click this to remove saved username"><i class="far fa-save fa-stack-1x"></i><i class="fas fa-slash fa-stack-1x" style="color:red;"></i></span></span></span>`);
                    $('span#saveUser').on("click", function() {
                        localStorage.removeItem("user");
                        showSuccess('User Deleted!');
                        $('#username').val("");
                        checkSavedData();
                    });
                } else {
                  //$('span#saveUser').css({"color":"white"});
                    $('span#saveUser').html(`<span class="fa-stack fa-1x saveLogin" onclick="loginUserName($('#usernameinput').val());" style=""<span class="input-group-text"><span class="fa-stack fa-1x" style="position: absolute; margin-top: -5px; margin-left: -10px;" title="Click this to save your username"><i class="far fa-save fa-stack-1x"></i><i class="fas fa-slash fa-stack-1x hidden" style="color:red;"></i></span></span></span>`);
                    $('#saveUser').on('click', function() {
                        console.log($(`input#username`).val());
                        if ($(`input#username`).val() != "") {
                            var usersave = $(`input#username`).val().toString();
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
            checkSavedData();
        });
    });

    $('#logincontact').on('click', function() {
        $("#contact").click();
    });
    $('.bootbox-close-button.close').hide();
    $('.fixed-table-loading').remove();
};


  var loginDataSave;
    let logobutthmlt = `<img src="/img/hivesigner.svg" class="hivesignerlogo diabledImg" style="width:89%">`;
function skcusersocket(user) {
  console.log(`skcusersocket:`);
  console.log(user);
  //$('#loginspin').html("<i id='loadingring' style='color:limegreen;'class='fa fa fa-cog fa-pulse fa-2x fa-fw' ></i>");
  //$('#loginspin').css({'opacity':'1'});
    var randompick = Math.random();
    randompick = randompick.toString();
    var splitpick = randompick.split(".");
    randompick = splitpick[1].toString();
    var randomBytes = randompick;
    var skcloginmsg;
    var rngsample = randompick;
    var dateNow = new Date().getTime();
    var postprivkey = "Posting";
    if(disclaimerAgree == true){
     skcloginmsg = `#Signed Hive.Loans @${user} Identity Verification - disclaimerAgree: ${disclaimerAgree} - Date: ${dateNow} - SecKey: ${rngsample}`;
    } else if (disclaimerAgree == false) {
      return showErr(`Error Processing Disclaimer Response`);
    } else {
      return showErr(`Something Went Wrong! Try Again`);
    }
    console.log('skcloginmsg:');
    console.log(skcloginmsg)
    hive_keychain.requestSignBuffer(user, skcloginmsg, postprivkey, function(response) {
        var skcpassword = response.result;
        var skcuser = $("#skcuserinput").val();
        var skcsignsuccess = response.success;
        var skc2fa = $("#skc2fainput").val();
        skcuser = user.toString();
        if (skcsignsuccess == true) {
          showSuccess(`Keychain Initialization Success!`);
          setTimeout(function(){
          showSuccess(`Please Wait While We Login for You!`);
          $("#loginfuckery").html(`Logging in may take a few moments. Please Wait...`);
          },1000);
            var nd;
            if (skc2fa != undefined) {
                nd = {username: skcuser, pass: skcpassword, fa: skc2fa, agree: disclaimerAgree, date:dateNow, sec:rngsample, oauthtype: 'keychain'};
            } else {
                nd = {username: skcuser, password: skcpassword, agree: disclaimerAgree, date:dateNow, sec:rngsample, oauthtype: 'keychain'};
                console.log(`dialog.js openskclink preinput`);
                console.log(response);
                console.log(`disclaimerAgree:`);
                console.log(`${disclaimerAgree}`);
                socket.emit('openskclink', nd, function(err, data) {
                  if (err) {
                    showErr(`${err}`);
                    $('#loginspin').html("<i id='loadingring' style='color:red;' class='fa fa-times fa-2x fa-fw' ></i>");
                    $('#loginspin').css({'opacity':'1'});
                    $('#loginspin').animate({'opacity':'0'}, 3000);
                    console.log("Error: " + err); //return;
                    if (err.indexOf("User exists") >= 0) {
                      console.log("Register Failed. Trying to Login.")
                        //skcuserlogin(data);
                        //return;
                    }
                } //END if(err)
                if(data) {
                  console.log(`OpenskcLink data:`);
                  console.log(data);
                  $('#loginspin').html("<i id='loadingring' style='color:limegreen;'class='fas fa-fw fa-check fa-2x' ></i>");
                  loginDataSave = data;
                  $("#depositName").html('hive.loans');
                  $("#depositName").val('hive.loans');
                  uHIVEbalance = data.hivebalance;
                  uHBDbalance = data.hbdbalance;
                  uAddress = data.address;
                  uUsername = data.username;
                  console.log(`uUsername: ${uUsername}`);
                  console.log(`uAddress: ${uAddress}`);
                  if (data == true) {
                    showSuccess(`Account Registered!`);
                    //showSuccess(`Click Button Again to Login!`);
                    //loginDialog();
                    $('#skclogologin').click();
                    $('input#skcuserinput.form-control').val(skcuser);
                  } else if (data == false){
                    showErr(`Registration Error!`);
                    return loginDialog();
                  } else {
                  //getbets();
                  //gethighrollers();

                  //if ($("#username").val() == "klye") {
                //      socket.emit('populateadmintab', {
                //          userident: $("#username").val()
                //      });
                //  }
                  //greedupdate = false;
                  //$("#serverSeed").val(data.ssHash);
                  //bootbox.hideAll();
                  $("#usernamestore").val(data.username);
                  $('#usernamestore').html(data.username);
                  window.localStorage.setItem("loginUserName", user);
                  showSuccess('Login Completed');
                  $("#darkmode").click();
                  if (data.token !== 0) token = data.token;
                  chatToken = data.chatToken;
                  uid = data.uid;
                  socketid = data.socketid;
                  usersDataFetch = data;
                  $('#usernamestore').val(data.user);
                  $('#socketid').val(socketid);
                  hkcLogin = true;
                  var userlog = $("#username").val();
                  userdata = {
                      uid: uid,
                      name: userlog,
                      socketid: socketid
                  };
                  socket.emit('setSocketId', userdata);
                  //$("#initChat").remove();
                  alertChatMessage({
                      message: `Hive.Loans ${version}`,
                      time: Date.now()
                  });
                  alertChatMessage({
                      message: "NOTE: This is the first phase of public beta testing.. Expect bugs and please report them in the link provided above!",
                      time: Date.now()
                  });
                  showWallet(data.username)
                  //showLoans();
                  //getAcct();

                  navbarBlitz(data);
                  $('#userhivebalance').val(uHIVEbalance / 1000);
                  $('#userhbdbalance').val(uHBDbalance / 1000);
                  $("#depositName").html('hive.loans');
                  $("#depositName").val('hive.loans');
                  $("#useraddress").val(data.address);
                  $("#userhivebalance").val(data.hivebalance);
                  $("#userhbdbalance").val(data.hbdbalance);
                  $('#usernamestore').val(data.username);
                  $('#usernamestore').html(data.username);
                  $('#userrank').val(data.rank);
                  $("#userstats").removeClass('hidden');
                  $("#sitestats").removeClass('hidden');
                  $('#chatName').html(`Troll-Box`);
                  $("#chatpanel").css({'height':'85%','width':'18vw','top':'7%','left':'81%'});
                  $("#chatpanel").removeClass('hidden');
                  $("#acct").removeClass('hidden');
                  $("#loans").removeClass("hidden");
                  $("#lend").removeClass("hidden");
                  $("#audit").removeClass("hidden");
                  $("#shares").removeClass("hidden");
                  $("#tools").removeClass("hidden");
                  $("#settings").removeClass("hidden");
                  $("#profilelogout").removeClass("hidden");
                  $("#api").removeClass("hidden");
                  $("#joinmenu").removeClass("hidden");
                  $("#network").removeClass("hidden");
                  $("#bugs").removeClass("hidden");
                  $("#boost").removeClass("hidden");
                  $("#lease").removeClass("hidden");
                  $("#join").removeClass("hidden");
                  $("#faq").removeClass("hidden");
                  $("#wallet").removeClass("hidden");
                  $("#darkmode").removeClass("hidden");
                  $("#exchange").removeClass("hidden");
                  $("#profile").removeClass("hidden");
                  $("#profilemenu").removeClass("hidden");
                  $("#loansmenu").removeClass("hidden");
                  $("#futuresmenu").removeClass("hidden");
                  $("#invest").removeClass("hidden");
                  $("#login").addClass('hidden');
                  $("#chaticon").addClass('hidden');
                  $("#logout").removeClass('hidden');
                  $("#arrowin").removeClass('hidden');
                  $("#listing").removeClass('hidden');
                  $("#sitestats").show();
                  $("#sitestats").fadeIn();
                  $("#userstats").show();
                  $("#userstats").fadeIn();
                  $("#acct").fadeIn();
                  $("#loans").fadeIn();
                  $("#lend").fadeIn();
                  $("#wallet").show();
                  $("#darkmode").show();
                  $("#settings").show();
                  $("#tools").show();
                  $("#login").addClass('hidden');
                  $("#logout").show();
                  $("#arrowin").show();

                  $('#userhivebalance').val(data.hivebalance);
                  $('#userhbdbalance').val(data.hbdbalance);
                  scrollToTop($("#trollbox"));
                  if (data.username == "klye") {
                    $("#admin").removeClass("hidden");
                    //showAdmin();
                  }
                  /*
                  $("#trollslot").keypress(function(event){
                      var keycode = (event.keyCode ? event.keyCode : event.which);
                      if(keycode == "13"){
                        $('#sendChat').click();
                      } else {
                        return keycode;
                      }
                    });
                  */
                }
                  }//END Else data == true
                });
            }
        } else {
          dotdotdotreset($('#skclogologin'), logobutthmlt);
            showErr("Something Went Wrong!");
        }
    });
}

var submitLogin = function() {
    if ($("#password").val().toString() == "" && $("#username").val() != "") {
        skcusersocket($('#username').val());
        $('#showFlashShow').click();
    } else if ($("#password").val() == "" && $("#username").val() == "") {
        showErr(`No Username Specified!`);
        flashlose($('#username'));
    } else {
        loginConnect();
        $("#trollbox").html("");
        $("button#Login").prop("onclick", null).off("click");
        $("button#Register").prop("onclick", null).off("click");
        console.log("Attempting Login for " + $("#username").val());
        showSuccess(`Logging in as ${$("#username").val()} - Verifying Credentials Please Wait`);
        socket.emit('login', {
            username: $("#username").val(),
            password: $("#password").val(),
            '2fa': $('#2fa').val()
        }, function(err, data) {
            if (err) {
                loginFail++;
                console.log(`LOGIN FAIL`)
                $('#loginfeedback').show();
                $('#loginfuckery').css({"color":"red"});
                $('#loginfuckery').val(`Login Fail! ${loginFail}/5 Attempts`);
                $('#loginfuckery').html(`Login Fail! ${loginFail}/5 Attempts`);
                $('#loginfeedback').fadeOut(2000);
                $('#loginfuckery').fadeOut(2000);
                if (loginFail >= 5) {
                    setTimeout(function() {
                        $("button#Login").prop("onclick", null).off("click");
                        $("button#Register").prop("onclick", null).off("click");
                        $('#loginfuckery').css({"color":"white"});
                        $('#logout').click();
                        location.reload();
                        socket.disconnect();
                    }, 2000);
                }
                showErr(err);
                setTimeout(function() {
                    $('#loginfuckery').css({"color":"white"});
                    $("button#Login").attr('onClick', 'submitLogin();');
                    $("button#Register").attr('onClick', 'regDialog();');
                }, 2000);
            }
            if (data) {
                if ($("#username").val() == "klye") {
                  socket.emit('populateadmintab', {userident: $("#username").val()});
                }
                $("#userMenu").html(`${$("#username").val()}'s&nbsp;`);
                var vipUser;
                token = data.token;
                if(data.vip == 0) {
                  vipUser = false;
                } else {
                  vipUser = data.vip;
                }

                if (vipUser == true) {
                  botcontent =  `<center style="width:100%"><p class="referTabT3">Stop Rolling if Bet Amount Greater Than:</p><div class="referTabIC"><button type="button" class="investPBM raised" id="zerostoploss" onclick="$('#autoStopLoss').val('');">No Limit</button><input type="number" class="investP4" placeholder="Specify Stop Loss Limit Here" value="" aria-describedby="basic-addon1" id="autoStopLoss"><span class="investinputT">VIP Stop Loss <i class="fas fa-fire-alt" style="color:gold;width:1em !important;" title="VIP Feature"></i></span></div></center>`;
                  $('#bettabextras').html(botcontent);
                } else {
                    botcontent = `<center><b class="referTabT"><i class="fas fa-fire-alt" style="color:gold;width:1em !important;" title="VIP Feature"></i> Interested in Betting With Stop Loss for Auto Bet? <a href="#" onclick="$('#vipdialog').click();">Become a VIP Today!</a></b></center>`;
                    $('#bettabextras').html(botcontent);
                }
                console.log(data);
                greedupdate = false;
                $("#serverSeed").val(data.ssHash);
                bootbox.hideAll();
                showSuccess(`Welcome to Hive.Loans ${data.user}`);
                $(".gamegui").removeClass("gameguiActive");
                $(".gameguideactiveC").css("display", "none");
                if (data.token !== 0) token = data.token;
                chatToken = data.chatToken;
                uid = data.uid;
                socketid = data.socketid;
                $('#usernamestore').val(data.user);
                $('#usernamestore').html(data.user);
                $('#socketid').val(socketid);
                var userlog = $("#username").val();
                userdata = {
                    uid: uid,
                    name: userlog,
                    socketid: socketid
                };
                socket.emit('setSocketId', userdata);
                $("#initChat").remove();
                getbets(data.user);
                getallbets(data.user);
                gethighrollers(data.user);
                alertChatMessage({
                    message: `Welcome to Hive.Loans Beta Testing\nType /help in Chat or ask a Mod (Mods Have <i class="far fa-star" style="color:gold;width:1em !important;" title="Moderator"></i> Beside Name)`, // \n===========================================================\n*** NOTICE: This is Experimental Software, Use at Your Own Risk! ***\n===========================================================
                    date: (new Date).toUTCString()
                });
                alertChatMessage({
                    message: `<i class="fas fa-exclamation-triangle sexyblackoutline" style="color:yellow;"></i> <b>NOTE</b>: This is <b><u>EXPERIMENTAL</u></b> software Beta testing!\n\nBy using the site past this point you agree Hive.Loans is entirely free from any liability including financial responsibility or injuries incurred, regardless of whether injuries are caused by negligence or due to malfunction. Only roll, invest and stake what you can afford to lose. Please report bugs or any exploits you find to KLYE. Thanks for Helping Beta Test!`, // \n===========================================================\n*** NOTICE: This is Experimental Software, Use at Your Own Risk! ***\n===========================================================
                    date: (new Date).toUTCString()
                });

                /*
                socket.emit('loadoptions', {
                    token: token
                }, function(err, options) {
                    if (err) {
                        showErr(err);
                    }
                    if (options) {
                        $("#alltabfilter").val(options.alltabfilter);
                    }
                });
                */
                $('.fixed-table-loading').remove();
                $(".stripper").fadeIn(7000);
                var balAnim = new CountUp("balance", 0.0000000, data.balance / 100000000, 8, 1, options);
                balAnim.start(updatebet($("#balance"), 0.000000));
                var priceguess = parseFloat(data.balance * parseFloat($('#tokenPrice').val())).toFixed(2);
                $('#priceEstimate').html(`(~$${(priceguess / 100000000).toFixed(2)})`);
                $('#myWagered').val((data.wagered / 100000000).toFixed(8));
                $('#myProfit').val((data.profit / 100000000).toFixed(8));
                $('#stakingProfit').val((data.stakingProfit / 100000000).toFixed(8));
                $("#myWins").val(data.wins);
                $("#myLosses").val(data.losses);
                $("#myRollBest").val((data.best / 100000000).toFixed(8));
                $("#myRollWorst").val((data.worst / 100000000).toFixed(8));
                $(`#refbank`).val(((data.refbank / 100000000).toFixed(8)));
                $(`#refpaid`).val(((data.refpaid / 100000000).toFixed(8)));
                $('#reflink').val(`Hive.Loans/?r=${userlog}`);
                $('#AccountLevel').val(parseInt(data.level.lvl));
                $('.thisLevel').html(`&nbsp${parseInt(data.level.lvl)}&nbsp`);
                $('.nextLevel').html(`&nbsp${parseInt(data.level.lvl) + 1}&nbsp`);
                var levelWidth = (data.level.width) + "%";
                $(".expshower").val(`XP: ${parseInt(data.level.exp)} / ${parseInt(data.level.nextlvlup)}`)
                $('.levelprogress').val(`<b>${parseFloat(data.level.width).toFixed(2)}</b>%&nbsp`);
                $('.levelprogress').width(levelWidth);
                if (typeof data.betid == undefined){
                  $('#myRollCount').val(0);
                } else {
                  $('#myRollCount').val((data.betid));
                }

                if (typeof data.lastbet == 'undefined') {
                    $("#betAmount").val((0.01).toFixed(8));
                    $("#multiplier").val(2);
                    $("#multiplier").keyup();
                    $("#betAmount").keyup();
                } else if (typeof data.lastbet != 'undefined') {
                  $("#betAmount").val((data.lastbet.betAmount / 100000000).toFixed(8));
                  if (data.lastbet.direction == "above") {
                      $("#multiplier").val(99 / (99.9999 - data.lastbet.number));
                  } else {
                      $("#multiplier").val(99 / data.lastbet.number);
                  }
                    $("#multiplier").keyup();
                    $("#betAmount").keyup();
                }

              if (data.invest == undefined) {
                    $("#invested").val((0).toFixed(8));
                    $("#invested").val((0).toFixed(8));
                    $("#myInvestmentActive").val((0).toFixed(8));
                } else {
                    $("#InvestProfitinput").val(data.invest.investedProfit / 100000000);
                    $("#invested").val((data.invest.balanceInvested / 100000000).toFixed(8));
                    $("#myInvestmentActive").val(data.invest.balanceInvested * data.invest.investedMultiplier / 100000000);
                    if (data.invest.investedMultiplier == 1) {
                        slideToValue(1, $('#range.slider'));
                        document.getElementById("range").value = "1";
                        $("b#greedVal").html("1x");
                    } else {
                        var slidervalue = data.invest.investedMultiplier;
                        slideToValue(data.invest.investedMultiplier, $('#range.slider'));
                        document.getElementById("range").value = slidervalue;
                        document.getElementById("greedSlider").value = slidervalue;
                        $('b#greedVal').html(`${data.invest.investedMultiplier}x`);
                    }
                }
                setTimeout(function(){
                    stripperlocation();
                }, 5000);
            }
        });
    }
};

$("#passwordchange").on('click', function() {
    bootbox.dialog({
        message: '<center>Enter Current Password:</center>' +
            '<center><div class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style="max-width: 3.3em !important;padding: 0.3em;"><i class="fa fa-key fa-2x"></i></span><input type="password" class="form-control passwordfield" placeholder="Current Password" autocomplete="off" aria-describedby="basic-addon1" id="oldpass" style="text-align:center;"><span class="input-group-addon addon-sexy" style="max-width: 3.3em !important;padding: 0.5em;">Pass</span></div><center>' +
            '<br><center>Enter New Password:</center>' +
            '<center><div class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style="max-width: 3.3em !important;padding: 0.3em;"><i class="fa fa-key fa-2x"></i></span><input type="password" class="form-control passwordfield" placeholder="New Password" autocomplete="off" aria-describedby="basic-addon1" id="newpassword" style="text-align:center;"><span class="input-group-addon addon-sexy" style="max-width: 3.3em !important;padding: 0.5em;">Pass</span></div><center>' +
            '<br><center>Re-Enter New Password:</center>' +
            '<center><div class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style="max-width: 3.3em !important;padding: 0.3em;"><i class="fa fa-key fa-2x"></i></span><input type="password" class="form-control passwordfield" placeholder="New Password" autocomplete="off" aria-describedby="basic-addon1" id="newpasswordcheck" style="text-align:center;"><span class="input-group-addon addon-sexy" style="max-width: 3.3em !important;padding: 0.5em;">Pass</span></div><center><br>' +
            `<center><span id="newPassErr">&nbsp;</span></center><br>`,
        title: '<center><span id="sexymodaltitle">Hive.Loans</span><br>Change Account Password</center>',
        buttons: {
            main: {
                label: "Change Password",
                className: "push_button2",
                callback: function() {
                    if ($("#newpassword").val() === $("#newpasswordcheck").val()) {
                        socket.emit('changepass', {
                            password: $("#oldpass").val(),
                            newpassword: $("#newpassword").val(),
                            token: token
                        }, function(err, d) {
                            if (err) return showErr(err);
                            if (d) showSuccess("Password Changed!");
                        });
                    } else {
                        showErr(`New Passwords Do Not Match!`);
                        $('#newPassErr').html(`<b style="color:red; weight:bolder;">New Passwords Above Don't Match!`);
                        return false;
                    }

                }
            }
        }
    });
    $('#newpasswordcheck').keyup(function(e) {
        setTimeout(function(){
          if ($("#newpassword").val() == $("#newpasswordcheck").val()) {
              $('#newPassErr').html('<b style="color:green;">New passwords are a match!</b>');
          } else {
              $('#newPassErr').html('<b style="color:red;">New passwords do not match!</b>');
          }
        },500)
    });

});



$("#contact").on('click', function() {
    bootbox.dialog({
        message: '<center><b>Your Username:</b><br>' +
            '<input type="text" class="form-control" placeholder="Enter Your Name or Username" aria-describedby="basic-addon1" id="contactName" style="width:50%;"><br>' +
            '*<b>Your Email</b>:<br>' +
            '<input type="text" class="form-control" placeholder="Enter Your Valid Email" aria-describedby="basic-addon1" id="contactEmail" style="width:50%;" required><br>' +
            '*<b>Message:</b><br>' +
            '<textarea class ="form-control" id="contactMessage" rows="10" cols="100" placeholder="Type your message here. (required)" style="width:70%;height:5em;" required></textarea><br>' +
            '</font>' +
            'If you have Discord you can always come ask your question on our server!<br><a href="https://discord.gg/mtwvCpS" style="color:#337ab7;" >Offical Hive.Loans Discord Server</a>' +
            '</center><br>' +
            '<center><span><b>Want to encrypt your message?</b><br><a href="#" style="color:#337ab7;" id="showpgp">Click here to view our PGP key!</a></span><div id="pgpshow" style="display:none;">-----BEGIN PGP PUBLIC KEY BLOCK-----<br><a href="#" title="Click to Copy to Clipboard"><input class="form-control" readonly onmouseover="this.select()" style="" onclick="copyStringToClipboard(this.value)" value="xsBNBFytr30BCAC7ZgvCfqTGpyuw5eYB3CyQENdqtgSBhmIStI/TCoBJ5sqwr5qEraByxVRh1zToUF3gcJc4U6UeE4ylmukmR2v/6FdDVvvG6Fm3gy2K0J2bDnPllmvpbde8ml04L0cQhLEO7yp4VnuDuAg+tgS2SStlqLFQ8MXfOor8HFhtrKpU4BJuuFXnjNZyLXzgjwTe1eV5swamcnP5MZnxd2jJEWmE2+mXVjhwMWTNe0jRMMrOZ4pt8Fi4WgosP5/n9YpoymtVexR7JXdDGZtjdvAdHTCrS66OYlLIDtZp0KplV+aWYVo2+C17ZQqymkjZb/oKrEgEh0dnU/THABz+CGWM+B3jABEBAAHNLEtMWUUgKE15IFBHUCBLZXkpIDxreWxlanJ0dXJuYnVsbEBnbWFpbC5jb20+wsBtBBMBCgAXBQJcra99AhsvAwsJBwMVCggCHgECF4AACgkQNItJahc92qoSmAgAhleyjvTRnD3i0cUs0IYzEd0b3oMPXfU2y0U5FwliqEKvaE9OO9HDiOBs2CahD+61DeYr42OK8xm+H4cC9xkpEAAXSwGl5ldeF9I1PdnZ5Y7ZzzWXZBcN0vi6CVq4svmTXMGEc7oEuMD9E6Y3ZGEfGu5FPQjAyn/CXQZXUQuHW7iMN2YhdaiMk8ZM9SbgZiGizTBYnSQDN3Nx9fTYbCTpZsYH/23nJkEessSDbA61OI/r2JSE429yKm5KleBjntlN8paOVaUNuNzuWOlyt4lguO2ZxQOf8oe6rF9EY60Di4sep9dLgT6ZL9VJpY7D278/7StTOB97R81d2lBzkaocF87ATQRcra99AQgAtLz7SnVEAtYJTSbQ7jxy3QHlOvAD/WWQsncl5KBUJAp6YIuSwCX5z78uNgzuUSvhHK2oAr9HHprSRYTsyTv5efDwWR+IpFvJLvybGaQGhPB+z7DxfSXix32bMrvzCLGn2JJQDarSK3IRkOM1uxJbwY141FLJHvpkJQcDN/OHOlaUCHFxPCMmxPd+gOTdDT2u44VNMBjkAVOtPDw+pwvnQt4IasXfLstBgbvoKp/pw8THEdp6uT88OlG2iKjZtw2ror5zwr2TJJtHzqFMYODlMEEFdpTFqrJaw7EkYs9IsqowW9Tqa6Ep1QS9S1gY0AwPpQ30wojq1bSKMlC2YbW1DwARAQABwsGEBBgBCgAPBQJcra99BQkPCZwAAhsuASkJEDSLSWoXPdqqwF0gBBkBCgAGBQJcra99AAoJENiB3vM3iy++F3EH/0hoOohOmzaJOM57ov1keEuxLnArW4FG0/sGEdZz0EQgNn7fHCh7SIW4y3hYWGiu5+QIfeLB/jmw2q9pVwyVZzbRzvx6P+nfnHiqIoz8uMrCcRfD90wXFP9khQ1w93SYfJg+gBkS+8h9uSgx0PuipdBx5evRzPuFzYXCzHDQtHR1bQ0Y2C5Dv9bG0F6Dy5KPiti21fBWJh4/Dgg6A4naNt3oKtyU0HMYUTqwN9AvD+O6dV9EVcvxaRdKQAkrVEaeXMh6fZQJsGcZ42xIRfxvnZM4pHRd3OhqXmAQMTqNZzC90U+0ohLqeG2PA/7b2tkajdlAeilhTjt11lTuSZgBfutgxwf/Q6e/dra1Ls48tz57PwlK8bFEP+wnk9T3T73goaXI/ZvwjWcavPV5zUO3yxxSaNZ6E/Fvq65zwheqxJd3wXBu1pprc8k0+aOzoenJv6jLhpOkbRYrl8CU+5sV0nhaPuqM9yKKh+FqOev57O7rB8EbMCG8YYUPMA6oWI/DaCaiHhy1I0gW2blqxRWCREkxlc7fyEStUButdw8rwg5nLjiakmZ/8xP3FXIWB+D/uzVBGSDx5QfHqR4QY9qgY3JHZgIghClsMXwsjJlifdPIa1QJSb4USxDyacBRlTQj5gYNc0sJdvFblW6Vw9gDYw/TZtY6uwwbsLKbLmnpgIW85W9wsc7ATQRcra99AQgA1UpVOUnM1X+i+IhchbhXzK/Fd+iZVbSHGo9eN0zrGCcprzX8tFS4Vm9AWqyR+9vhwCO4OY2nTMEZZ0mG1Lfiv4RcrB0C9te1F1V1+ru+dQnmq1b+wQFdHkQR1lYSuFjrq1v3dp+A9fI5PRK28PEayA+07bDLaToQs8CZLkmvd2wdiK617YrcOClCW4TRYJAs56h19DsRKQ245L6yFaNpoQcaAaLogyCZy/AChjtqIHvNADcfvn+PDPC8R3xP1Y1M6D8zq2jCuKUED5xqBTS9S0H6fTW7VU+t/gpmetrNyuTQ+30sQClCmgMYEKRuQZIAKjDIDwj+UalKAVn3OIUo1wARAQABwsGEBBgBCgAPBQJcra99BQkPCZwAAhsuASkJEDSLSWoXPdqqwF0gBBkBCgAGBQJcra99AAoJEABanYRVBM7T4FYH/3BrnSIXGyHlQkf/Bnj0eapx7In0UzGufrJNk/+SlXBBn4EQ6rYnYtDQMcxBPuVpAHHVi1ZKeaqxciRCzfrA7o84mAUozEFV8upXJCCJmhlSCodjOeupU+N+RzoS3VFkhzY0lds67iAhjg8GY4IvJigIFFdeCmNirmK1AercSjEiRiAFVk7ULbVQ0HBHir0JKJMDLxeQ0Gxo/1uEtuZ0AvpDVCjin8rU9iHStx36wqlB7DyviUaA5VxuHwTyK0QIBKByokr0oa9RSgtMah1nD1hk/eWH/3GTmCfs2ouvX1A0Lq/1F8XMmDXDTYaMCejb9Lyz5aU5R4Jyufce4XaPNJIY0wf/R1C4Ca386NDMu4lHyp7VIgdWj5aCTbdBVmjybTOAlG/zflD2q9bOY1ndfEiiBKr4lKdo5HVPD7Ikvjx8/OgqYhudq+g/yypOpjFmMPhhboXZ/21w2zdfK24Ezy3FE0/Nz1p0Ik5L4EKNjUCzgx8PedMAqfOavBUSIQm/9qIc/G5WSgM2xsd3FSWBPMtQu0x1NeboXMuM0p0zfvU/07wIhznB85LRr6BGaNfSkywrktBL6zUu5fVHsHDeZ96mq0C9Tu6nR1vo6g1PJck2Sbm/PyQGEPmZMupnyHL5lg6ENMNXPSz1YbqX77QNxKjjaA7FZ5j/8CC98OxmMRTkDjdpLw===xIpc"></a><br>-----END PGP PUBLIC KEY BLOCK-----</div><br>&nbsp;<br><sub>( Please ensure e-mail provided is valid! Expect a reply to your email within a day! )</sub></center>',
        title: '<center><span id="sexymodaltitle">Hive.Loans</span><br>Need Assistance or Have a Question? Contact Us!</center>',
        buttons: {
            main: {
                label: "Send",
                className: "push_button2",
                callback: function() {
                  showErr(`Please Visit Our Discord!`);
                  /*
                    socket.emit('contactus', {
                        name: $("#contactName").val(),
                        email: $("#contactEmail").val(),
                        message: $("#contactMessage").val(),
                        token: token
                    }, function(err, data) {
                        if (err) return showErr("Failed to Send");
                        if (data.token !== 0) token = data.token; //token is always returned
                        showSuccess("Message Sent!");

                    });
                    */
                }
            }
        }
    });
    $("#showpgp").on('click', function() {
        $("#pgpshow").fadeTo("fast", 1);
    })
});

function confirm2fa() {
    socket.emit('set2fa', {
        token: token,
        code: $("#confirm2fanumber").val()
    }, function(err, data) {

        if (err) return showErr(err);
        token = data.token;
        showSuccess("2FA Enabled!");
        $("#2faresponse").text("2FA Enabled!");
    });
}

function delete2fa() {
    socket.emit('del2fa', {
        token: token,
        code: $("#delete2fanumber").val()
    }, function(err, data) {
        console.log(err);
        if (err) return showErr(err);
        token = data.token;
        showSuccess("2FA Disabled!");
    });
}

$("#secondfactorsettings").on('click', function() {
    socket.emit('get2fa', {
        token: token
    }, function(err, data) {
        if (err) {
          console.log(err);
          return showErr(err);
        }
        token = data.token;
        if (data.set) {
            bootbox.dialog({
                message: '<center><b>Disabled 2FA Protection Using Your Current 2FA Code:</b></center>' +
                    '<center><div class="input-group" style="width:75%;"><span><input type="text" class="form-control"  style="" placeholder="" aria-describedby="basic-addon1" id="delete2fanumber"/></span><br><br><span class="input-group-btn">' +
                    '<button type="button" class="btn  push_button2 sextext" style="margin-right:2px;margin-top:-5px;padding-bottom:4px;" onClick="delete2fa();">Delete</button>' +
                    '</span></div></center>',
                title: '<center><span id="sexymodaltitle">Hive.Loans</span><br>2FA Security Settings Setup</center>'
            });
        } else {
            bootbox.dialog({
                message: '<div><center><b>Scan the Code Below With Any TOTP Type 2FA Application:</b><br><img style="margin-right:5px" src="' + data.qrcode + '"><br><b>Secret:</b><br>' + data.secret + '</center></div><br><center>Input 2FA Code From Your Authenicator App to Enable 2FA:</center>' +
                    '<center><input type="text" class="form-control" style="" placeholder="" aria-describedby="basic-addon1" id="confirm2fanumber"/><br><br>' +
                    '<center><button type="button" class="btn  push_button2 sextext" style="" onClick="confirm2fa();">Confirm</button></center>' +
                    '</div><br><div id="2faresponse"></center>',
                title: '<center><span id="sexymodaltitle">Hive.Loans</span><br>2FA Security Settings Setup</center>'
            });
        }
        window.scrollTo(0, 0);
    });
});

$("#rtos").on('click', function() {
    termsOfService();
});


var contractDialog = function (datanew) {

            console.log("contractDialog data");
            console.log(JSON.stringify(datanew));
            bootbox.dialog({
              message:
              `<span id="popupActiveTable" style="padding:15px; width:100% !important; height:50%;overflow-y:scroll;"></span><table id="popupActiveHead" style="max-height:30% !important;"></table>`,
              title: '<center><span id="sexymodaltitle">Hive.Loans</span><br>Contract Details</b></center>',
              buttons: {
                  main: {
                      label: "Close",
                      className: "push_button2"
                  }
              }
            });
// CreateTableFromJSON(ourloans, 'ourloans', 'loadActiveloans', 'loadActiveTable', 'loadActiveHead');
return CreateTableFromJSON(`'${JSON.stringify(datanew)}'`, 'popuploans', 'popupActiveloans', 'popupActiveTable', 'popupActiveHead');

};

var betPublicDialog = function(row) {
  console.log(`betPublicDialog`);
  console.log(row);
    bootbox.dialog({
        message: '<div id="betDetail"></div>',
        title: `<center><span id="sexymodaltitle">Hive.Loans</span><br>Bet Summary for <b id="rollstatslink">@${row.username}</b></center>`, //Bet ID# ' + row.betnumber + '
        buttons: {
            main: {
                label: "Close",
                className: "push_button2"
            }
        }
    });

    var provablystring = "";
    var $betDetail = $("#betDetail");
    var wincheck = parseFloat(row.win);
    if (wincheck >= 0) {
        $betDetail.html(`<center><b style="font-size:2em;color:green;">WON!</b><br><h4>Wagered <b>${parseFloat(row.amount).toFixed(8)}</b> HIVE Aiming for <b>${row.target}</b><br>Winning <b style='color:green;'>${row.win}</b> HIVE with a Roll of <b>${row.result}</b></h4>${provablystring}</center>`);
    } else {
        $betDetail.html(`<center><b style="font-size:2em;color:red;">LOST!</b><br><h4>Wagered <b>${parseFloat(row.amount).toFixed(8)}</b> HIVE Aiming for <b>${row.target}</b><br>Losing <b style='color:red;'>${row.win}</b> HIVE with a Roll of <b>${row.result}</b></h4>${provablystring}</center>`);
    }

    $("#rollstatslink").on('click', function() {
        userstatsDialog(row.username);
    });
};

function showSideWalletHistory     (user) {
  socket.emit('wallethistory', {name:user}, function(err, data){
    if(err) showErr(err);
    if(data) {
      console.log(`showWalletHistory fired!`)
      $('#alertpanel').animate({'height':'85%','top':'11%'});
      //$('#userpanel').removeClass('hidden');
      //$("#userpanel").css({'height':'40%','width':'40%','top':'50%','left':'50%'});
      //$('#panelName').val('Wallet History');
      //$('#panelName').html('Wallet History');
      //$("#panelContent").html(`Please Wait While Wallet History Query Completes`);
      //$('#userpanel').fadeIn();
    }
  })
}

/*
var crossedoutwallethistory = `<span class="fa-stack fa-1x">` +
`<i class="fas fa-history fa-stack-1x"></i>` +
`<i class="fas fa-ban fa-stack-1x" style="color:red; font-weight:100;"></i>` +
`</span>`;

var wallethistory = `<i class="fas fa-history"></i>`;
*/
var showWalletHistoryEnabled = true;

function showWalletHistory(user) {
  if (showWalletHistoryEnabled == true) {
    console.log(`showWalletHistory fired!`);
    console.log(`showWalletHistoryEnabled: ${showWalletHistoryEnabled}`);
    $('#showWalletHistory').html(`Click Here to Hide Your Wallet History`);
    socket.emit('wallethistory', {name:uUsername}, function(err, data){
      if(err) showErr(err);
      if(data) {
        console.log(`showWalletHistory(${uUsername}) data:`);
        console.log(data);
        $('#jumbotron').animate({'height':'80%','top':'10%'});
        $('#userpanel').fadeIn();
        $("#userpanel").css({'height':'40%','width':'40%','top':'50%','left':'50%'});
        $('#panelName').val('Wallet History');
        $('#panelName').text('Wallet History');
        $("#panelContent").text(`Please Wait While Wallet History Query Completes`);
        $('#userpanel').fadeIn();
        $('#walletHistoryInset').removeClass('hidden');
        $('#walletHistoryInset').fadeIn();
        $('#wallethistoryspan').fadeIn();
        showWalletHistoryEnabled = false;
      }
    });
  } else {
    console.log(`showWalletHistory fired!`);
    console.log(`showWalletHistoryEnabled: ${showWalletHistoryEnabled}`);
    $('#showWalletHistory').html(`Click Here to Show Your Wallet History`);
    $('#jumbotron').animate({'height':'38%','top':'30%'});
    $('#userpanel').fadeOut();
    $('#walletHistoryInset').fadeOut();
    //$('#walletHistoryInset').addClass('hidden');
    $('#wallethistoryspan').fadeOut();
    $('#userpanel').fadeOut();
    showWalletHistoryEnabled = true;
  }
}

function showListing() {
    console.log(`showListing() called`);
    loadingjumbo();
    let listingContent = ``+
    `<center><b>Do you have a crypto asset that needs a place to be exchanged and traded?</b></center><br>`+
    `Shortly after the succesful completion ofthe v0.1.0 beta testing phase of this site, we'll be allowing users from all corners of the globe to trade their assets on our site.<br><br>` +
    `From ERC-20 style tokens on Ethereum, Your Hive-Engine.com Tokens or proprietary emergent sidechain protocols within our own ecosystem, it's generally agreed upon the more places an asset is traded the more likely it is to succeed long term. Here at Hive.Loans we offer and plan to greatly expand services offered to the HIVE community by creating a competitive atmosphere against long standing "monopolies" (of sorts) in the HIVE ecosystem having to deal with user created tokens or assets. Now we're not here to replace everyone else's services on HIVE, we're here to amalgamate and link everything together into a stronger, more focused push on gettting HIVE ready to compete with the big cryptos out there.<br><br>` +
    `<br><b>Get Listed on the Hive.Loans exchange, quick and affordable!</b><br>` +
    `Fill out the information below in order to get listing estimate:<br>` +
    `<br>` +
    `Asset or Token Name:<br>`+
    `<input type="text" class="casperInput" id="tokenname"><br>`+
    `Asset or Token Symbol:<br>`+
    `<input type="text" class="casperInput" id="tokensymbol"><br>`+
    `Asset or Token Website or Information:<br>`+
    `<input type="text" class="casperInput" id="tokensite"><br><br>`+
    `<b>Additional Listing Options or Offerings</b>:<br>` +
    `Is this asset listing an IPO/ICO? <i class="far fa-fw fa-question-circle siteinfo" title="Specify if this listing is an IPO/ICO" onclick="alert('Is this the first public release of this asset?')"></i><br>` +
    `<input type="text" class="casperInput" id="tokenipo"><br>`+
    `<b></b>` +
    `A one time listing fee of <span id="listingprice">0.000</span><span id="pricechecktokenlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span><br>` +
    `<br>` +
    `<br>` +
    `<b>Asset Listing Integration:</b><br>` +
    `After ordering an asset listing be aware that the duration until full integration, ranges from a few hours to a few weeks, depending on the complexity of tying in the asset to the exchange and establishing the required infrustructure.` +
    `<br>` +
    `Your account balance must contain the listing fee and all fields above filled out properly in order to succesfully submit an asset listing creation order.` +
    `<button type="button" style="font-size: larger; padding: 10px; background: #000; color: white; width: 40%;border-radius:5px;" class="button" id="listassetbutton" onClick="finishThis(); /*listAsset();*/" title="Click Here to List Asset" >Create Asset</button></center><br><br>` +
    `<span id="listingsfooter" style="font-size: smaller;"><i class="fas fa-exclamation-triangle sexyblackoutline" style="color:yellow;"></i> <b>NOTE</b>: You must have the listing fee in your account and be aware of lead times!\.`;
    //`<br>By setting the @hive.loans account as your recovery account you'll gain access to automated account recovery offered here under the "Tools" page. As for handling of account recovery if you've selected any of the other Featured Recovery Accounts you'll have to look up their account recovery handling methods.</span><br><br>`;

    $("#jumbotron").fadeOut('fast');
    $("#jumbotron").promise().done(function(){
      $("#jumboHead").show();
        $("#jumboWrapper").html(listingContent);
        $("#jumbotron").css({'top':'11%','height':'86vh','width':'25%'});
        $("#jumbotron").center();
        $("#jumbotron").fadeIn();
        $("#jumboTitle").text(`List & Trade Your Digital Assets`);
    });

}

async function showWallet(username) {
  if(!username) showErr('You Must Specify a User!');
  console.log(`showWallet() called`);
  loadingjumbo();
  var statsBalTop;
  var statsHBDBal;
  $("#jumbotron").fadeOut('fast');
  var resultData;
  socket.emit('walletdata', {username: username}, function(err, data){
    if(err) showErr(err);
    //if(data) showSuccess(data);
  });
};//END showWallet

async function viewUserProfile(user) {
  console.log(`viewUserProfile(${user}) called`);
  loadingjumbo();
  //var userDelegations = []

  await hive.api.getDynamicGlobalProperties( async function(err, result) {
    if(err){console.log(err)}
    total_vesting_shares = parseInt(result.total_vesting_shares);
    total_vesting_fund = parseInt(result.total_vesting_fund_hive);
  });
  await hive.api.getAccounts([user], async function(err, result) {
    console.log(`getAccounts`)
    if(err){
      console.log(err)
    }
    if(result){
      console.log(result);
      var recoverAcct = resultData.recovery_account;
      var hivePower = parseInt(resultData.vesting_shares);
      var recoverAcct = resultData.recovery_account;
      var hivePower = parseInt(resultData.vesting_shares);

      await hive.api.getVestingDelegations(`'${user}'`, '', 0, function(err, result) {
        if(err !== null) {
          console.log(`Error: ${err}`);
        }
        if(result.length > 0){
          result.forEach((item, i) => {
            var user = item.delegatee;
            var vests = parseFloat(item.vesting_shares);
            var hiveVested = ( Number(total_vesting_fund) *  Number(vests) ) / Number(total_vesting_shares);
            var entry = ` <span class="profileDelegateUsr"><a href="https://hiveblocks.com/@${user}" class="histuserlink" style="color: white !important; text-decoration:none !important;" target="_blank" title="Click to View This Account on HiveBlocks.com in a New Window">@${user} <i class="fas fa-external-link-square-alt" title=""></i></a></span> <span class="profileDelegateAmt">${hiveVested.toFixed(3)} HIVE</span><br>`; //- ${item.id}
            userDelegations.push(entry)
          });
        }
      });

    if(userDelegations.length == 0){
      userDelegations = `No Active Delegations`;
    }
    hypertabletwo =
    `<table style="width:100%;">` +
    `<tbody>` +
    `<tr>` +
    `<td colspan="3">` +
    `<span id="metaprofile">` +
    `<span id="userpic" style="float:right;">` +
    `</span>` +
    `<br>` +
    `<span id="nameid"></span> ` +
    `<code>( @${user} )</code>` +
    `<br>` +
    `<i class="fas fa-fw fa-globe"></i><span id="locationid"></span>` +
    `<br>` +
    `<b style="font-size:larger;">Rank: ${$('#userrank').val()}</b>` +
    `<br>` +
    `<span id="profilestring"></span>` +
    `</td>` +
    `</tr>` +
    `<tr>` +
    `<td colspan="3">` +
    `<div class="autoBettitleC2 autoBettitleC2p levelHolder" style="position:relative">
    <span class="thisLevel" id="thisLevel" style="">0</span>
    <span class="levelprogress" title="Progress to next Account Level" style="width: 34.95%;"></span>
    <span class="autoBettitleTT Logoml nextLevel" id="nextLevel">0</span>
    </div>` +
    `</td>` +
    `</tr>` +
    `<tr>` +
    `<td>` +
    `<span id="statsBal"></span>` +
    `</td>` +
    `<td>` +
    `<p id="hivePowerHeld"></p>` +
    `</td>` +
    `<td>` +
    `<span id="statHBDsBal"></span>` +
    `</td>` +
    `</tr>` +
    `<tr>` +
    `<td  id="recoverAcct">Recovery shit here</td>` +
    `<td>Account XP:</td>` +
    `<td>Date Created:` +
    `<br>` +
    `${dateCreated}` +
    `</td>` +
    `</tr>` +
    `<tr>` +
    `<td colspan="3">` +
    `<span id="recAlert">` +
    `</span>` +
    `<hr class="allgrayeverythang">` +
    `<b style="font-size:smaller;">` +
    `Scope Keys & Permissions:` +
    `<br>` +
    `<code>Posting Public Key:</code>` +
    `<br>${posting_key} <i class="far fa-fw fa-eye"></i>` +
    `<br>` +
    `<code>Active Public Key:</code>` +
    `<br>${active_key} <i class="far fa-fw fa-eye"></i>` +
    `<br>` +
    `<code>Owner Public Key:</code>` +
    `<br>${owner_key} <i class="far fa-fw fa-eye"></i>` +
    `<br>` +
    `<code>Memo Public Key:</code>` +
    `<br>${memo_key} <i class="far fa-fw fa-eye"></i>` +
    `</td>` +
    `</tr>` +
    `</tbody>` +
    `</table>`;

          $("#jumbotron").fadeOut('fast');
          $("#jumbotron").promise().done(function(){
          $("#jumboHead").show();
          $("#jumboWrapper").html( hypertabletwo);
          $("#jumboTitle").text(`@${user} Profile`);
          $("#metaprofile").val(profiledata['profile']);
          $('#delegationShow').html(userDelegations);
          $('#urank').val($('#userrank').val());
          $("#jumbotron").css({'height':'70%','width':'25%'});
          $("#jumbotron").center();
          $("#jumbotron").fadeIn();
            getAcct();
          profiledata = JSON.parse(profiledata);


          console.log("profiledata");
          console.log(profiledata);
          var userc = profiledata.profile.profile_image;
          var userabout = profiledata.profile.about;
          var userlocation = profiledata.profile.location;
          var username = profiledata.profile.name;
          $("#userpic").css({"background-image":`url("${userc}")`}); // `<img src="${userc}" style="width:5vw;height:5vw;border-radius:15px;border: inset 2px grey;">`
          $("#locationid").html(`${profiledata.profile.location}`);
          $("#nameid").html(`${username}`);
          $("#profilestring").html(`${userabout}`);
          $("#recoverAcct").html(`<span id="showRecoverAccount"><b>Show Recovery Account</b></span><span id="recName">${recoverAcct}</span><span id="prawarn"></span>`);
          $("#profileRecoverAcct").html(`<span id="precacct">${recoverAcct}</span>`);
          $("#showRecAcct").html(`@${recoverAcct}`);
          $("#hivePowerHeld").html(`<b>HIVE Power</b>:<br>${toThree(hiveVested)} HP`);
          $("#loansHPdisplay").html(`<span id="hplevel">${toThree(hiveVested)}</span> HP`);
          $("#urank").html(`${$('#userrank').val()}`);
          loanMax = parseFloat(hiveVested * 0.7);

          if(recoverAcct !== 'hive.loans' && recoverAcct !== 'anonsteem' && recoverAcct !== 'beeanon' && recoverAcct !== 'blocktrades') {
            $("#recName").css({"color":"red"});
            $("#precacct").css({"color":"red"});
            $("#prawarn").css({"color":"red"});
            $("#showRecAcct").css({"color":"red"});
            $("#recAlert").html(`<b title="Recovery Account is Invalid!">❌</b><br><code class="recinv">Please set @hive.loan as recovery account! Click here to change recovery account</code><br><sub>( This will take 30 days to complete )</sub>`);
            $(".acceptButton").hide();
            $("#recAlert").html(`<sub><b style="color:red;">Recovery Account Invalid!</b><br>Please set @hive.loans as recovery account!<br><br>Click here to change recovery account<br><sub>( This will take 30 days to complete )</sub></sub>`);
          } else {
            $("#recName").css({"color":"lawngreen"});
            $("#precacct").css({"color":"lawngreen"});
            $("#prawarn").css({"color":"white"});
            $("#showRecAcct").css({"color":"lawngreen"});
            $("#prawarn").html(`✔️`);
            $(".acceptButton").show();
            $("#recAlert").html(`<b title="Recovery Account is Valid">✔️</b>`);
          }
      });
    }

  });
}

var termsOfService = function() {

var tosContent = 'Introduction\n\n\n' +
      'These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Hive.Loans accessible at https://Hive.Loans.\n\n\n' +
      'These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website Standard Terms and Conditions.\n\n\n' +
      'Minors or people below 18 years old are not allowed to use this Website!\n\n\n' +
      'Intellectual Property Rights\n\n' +
      'Other than the content you own, under these Terms, Hive.Loans and/or its licensors own all the intellectual property rights and materials contained in this Website.\n\n' +
      'You are granted limited license only for purposes of viewing the material contained on this Website.\n\n' +
      'Restrictions\n\n' +
      'You are specifically restricted from all of the following:\n\n' +
      '\n\n' +
      'publishing any Website material in any other media;\n\n' +
      'selling, sublicensing and/or otherwise commercializing any Website material;\n\n' +
      'publicly performing and/or showing any Website material;\n\n' +
      'using this Website in any way that is or may be damaging to this Website;\n\n' +
      'using this Website in any way that impacts user access to this Website;\n\n' +
      'using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;\n\n' +
      'engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;\n\n' +
      'using this Website to engage in any advertising or marketing.\n\n' +
      '\n\n' +
      'Certain areas of this Website are restricted from being access by you and Hive.Loans may further restrict access by you to any areas of this Website, at any time, in absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality as well.\n\n' +
      'Your Content\n\n' +
      'In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, img or other material you choose to display on this Website. By displaying Your Content, you grant Hive.Loans a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.\n\n' +
      'Your Content must be your own and must not be invading any third-partyâ€™s rights. Hive.Loans reserves the right to remove any of Your Content from this Website at any time without notice.\n\n' +
      'Your Privacy\n\n' +
      'Hive.Loans will not share your name, username, email, login information, account status or any other information with any party regardless of inquiry. Under no circumstance will we give any information to any government agency, police department or tax collector even if they have proper warrants and paperwork.<br>We respect your privacy and information, confidentiality is important!\n\n' +
      'No warranties\n\n' +
      'This Website is provided "as is," with all faults, and Hive.Loans express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.\n\n' +
      'Limitation of liability\n\n' +
      'In no event shall Hive.Loans, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Â Hive.Loans, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.\n\n' +
      'Indemnification\n\n' +
      'You hereby indemnify to the fullest extent Hive.Loans from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.\n\n' +
      'Severability\n\n' +
      'If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.\n\n' +
      'Variation of Terms\n\n' +
      'Hive.Loans is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.\n\n' +
      'Assignment\n\n' +
      'The Hive.Loans is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.\n\n' +
      'Entire Agreement\n\n' +
      'These Terms varitute the entire agreement between Hive.Loans and you in relation to your use of this Website, and supersede all prior agreements and understandings.\n\n' +
      'Governing Law & Jurisdiction\n\n' +
      'These Terms will be governed by and interpreted in accordance with the natural laws of Planet Earth, and you submit to the non-exclusive jurisdiction of the natural laws of Planet Earth for the resolution of any disputes.' +
      '';

  var termsofContent = '<textarea style="width:100%; height:70vh;font-size:smaller;overflow-x:hidden;" id="termsoftextarea" readonly></textarea>' +
  `<center><button class="button" onclick="showLogin();"><b style="font-weight:900;font-size:larger;">Return to Login</b></button></center>`+
  `<br>&nbsp;<br>`;


        $("#jumbotron").fadeOut('fast');
        $("#jumbotron").promise().done(function(){
          $("#jumboHead").show();
            $("#jumboWrapper").html(termsofContent + '<br>');
            $("#termsoftextarea").val(tosContent);
            $("#jumbotron").css({'top':'5vh','min-height':'80vh','width':'25%'});
            $("#jumbotron").center();
            $("#jumbotron").fadeIn();
            $("#jumboTitle").text(`Terms of Service`);
        });

};

async function showSettings() {
  console.log(`showSettings() called`);
  loadingjumbo();
  let settingsContent = ``+
  `<center>Configure Various Account and Site Settings Below</center><br>`+
  //`<br><b>Change Account Password</b>:<br><input id="oldpasschanger" placeholder="Current Password" type="text"> <input id="newpasschanger" placeholder="New Password" type="text"> <input id="repeatchanger" placeholder="Repeat New Password" type="text">` +
  `<br><br><b>2FA Settings</b>:<br><button class="button" style="line-height: 1vh;">Enable 2FA</button>` +
  `<br><br><b>Live Chat Settings</b>:<br><button class="button" style="line-height: 1vh;">Disable</button>` +
  `<br><button class="button" style="line-height: 1vh;">Disable Private</button>` +
  `<br><button class="button" style="line-height: 1vh;">Disable @ Mentions</button>` +
  `<br><b>HIVE CFD / Futures Trading</b>:` +
  `<br>` +
  `<button class="button" style="line-height: 1vh;">Disable</button>` +
  `<br>` +
  `<sub><i class="fas fa-exclamation-triangle sexyblackoutline" style="color:yellow;"></i> Disabling Futures is <b>Permanent</b>!</sub>` +
  `<br><br><b>Public Profile Sharing</b>:<br><button class="button" style="line-height: 1vh;">Hide Profile</button>` +
  `<br><br><b>Site Display Currency</b>:` +
  `<br>` +
  `<button class="button" style="line-height: 1vh;" onClick="btcCurrency();">BTC</button> ` +
  `<button class="button hidden" style="line-height: 1vh;" onClick="">HIVE</button> ` +
  `<button class="button hidden" style="line-height: 1vh;" onClick="">HBD</button> ` +
  `<button class="button" style="line-height: 1vh;" onClick="usdCurrency();">USD</button>` +
  `<br>` +
  `<br>` +
  `<b>Show Info Bubbles</b>:` +
  `<button id="settings-siteinfo" class="button" style="line-height: 1vh;" onClick="togglesiteinfo()">Hide</button> ` +
  `<button class="button hidden" style="line-height: 1vh;" onClick="">Show</button> ` +
  `<br><input id="settingsDonatePercent" placeholder="Current Password" type="number" min="1" max="100" step="0.01" placeholder="1.00">` +
  `<br><br>` +
  `<button disabled type="button" style="font-size: larger; padding: 10px; background: #000; color: white; width: 40%;border-radius:5px;" class="button" id="setSettings" onClick="saveSettings();" title="Click Here to Save Settings" disabled >Save Settings</button></center><br><br>` +
  `<span id="settingsfooter" style="font-size: smaller;"><i class="fas fa-exclamation-triangle sexyblackoutline" style="color:yellow;"></i> <b>NOTE</b>: Settings Must be Saved to Take Effect!`;
  //`<br>By setting the @hive.loans account as your recovery account you'll gain access to automated account recovery offered here under the "Tools" page. As for handling of account recovery if you've selected any of the other Featured Recovery Accounts you'll have to look up their account recovery handling methods.</span><br><br>`;

  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();
      $("#jumboWrapper").html(settingsContent);
      $("#jumbotron").css({'top':'11%','height':'86vh','width':'25%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Account & Site Settings`);
  });
}

async function showProfile() {
  var userSiteData = await getUserSiteBalance(uUsername).then(res => { return res }).catch(error => {console.log(error)});
  if(debug == true) console.log(`showProfile() called`);
  loadingjumbo();
  var result = await getUserHIVEAccount(uUsername);
  var userSiteInfo = result[1]['data'];
  result = result[0];
  profiledata = result['posting_json_metadata'];
  if(debug === false){
    console.log(userSiteInfo);
    console.log(result);
    console.log(profiledata);
  }
  recoverAcct = result.recovery_account;
  hivePower = parseInt(result.vesting_shares);
  recoverAcct = result.recovery_account;
  hivePower = parseInt(result.vesting_shares);
  memo_key = result.memo_key;
  owner_key = result.owner.key_auths[0].toString();
  active_key = result.active.key_auths[0].toString();
  posting_key = result.posting.key_auths[0].toString();
  reputation = hive.formatter.reputation(result.reputation);
  if(reputation == NaN || typeof reputation == 'string') reputation = "None";
  owner_key = owner_key.split(',')[0];
  active_key = active_key.split(',')[0];
  posting_key = posting_key.split(',')[0];
  dateCreated = result.created;
  var dateSplice = dateCreated.split("T");
  dateCreated = dateSplice[0];
  var timeCreated = dateSplice[1];
  //getAcct();
  var userc;
  var userabout;
  var userlocation;
  var usersite;
  var username;
  var hiveVested;
  var vests;
  var xp = userSiteInfo.xp;
  var lvl = userSiteInfo.level;
  var nextlvl = lvl + 1;
  var lvlxpstart = lvl * 1000;
  var lvlxpend = nextlvl * 1000;
  var xpbarwidth = (100 - ((lvlxpend - xp) / 10)).toFixed(1);
  var xpbarraw = xpbarwidth;
  xpbarwidth = xpbarwidth +  "%";
  var sharecount = userSiteInfo.shares;
  var shareyield = sharecount * 0.0002;
  if(sharecount == 0) sharecount = "NONE"
  var shareprofit = userSiteInfo.shareprofit;
  if(typeof userSiteInfo.witness_description != undefined){
    witdeclaration = userSiteInfo.witness_description;
  }
  console.log(xpbarwidth);
  try {
    profiledata = JSON.parse(profiledata);
    console.log(profiledata);
    vests = parseFloat(result.vesting_shares);
    userc = profiledata.profile.profile_image;
    userabout = profiledata.profile.about;
    userlocation = profiledata.profile.location;
    usersite = profiledata.profile.website;
    var siteName = usersite.split('//')[1];
    usersite = siteName;
    username = profiledata.profile.name;
    hiveVested = ( Number(total_vesting_fund) *  Number(vests) ) / Number(total_vesting_shares);
  } catch(e) {
    console.log(e);
  }
  hypertabletwo = `<table style="width:100%;">` +
  `<tbody>` +
  `<tr>` +
  `<td colspan="3">` +
  `<span id="metaprofile">` +
  `<span id="userpic" style="float:right;">` +
  `</span>` + //end userpic
  `<div id="profiletext">` +
  `<span id="nameid">` +
  `Name` +
  `</span>` +
  `<br>` +
  `<sup id="profilestuff">` +
  `<sub><i class="fas fa-fw fa-bolt" title="Account Type"></i> lvl ${lvl} <span id="lvltype">${$('#userrank').val()}</span></sub>` +
  `<br>` +
  `<sub>${commaNumber(xp)}xp / ${commaNumber(lvlxpend)}xp</sub><br>` +
  `<code><sub><span id="userXPTillLevel"></span> till lvl ${commaNumber(nextlvl)}</sub></code>`+
  `<br>` +
  `<sub>` +
  `<i class="fas fa-fw fa-medal" title="Network Reputation"></i>&nbsp;Reputation:&nbsp;` +
  `<span id="reputationid">` +
  `0` +
  `</span>` +
  `</sub>` +
  `<br>` +
  `<i class="fas fa-fw fa-at"></i>&nbsp;Blog:&nbsp;<a href="https://peakd.com/@${uUsername}" class="paintitwhite" title="Clicking this will Open Another Website">${uUsername}</a> <sup><sub><i class="fas fa-fw fa-external-link-alt" title="Clicking this will Open Another Website"></i></sub></sup>` +
  `</span>` +
  `<br>` +
  `<i class="fas fa-fw fa-couch" title="Location"></i>&nbsp;Location:&nbsp;` +
  `<span id="locationid"></span>` +
  `<br>` +
  `<i class="fas fa-fw fa-globe" title="Website"></i>&nbsp;Website:&nbsp;` +
  `<span id="websiteid" title="Clicking this will Open Another Website" class="paintitwhite" ></span> <sup><sub><i class="fas fa-fw fa-external-link-alt" title="Clicking this will Open Another Website"></i></sub></sup>` +
  `<br>` +
  `<span id="creatorDate">` +
  `<i class="far fa-fw fa-calendar-alt" title="HIVE Registration Date"></i>&nbsp;Join Date:&nbsp;` +
  `${dateCreated}` +
  `</span>` +
  `</td>` +
  `</tr>` +
  `</div>` +
  `<td colspan="3">` +
  `<div id="profilestring"></div>` +
  `<div id="witdeclaration"></div>` +
  `<div class="levelHolder" style="position:relative">` +
  `<span class="thisLevel" id="thisLevel" style="">` +
  `0` +
  `</span>` +
  `<span class="levelprogress" title="Progress to next Account Level" style="width:${xpbarwidth} !important;">` +
  `<span id="xpOnBar">` +
  `${commaNumber(xp)}<span id="xpOnBarHeadXp">xp</span><span id="xpOnBarTail"> / ${commaNumber(lvlxpend)}xp</span>` +
  `</span>` +
  `</span>` +
  `<span class="autoBettitleTT Logoml nextLevel" id="nextLevel">` +
  `0` +
  `</span>` +
  `</div>` +
  `</td>` +
  `</tr>` +
  `<tr>` +
  `<td>` +
  `<span id="statsBal">` +
  `</span>` +
  `</td>` +
  `<td>` +
  //`<p id="hivePowerHeld">` +
  //`</p>` +
  `</td>` +
  `<td>` +
  `<span id="statHBDsBal">` +
  `</span>` +
  `</td>` +
  `</tr>` +
  `<tr id="profilestatsrow">` +
  //`<p id="sasf" onload="$('#sasf').addClass('hidden');"><span id="showStatsTemp">Show</span> Account Stats & Facts</p>` +
  `<td class="profilestats">` +
  `<b>Loans</b>` +
  `<br>` +
  `<code>Contracts Created</code>` +
  `<br>` +
  `${commaNumber(userSiteInfo.totallends)}` +
  `<br>` +
  `<code>Total Loaned</code>` +
  `<br>` +
  `${commaNumber((0).toFixed(3))} <i class="fab fa-fw fa-hive" style="color:#E31337;"></i>` +
  `<br>` +
  `<code>Lending Profit</code>` +
  `<br>` +
  `${commaNumber(((userSiteInfo.hiveprofit / 1000)).toFixed(3))} <i class="fab fa-fw fa-hive" style="color:#E31337;"></i>` +
  `<br>` +
  `</td>` +
  `<td class="profilestats">` +
  `<b>Trade</b>` +
  `<br>` +
  `<code>Open Orders</code>` +
  `<br>` +
  `${commaNumber(0)}` +
  `<br>` +
  `<code>Total Orders</code>` +
  `<br>` +
  `${commaNumber((userSiteInfo.activeorder + userSiteInfo.closedorder).toFixed(0))}` +
  `<br>` +
  `<code>Total Traded</code>` +
  `<br>` +
  `${commaNumber(((userSiteInfo.totalorder / 1000)).toFixed(3))} <i class="fab fa-fw fa-hive" style="color:#E31337;"></i>` +
  `</td>` +
  `<td class="profilestats hidden">` +
  `<b>Bankroll</b>` +
  `<br>` +
  `<code>Invested</code>` +
  `<br>` +
  `${commaNumber((userSiteInfo.invested / 1000))} <i class="fab fa-fw fa-hive" style="color:#E31337;"></i>` +
  `<br>` +
  `<code>Percent</code>` +
  `<br>` +
  `${commaNumber((userSiteInfo.investedpercent / 1000))} <i class="fas fa-fw fa-percentage" style="color:white;"></i>` +
  `<br>` +
  `<code>Profit</code>` +
  `<br>` +
  `${commaNumber((userSiteInfo.investedprofit / 1000))} <i class="fab fa-fw fa-hive" style="color:#E31337;"></i>` +
  `<br>` +
  `</td>` +
  `<td class="profilestats">` +
  `<b>Share</b>` +
  `<br>` +
  `<code>HLSHARE Owned</code>` +
  `<br>` +
  `${commaNumber(sharecount)} <i class="fas fa-fw fa-file-invoice-dollar" style="color:lightblue"></i>` +
  `<br>` +
  `<code>Site Revenue Owned</code>` +
  `<br>` +
  `${shareyield.toFixed(4)}%` +
  `<br>` +
  `<code>Dividends Earned</code>` +
  `<br>` +
  `${commaNumber((shareprofit / 1000).toFixed(3))} <i class="fab fa-fw fa-hive" style="color:#E31337;"></i>` +
  `</td>` +
  `</tr>` +
  `<tr>` +
  `<td colspan="3">` +
  `<hr class="allgrayeverythang">` +
  `<span id="showRecoverAccount">` +
  `<span id="recoverAcct" class=""></span>` +
  `</span>` +
  `<span id="recAlert" class="">` +
  `</span>` +
  `<hr class="allgrayeverythang">` +
  `<b style="font-size:smaller;">` +
  `<span onclick="$('#profilestatsrow').hide(); $('#sasf').show(); $('#showTemp').hide();$('#profileKeys').removeClass('hidden');"><span id="showTemp">Show </span>Account Keys & Scope Permissions</span>` +
  `<div id="profileKeys" class="hidden">` +
  `<br>` +
  `<code>` +
  `Posting Public Key:` +
  `</code>` +
  `<br>` +
  `${posting_key}&nbsp;` +
  `<i class="far fa-fw fa-eye" title="View Posting Private Key (Not Implemented Yet)"></i>` +
  `<br>` +
  `<br>` +
  `<code>Active Public Key:</code>` +
  `<br>` +
  `${active_key}&nbsp;` +
  `<i class="far fa-fw fa-eye" title="View Active Private Key (Not Implemented Yet)"></i>` +
  `<br>` +
  `<br>` +
  `<code>Owner Public Key:</code>` +
  `<br>` +
  `${owner_key}&nbsp;` +
  `<i class="far fa-fw fa-eye" title="View Owner Private Key (Not Implemented Yet)"></i>` +
  `<br><br>` +
  `<code>Memo Public Key:</code>` +
  `<br>${memo_key}&nbsp;` +
  `<i class="far fa-fw fa-eye" title="View Memo Private Key (Not Implemented Yet)"></i>` +
  `</div>` +
  `</td>` +
  `</tr>` +
  `</tbody>` +
  `</table>`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();
    $("#jumboWrapper").html( hypertabletwo);
    $("#recoverAcct").html(`<b>Recovery Account</b>:&nbsp;<span id="recName"><a href='https://hiveblocks.com/@${recoverAcct}' target="_blank" style="color:${linkColor};">@${recoverAcct}</span?</span><br>`);
    if(recoverAcct != 'hive.loans' && recoverAcct != 'anonsteem' && recoverAcct != 'beeanon' && recoverAcct != 'blocktrades') {
      $("#recName").css({"color":"red"});
      linkColor = "red";
      $("#recAlert").html(`<b title="Recovery Account is Invalid!">❌</b><br><code class="recinv">Please set @hive.loan as recovery account! Click here to change recovery account</code><br><sub>( This will take 30 days to complete )</sub>`);
    } else {
      $("#recName").css({"color":"lawngreen !important","font-weight":"700"});
      linkColor = "lawngreen";
      $("#recAlert").html(`<b title="Recovery Account is Valid">✔️</b>`);
    }
    $("#metaprofile").val(profiledata['profile']);
    $('#delegationShow').html(userDelegations);
    $('#urank').val($('#userrank').val());
    $("#jumbotron").css({'height':'100%','width':'25%','top':'25%'});
    $("#jumbotron").center();
    $("#jumbotron").fadeIn();
    $("#jumboTitle").text(`Your Profile`);

    if (xpbarraw < 11) $('#xpOnBarTail').addClass('hidden');
    if (xpbarraw < 4) $('#xpOnBarHeadXp').addClass('hidden');
    if (xpbarraw < 2.7) $('#xpOnBar').addClass('hidden');
    console.log(witdeclaration);
    if(witdeclaration != undefined) $('#witdeclaration').html(`${witdeclaration}`);
    $("#userpic").css({"background-image":`url("${userc}")`});
    $("#locationid").text(profiledata.profile.location);
    $("#websiteid").html(`<a href="${profiledata.profile.website}" class="paintitwhite">${usersite}</a>`);
    $("#nameid").text(username);
    $("#reputationid").text(reputation);
    $("#thisLevel").text(lvl);
    $("#nextLevel").text(nextlvl);
    $("#userXPTillLevel").text(`${(lvlxpend - xp)} xp`);
    $("#profilestring").text(userabout);
    $("#recoverAcct").html(`<span><b>Recovery Account</b>:&nbsp;<span id="recName">${recoverAcct}</span><span id="prawarn"></span></span>`);
    $("#profileRecoverAcct").html(`<span id="precacct"><a href="https://hiveblocks.com/@${recoverAcct}"  class="paintitwhite">${recoverAcct}</a></span>`);
    $("#showRecAcct").text(recoverAcct);
    $("#hivePowerHeld").html(`<b>HIVE Power</b>:<br>${toThree(hiveVested)} HP`);
    $("#loansHPdisplay").html(`<span id="hplevel">${toThree(hiveVested)}</span> HP`);
    $("#urank").html(`${$('#userrank').val()}`);
    loanMax = parseFloat(hiveVested * 0.7);
  });

  if(recoverAcct !== 'hive.loans' && recoverAcct !== 'anonsteem' && recoverAcct !== 'beeanon' && recoverAcct !== 'blocktrades') {
    $("#recName").css({"color":"red"});
    $("#precacct").css({"color":"red"});
    $("#prawarn").css({"color":"red"});
    $("#showRecAcct").css({"color":"red"});
    $("#recAlert").html(`<b title="Recovery Account is Invalid!">❌</b><br><code class="recinv">Please set @hive.loan as recovery account! Click here to change recovery account</code><br><sub>( This will take 30 days to complete )</sub>`);
    $(".acceptButton").hide();
    $("#recAlert").html(`<sub><b style="color:red;">Recovery Account Invalid!</b><br>Please set @hive.loans as recovery account!<br><br>Click here to change recovery account<br><sub>( This will take 30 days to complete )</sub></sub>`);
  } else {
    $("#recName").css({"color":"lawngreen"});
    $("#precacct").css({"color":"lawngreen"});
    $("#prawarn").css({"color":"white"});
    $("#showRecAcct").css({"color":"lawngreen"});
    $("#prawarn").text(`✔️`);
    $(".acceptButton").show();
    $("#recAlert").html(`<b title="Recovery Account is Valid">✔️</b>`);
  }

}

function showApi() {
  console.log(`showApi() called`);
  loadingjumbo();
  var apiContent = `<br>This website provides a number of both public and secured API functions:<br>` +
  `<b>Public API Commands</b><br><br>`+
  `<b>HIVE Price API:</b><br>`+
  `<input type="text" onmouseover="this.select()" onclick="copyStringToClipboard(this.value)" style="" readonly class="apiinputs" value="Hive.Loans/api?hiveprice"><br>`+
  `Use the above link to view what the current price of HIVE is according to the global markets data available and used by the site to calculate futures prices.` +
  `<br><br><b>HIVE Price History API:</b><br>`+
  `<input type="text" onmouseover="this.select()" onclick="copyStringToClipboard(this.value)" style="" readonly class="apiinputs" value="Hive.Loans/api?hivepricehistory=100"><br>`+
  `Use the above link to view what the past price of HIVE was according to the global markets data recorded at each block, returns multiple price values over time.` +
  `<br><br><b>Site Audit API:</b><br>`+
  `<input type="text" onmouseover="this.select()" onclick="copyStringToClipboard(this.value)" style="" readonly class="apiinputs" value="Hive.Loans/api?audit"><br>`+
  `Use the above link to view the current audit state of the site in real time.` +
  `<br><br><b>Borrowers List API:</b><br>`+
  `<input type="text" onmouseover="this.select()" onclick="copyStringToClipboard(this.value)" style="" readonly class="apiinputs" value="Hive.Loans/api?borrowers"><br>`+
  `Allows for a list of currently active borrowers on the platform, used in helping 3rd party recovery accounts check to see if they should recover an account or not.` +
  `<br><br><b>Secured API Commands</b><br><br>`+
  `Currently being worked on to allow for secure loaning, trading and operating of your Hive.Loans Account programatically. Users will be able to generate secured API key pairs in order to interact with the site as they wish without the need to access it from the browser. While currently not publically available this feature will be coming in a subsequent patch after beta testing. Tons of API upgrades incoming in the near future.`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();
      $("#jumboWrapper").html(apiContent);
      $("#jumbotron").css({'top':'25%','height':'69vh','width':'25%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Site API Information & Settings`);
  });
}

function showKeysRecoveryPanel() {
  console.log(`showKeysRecoveryPanel() called`);
  loadingjumbo();
  var keyrecoveryContent = `<iframe src='../recovery/index.html' id="frame1" name="frame1" style="width:100%;height:100%;"></iframe>`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();
      $("#jumboWrapper").html(keyrecoveryContent);
      $("#jumbotron").css({'height':'85%','width':'25%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Account Recovery Center`);
  });
}

function showRecoveryPanel() {
  console.log(`showRecoveryPanel() called`);
  loadingjumbo();
  let newRecAcctVar = '';
  let newRecAcctVarlink;
  let recoveryContent = `<center>` +
  `<h3 class="pagehead" style="color:white !important;">` +
  `Change HIVE Recovery Account` +
  `</h3>` +
  `</center>` +
  `<center>` +
  `Current Recovery Account:` +
  `<b><span id="showRecAcct"></span></b>` +
  `</center>` +
  `<br>`+
  `In order to borrow on Hive.Loans your recovery account must be set to an account featured on the Accepted Recovery Accounts list below:` +
  `<br>` +
  `<br>` +
  `<center>` +
  `<b>Accepted Recovery Accounts:</b>` +
  `<br><br>`+
  `@hive.loans` +
  `<br>` +
  `<sub>` +
  `<b>preferred</b> recovery account, enables automated key recovery` +
  `</sub>` +
  `<br><br>` +
  `@blocktrades` +
  `<br>` +
  `<sub>` +
  `a long time trusted HIVE witness and exchange operator` +
  `</sub>` +
  `<br><br>` +
  `@beeanon` +
  `<br>` +
  `<sub>an anonymous account creator by @someguy123</sub>` +
  `<br><br>` +
  `@someguy123` +
  `<br>` +
  `<sub>trustworthy long time HIVE witness</sub>` +
  `<br><br>` +
  `@anonsteem` +
  `<br>` +
  `<sub>an anonymous account creator by @someguy123</sub>` +
  `</center>` +
  `<br><br>` +
  `<br>` +
  `<center>` +
  `<input type="text" id="recoveryAcctInput" style="" placeholder="enter name of new recovery account" onkeyup="return newRecAcctVar = $('#recoveryAcctInput').val();"><br><sub>( enter your new recovery account above without the @ )</sub><br>` +
  `<button type="button" style="" class="button" id="setRecoverAccountButton" onClick=" newRecAcctVarlink = 'https://hivesigner.com/sign/change_recovery_account?new_recovery_account=' + newRecAcctVar; window.open(newRecAcctVarlink);" title="Click here to set Recovery Account">Set Recovery Account</button></center><br><br>` +
  `<span style="font-size: smaller;"><i class="fas fa-exclamation-triangle sexyblackoutline" style="color:yellow;"></i> <b>NOTE</b>: To maintain the security necessary to provide automated lending and borrowing, it will take 30 days from the time of changing your recovery account to one listed above for the system to allow you to borrow. Any attempts to change your recovery account while actively borrowing will result in your account being locked down for the remainder of your loan repayment, and a 10% loan tampering fee will be added to your repayment total.`;
  //`<br>By setting the @hive.loans account as your recovery account you'll gain access to automated account recovery offered here under the "Tools" page. As for handling of account recovery if you've selected any of the other Featured Recovery Accounts you'll have to look up their account recovery handling methods.</span><br><br>`;

  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();
      $("#jumboWrapper").html(recoveryContent);
      $("#jumbotron").css({'height':'85%','width':'25%'});
      getAcct();
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Establish New Account Recovery Warden`);
  });
}

function showAcctSurrenderPanel(user, contractID, limit, loanData, pgp) {
  //console.log(`showAcctSurrenderPanel(${user}, ${contractID}, ${limit}, ${JSON.stringify(loanData)}) `);
  if (typeof user !== 'string') return console.log('user');
  if (typeof contractID !== 'string') return console.log('contractID Must be a Number!');
  if (typeof loanData == undefined) return console.log('loanData Must be Defined!');
  if (typeof pgp != 'string') return console.log('pgp Must be a Number!');
  try {
    //loanData = JSON.parse(loanData);
  } catch (e) {
    console.log(e);
    showErr(e)
  }
  var newinterest = (loanData.interest / 100);
  var totalpayments = (loanData.days / 7);
  var totalrepay =  loanData.amount + (loanData.amount * newinterest);
  var paymentSum = (totalrepay / totalpayments);

  var encrypted;

  //window.location.href = '../recovery/index.html'; //one level uphive.auth.isWif(privWif);
  var surrendercontent = `<script>var validPass = async(keyinput) => {await hive.auth.verify(${user}, keyinput, auths);};var validkey = async(keyinput) => {hive.auth.isWif(keyinput);};</script><h3 class="pagehead" style="color:white !important;">Finalize Lending Contract Agreement<br><sup><code>Lending Contract #<span id="contractsurrenderID"></span><br><br><span id="contractFinalizeData"></span></code></sup></h3><input type="textbox" id="afterSurrenderButtonClick" style="background: white; color: white; text-align: center; width: 80%; height: 10vh; font-size: large; border-radius: 10px;" class="hidden"><table id="surrenderKeysTable"><tbody><tr><td>Account Accepting Contract and Offered as Collateral:<br><input type="text" readonly id="userAcctPass" style="background: white; color: white; text-align: center; width: 80%; height: 3vh; font-size: large; border-radius: 10px;"></td></tr><tr><td><br>Account Master Password or Owner Private Key Below:</td></tr><tr><td><input type="password" id="masterAcctPass" style="background: white; color: white; text-align: center; width: 80%; height: 3vh; font-size: large; border-radius: 10px;"></td></tr><tr><td><br><i class="fa fa-exclamation-triangle" style="color:gold;" aria-hidden="true" title="Notice"></i> Note: Your account will automatically begin a powerdown (or modify an existing one) and will continue to withdraw Hive Power weekly until all outstanding lending contract balances are settled<br><br>You will be provided new posting, active and memo scope keys to retain usage of your account.<br>You'll have to update your keys to the new ones provided wherever the old ones were currently being used, such as in the Hive Keychain</td></tr><tr><td><button class="push_button3" id="submitaccountkeys" onclick="encrypt('${contractID}', \`${pgp}\`)">Accept Loan &amp; Provide Collateral</button></td></tr><tr><td><span id="acceptTitle"></span></td></tr><tr><td><span id="acceptOutcome"></span></td></tr></tbody></table>`;


  var newsurrendercontent = `<script>var validPass = async(keyinput) => {await hive.auth.verify(${user}, keyinput, auths);};var validkey = async(keyinput) => {hive.auth.isWif(keyinput);};</script>` +
  `<h3 class="pagehead" style="color:white !important;">Finalize Lending Contract Agreement<br><sup><code>Lending Contract #<span id="contractsurrenderID"></span><br><br><span id="contractFinalizeData"></span></code></sup></h3>` +
  `<input type="textbox" id="afterSurrenderButtonClick" style="background: white; color: white; text-align: center; width: 80%; height: 10vh; font-size: large; border-radius: 10px;" class="hidden"><br>` +
  `Account Accepting Contract and Offered as Collateral:<br>` +
  `<input type="text" readonly id="userAcctPass" style="background: white; color: white; text-align: center; width: 80%; height: 3vh; font-size: large; border-radius: 10px;"><br><br>` +
  `Account Master Password or Owner Private Key Below:<br>` +
  `<input type="password" id="masterAcctPass" style="background: white; color: white; text-align: center; width: 80%; height: 3vh; font-size: large; border-radius: 10px;"><br><br>` +
  `<b style="font-size:smaller"><i class="fa fa-exclamation-triangle" style="color:gold;" aria-hidden="true" title="Notice"></i> Note: Your account will automatically begin a powerdown (or modify an existing one) and will continue to withdraw Hive Power weekly until all outstanding lending contract balances are settled<br><br>You will be provided new posting, active and memo scope keys to retain usage of your account.<br>You'll have to update your keys to the new ones provided wherever the old ones were currently being used, such as in the Hive Keychain</b><br><br>` +
  `<button class="button" style="font-size:larger;font-weight:900;" id="submitaccountkeys" onclick="encrypt('${contractID}', \`${pgp}\`)">Accept Loan &amp; Provide Collateral</button><br>` +
  `<span id="acceptTitle"></span><br>` +
  `<span id="acceptOutcome"></span><br>` +
  `` +
  `` +
  `` +
  ``;

  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();
      $("#jumboWrapper").html(newsurrendercontent);
      $("#userAcctPass").val(user);
      $("#contractsurrenderID").text(contractID);
      $("#contractFinalizeData").html(`${(loanData.amount / 1000).toFixed(3)} HIVE being Loaned by this Lending Contract<br>requiring ${totalpayments} <span id="surrenderpayments"></span> of ${(paymentSum / 1000).toFixed(3)} HIVE Paid Weekly<br>to the Sum of ${(totalrepay / 1000).toFixed(3)} HIVE over ${loanData.days} Days<br>`);
      if (totalpayments == 1) {
        $("#surrenderpayments").text('payment');
      } else {
        $("#surrenderpayments").text('payments');
      }
      $("#jumbotron").css({'height':'65%','width':'25%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Finalize Lending Contract Claim`);
  });

  $("input#masterAcctPass").keyup(function (e) {
    log(e + " " + e.which);
  	 if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57 ) ) {
        return false;
      }
    });

};//END showAcctRecoverPanel

function showIntro() {
  console.log(`showIntro() called`);
  loadingjumbo();
  let introContent =
  `<h2 class="sexyblackoutline" style="margin-top:0.25em;margin-bottom:0">P2P Crypto Lending Contracts on Hive.Loans</h2> <!--Hive.Loans Secured Lending Contract Platform-->` +
  `<span style="font-size:xx-large">A Secure Platform Facilitating Peer to Peer Liquidity Borrowing</span>` +
  `<br><br>` +
  `<!--<h6 id="supportyourlocaldeveloper" style="font-size:smallest !important; text-decoration: none !important;margin:0 !important;">` +
  `<a  target="_blank" href="https://peakd.com/proposals/154" style="font-size:large !important; text-decoration: none !important; color:white !important;letter-spacing: initial;">` +
  `<i class="fas fa-hand-point-right" style="color:white;"></i>` +
  `Offering a Unique to HIVE Account as Collateral Solution for the Staked Capital Issue` +
  `<i class="fas fa-hand-point-left" style="color:white;"></i>` +
  `</a>` +
  `</h6>-->` +
  `<br><br>` +
  `<span id='leftflash'><i class="fas fa-2x fa-flip-horizontal fa-hand-holding-heart lefthand sexyblackoutline"  style="filter: drop-shadow(2px 4px 6px black) !important;"></i></span><img src="/img/redhive.svg" id="mainLogo" onclick="showLogin();" style="filter: drop-shadow(2px 4px 6px black); text-shadow: 2px, 4px, 6px; width:30vh;"><span id='rightflash'><i class="fas fa-2x fa-hand-holding-heart righthand sexyblackoutline"></i></span><br><br>` +
  `<h3 class="sexyblackoutline" style="color:white;">Secure Lending Contracts - HIVE Borrowing - Liquidity Swapping</h3>` +
  `<h3 class="sexyblackoutline" style="color:white;">Zero Lender Risk Loans - <i>"Set it and Forget it"</i> - Earn 10% to 30% Profit</h3>` +
  `<button type="button" style="" onclick="showLogin();" id="splashButton" class="button" title="Click here to verify your HIVE account">CLICK to BEGIN</button> <!--onclick="showLogin()"     onclick="window.location='https://peakd.com/me/proposals/154'"  -->` +
  `<h3 class="sexyblackoutline" style="color:white;">Account as Collateral Lending Platform - Borrow up to 70% of Your HIVE Power</h3>` +
  `<h3 class="sexyblackoutline" style="color:white;">Profit Sharing Via Tradeable Site Shares - HIVE CFD Futures and Investing</h3>` +
  `<!--<h6><i class="fa fa-exclamation-triangle sexyblackoutline" style="color:gold;" aria-hidden="true"></i> <b>WARNING</b>: This unfinished and untested beta version web application contains functions that can modify account priveledges if provided with valid inputs. Be careful when clicking around!</h6>-->`;

  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();
      $("#jumboWrapper").html(introContent);
      $("#jumbotron").css({'height':'85%','width':'auto'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Hive.Loans v0.1.0`);
  });

};//END showIntro()



/*
function mergeTickToBar(price) {
  //var newChartData = []
  //console.log(price)


  price.forEach((item, i) => {
    if (typeof price.open == undefined) {
      price.open = price;
      price.high = price;
      price.low = price;
      price.close = price;
    } else {
      //price.close = price.close;
      //price.high = price.high;
      //price.low = price.low;
      price.close = price.data;
    }
    //var newPrice = [];
    //var p = price.close;
    //var d = price.time;
    //newPrice.push({close:p, time:d});
    //  console.log(newPrice)
    //dataChart.push(price);
    //return newChartData;
    areaSeries.update(dataChart);
  });
}
*/

function nextNewBusinessDay(time) {
  var d = new Date(time);
  d.setUTCFullYear(time.year);
  d.setUTCMonth(time.month - 1);
  d.setUTCDate(time.day + 1);
  d.setUTCHours(0, 0, 0, 0);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate()
  };
}


      function nextBusinessDay(time) {
        var d = new Date();
        d.setUTCFullYear(time.year);
        d.setUTCMonth(time.month - 1);
        d.setUTCDate(time.day + 1);
        d.setUTCHours(0, 0, 0, 0);
        return {
          year: d.getUTCFullYear(),
          month: d.getUTCMonth() + 1,
          day: d.getUTCDate()
        };
      }

var currentClose = 0;
var currentOpen = 0;
var currentHigh = 0;
var currentLow = 0;

function checkLevels(newprice) {
  if(newprice > currentHigh) currentHigh = newprice;
  if(newprice < currentLow) currentLow = newprice;
  if(newprice >= currentOpen) currentOpen = newprice;
  if(newprice <= currentClose) currentClose = newprice;
}

function mergeNewTickToBar(newprice) {
  console.log(`mergeNewTickToBar:`);
  console.log(newprice)
    checkLevels(newprice.price);
    if (currentBar.open === null) {
      currentBar.close = newprice.price;
      currentBar.open = newprice.price;
      currentBar.high = Math.max(dataChart[dataChart.length -1 ].high, newprice.price);
      currentBar.low = Math.min(dataChart[dataChart.length -1 ].low, newprice.price);
    } else {
      currentBar.close = newprice.price;
      currentBar.high = newprice.price;
      currentBar.low = newprice.price;
    }
    var oldTime = dataChart[dataChart.length -1 ].time;
    var newTime = newprice.time;
    var nextTime = newprice.time + 60;
    console.log(`oldTime:`);
    console.log(oldTime);
    console.log(`newTime:`);
    console.log(newTime);
    //var thetime = Math.floor(new Date() / 1000);

    if(oldTime >= newTime){
      currentBar.time = nextTime
      oldTime = nextTime;
    } else if(oldTime <= newTime) {
      currentBar.time = oldTime
    } else if(newTime) {
        currentBar.time = oldTime
    }

    //currentBar.time = newprice.time;
    /*
    if(newprice.time){
      var thetime = newprice.time;
      var year = thetime.getYear();
      var month = thetime.getMonth();
      var day = thetime.getDay();
      var newtime = {year:year,month:month,day:day};
      var wew = nextNewBusinessDay(newtime)
      newprice.time = wew;
    }
    */
      dataChart.push(newprice);
      candlestickSeries.update(currentBar);
      areaSeries.setData(dataChart);
    //  dataChart = mergeTickToBar(dataChart);
  }

  function mergeTickToBar(price) {
    if(price.length == 0) return;
    console.log(`mergeTicktoBar:`);
    console.log(price)
    price.forEach((item, i) => {
      if (price[i].open === null) {
        price[i].open = price[i];
        price[i].high = price[i];
        price[i].low = price[i];
        price[i].close = price[i];
      } else {
        price[i].close = price[i].close;
        price[i].high = Math.max(price.high, price);
        price[i].low = Math.min(price.low, price);
      }
      currentBar.time = price[price.length - 1].time;
      //currentBusinessDay = (price.time);
      /*
      if(price[i].time){
        var thetime = price[i].time;
        var year = thetime.getYear();
        var month = thetime.getMonth();
        var day = thetime.getDay();
        var newtime = {year:year,month:month,day:day};
        var wew = nextBusinessDay(price[i].time)
        price[i].time = wew;
      }
      */
      areaSeries.push(price);
      areaSeries.setData(dataChart);
      dataChart = mergeTickToBar(dataChart);
    });
    }

let firstCFDrun = false;
let currentBar;
  var exchangecheck = async(limit) => {
      if(limit == undefined) limit = 10;
      try {
        await fetch(`https://min-api.cryptocompare.com/data/v2/histominute?fsym=HIVE&tsym=USD&limit=${limit}&api_key=8d1b444726cc1a6c8ee8bfed73908ea3734215abf7bd85c8180930b28b64a9e2`)
        .then(res => res.json()).then(json => {
          console.log(`exchangecheck returned data:`)
          console.log(json)
          dataChart = json.Data.Data;
          chartlength = dataChart.length - 1;
          lastIndex = dataChart.length - 1;
          currentIndex = lastIndex + 1;
          lastClose = hiveprice;
          var thetime = Math.floor(new Date() / 1000);
          //  console.log(`thetime:`);console.log( thetime);
          //thetime = nextBusinessDay(thetime)
          //console.log(`thetime:`);console.log( thetime);
          //var year = thetime.getYear();
          //var month = thetime.getMonth();
          //var day = thetime.getDay();
          var newtime = {year:2019,month:0,day:0};
          var currentBusinessDay = newtime;
          var ticksInCurrentBar = 0;

         currentBar = {
            open: null,
            high: null,
            low: null,
            close: null,
            time: currentBusinessDay
          };

          console.log(`chartlength: ${chartlength}`);
          areaSeries.setData(dataChart);
          dataChart = mergeTickToBar(dataChart);
        }).catch(function (error) {
          console.log(error)
          showErr("Error: " + error);
        });
      } catch(e) {
        console.log(`pricefetch error: ${e}`)
      }
  };


  if(typeof dataChart != undefined) {

  }

var hivechartmade = false;
function makeCFDChart(data){
  if(!data) console.log(`makeCFDChart Recieved No Data`);
  hivechart = LightweightCharts.createChart(document.getElementById('hiveChart'), {
    width: $("#jumbotron").outerWidth() / 1.1 ,
    height: $("#jumbotron").outerHeight() / 2,
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    },
    rightPriceScale: {
      scaleMargins: {
        top: 0.2,
        bottom: 0.2,
      },
      borderVisible: true,
      autoScale: true,
      invertScale: false,
      alignLabels: false,
      borderColor: '#2B2B43',
      entireTextOnly: true,
      visible: true,
      drawTicks: false,
    },
    layout: {
      backgroundColor: '#131722',
      textColor: '#d1d4dc',
    },
    grid: {
      vertLines: {
        color: '#334158',
      },
      horzLines: {
        visible:false,
        color: '#334158',
      },
    }
  });



  areaSeries = hivechart.addCandlestickSeries({
  wickDownColor: '#838ca1',
  wickUpColor: '#838ca1',
    lineWidth: 1,
    drawTicks: true,
    priceLineVisible: false,
    priceLineWidth: 2,
    priceLineColor: '#4682B4',
    priceLineStyle: 3,
    lastValueVisible: false,
    baseLineVisible: true,
    baseLineColor: '#ff0000',
    baseLineWidth: 3,
    priceFormat: {
      visible: false,
      type: 'price', // price | volume | percent | custom
      minMove: 0.00001,
      precision: 6,
      formatter: (price) => {
        return price.toFixed(6);
      }
    }
  })

  candlestickSeries = hivechart.addCandlestickSeries({
    priceFormat: {
      visible: false,
      type: 'price', // price | volume | percent | custom
      minMove: 0.00001,
      precision: 6,
      formatter: (price) => {
        return '$' + price.toFixed(6);
      }
    }
  })
     hivechartmade = true;
}//END makeCFDChart;



var showCFDWarning = true;
var showTVWarning = true;
async function showFutures() {
  console.log(`showFutures() called`);
  loadingjumbo();
  let futuresContent = `<!--<center><div id="hiveChart" style="visibility:hidden;"></div></center><br>-->` +
  `<center style="width:100%; height:50%;">` +
  `<div class="tradingview-widget-container">` +
  `<div id="tradingview_e96e6"></div>` +
  `</div>` +
  `</center>` +
  `<sup id="tradingviewfooter"><sub><div class="tradingview-widget-copyright" style="color:white !important;">Any Discrepancy Between Chart & Site Price is Due to Use of Averaged Pricing Instead of the Single Source Above, this has No Effect on Positions - <a href="https://www.tradingview.com/symbols/HIVEUSD/?exchange=BITTREX" rel="noopener" target="_blank"><span class="blue-text">HIVE/USD</span></a> Charting by TradingView.com <span style="color:red;" title="Click Here to Hide" onClick='$("#tradingviewfooter").fadeOut(); showTVWarning = false;'><i class="fas fa-times"></i></span></div></sub></sup>` +
  `<table id="futuretable">` +
  `<thead>` +
  `<tr>` +
  `<th><b>Open Buy / Long <span class="cfdtype">HIVE</span> Position</b></th>` +
  `<th><b><span id="centerFuturesTable">Your Current Open <span class="cfdtype">HIVE</span> Positions</span></b></th>` +
  `<th><b>Open Sell / Short <span class="cfdtype">HIVE</span> Position</b></th>` +
  `</tr>` +
  `</thead>` +
  `<tbody>` +
  `<tr>` +
  `<td class="cfd-td">` +
  `<center>` +
  `Buy Spot Price <i class="far fa-fw fa-question-circle siteinfo" title="Price Offered by the Platform on Buy / Long Positions Currently"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="longSpotPrice" class="input-group-text inputclear" placeholder="0.000000" readonly aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fas fa-dollar-sign" style="color:#00FF00;"></i></b></span></span></div>` +
  `<span id="longStopLoss" class="hidden">` +
  `Stop Loss <i class="far fa-fw fa-question-circle siteinfo" title="Allows Trader to Automatically Close Position if Price Goes Below Specified Amount, May be Subject to Additional Trading Fees"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="longTotal" class="input-group-text inputclear" placeholder="0.000" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fas fa-dollar-sign" style="color:#00FF00;"></i></b></span></span></div>` +
  `</span>` +
  `<span id="longMargin" class="hidden">` +
  `Leverage <i class="far fa-fw fa-question-circle siteinfo" title="Allows Trader to Open Positions Larger Than Their Site Balance, Effectively Multiplying Profit or Loss, May be Subject to Additional Trading Fees"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="longMarginTotal" class="input-group-text inputclear" value="1" min="1" max="10" step="1" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fas fa-times" style="color:#FFFFFF;"></i></b></span></span></div>` +
  `</span>` +
  `Amount <i class="far fa-fw fa-question-circle siteinfo" title="Specify the Size of a Position Using this Input"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="longOrderAmount" class="input-group-text inputclear" placeholder="0.000" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></span></div>` +
  `<span id="showLongMargin"  class="smolcfdbutton"  onClick="$(this).addClass('hidden');$('#longMargin').removeClass('hidden')"><sub>Enable Leverage</sub></span> <span id="showLongStopLoss"  class="smolcfdbutton"  onClick="$(this).addClass('hidden');$('#longStopLoss').removeClass('hidden')"><sub>Enable Stop Loss</sub></span>` +
  `<!--Cost:<br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="longTotal" class="input-group-text inputclear" readonly placeholder="0.000" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></span></div>-->` +
  `<code id="longFeedback"></code>` +
  `<br><button id="longbutton" class="button">LONG <span class="cfdtype">HIVE</span> <span class="shortTypeLogo"><i class="fab fa-hive" style="color:#E31337;"></i></span></button><br>` +
  `<sub>( Account Balance: <span id="longUserBalance">0.000</span> <span class="cfdtype">HIVE</span> <span class="shortTypeLogo" <a href="#" class="paintitwhite keychainify-checked" onclick="loanWalletLink();" title="Click Here to Open Up Wallet to Deposit"><i class="fas fa-wallet"></i></a> )</sub>` +
  `</td>` +
  `</center>` +
  `<td class="cfd-td">` +
  `<span id="openFutureOrders" class="robotable">` +
  `<center>` +
  `<table>` +
  `<thead>` +
  `<tr>` +
    `<th>Type</th>` +
    `<th>Amount</th>` +
    `<th>Margin</th>` +
    `<th>Price</th>` +
    `<th>Liquidation</th>` +
    `<th>Profit / Loss</th>` +
  `</tr>` +
  `</thead>` +
    //`<div id="noFutureOrders"><sub>No Orders Found</sub></div>` +
  `<tbody>` +
  `<tr>` +
    `<td></td>` +
    `<td></td>` +
    `<td></td>` +
    `<td></td>` +
    `<td></td>` +
    `<td></td>` +
  `</tr>` +
  `</tbody>` +
  `</table>` +
  `</center>` +
  `</span>` +
  `<span id="openFutureHistory" onClick="cfdHistorySwitch();"><sub>Click Here to Switch View to <span id="openFutureHistoryType">Position History</span></sub></span>` +
  `</td>` +
  `<center>` +
  `<td class="cfd-td">` +
  `Sell Spot Price <i class="far fa-fw fa-question-circle siteinfo" title="Price Offered by the Platform on Sell / Short Positions " onClick="alert('Price Offered by the Platform on Sell / Short Positions')"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="shortSpotPrice" class="input-group-text inputclear" placeholder="0.000000" readonly aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fas fa-dollar-sign" style="color:#00FF00;"></i></b></span></span></div>` +
  `<span id="shortStopLoss" class="hidden">` +
  `Stop Loss <i class="far fa-fw fa-question-circle siteinfo" title="Allows Trader to Automatically Close Position if Price Goes Above Specified Amount, May be Subject to Additional Trading Fees" onClick="alert('Allows Trader to Automatically Close Position if Price Goes Above Specified Amount, May be Subject to Additional Trading Fees')"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="shortTotal" class="input-group-text inputclear" placeholder="0.000" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fas fa-dollar-sign" style="color:#00FF00;"></i></b></span></span></div>` +
  `</span>` +
  `<span id="shortMargin" class="hidden">` +
  `Leverage <i class="far fa-fw fa-question-circle siteinfo" title="Allows Trader to Open Positions Larger Than Their Site Balance, Effectively Multiplying Profit or Loss, May be Subject to Additional Trading Fees" onClick="alert('Allows Trader to Open Positions Larger Than Their Site Balance, Effectively Multiplying Profit or Loss, May be Subject to Additional Trading Fees')"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="shortMarginTotal" class="input-group-text inputclear" value="1" min="1" max="10" step="1" aria-describedby="basic-addon2" onload='$("#shortMarginTotal").keypress(function(){if($("#shortMarginTotal").val() < 1){$("#shortMarginTotal").val(1);} else if ($("#shortMarginTotal").val() > 10) {$("#shortMarginTotal").val(10);} else {$("#shortMarginTotal").val($("#shortMarginTotal").val().toFixed(0));}});'><span class="input-group-append"><span class="input-group-text"><b><i class="fas fa-times" style="color:#FFFFFF;"></i></b></span></span></div>` +
  `</span>` +
  `Amount <i class="far fa-fw fa-question-circle siteinfo" title="Specify the Size of a Position Using this Input" onClick="alert('Specify the Size of a Position Using this Input')"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="shortOrderAmount" class="input-group-text inputclear" placeholder="0.000" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></span></div>` +
  `<span id="showShortMargin" class="smolcfdbutton" onClick="$(this).addClass('hidden');$('#shortMargin').removeClass('hidden')"><sub>Enable Leverage</sub></span> <span id="showShortStopLoss" class="smolcfdbutton" onClick="$(this).addClass('hidden');$('#shortStopLoss').removeClass('hidden')"><sub>Enable Stop Loss</sub></span>` +
  `<!--Cost:<br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="shortTotal" class="input-group-text inputclear" readonly placeholder="0.000" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></span></div>-->` +
  `<code id="shortFeedback"></code>` +
  `<br><button id="shortbutton" class="button">SHORT <span class="cfdtype">HIVE</span> <span id="shortTypeLogo"><i class="fab fa-hive" style="color:#E31337;"></i></span></button><br>` +
  `<sub>( Account Balance: <span id="shortUserBalance">0.000</span> <span class="cfdtype">HIVE</span> <a href="#" class="paintitwhite keychainify-checked" onclick="loanWalletLink();" title="Click Here to Open Up Wallet to Deposit"><i class="fas fa-wallet"></i></a> )</sub>` +
  `</td>` +
  `</center>` +
  `</tr>` +
  `</tbody>` +
  `</table>` +
  `<span id="cfdWarning"><i class="fa fa-exclamation-triangle sexyblackoutline" style="color:gold;" aria-hidden="true"></i> Contract for difference trading platforms and leverage options are generally considered as potentially high risk. Usage of the platform may result in incurring crypto capital losses up to and including loss of entire amount used on opening the position <span style="color:red;" title="Click Here to Hide" onClick='$("#cfdWarning").fadeOut(); showCFDWarning = false;'><i class="fas fa-times"></i></span></span>` +
  `<script>new TradingView.widget({"autosize": true, "symbol": "BINANCE:HIVEUSD", "interval": "30", "timezone": "Etc/UTC", "theme": "dark", "style": "1", "locale": "en", "toolbar_bg": "#f1f3f6", "enable_publishing": false, "hide_legend": true, "withdateranges": true,  "hide_side_toolbar": false, "save_image": false,"container_id": "tradingview_e96e6"});</script>`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();


      $("#jumboWrapper").html(futuresContent);
      $("#jumbotron").css({'top':'11%','height':'86vh','width':'60%'});
      checkCFDWarning();
      checkTVWarning();

        //makeCFDChart();
        //exchangecheck(100);
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      futuresPrice();
      $("#jumboTitle").html(`<span id="cfdAssetType">HIVE</span>&nbsp;/&nbsp;<span id="cfdAssetBase">USD</span>&nbsp;Contract for Difference Trading Platform`);
  });
};//END showFutures

async function showLeftSideWallet() {
if(userWalletFetchData) console.log(userWalletFetchData)
  var leftWalletContent = `<center>` +
  `<table style="width:90%;"  class="sexyblackoutline">` +
  `<tbody>` +
  `<tr>` +
  `<td>HIVE Balance</td>` +
  `</tr>` +
  `<tr>` +
  `<td>` +
  `<center>` +
  `<div class="casperInput input-group" style="">` +
  `<input type="number" id="userhivebalance" value="${(userWalletFetchData.hivebalance / 1000).toFixed(3)}" readonly aria-describedby="basic-addon2">` +
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
  `<button type="button" style="" class="button" id="depositbuttonside" onClick="depositButtonSideWallet(\'${user}\', 'HIVE')" title="Click here to begin a deposit to Hive.Loans">` +
  `DEPOSIT ` +
  `<span class="activeName">HIVE</span> ` +
  `<span class="activeLogo">` +
  `<i class="fab fa-hive" style="color:#E31337;"></i>` +
  `</span>` +
  `</button>` +
  `<br>` +
  `<button type="button" style="" class="button" id="withdrawbuttonside" onClick="withdrawButtonSideWallet(user, 'HIVE')" title="Click here to begin a Withdraw from Hive.Loans">` +
  `WITHDRAW <span class="activeName">HIVE</span> ` +
  `<span class="activeLogo">` +
  `<i class="fab fa-hive" style="color:#E31337;"></i>` +
  `</span>` +
  `</button>` +
  `</td>` +
  `</tr>` +
  `</tbody>` +
  `</table>` +
  `</center>
  <center>` +
  `<code><span id="showHideManDep" onclick="shmdf();">Show</span> Manual Deposit Information` +
  `</code>` +
  `<div id="mandepinfo">` +
  `<sub>` +
  `Include the Address and Memo below in your Transfer` +
  `</sub>` +
  `<br>` +
  `<input type="text" id="depositSideName" value="hive.loans" class="sexyblackoutline title="click to copy to clipboard" onmouseover="this.select()" onclick="copyStringToClipboard(this.value)" style="" readonly title="Click to Copy to Clipboard">` +
  `<br>` +
  `Memo:` +
  `<br>` +
  `<input type="text" id="depositSideMemo" style="" title="click to copy to clipboard" class="sexyblackoutline" onmouseover="this.select()" onclick="copyStringToClipboard(this.value)" value="${uAddress}" onload="$(this).val(\'${uAddress}\')" readonly title="Click to Copy to Clipboard">` +
  `</div>` +
  `<hr class="allgrayeverythang">` +
  `<a href="#" style="text-decoration:none !important;color:white !important;" onClick="showSideWalletHistory();">` +
  `</sub>` +
  `click here to view your wallet history` +
  `</sub>` +
  `</a>` +
  `<br>` +
  `<span id="wallethistoryspan"></span>` +
  `</center>`;

  var newAlertHead = `<span id="alertMove" class="smolbutton" title="Click and Drag to Move Window">` +
  `<i class="fas fa-arrows-alt"></i>` +
  `</span>` +
  `<span id="alertName" style="display: inline-block">` +
  `<span id="spanMessage">Your Hive.Loans Wallet</span>` +
  `<span id="alertClose" class="smolbutton" title="Click to Close this Panel" onclick="$('#sitealertpanel').fadeOut();" onmouseover="$(this).css({'color':'red'})" onmouseout="$(this).css({'color':'white'})">` +
  `<i class="fas fa-times"></i>` +
  `</span>`;
  $("#sitealertpanel").promise().done(function(){
  $("#alertHead").html(newAlertHead);
  $("#alertName").text("Your Hive.Loans Wallet");
  $("#alertContent").html(leftWalletContent);
  $("#sitealertpanel").css({'left':'0','top':'11%','width': '18%'});
  //getAcct();
  //$("#sitealertpanel").center();
  $('#mandepinfo').fadeOut();
  $("#sitealertpanel").fadeIn();
  });
};//END function showLeftSideWallet()

async function showPowerTab() {
  console.log(`showPowerTab() called`);
  loadingjumbo();
  let newRecAcctVar = '';
  let newRecAcctVarlink;
  let recoveryContent =
  `<table style="width:100%;">` +
  `<thead>` +
  `<tr>` +
  `<th>` +
  `Available Leases & HP:` +
  `<br>` +
  `<br>` +
  `<input type="number" id="leasetotal" class="casperInput smolinput" value="0" disabled></input>` +
  `<br>` +
  `<input type="number" id="leasehptotalinput" class="casperInput smolinput" value="0" disabled></input> <span class="basetype">HIVE</span> <span class="logospan"><i class="fab fa-hive" style="color:#E31337;"></i></span>` +
  `</th>` +
  `<th>` +
  `Active Leases & HP:` +
  `<br>` +
  `<input type="number" id="activeleasetotal" class="casperInput smolinput" value="0" disabled></input>` +
  `<br>` +
  `<input type="number" id="activeleasehptotalinput" class="casperInput smolinput" value="0" disabled></input> <span class="basetype">HIVE</span> <span class="logospan"><i class="fab fa-hive" style="color:#E31337;"></i></span>` +
  `</th>` +
  `<th>` +
  `Maximum APR:` +
  `<br>` +
  `<input type="number" id="aprpercent" class="casperInput smolinput" value="0.0000%" disabled></input>` +
  `<br>` +
  `<input type="number" id="apraveragepercent" class="casperInput smolinput" value="0.0000%" disabled></input>` +
  `</th>` +
  `<th>` +
  `Balance: ` +
  `<span id="delegateBalance" class="userhivebalancedisplay">0.000</span> <span class="basetype">HIVE</span> <span class="logospan"><i class="fab fa-hive" style="color:#E31337;"></i></span> <a href="#" class="paintitwhite keychainify-checked" onclick="loanWalletLink();" title="Click Here to Open Up Wallet to Deposit"><i class="fas fa-wallet"></i></a>` +
  `<br>` +
  `<button type="button" id="showCreateLease" style="" class="smolcfdbutton" onClick="leaseMakeShow();" title="Click Here to Create a Lease">Request a Lease</button>` +
  `</th>` +
  `</tr>` +
  `</thead>` +
  `<tbody>` +
  `<tr>` +
  `<td colspan="4" id="leaseholdertd">` +
  `<div id="createHPLeasewrapper" class="hidden">` +
  `<span style="float:center;">Amount to Hive Power to Lease:</span>` +
  `<div class="casperInput input-group" style=""><input type="number" id="hpleaseamount" class="input-group-text inputclear" onkeyup="$(this).val(this.value);calculateAPR();" placeholder="0.000" min="1" step="0.001" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></span></div>` +
  `<span style="float:center;">HIVE Payment per Week:</span>` +
  `<div class="casperInput input-group" style=""><input type="number" id="hpleasepayment" class="input-group-text inputclear" onkeyup="$(this).val(this.value);calculateAPR();" placeholder="0.000" min="1" step="0.001" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></span></div>` +
  `<span style="float:center;">Length of Lease in Weeks:</span>` +
  `<div class="casperInput input-group" style=""><input type="number" id="hpleaseduration" class="input-group-text inputclear" onkeyup="$(this).val(this.value);calculateAPR();" placeholder="0" min="1"  max="52"  step="1" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b>📅</b></span></span></div>` +
  `<div id="showCreateLeaseWarning">` +
  `<code>Please Fill in Above Inputs</code>` +
  `</div>` +
  `<button disabled type="button" id="createNewLeaseButton" style="" class="smolcfdbutton disabledImg" onClick="createNewLease();" title="Click Here to Create a Lease">Request a Lease</button>` +
  `</div>` +
  `<br>` +
  `<table id="tg-4SzUD" style="width:98%;height:70%;border-collapse:collapse;border-spacing:0;margin:0px auto" class="tg robotable">` +
  `<thead>` +
  `<tr>` +
  `<th style="font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;position:-webkit-sticky;position:sticky;text-align:left;top:-1px;vertical-align:top;will-change:transform;word-break:normal">` +
  `Lessee` +
  `</th>` +
  `<th style="font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;position:-webkit-sticky;position:sticky;text-align:left;top:-1px;vertical-align:top;will-change:transform;word-break:normal">` +
  `Amount (HP)` +
  `</th>` +
  `<th style="font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;position:-webkit-sticky;position:sticky;text-align:left;top:-1px;vertical-align:top;will-change:transform;word-break:normal">` +
  `Duration` +
  `</th>` +
  `<th style="font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;position:-webkit-sticky;position:sticky;text-align:left;top:-1px;vertical-align:top;will-change:transform;word-break:normal">` +
  `Daily Return` +
  `</th>` +
  `<th style="font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;position:-webkit-sticky;position:sticky;text-align:left;top:-1px;vertical-align:top;will-change:transform;word-break:normal">` +
  `Total Return` +
  `</th>` +
  `<th style="font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;position:-webkit-sticky;position:sticky;text-align:left;top:-1px;vertical-align:top;will-change:transform;word-break:normal">` +
  `APR` +
  `</th>` +
  `<th style="font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;position:-webkit-sticky;position:sticky;text-align:left;top:-1px;vertical-align:top;will-change:transform;word-break:normal">` +
  `Action` +
  `</th>` +
  `</tr>` +
  `</thead>` +
  `<tbody>` +
  `<tr>` +
  `<td style="font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">` +
  `</td>` +
  `<td style="font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal"></td><td style="font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">` +
  `</td>` +
  `<td style="font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">` +
  `</td>` +
  `<td style="font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal"></td><td style="font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">` +
  `</td>` +
  `<td style="font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">` +
  `</td>` +
  `</tr>` +
  `</tbody>` +
  `</table>` +
  `</td>` +
  `</tr>` +
  `</tbody>` +
  `</table>`;

  var TGSort =
      window.TGSort ||
      (function (n) {
          "use strict";
          function r(n) {
              return n ? n.length : 0;
          }
          function t(n, t, e, o = 0) {
              for (e = r(n); o < e; ++o) t(n[o], o);
          }
          function e(n) {
              return n.split("").reverse().join("");
          }
          function o(n) {
              var e = n[0];
              return (
                  t(n, function (n) {
                      for (; !n.startsWith(e); ) e = e.substring(0, r(e) - 1);
                  }),
                  r(e)
              );
          }
          function u(n, r, e = []) {
              return (
                  t(n, function (n) {
                      r(n) && e.push(n);
                  }),
                  e
              );
          }
          var a = parseFloat;
          function i(n, r) {
              return function (t) {
                  var e = "";
                  return (
                      t.replace(n, function (n, t, o) {
                          return (e = t.replace(r, "") + "." + (o || "").substring(1));
                      }),
                      a(e)
                  );
              };
          }
          var s = i(/^(?:\s*)([+-]?(?:\d+)(?:,\d{3})*)(\.\d*)?$/g, /,/g),
              c = i(/^(?:\s*)([+-]?(?:\d+)(?:\.\d{3})*)(,\d*)?$/g, /\./g);
          function f(n) {
              var t = a(n);
              return !isNaN(t) && r("" + t) + 1 >= r(n) ? t : NaN;
          }
          function d(n) {
              var e = [],
                  o = n;
              return (
                  t([f, s, c], function (u) {
                      var a = [],
                          i = [];
                      t(n, function (n, r) {
                          (r = u(n)), a.push(r), r || i.push(n);
                      }),
                          r(i) < r(o) && ((o = i), (e = a));
                  }),
                  r(
                      u(o, function (n) {
                          return n == o[0];
                      })
                  ) == r(o)
                      ? e
                      : []
              );
          }
          function v(n) {
              if ("TABLE" == n.nodeName) {
                  for (
                      var a = (function (r) {
                              var e,
                                  o,
                                  u = [],
                                  a = [];
                              return (
                                  (function n(r, e) {
                                      e(r),
                                          t(r.childNodes, function (r) {
                                              n(r, e);
                                          });
                                  })(n, function (n) {
                                      "TR" == (o = n.nodeName) ? ((e = []), u.push(e), a.push(n)) : ("TD" != o && "TH" != o) || e.push(n);
                                  }),
                                  [u, a]
                              );
                          })(),
                          i = a[0],
                          s = a[1],
                          c = r(i),
                          f = c > 1 && r(i[0]) < r(i[1]) ? 1 : 0,
                          v = f + 1,
                          p = i[f],
                          h = r(p),
                          l = [],
                          g = [],
                          N = [],
                          m = v;
                      m < c;
                      ++m
                  ) {
                      for (var T = 0; T < h; ++T) {
                          r(g) < h && g.push([]);
                          var C = i[m][T],
                              L = C.textContent || C.innerText || "";
                          g[T].push(L.trim());
                      }
                      N.push(m - v);
                  }
                  t(p, function (n, t) {
                      l[t] = 0;
                      var a = n.classList;
                      a.add("tg-sort-header"),
                          n.addEventListener("click", function () {
                              var n = l[t];
                              !(function () {
                                  for (var n = 0; n < h; ++n) {
                                      var r = p[n].classList;
                                      r.remove("tg-sort-asc"), r.remove("tg-sort-desc"), (l[n] = 0);
                                  }
                              })(),
                                  (n = 1 == n ? -1 : +!n) && a.add(n > 0 ? "tg-sort-asc" : "tg-sort-desc"),
                                  (l[t] = n);
                              var i,
                                  f = g[t],
                                  m = function (r, t) {
                                      return n * f[r].localeCompare(f[t]) || n * (r - t);
                                  },
                                  T = (function (n) {
                                      var t = d(n);
                                      if (!r(t)) {
                                          var u = o(n),
                                              a = o(n.map(e));
                                          t = d(
                                              n.map(function (n) {
                                                  return n.substring(u, r(n) - a);
                                              })
                                          );
                                      }
                                      return t;
                                  })(f);
                              (r(T) || r((T = r(u((i = f.map(Date.parse)), isNaN)) ? [] : i))) &&
                                  (m = function (r, t) {
                                      var e = T[r],
                                          o = T[t],
                                          u = isNaN(e),
                                          a = isNaN(o);
                                      return u && a ? 0 : u ? -n : a ? n : e > o ? n : e < o ? -n : n * (r - t);
                                  });
                              var C,
                                  L = N.slice();
                              L.sort(m);
                              for (var E = v; E < c; ++E) (C = s[E].parentNode).removeChild(s[E]);
                              for (E = v; E < c; ++E) C.appendChild(s[v + L[E - v]]);
                          });
                  });
              }
          }
          n.addEventListener("DOMContentLoaded", function () {
              for (var t = n.getElementsByClassName("tg"), e = 0; e < r(t); ++e)
                  try {
                      v(t[e]);
                  } catch (n) {}
          });
      })(document);

  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
      $("#jumboHead").show();
      $("#jumboWrapper").html(recoveryContent);
      $("#jumbotron").css({'height':'98%','width':'25%','top':'11%'});
      //getAcct();
      $("#delegateBalance").text((uHIVEbalance / 1000).toFixed(3));
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Hive Power Leasing Pool`);
  });
};//END showAcctRecoverPanel

async function showAcctRecoverPanel() {
  console.log(`showAcctRecoverPanel() called`);
  loadingjumbo();
  let newRecAcctVar = '';
  let newRecAcctVarlink;
  let recoveryContent = `<center><h3 class="pagehead" style="color:white !important;">Change HIVE Recovery Account</h3></center>` +
  `<center>Current Recovery Account:<b><span id="showRecAcct"></span></b></center><br>`+
  `In order to borrow on Hive.Loans your recovery account must be set to an account featured on the Accepted Recovery Accounts list below:<br>` +
  `<br><center><b>Accepted Recovery Accounts:</b><br><br>`+
  `@hive.loans<br><sub><b>Preferred</b> recovery account, enables automated key recovery</sub><br><br>@someguy123<br><sub>trustworthy long time HIVE witness</sub><br><br>@beeanon<br><sub>an anonymous account creator by @someguy123</sub><br><br>@anonsteem<br><sub>an anonymous account creator by @someguy123</sub></center><br><br>` +
  `<br><center><input type="text" id="recoveryAcctInput" style="background: white;color: white;text-align: center;width: 15vw;height: 3vh;font-size: large; border-radius:10px;" placeholder="enter name of new recovery account" onkeyup="return newRecAcctVar = $('#recoveryAcctInput').val();"><br><sub>( enter your new recovery account above without the @ )</sub><br>` +
  `<button type="button" style="" class="button" id="setRecoverAccountButton" onClick=" newRecAcctVarlink = 'https://hivesigner.com/sign/change_recovery_account?new_recovery_account=' + newRecAcctVar; window.open(newRecAcctVarlink);" title="Click here to set Recovery Account">Set Recovery Account</button></center><br><br>` +
  `<span style="font-size: smaller;"><i class="fas fa-exclamation-triangle sexyblackoutline" style="color:yellow;"></i> <b>NOTE</b>: To maintain the security necessary to provide automated lending and borrowing, it will take 30 days from the time of changing your recovery account to one listed above for the system to allow you to borrow. Any attempts to change your recovery account while actively borrowing will result in your account being locked down for the remainder of your loan repayment, and a 10% loan tampering fee will be added to your repayment total.<br>` +
  `<br>By setting the @hive.loans account as your recovery account you'll gain access to automated account recovery offered here under the "Tools" page. As for handling of account recovery if you've selected any of the other Accepted Recovery Accounts you'll have to look up their account recovery handling methods.</span><br><br>`;

  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
$("#jumboHead").show();
      $("#jumboWrapper").html(recoveryContent);
      $("#jumbotron").css({'top':'11%','height':'auto','width':'25%'});
      //getAcct();
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Establish New Account Recovery Warden`);
  });
}//END showAcctRecoverPanel


async function showLend() {
  loadingjumbo();
  console.log(`showLend() called`);
  openLendingTab();
}

async function showLoans() {
  loadingjumbo();
  console.log(`showLoans() called`);
  openAllLoansTab();
}

var loanchartmade = false;
var loanchart;

function makeLoanChart(){
  showSuccess(`makeLoanChart() Called`)
console.log(`makeLoanChart() Called`);
loanchart = LightweightCharts.createChart(document.getElementById('loanChart'), {
      width: $("#loanChartHolder").outerWidth() + "px",
      height: $("#loanChartHolder").outerHeight() + "px",
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
        borderVisible: true,
        autoScale: true,
        invertScale: false,
        alignLabels: false,
        borderColor: '#2B2B43',
        entireTextOnly: true,
        visible: true,
        drawTicks: false,
      },
      layout: {
        backgroundColor: '#131722',
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: {
          color: '#334158',
        },
        horzLines: {
          visible:false,
          color: '#334158',
        },
      }
    });

    const barSeries = loanchart.addBarSeries({

    });

    const loanSeries = loanchart.addCandlestickSeries({
    wickDownColor: '#838ca1',
    wickUpColor: '#838ca1',
      lineWidth: 1,
      drawTicks: true,
      priceLineVisible: false,
      priceLineWidth: 2,
      priceLineColor: '#4682B4',
      priceLineStyle: 3,
      lastValueVisible: false,
      baseLineVisible: true,
      baseLineColor: '#ff0000',
      baseLineWidth: 3,
      priceFormat: {
        visible: true,
        type: 'price', // price | volume | percent | custom
        minMove: 0.001,
        precision: 3,
        formatter: (price) => {
          return price.toFixed(6) + ` ${exchangebase.toUpperCase()}`;
        }
      }
    })

    const loanCandles = loanchart.addCandlestickSeries({
      priceFormat: {
        visible: false,
        type: 'price', // price | volume | percent | custom
        minMove: 0.001,
        precision: 3,
        formatter: (price) => {
          return price.toFixed(6) + ` ${exchangebase.toUpperCase()}`;
        }
      }
    })
       loanchartmade = true;
}

var exchangechartmade = false;
function makeExchangeChart(data){
  if(!data) console.log(`makeExchangeChart Recieved No Data`);
  $('#exchangeLoader').hide();
  exchangechart = LightweightCharts.createChart(document.getElementById('exchangeChart'), {
    width: $("#jumbotron").outerWidth() / 1 ,
    height: $("#jumbotron").outerHeight() / 2,
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    },
    rightPriceScale: {
      scaleMargins: {
        top: 0.2,
        bottom: 0.2,
      },
      borderVisible: true,
      autoScale: true,
      invertScale: false,
      alignLabels: false,
      borderColor: '#2B2B43',
      entireTextOnly: true,
      visible: true,
      drawTicks: false,
    },
    layout: {
      backgroundColor: '#131722',
      textColor: '#d1d4dc',
    },
    grid: {
      vertLines: {
        color: '#334158',
      },
      horzLines: {
        visible:false,
        color: '#334158',
      },
    }
  });



  areaSeries = exchangechart.addCandlestickSeries({
  wickDownColor: '#838ca1',
  wickUpColor: '#838ca1',
    lineWidth: 1,
    drawTicks: true,
    priceLineVisible: false,
    priceLineWidth: 2,
    priceLineColor: '#4682B4',
    priceLineStyle: 3,
    lastValueVisible: false,
    baseLineVisible: true,
    baseLineColor: '#ff0000',
    baseLineWidth: 3,
    priceFormat: {
      visible: true,
      type: 'price', // price | volume | percent | custom
      minMove: 0.001,
      precision: 3,
      formatter: (price) => {
        return price.toFixed(6) + ` ${exchangebase.toUpperCase()}`;
      }
    }
  })

  candlestickSeries = exchangechart.addCandlestickSeries({
    priceFormat: {
      visible: false,
      type: 'price', // price | volume | percent | custom
      minMove: 0.001,
      precision: 3,
      formatter: (price) => {
        return price.toFixed(6) + ` ${exchangebase.toUpperCase()}`;
      }
    }
  })
     hivechartmade = true;
};//END makeCFDChart;

var showExchangeWarning = true;
async function showShares() {
  loadingjumbo();
  console.log(`showShares() called`);
  let exchangeContent = `<center style="width:100%; height:50%;">` +
  `<div id="exchangeChart" style="width:100%;"><span id="exchangeLoader">Loading Exchange Data...</span></div>` +
  `</center>` +
  `<div id="pickerTickerTitle">Select a Asset / Token Trading Pair Below</div>` +
  `<div id="exchangePickerTicker">` +
  `<span id="exchangePickerLeft" class="smolbutton"><i class="fas fa-fw fa-long-arrow-alt-left"></i></span>` +
  `<div id="exchangePicker">` +
  `<span id="tradepair1" class="smolexchangebutton"><i class="fas fa-file-invoice-dollar" style="color:lightblue"></i> HLSHARE / <i class="fab fa-hive" style="color:#E31337;"></i> HIVE</span>` +
  `<span id="tradepair2" class="smolexchangebutton" onclick="showErr('HBD / HIVE Trading Pair Not Yet Enabled!')"><i class="fab fa-hive" style="color:green;"></i> HBD / <i class="fab fa-hive" style="color:#E31337;"></i> HIVE</span>` +
  `<span id="tradepair3" class="smolexchangebutton" onclick="showErr('LEO / HIVE Trading Pair Not Yet Enabled!')"><img class="imglogo" src="/img/leo.ico"> LEO / <i class="fab fa-hive" style="color:#E31337;"></i> HIVE</span>` +
  `<span id="tradepair4" class="smolexchangebutton" onclick="showErr('BTC / HIVE Trading Pair Not Yet Enabled!')"><i class="fab fa-bitcoin" style="color:#f2a900;"></i> BTC / <i class="fab fa-hive" style="color:#E31337;"></i> HIVE</span>` +
  `<span id="tradepair5" class="smolexchangebutton" onclick="showErr('ETH / HIVE Trading Pair Not Yet Enabled!')"><i class="fab fa-ethereum" style="color:#ecf0f1"></i> ETH / <i class="fab fa-hive" style="color:#E31337;"></i> HIVE</span>` +
  `<span id="tradepair7" class="smolexchangebutton" onclick="showErr('DEC / HIVE Trading Pair Not Yet Enabled!')"><img class="imglogo" src="/img/logo-dec.svg"> DEC / <i class="fab fa-hive" style="color:#E31337;"></i> HIVE</span>` +
  `<span id="tradepair7" class="smolexchangebutton" onclick="showErr('USDT / HIVE Trading Pair Not Yet Enabled!')"><i class="fas fa-dollar-sign" style="color:#50AF95;"></i> USDT / <i class="fab fa-hive" style="color:#E31337;"></i> HIVE</span>` +
  `<span id="tradepair6" class="smolexchangebutton" onclick="showErr('XMR / HIVE Trading Pair Not Yet Enabled!')"><i class="fab fa-monero" style="color:#ff6600"></i> XMR / <i class="fab fa-hive" style="color:#E31337;"></i> HIVE</span>` +
  `</div>` +
  `<span id="exchangePickerRight" class="smolbutton"><i class="fas fa-fw fa-long-arrow-alt-right"></i></span>` +
  `</div>` +
  `<table id="exchangetable">` +
  `<thead>` +
  `<tr>` +
  `<th><b>Buy <span class="exchangetype">HLSHARE</span></b></th>` +
  `<th><b><span id="centerExchangeTable">Your Current Open <span class="exchangetype">HLSHARE</span> Orders</span></b></th>` +
  `<th><b>Sell <span class="exchangetype">HLSHARE</span></b></th>` +
  `</tr>` +
  `</thead>` +
  `<tbody>` +
  `<tr>` +
  `<td class="exchange-td">` +
  `<center>` +
  `Buy Price <i class="far fa-fw fa-question-circle siteinfo" title="Price to Purchase Asset" onClick="alert('Price to Purchase Asset')"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="exchangeBuyPrice" class="input-group-text inputclear" placeholder="0.000000" min="0.00000001" step="0.00000001" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></span></div>` +
  `Amount <i class="far fa-fw fa-question-circle siteinfo" title="Specify Amount of Asset to Purchase" onClick="alert('Specify Amount of Asset to Purchase')"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="exchangeBuyAmount" class="input-group-text inputclear" placeholder="0" min="1" step="1" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fas fa-file-invoice-dollar" style="color:lightblue"></i></b></span></span></div>` +
  `Total <i class="far fa-fw fa-question-circle siteinfo" title="Buy for a Minimum Total (not including any fees)" onClick="alert('Buy for a Minimum Total (not including any fees)')"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="buyTotal" class="input-group-text inputclear" readonly placeholder="0.000" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></span></div>` +
  `<span id="buyTypeButtons">` +
  `<span id="showBuyTypeLimit" class="smolcfdbutton" onclick="/*$(this).addClass('hidden');$('#shortMargin').removeClass('hidden');*/ showSuccess('Order Type Limit Selected');"><sub>Limit</sub></span> <span id="showBuyTypeMarket" class="smolcfdbutton" onclick="/*$(this).addClass('hidden');$('#shortMargin').removeClass('hidden');*/ showErr('Order Type Market Unavailable in Beta');"><sub>Market</sub></span>` +
  `</span>` +
  `<sub><span id="buyFeedback"></span></sub>` +
  `<br><button id="buybutton" class="button">BUY <span class="exchangetype">HLSHARE</span> <span id="exchangeTypeLogo"><i class="fas fa-file-invoice-dollar" style="color:lightblue;"></i></span></button><br>` +
  `<sub>( Account Balance: <span id="buyUserBalance" class="userhivebalancedisplay">0.000</span> <span class="exchangebase">HIVE</span> <a href="#" class="paintitwhite keychainify-checked" onclick="loanWalletLink();" title="Click Here to Open Up Wallet to Deposit"><i class="fas fa-wallet"></i></a>)</sub>` +
  `</td>` +
  `</center>` +
  `<td class="exchange-td">` +
  `<span id="openExchangeOrders" class="robotable">` +
  `<span id="noExchangeOrders"><sub>No Orders Found</sub></span>` +
  `</span>` +
  `<span id="openExchangeHistory" onClick="exchangeHistorySwitch();"><sub>Click Here to Switch View to <span id="openExchangeHistoryType">Order History</span></sub></span>` +
  `</td>` +
  `<center>` +
  `<td class="exchange-td">` +
  `Sell Price <i class="far fa-fw fa-question-circle siteinfo" title="Price to Sell Asset" onClick="alert('Price to Sell Asset')"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="exchangeSellPrice" class="input-group-text inputclear" placeholder="0.000000"  min="0.00000001" step="0.00000001"  aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></span></div>` +
  `Amount <i class="far fa-fw fa-question-circle siteinfo" title="Specify Amount of Asset to Sell" onClick="alert('Specify Amount of Asset to Sell')"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="exchangeSellAmount" class="input-group-text inputclear" placeholder="0" min="1" step="1" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fas fa-file-invoice-dollar" style="color:lightblue;"></i></b></span></span></div>` +
  `Total <i class="far fa-fw fa-question-circle siteinfo" title="Sell for a Minimum Total (not including any fees)" onClick="alert('Sell for a Minimum Total (not including any fees)')"></i><br>` +
  `<div class="casperInput input-group" style=""><input type="number" id="sellTotal" class="input-group-text inputclear" readonly placeholder="0.000" aria-describedby="basic-addon2"><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></span></div>` +
  `<span id="sellTypeButtons">` +
  `<span id="showSellTypeLimit" class="smolcfdbutton" onclick="/*$(this).addClass('hidden');$('#shortMargin').removeClass('hidden');*/ showSuccess('Order Type Limit Selected');"><sub>Limit</sub></span> <span id="showSellTypeMarket" class="smolcfdbutton" onclick="/*$(this).addClass('hidden');$('#shortMargin').removeClass('hidden')*/ showErr('Order Type Market Unavailable in Beta');"><sub>Market</sub></span>` +
  `</span>` +
  `<sub><span id="sellFeedback"></span></sub>` +
  `<br><button id="sellbutton" class="button">SELL <span class="exchangetype">HLSHARE</span> <span id="exchangeTypeLogo"><i class="fas fa-file-invoice-dollar" style="color:lightblue;"></i></span></button><br>` +
  `<sub>( Account Holdings: <span id="sellUserBalance" class="userhivebalancedisplay">0</span> <span class="exchangetype">HLSHARE</span> )</sub>` +
  `</td>` +
  `</center>` +
  `</tr>` +
  `</tbody>` +
  `</table>` +
  `<span id="exchangeWarning"><i class="fa fa-exclamation-triangle sexyblackoutline" style="color:gold;" aria-hidden="true"></i> Currently the only available asset for exchange trading is HLSHARE featuring no trading fees, with each of the limited 100,000 HLSHARE units granting holder 0.0002% of site monthly revenue, however future trading pairs may incur a small commission fee upon succesful order action <span style="color:red;" title="Click Here to Hide" onClick='$("#exchangeWarning").fadeOut(); showExchangeWarning = false;'><i class="fas fa-times"></i></span></span>`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();

      $("#jumbotron").css({'top':'11%','height':'86vh','width':'60%'});
      $("#jumboWrapper").html(exchangeContent);
      checkExchangeWarning();
      makeExchangeChart();
      //openShares();
        //makeCFDChart();
        //exchangecheck(100);
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").html(`<span id="exchangeAssetType">HLSHARE</span>&nbsp;/&nbsp;<span id="exchangeAssetBase">HIVE</span>&nbsp;Exchange`);
  });
};

async function showLoansMixed() {
  console.log(`showLoansMixed() called`);
  loadingjumbo();
  let mixedContent = `<center>` +
  `<div id="loanChartHolder">` +
  `<table id="loanMixedChartTable" style="width:100%;height:100%;border:none;">` +
  `</table>` +
  `</div>` +
  `<div>` +
  `<table id="mainloantable" style="width:98%;">` +
  `<thead>` +
  `<tr>` +
  `<th><b>Create <span class="loantype">HIVE</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> Lending Contract</b></th>` +
  `<th><b><span id="centerLoanTable">Your <span id="centerLoanTableType">Current</span> <span class="loantype">HIVE</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> Lending Contracts</span></b></th>` +
  `<th><b>Request <span class="loantype">HIVE</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> Lending Contract</b></th>` +
  `</tr>` +
  `</thead>` +
  `<tbody>` +
  `<tr>` +
  `<td class="mainloan-td">` +
  `<center>` +
  `Amount of <span class="loantype">HIVE</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> to Loan <i class="far fa-fw fa-question-circle siteinfo" title="Amount of HIVE to Loan" onClick="alert('Amount of HIVE to Loan')"></i>` +
  `<br>` +
  `<div class="casperInput input-group" style="">` +
  `<input type="number" id="loanCreateAmount" class="input-group-text inputclear" onkeyup="$(this).val(this.value); createMainLoanPreview();" placeholder="0.000" min="1" step="0.001" aria-describedby="basic-addon2">` +
  `<span class="input-group-append">` +
  `<span class="input-group-text">` +
  `<b><i class="fab fa-hive" style="color:#E31337;"></i></b>` +
  `</span>` +
  `</span>` +
  `</div>` +
  `Duration <i class="far fa-fw fa-question-circle siteinfo" title="Specify Duration of Contract" onClick="alert('Specify Duration of Contract')"></i>` +
  `<br>` +
  `<select onchange="$(this).val(this.value); createMainLoanPreview();" class="casperInput" value="7" id="loanCreateDuration" min="7" max="91" step="7" name="loanCreateDuration" placeholder="7 to 91" required>` +
  `<option value="7">7 Days <sub>( 1 Repayment )</code></option>` +
  `<option value="14">14 Days <code>( 2 Repayments )</code></option>` +
  `<option value="21">21 Days <code>( 3 Repayments )</code></option>` +
  `<option value="28">28 Days <code>( 4 Repayments )</code></option>` +
  `<option value="35">35 Days <code>( 5 Repayments )</code></option>` +
  `<option value="42">42 Days <code>( 6 Repayments )</code></option>` +
  `<option value="49">49 Days <code>( 7 Repayments )</code></option>` +
  `<option value="56">56 Days <code>( 8 Repayments )</code></option>` +
  `<option value="63">63 Days <code>( 9 Repayments )</code></option>` +
  `<option value="70">70 Days <code>( 10 Repayments )</code></option>` +
  `<option value="77">77 Days <code> ( 11 Repayments )</code></option>` +
  `<option value="84">84 Days <code>( 12 Repayments )</code></option>` +
  `<option value="91">91 Days <code>( 13 Repayments )</code></option>` +
  `</select>` +
  `<br>` +
  `Interest Rate <i class="far fa-fw fa-question-circle siteinfo" title="Percentage of Interest to Charge on Loan" onClick="alert('Percentage of Interest to Charge on Loan')"></i>` +
  `<br>` +
  `<div class="casperInput input-group">` +
  `<input type="number" onkeyup="$(this).val(this.value); createLoanPreview(); loanCreateInterestWrangler();"  class="inputclear" id="loanCreateInterest" min="10" max="30" step="1" placeholder="10 to 30" required placeholder="Interest Rate" aria-label="Interest Rate" aria-describedby="basic-addon2">` +
  `<span class="input-group-append">` +
  `<span class="input-group-text" id="basic-addon2">` +
  `<b>%</b>` +
  `</span>` +
  `</span>` +
  `</div>` +
  `<br>` +
  `<sub class="robotable" style="height:20% !important;width:60% !important; text-align:left;overflow:hidden; overflow-y:hidden !important;">` +
  `<span id="loanCreateFeedback">` +
  `Returns: <span id="loanCreateFeedbackReturn">0.000 <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> <i class="fas fa-fw fa-info-circle" title="( minus a 0.000 HIVE site commission fee (10%) )"></i> Paid Over ~ Days</span>` +
  `<br>`+
  `Weekly Yield: <span id="loanCreateFeedbackDaily"> 0.000 <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span></span>` +
  `<br>`+
  `<center><div class="mainLoanFees"><u>Contract Fees</u></div></center>` +
  `<span id="loanCreateFeedbackCommission">` +
  `Deployment Fee <span id="dlfee">0.000 <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span></span>` +
  `<br>` +
  `Commission Fee <span id="difee">0.000 <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span></span></span>` +
  `<br>` +
  `Cancellation Fee <span id="clfee">0.000 <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span></span>` +
  `</span>` +
  `</span>` +
  `</sub>` +
  `<button id="createMainLoanbutton" onClick="createNewMainLoan();" class="button">MAKE <span class="loanbase">HIVE</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> LOAN</button><br>` +
  `<sub>( Account Balance: <span id="loanUserBalance" title="Click Here to Copy Value to Loan Amount" onclick="$('#loanCreateAmount').val(${(userWalletFetchData.hivebalance / 1000).toFixed(3)});" class="userhivebalancedisplay">${(userWalletFetchData.hivebalance / 1000).toFixed(3)}</span> <span class="loanbase">HIVE</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> <a href="#" class="paintitwhite" onClick="loanWalletLink();" title="Click Here to Open Up Wallet to Deposit"><i class="fas fa-wallet"></i></a> )</sub>` +
  `</center>` +
  `</td>` +
  `<td class="mainloan-td">` +
  `<center>` +
  `<span id="openLoanContracts" class="robotable">` +
  `<span id="noLoanContracts"><sub>No Contracts Found</sub></span>` +
  `</span>` +
  `<span id="openLoansHistory" onClick="loansHistorySwitch();"><sub>Click Here to Switch View to <span id="openLoansHistoryType">Closed Contracts</span></sub></span>` +
  `</center>` +
  `</td>` +
  `<td class="mainloan-td">` +
  `<center>` +
  `Amount of <span class="loantype">HIVE</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> to Borrow <i class="far fa-fw fa-question-circle siteinfo" title="Amount of HIVE to Borrow" onClick="alert('Amount of HIVE to Borrow')"></i>` +
  `<br>` +
  `<div class="casperInput input-group" style="">` +
  `<input type="number" id="borrowCreateAmount" class="input-group-text inputclear" placeholder="0.000" min="1" step="0.001"  aria-describedby="basic-addon2">` +
  `<span class="input-group-append">` +
  `<span class="input-group-text">` +
  `<b><span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span></b>` +
  `</span>` +
  `</span>` +
  `</div>` +
  `Duration <i class="far fa-fw fa-question-circle siteinfo" title="Specify Duration of Contract" onClick="alert('Specify Duration of Contract')"></i>` +
  `<br>` +
  `<select onchange="$(this).val(this.value); createMainBorrowPreview();" class="casperInput" value="7" id="borrowCreateDuration" min="7" max="91" step="7" name="loanCreateDuration" placeholder="Loading Loan Limits..." required>` +
  /*
  `<option value="7">7 Days <sub>( 1 Repayment - <span id="bpo1"></span> Max )</code></option>` +
  `<option value="14">14 Days <code>( 2 Repayments - <span id="bpo2"></span> Max ))</code></option>` +
  `<option value="21">21 Days <code>( 3 Repayments - <span id="bpo3"></span> Max ))</code></option>` +
  `<option value="28">28 Days <code>( 4 Repayments - <span id="bpo4"></span> Max ))</code></option>` +
  `<option value="35">35 Days <code>( 5 Repayments - <span id="bpo5"></span> Max ))</code></option>` +
  `<option value="42">42 Days <code>( 6 Repayments - <span id="bpo6"></span> Max ))</code></option>` +
  `<option value="49">49 Days <code>( 7 Repayments - <span id="bpo7"></span> Max ))</code></option>` +
  `<option value="56">56 Days <code>( 8 Repayments - <span id="bpo8"></span> Max ))</code></option>` +
  `<option value="63">63 Days <code>( 9 Repayments - <span id="bpo9"></span> Max ))</code></option>` +
  `<option value="70">70 Days <code>( 10 Repayments - <span id="bpo10"></span> Max ))</code></option>` +
  `<option value="77">77 Days <code> ( 11 Repayments - <span id="bpo11"></span> Max ))</code></option>` +
  `<option value="84">84 Days <code>( 12 Repayments - <span id="bpo12"></span> Max ))</code></option>` +
  `<option value="91">91 Days <code>( 13 Repayments - <span id="bpo13"></span> Max ))</code></option>` +
  */
  `</select>` +
  `<br>` +
  `Interest Rate <i class="far fa-fw fa-question-circle siteinfo" title="Percentage of Interest to Offer on Loan" onClick="alert('Percentage of Interest to Offer on Loan')"></i>` +
  `<br>` +
  `<div class="casperInput input-group">` +
  `<input type="number" onkeyup="$(this).val(this.value); createMainBorrowPreview();"  class="inputclear" id="borrowCreateInterest" min="10" max="30" step="1" placeholder="10 to 30" required placeholder="Interest Rate" aria-label="Interest Rate" aria-describedby="basic-addon2">` +
  `<span class="input-group-append">` +
  `<span class="input-group-text" id="basic-addon2">` +
  `<b>%</b>` +
  `</span>` +
  `</span>` +
  `</div>` +
  `<br>` +
  `<sub class="robotable" style="height:20% !important;width:60% !important; text-align:left;overflow:hidden; overflow-y:hidden !important;">` +
  `<span id="borrowCreateFeedback">` +
  `Total Cost <span id="borrowCreateFeedbackReturn">0.000 <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> <i class="fas fa-fw fa-info-circle" title="( minus a 0.000 HIVE site commission fee (10%) )"></i> Paid Over ~ Days</span>` +
  `<br>`+
  `Weekly Payment <span id="borrowCreateFeedbackDaily"> 0.000 <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span></span>` +
  `<br>`+
  `<center><div class="mainLoanFees"><u>Contract Fees</u></div></center>` +
  `<span id="borrowCreateFeedbackCommission">` +
  `Interest Fee <span id="dbfee">0.000</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span>` +
  `<br>` +
  `Deployment Fee <span id="dpfee">0.000</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span>` +
  `<br>` +
  `Cancellation Fee <span id="cbfee">0.000</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span>` +
  `<br>` +
  `</span>` +
  `</span>` +
  `</sub>` +
  `<button id="createMainLoanbutton" onClick="createNewMainBorrow();" class="button">SEEK <span class="loanbase">HIVE</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> LOAN</button><br>` +
  `<sub>( <span id="borrowHP">0.000</span> <i class="fab fa-hive" style="color:#E31337;"></i> <span class="exchangebase">HP</span> Staked )</sub>` +
  `</center>` +
  `</td>` +
  `</tr>` +
  `</tbody>` +
  `</table>` +
  `</div>` +
  `</center>`;

  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
      $("#jumboHead").show();
      $("#jumboWrapper").html(mixedContent);
      //$("#openLoanContracts").html();
      //$('#founderslist').html(founderlist);
      //$('#foundercount').html(foundercount);
      $("#jumbotron").css({'top':'11%','height':'86vh','width':'60%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboHead").show();
      $("#jumboTitle").text(`HIVE Liquidity Lending Contract Exchange`);

      if(loanchartmade == false){
        //makeLoanChart();
        $("#noLoanContracts").fadeIn();
        var loanState = processState(siteLoansArray, false);
        $("#noLoanContracts").html(loanState);
      } else {
        $("#noLoanContracts").fadeIn();
        var loanState = processState(siteLoansArray, false);
        $("#noLoanContracts").html(loanState);
      }
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
  $('#borrowHP').html(hpNow);
  $('#borrowHP').val(hpNow);
  let thelisttoaddto = document.getElementById('borrowCreateDuration');
  //var hivelogotest = '<span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span>';
  for(var i = 1; i < 14; i++){
    let newOption = document.createElement('option');
    let s = '';
    if(i>1) s = 's';
    let optionText = document.createTextNode(`${i} Week${s} - Max Loan: ${(loanMax / (14 - i)).toFixed(3)} HIVE`);
    // set option text
    newOption.appendChild(optionText);
    // and option value
    newOption.setAttribute('value', (i * 7));
    // add the option to the select box
    thelisttoaddto.appendChild(newOption);
  };
  //$('#tlh').html(hivelogotest);
};

async function showFaq() {
  console.log(`showFaq() called`);
  loadingjumbo();
  getFounders();
  let faqContent = `<center>` +
  `This is an unfinished DEMO of the Hive.Loans project and is in no way meant to represent the launch version<br>` +
  `Many feautures may be broken, bugged, unstable or just straight up missing. It's advised to not use this version<br>` +
  `<a href="https://peakd.com/coding/@klye/a-quick-look-at-an-early-working-prototype-of-the-upcoming-hive-loans-account-as-collateral-community-lending-pool">Check out this post for more information</a><br>`+
  `Hive.Loans will allow users to create lending contracts loaning out their liquid HIVE against the colalteral of an account<br>` +
  `This site is scheduled for release on or before the 15th of April 2021 if all goes well in development.<br>` +
  `<br>` +
  `The <span id="foundercount"></span> Users who Voted in Support of Proposal #154 (⚡ Founder Rank):<br><sup>( Founders get 50% off of fees site wide )</sup></center><h5><span id="founderslist"></span></h5><br>` +
  `<br>` +
  `<center>The <span id="backercount"></span> Users who Pledged HIVE or HBD Developement Capital Directly (💸 Backer Rank):<br><sup>( Backers get an enhanced interest rate cap of 35% )</sup><h5><span id="backerslist"></span></h5></center><br>` +
  `<br>` +
  `<center>The Ultra Exclusive One-of-a-Kind Project Benefactor (💰 Benefactor Rank):<br>( Get a monthly payment of 10% of the service revenue! )</sup><h5><span id="benefactorlist">@coininstant</span></h5></center><br>` +
  `<br>`;
  var backersnames = '';
  backerlist.forEach((item, i) => {
    backersnames += `&nbsp;<a href="https://peakd.com/@${item}" style="text-decoration:none !important; color:white;font-size:larger;">${item}</a>&nbsp;`;
  });

  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
      $("#jumboHead").show();
      $("#jumboWrapper").html(faqContent);
      console.log(foundercount)
      console.log(founderlist)
      $('#founderslist').html(founderlist);
      $('#foundercount').html(foundercount);
      $('#backerslist').html(backersnames);
      $("#jumbotron").css({'top':'11%','height':'86vh','width':'60%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Site Information & Frequently Asked Questions`);
  });
}

async function showTools() {
  loadingjumbo();
  let toolsContent = `<center>` +
  `<h4><b>Set Recovery Account Tools and Private Key Recovery</b></h4>`+
  `<a href="#" class="paintitwhite"onClick="showRecoveryPanel();"><b><i class="fas fa-fw fa-users-cog"></i> Change Recovery Account</b></a>&nbsp;&nbsp;<i class="fas fa-fw fa-info-circle" title="Use the tool linked below to change your recovery account"></i><br><br>` +
  `<a href="#" class="paintitwhite"onClick="showKeysRecoveryPanel();"><b><i class="fas fa-fw fa-user-check"></i> Recovery Account Keys</b></a>&nbsp;&nbsp;<i class="fas fa-fw fa-info-circle" title="Use the tool linked below to recover keys to your account"></i><br><br>` +
  `<h4><b>Utilize Hive.Loans to Facilitate a Secure Escrow Instance</b></h4>`+
  `<a href="#" class="paintitwhite"onClick="showRecoveryPanel();"><b><i class="fas fa-fw fa-handshake"></i> Create Escrow Trade</b></a>&nbsp;&nbsp;<i class="fas fa-fw fa-info-circle" title="Use the tool linked below to create a secure escrow instance"></i><br><br>` +
  `<a href="#" class="paintitwhite"onClick="showRecoveryPanel();"><b><i class="fas fa-fw fa-handshake-slash"></i> Cancel Escrow Trade</b></a>&nbsp;&nbsp;<i class="fas fa-fw fa-info-circle" title="Use the tool linked below to cancel an existing escrow instance"></i><br><br>` +
  `<h4><b>Modify Account Hive Power Delegations</b></h4>`+
  `<a href="#" class="paintitwhite"onClick="showDelegationPanel();"><b><i class="fas fa-fw fa-tasks"></i> View / Modify Account Delegations</b></a>&nbsp;&nbsp;<i class="fas fa-fw fa-info-circle" title="Use the tool linked below view and modify delegations"></i><br><br>` +
  `and another<br></center>`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
      $("#jumboHead").show();
      $("#jumboWrapper").html(toolsContent);
      $("#jumbotron").css({'top':'11%','height':'86vh','width':'25%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Account Tools & Resources`);
  });
}

async function showSiteAudit() {
  loadingjumbo();

  let auditContent = `<center>This Application Self Audits and Reports Here Every 60 Seconds` +
  `<br>Last Updated:<br><div class="casperInput input-group"><input id="audit-update" class="input-group-text inputclear" placeholder="Loading Update" readonly></div>` +
  `<b>BANKING</b>:` +
  `<br><span style="float:left;">Hot Wallet:<a href="https://hiveblocks.com/@hive.loans"><i class="fas fa-fw fa-question-circle" style="color:white;" title="The Hive.Loans Hot Wallet Account is @hive.loans. Click here to view on HiveBlocks.com"></i></a><br><div class="casperInput input-group"><input id="audit-hot" class="input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span> <span style="float:right;">Cold Wallet:<a href="https://hiveblocks.com/@hive.loans"><i class="fas fa-fw fa-question-circle" style="color:white;" title="The Hive.Loans Cold Wallet Account is @hive.loans.safe. Click here to view on HiveBlocks.com"></i></a><br><div class="casperInput input-group"><input id="audit-cold" class="input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span>` +
  `<br><span style="float:left">Users Balances Total:<i class="fas fa-fw fa-question-circle" title="The Total Funds in All User Balances on Site Currently"></i><br><div class="casperInput input-group"><input id="audit-userbal" class="input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span><span style="float:right;">Custodial Funds Total:<i class="fas fa-fw fa-question-circle" title="The Total Funds Held by the Application"></i><br><div class="casperInput input-group"><input id="audit-sitebal" class="input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><span class="input-group-text"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span>` +
  `<br><span style="float:left;">Locked in Contract Funds Total:<i class="fas fa-fw fa-question-circle" title="The Total Funds Locked into Available Lending Contracts"></i><br><div class="casperInput input-group"><input id="audit-lockedtotal" class="input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span>` +
  `<span style="float:right;">Excess Custodial Funds Total:<i class="fas fa-fw fa-question-circle" title="The Total Funds the Application Holds in Excess of Required Amount for Operation"></i><br><div class="casperInput input-group"><input id="audit-extras" class="input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span>` +
  `<br><br><hr class="allgrayeverythang">`+
  `<b>CONTRACTS</b>:` +
  `<br><span style="float:left;">Active Loan Contracts:<i class="fas fa-fw fa-question-circle" title="Lending Contracts Accepted by a Borrower and Actively Being Repaid"></i><br><div class="casperInput input-group"><input id="audit-active" class="input-group-text inputclear" placeholder="0" readonly></div></span>` +
  `<span style="float:right;">Available Loan Contracts:<i class="fas fa-fw fa-question-circle" title="Lending Contracts Available to be Accepted by Borrowers"></i><br><div class="casperInput input-group"><input id="audit-available" class="input-group-text inputclear" placeholder="0" readonly></div></span>` +
  `<br><span style="float:left;">Finished Loan Contracts:<i class="fas fa-fw fa-question-circle" title="Lending Contracts That Have Been Repaid and Finalized"></i><br><div class="casperInput input-group"><input id="audit-completed" class="input-group-text inputclear" placeholder="0" readonly></div></span>` +
  `<span style="float:right;">Cancelled Loan Contracts:<i class="fas fa-fw fa-question-circle" title="Lending Contracts That Have Been Cancelled by Lender"></i><br><div class="casperInput input-group"><input id="audit-cancelled" class="input-group-text inputclear" placeholder="0" readonly></div></span>` +
  `<br><span style="float:left;">Loan Contract Amount Total:<i class="fas fa-fw fa-question-circle" title="The Total Amount of Funds Currently Available to Borrow via Lending Contracts"></i><br><div class="casperInput input-group"><input id="audit-loantotal" class="input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span>` +
  `<span style="float:right;">Repaid Amount Total:<i class="fas fa-fw fa-question-circle" title="The Total Funds Repaid to the Lending Contract Creators Through the Site"></i><br><div class="casperInput input-group"><input id="audit-returntotal" class="input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span>` +
  `<br><br><hr class="allgrayeverythang">`+
  `<b>USERS</b>:` +
  `<br><span style="float:left;">Site Accounts:<i class="fas fa-fw fa-question-circle" title="The Number of Accounts on Hive.Loans"></i><br><input id="audit-accounts" class="casperInput" placeholder="0" readonly></span>` +
  `<span style="float:right;">Active Accounts:<i class="fas fa-fw fa-question-circle" title="The Number of Accounts Active in the Past 30 Days"></i><br><input id="audit-activeaccts" class="casperInput" placeholder="0" readonly></span>` +
  `<br><span style="float:left;">Dormant Accounts:<i class="fas fa-fw fa-question-circle" title="The Number of Accounts With No Activity in the Past 30 Days"></i><br><input id="audit-dormant" class="casperInput" placeholder="0" readonly></span>` +
  `<span style="float:right;">Collateral Account Count:<i class="fas fa-fw fa-question-circle" title="The Number of Accounts Currently Borrowing via Lending Contracts"></i><br><input id="audit-collateral" class="casperInput" placeholder="0" readonly></span>` +
  `<br><br><hr class="allgrayeverythang">`+
  `<b>FEES</b>:` +
  `<br><span style="float:left;">Creation Fees:<i class="fas fa-fw fa-question-circle" title="Lending Contract Creation Fees Total"></i><br><div class="casperInput input-group"><input id="audit-createfee" class=" input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span>` +
  `<span style="float:right;">Commission Fees:<i class="fas fa-fw fa-question-circle" title="Lending Contract Interest Commission Fees Total"></i><br><div class="casperInput input-group"><input id="audit-interestfee" class=" input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span>` +
  `<br><span style="float:left;">Cancellation Fees:<i class="fas fa-fw fa-question-circle" title="Lending Contract Cancellation Fees Total"></i><br><div class="casperInput input-group"><input id="audit-cancelfee" class=" input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span>` +
  `<span style="float:right;">Withdraw Fees:<i class="fas fa-fw fa-question-circle" title="Wallet Withdrawal Fees Total"></i><br><div class="casperInput input-group"><input id="audit-withdrawfee" class=" input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span>` +
  `<br><span style="float:left;">Fines Fees:<i class="fas fa-fw fa-question-circle" title="Fines for Lending Contract Tampering Fees Total"></i><br><div class="casperInput input-group"><input id="audit-finesfee" class=" input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span>` +
  `<span style="float:right;">Site Fees Total:<i class="fas fa-fw fa-question-circle" title="Total Fees the Application has Generated"></i><br><div class="casperInput input-group"><input id="audit-totalfee" class=" input-group-text inputclear" placeholder="0.000" readonly><span class="input-group-append"><b><i class="fab fa-hive" style="color:#E31337;"></i></b></span></div></span>`;
  `<br><br><hr class="allgrayeverythang">`+
  `<br><b>STATUS</b>:<br><div class="casperInput input-group"><input id="audit-update" class="input-group-text inputclear" placeholder="Loading Site Audit Status..." readonly></div>`;
  //`<button id="auditcloser" onClick="$('#jumboClose').click();" class="button">CLOSE</button></center>`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();
      fetchAudit();
      $("#jumboWrapper").html(auditContent);
      $("#jumbotron").css({'top':'11%','height':'86vh','width':'25%'});
      $("#jumbotron").center();
      $("#jumboTitle").text(`Site Audit`);
      $("#jumbotron").fadeIn();
  });
};

async function showMining() {
  loadingjumbo();
  let miningContent = `<center>` +
  `<h4><b>Mine HIVE With Your Browser</b></h4>`+
  `<span id="xmrstart">Starting the Miner!</span>` +
  `<div id="xmrload"></div>` +
  `under construction` +
  `</center>`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();
      $("#jumboWrapper").html(miningContent);
      $("#jumbotron").css({'top':'11%','height':'86vh','width':'25%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Mine HIVE in Your Browser`);
  });
};

async function showUserAudit() {
  loadingjumbo();
  let auditContent = `<center>` +
  `<h4><b>Set Recovery Account Tools and Private Key Recovery</b></h4>`+
  `<a href="#" class="paintitwhite"onClick="showRecoveryPanel();"><b><i class="fas fa-fw fa-users-cog"></i> Change Recovery Account</b></a>&nbsp;&nbsp;<i class="fas fa-fw fa-info-circle" title="Use the tool linked below to change your recovery account"></i><br><br>` +
  `<a href="#" class="paintitwhite"onClick="showKeysRecoveryPanel();"><b><i class="fas fa-fw fa-user-check"></i> Recovery Account Keys</b></a>&nbsp;&nbsp;<i class="fas fa-fw fa-info-circle" title="Use the tool linked below to recover keys to your account"></i><br><br>` +
  `<h4><b>Utilize Hive.Loans to Facilitate a Secure Escrow Instance</b></h4>`+
  `<a href="#" class="paintitwhite"onClick="showRecoveryPanel();"><b><i class="fas fa-fw fa-handshake"></i> Create Escrow Trade</b></a>&nbsp;&nbsp;<i class="fas fa-fw fa-info-circle" title="Use the tool linked below to create a secure escrow instance"></i><br><br>` +
  `<a href="#" class="paintitwhite"onClick="showRecoveryPanel();"><b><i class="fas fa-fw fa-handshake-slash"></i> Cancel Escrow Trade</b></a>&nbsp;&nbsp;<i class="fas fa-fw fa-info-circle" title="Use the tool linked below to cancel an existing escrow instance"></i><br><br>` +
  `<h4><b>Modify Account Hive Power Delegations</b></h4>`+
  `<a href="#" class="paintitwhite"onClick="showDelegationPanel();"><b><i class="fas fa-fw fa-tasks"></i> View / Modify Account Delegations</b></a>&nbsp;&nbsp;<i class="fas fa-fw fa-info-circle" title="Use the tool linked below view and modify delegations"></i><br><br>` +
  `and another<br></center>`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
$("#jumboHead").show();
      $("#jumboWrapper").html(auditContent);
      $("#jumbotron").css({'top':'11%','height':'86vh','width':'25%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`User Audit`);
  });
};

var brtable =
`<div class="tg-wrap">` +
`<table id="tg-Od3NG" class="tg robotable" style="height:49% !important">` +
`<thead style="width:100%;">` +
  `<tr>` +
    `<th class="tg-0lax">id</th>` +
    `<th class="tg-0lax">amount</th>` +
    `<th class="tg-0lax">duration</th>` +
    `<th class="tg-0lax">profit</th>` +
    `<th class="tg-0lax">status</th>` +
  `</tr>` +
`</thead>` +
`<tbody>` +
  `<tr>` +
    `<td class="tg-0lax"></td>` +
    `<td class="tg-0lax"></td>` +
    `<td class="tg-0lax"></td>` +
    `<td class="tg-0lax"></td>` +
    `<td class="tg-0lax"></td>` +
  `</tr>` +
`</tbody>` +
`</table>` +
`</div>`;

var TGSort=window.TGSort||function(n){"use strict";function r(n){return n?n.length:0}function t(n,t,e,o=0){for(e=r(n);o<e;++o)t(n[o],o)}function e(n){return n.split("").reverse().join("")}function o(n){var e=n[0];return t(n,function(n){for(;!n.startsWith(e);)e=e.substring(0,r(e)-1)}),r(e)}function u(n,r,e=[]){return t(n,function(n){r(n)&&e.push(n)}),e}var a=parseFloat;function i(n,r){return function(t){var e="";return t.replace(n,function(n,t,o){return e=t.replace(r,"")+"."+(o||"").substring(1)}),a(e)}}var s=i(/^(?:\s*)([+-]?(?:\d+)(?:,\d{3})*)(\.\d*)?$/g,/,/g),c=i(/^(?:\s*)([+-]?(?:\d+)(?:\.\d{3})*)(,\d*)?$/g,/\./g);function f(n){var t=a(n);return!isNaN(t)&&r(""+t)+1>=r(n)?t:NaN}function d(n){var e=[],o=n;return t([f,s,c],function(u){var a=[],i=[];t(n,function(n,r){r=u(n),a.push(r),r||i.push(n)}),r(i)<r(o)&&(o=i,e=a)}),r(u(o,function(n){return n==o[0]}))==r(o)?e:[]}function v(n){if("TABLE"==n.nodeName){for(var a=function(r){var e,o,u=[],a=[];return function n(r,e){e(r),t(r.childNodes,function(r){n(r,e)})}(n,function(n){"TR"==(o=n.nodeName)?(e=[],u.push(e),a.push(n)):"TD"!=o&&"TH"!=o||e.push(n)}),[u,a]}(),i=a[0],s=a[1],c=r(i),f=c>1&&r(i[0])<r(i[1])?1:0,v=f+1,p=i[f],h=r(p),l=[],g=[],N=[],m=v;m<c;++m){for(var T=0;T<h;++T){r(g)<h&&g.push([]);var C=i[m][T],L=C.textContent||C.innerText||"";g[T].push(L.trim())}N.push(m-v)}t(p,function(n,t){l[t]=0;var a=n.classList;a.add("tg-sort-header"),n.addEventListener("click",function(){var n=l[t];!function(){for(var n=0;n<h;++n){var r=p[n].classList;r.remove("tg-sort-asc"),r.remove("tg-sort-desc"),l[n]=0}}(),(n=1==n?-1:+!n)&&a.add(n>0?"tg-sort-asc":"tg-sort-desc"),l[t]=n;var i,f=g[t],m=function(r,t){return n*f[r].localeCompare(f[t])||n*(r-t)},T=function(n){var t=d(n);if(!r(t)){var u=o(n),a=o(n.map(e));t=d(n.map(function(n){return n.substring(u,r(n)-a)}))}return t}(f);(r(T)||r(T=r(u(i=f.map(Date.parse),isNaN))?[]:i))&&(m=function(r,t){var e=T[r],o=T[t],u=isNaN(e),a=isNaN(o);return u&&a?0:u?-n:a?n:e>o?n:e<o?-n:n*(r-t)});var C,L=N.slice();L.sort(m);for(var E=v;E<c;++E)(C=s[E].parentNode).removeChild(s[E]);for(E=v;E<c;++E)C.appendChild(s[v+L[E-v]])})})}}n.addEventListener("DOMContentLoaded",function(){for(var t=n.getElementsByClassName("tg"),e=0;e<r(t);++e)try{v(t[e])}catch(n){}})}(document);

async function showBankroll() {
  loadingjumbo();
  let bankrollContent = `<center id="bankrollContent">` +
  `<div id="createHPLeasewrapper" class="" style="display: block;">` +
  `<span style="float:center;">Your Current Invested:</span>` +
  `<div class="casperInput input-group" style="">` +
  `<input type="number" readonly disabled placeholder="0.000" id="activebankroll" class="input-group-text inputclear" onkeyup="$(this).val(this.value);calculateAPR();" placeholder="0.000" min="1" step="0.001" aria-describedby="basic-addon2">` +
  `<!--<span class="input-group-append"><span class="input-group-text">` +
  `<b><i class="fab fa-hive" style="color:#E31337;"></i></b>` +
  `</span>` +
  `</span>-->` +
  `</div>` +
  `<span style="float:center;">All Time Investment Profit:</span>` +
  `<div class="casperInput input-group" style="">` +
  `<input type="number" id="bankrolldivest" class="input-group-text inputclear" onkeyup="$(this).val(this.value);calculateAPR();" placeholder="0" min="1" max="52" step="1" aria-describedby="basic-addon2">` +
  `<span class="input-group-append">` +
  `<b><i class="fab fa-hive" style="color:#E31337;"></i></b>` +
  `</span>` +
  `</span>` +
  `</div>` +
  `<hr class="allgrayeverythang">` +
  `<b>Modify or Create an Investment</b><br>` +
  `<span style="float:center;">Amount:</span>` +
  `<div class="casperInput input-group" style="">` +
  `<input type="number" id="bankrollamount" class="input-group-text inputclear" onkeyup="$(this).val(this.value);calculateAPR();" placeholder="0.000" min="1" step="0.001" aria-describedby="basic-addon2">` +
  `<span class="input-group-append"><span class="input-group-text">` +
  `<b><i class="fab fa-hive" style="color:#E31337;"></i></b>` +
  `</span>` +
  `</span>` +
  `</div>` +
  `<sub>( Account Balance: <span id="loanUserBalance" class="userhivebalancedisplay">${(userWalletFetchData.hivebalance / 1000).toFixed(3)}</span> <span class="loanbase">HIVE</span> <span class="loanlogo"><i class="fab fa-hive" style="color:#E31337;"></i></span> <a href="#" class="paintitwhite keychainify-checked" onclick="loanWalletLink();" title="Click Here to Open Up Wallet to Deposit"><i class="fas fa-wallet"></i></a> )</sub>` +
  `<br><span style="float:center;">Duration:</span>` +
  `<div class="casperInput" style="">` +
  `<select onchange="$(this).val(this.value); if($(this).val == -1){$('#showBankrollWarning').html('Invest Long Term, 7 Day Divest')}" class="casperInput" value="7" id="bankrollduration" min="-1" max="91" step="7" name="bankrollduration" placeholder="7 to ∞" required>` +
  `<option value="-1">∞ Days <code>( 1.5% Fee Reduction )</code></option>` +
  `<option value="7">7 Days <code>( 0.0% Fee Reduction )</code></option>` +
  `<option value="14">14 Days <code>( 0.1% Fee Reduction )</code></option>` +
  `<option value="21">21 Days <code>( 0.2% Fee Reduction )</code></option>` +
  `<option value="28">28 Days <code>( 0.3% Fee Reduction )</code></option>` +
  `<option value="35">35 Days <code>( 0.4% Fee Reduction )</code></option>` +
  `<option value="42">42 Days <code>( 0.5% Fee Reduction )</code></option>` +
  `<option value="49">49 Days <code>( 0.6% Fee Reduction )</code></option>` +
  `<option value="56">56 Days <code>( 0.7% Fee Reduction )</code></option>` +
  `<option value="63">63 Days <code>( 0.8% Fee Reduction )</code></option>` +
  `<option value="70">70 Days <code>( 0.9% Fee Reduction )</code></option>` +
  `<option value="77">77 Days <code>( 1.0% Fee Reduction )</code></option>` +
  `<option value="84">84 Days <code>( 1.1% Fee Reduction )</code></option>` +
  `<option value="91">91 Days <code>( 1.2% Fee Reduction )</code></option>` +
  `</select>` +
  //`<input type="number" id="bankrollduration" class="input-group-text inputclear" onkeyup="$(this).val(this.value);calculateAPR();" placeholder="0.000" min="1" step="0.001" aria-describedby="basic-addon2">` +
  `</div>` +
  `</span>` +
  `<div id="showBankrollWarning">` +
  `<code>Please Fill in Above Inputs</code>` +
  `</div>` +
  `<button id="bankrollInvest" onclick="ass();" class="button">Invest</button>` +
  //`<button id="bankrollDivest" onclick="ass();" class="button">Divest</button>` +
  `<span id="bankrollWarning"><i class="fa fa-exclamation-triangle sexyblackoutline" style="color:gold;" aria-hidden="true"></i> Investing in the exchange bankroll may result in loses or profit .<span style="color:red;" title="Click Here to Hide" onClick='$("#bankrollWarning").fadeOut(); bankrollWarning = false;'><i class="fas fa-times"></i></span></span>` +
  `<br><br>` +
  `<b>Investment Explorer</b><br>` +
  `${brtable}` +
  `</center>`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();
    $("#jumboWrapper").html(bankrollContent);
    $("#jumbotron").css({'top':'11%','height':'86vh','width':'25%'});
    $("#jumbotron").center();
    $("#jumbotron").fadeIn();
    $("#jumboTitle").text(`CFD Bankroll Liquidity Investing`);
  });
};

async function showAdmin() {
  loadingjumbo();
  let adminContent = `<center id="adminPageContent">` +
  `<div id="adminWithdrawTable" class="robotable" style="height:25%; width:98%;">` +
  `<table id="adminwd">` +
  `</table>` +
  `</div>` +
  `<br>` +
  `<button id="adminSS" onclick="ass();" class="button">SKIP SYNC</button>` +
  `</center>`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    $("#jumboHead").show();
      $("#jumboWrapper").html(adminContent);
      $("#jumbotron").css({'position':'relative','top':'11%','height':'86vh','width':'25%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Admin Page`);
  });
}

var disclaimerAgree = false;
function showDisclaimer(){
  $("#sitealertpanel").promise().done(function(){
      $("#jumbotron").hide();
      $("#jumbotron").addClass('hidden');
      $("#sitealertpanel").css({'position':'relative','top':'14% !important','height':'79vh !important','width':'25%'});
      $("#sitealertpanel").center();
      $("#sitealertpanel").removeClass('hidden');
      $("#sitealertpanel").fadeIn();
      $("#disclaimerUsername").click();
      $("#disclaimerUsername").focus();
  });
}

function showPricePeakPanel(coin, type){
  if(!coin) coin = "hive";
  if(!type) type = "usd";
  var url;
  if(!usersDataFetch) return;
  $("#alertpricepanel").promise().done(function(){
    $("#alertpricepanel").removeClass('hidden');
    if(type == "usd"){
      url = `<script type="text/javascript">var cf_widget_size = "large"; var cf_widget_from = "HIVE"; var cf_widget_to = "usd"; var cf_widget_name = "pricepanelchart"; var cf_clearstyle = true;</script><script src="https://www.worldcoinindex.com/content/widgets/js/render_widget-min.js" type="text/javascript"></script>`;
    }
    $("#HivePriceDanger").html('<span id="pricepanelchart"></span>' + url);
      //$("#jumbotron").hide();
      $("#alertpricepanel").animate({'bottom':'6%'}, 500);
  });
};

function skclogologinclick(){
  var clickString = `Please See Keychain Popup to Continue`; //<i style="color:white !important;" class="fas fa-long-arrow-alt-right"></i>
  $('#loginfuckery').html(clickString);
  $('#loginfuckery').css({'color':'lawngreen', 'font-weight':'900'});
  $('#proceed').focus();
}

$("#disclaimerUsername").keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    var l = ($("#disclaimerUsername").val()).length;
    if(keycode == "13" && l >= 3 && l <= 16){
        disclaimerOK();
    } else if(keycode == "13"){
      showErr(`Invalid HIVE Username Signed!`);
      flashlose($('#discoflasher'));
    }
});

let bpc;
var betaKey = function(event){
  if(!bpc) return;
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == "13" && bpc.length === 9){
        flashwin($("input#betapass"));
        checkBetaPass();
    }
};

var betaNumPress = (n) => {
  //if(typeof n !== 'number') return;
  if(bpc == undefined) {
    flashwin($("input#betapass"));
    bpc = n;
    $('#betapass').val(bpc);
  } else {
    if(bpc.length > 9) return showErr('Beta Pass is 9 or Less Numbers!');
    bpc += `${n}`;
    $('#betapass').val(bpc);
    bpcll = bpc.length;
    /*
    if(bpc.length < 9 || bpc.length == 3) {
      $("#checkBetaPassButton").prop("title", "Please Enter All Access Beta Pass");
      $("#checkBetaPassButton").prop("disabled", true);
      $("#checkBetaPassButton").addClass("disabledImg");
    } else if (bpc.length === 9 || bpc.length == 3) {
      $("#checkBetaPassButton").prop("title", "Click Here or Hit ENTER to Continue");
      $("#checkBetaPassButton").prop("disabled", false);
      $("#checkBetaPassButton").removeClass("disabledImg");
      submitBetaPass(bpc);
    }
    */
  }
};

 function eyechecker(){
  if($('#toggleBetaPassEye').is(':checked')){
   $("input#betapass").attr("type", "number");
   $("#toggleText").html(`<i class="far fa-eye-slash"></i>`);
  } else {
   $("input#betapass").attr("type", "password");
   $("#toggleText").html(`<i class="far fa-eye"></i>`);
 };
 };


async function showBetaPass() {
  let betapasscontent = `<center id="betaPassContent">` +
  `<b style="font-size:larger;">Enter Your All Access Beta Pass:</b>` +
  `<br>` +
  `<div class="casperInput input-group" style="">` +
  `<span class="input-group-prepend">` +
  `<div>` +
  `<span id="toggleText" onClick="$('#toggleBetaPassEye').click();"><i class="far fa-eye"></i></span>` +
  `<input id="toggleBetaPassEye" type="checkbox" checked onClick="eyechecker();">` +
  `</div>` +
  `</span>` +
  //REMOVE
  `<input type="password" id="betapass" class="input-group-text inputclear" onkeyup="checkBetaPass(); bpc = this.value;" value="" placeholder="" min="1" step="1" aria-describedby="basic-addon2">` +
  `<span class="input-group-append"><span class="input-group-text">` +
  `<b id="betalocklogo" style="color:red;"><i class="fas fa-lock"></i></b>` +
  `</span>` +
  `</span>` +
  `</div>` +
  `<div class="tg-wrap"><table>`+
`<tbody>`+
  `<tr>`+
    `<td><button onClick="betaNumPress(1);" class="button numButton" >1</button></td>`+
    `<td><button onClick="betaNumPress(2);" class="button numButton" >2</button></td>`+
    `<td><button onClick="betaNumPress(3);" class="button numButton" >3</button></td>`+
  `<tr>`+
  `</tr>`+
    `<td><button onClick="betaNumPress(4);" class="button numButton" >4</button></td>`+
    `<td><button onClick="betaNumPress(5);" class="button numButton" >5</button></td>`+
    `<td><button onClick="betaNumPress(6);" class="button numButton" >6</button></td>`+
  `</tr>`+
  `<tr>`+
    `<td><button onClick="betaNumPress(7);" class="button numButton" >7</button></td>`+
    `<td><button onClick="betaNumPress(8);" class="button numButton" >8</button></td>`+
    `<td><button onClick="betaNumPress(9);" class="button numButton" >9</button></td>`+
  `</tr>`+
  `<tr>`+
    `<td><button onclick="$('input#betapass').val(''); bpc = ''; flashlose('input#betapass'); checkBetaPass(); " class="button numButton" ><i class="fas fa-undo-alt"></i></button></td>`+
    `<td><button onClick="betaNumPress(0);" class="button numButton" >0</button></td>`+
    `<td><button onclick="if(!bpc){return bpc = '';}; bpc = bpc.slice(0, -1); $('input#betapass').val(bpc); checkBetaPass(); flashlose('input#betapass');" class="button numButton" title='Backspace'><i class="fas fa-backspace"></i></button></td>`+
  `</tr>`+
`</tbody>`+
`</table>`+
`</div>`+
  `<br>`+
  `<button id="checkBetaPassButton" onclick="submitBetaPass($('input#betapass').val());" class="button" title="Please Enter All Access Beta Pass">ENTER <i class="fas fa-sign-in-alt"></i></button>` +
  `<div id="betapassfooter" style="position:absolute;bottom:0%;width:100% !important;">` +
  `</div>` +
  `</center>`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
    //$("#jumboHead").hide();
      $("#jumboClose").hide();
      $("#jumboWrapper").html(betapasscontent);
      $('#toggleBetaPassEye').click();
      $("#jumbotron").css({'top':'30%','height':'85%','width':'15%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("input#betapass").click();
      $("input#betapass").focus();
      $("#jumboTitle").text(`Security`);
  });
};

async function showRepayWindow(loanData) {
  console.log(`showRepayWindow(loanData)`);
  console.log(loanData)
  loadingjumbo();
  try {
    //loanData = JSON.stringify(loanData);
  } catch (e) {console.log(e);showErr(`Failed to Parse Loan Data!`)};
  var newinterest = (loanData.interest / 100);
  var totalpayments = (loanData.days / 7);
  var totalrepay =  loanData.amount + (loanData.amount * newinterest);
  var paymentSum = (totalrepay / totalpayments);
  var collected = loanData.collected;
  var outstandingDebt = (totalrepay - collected);
  var encrypted;
  var superamtvar;
  //console.log(`showRepayWindow(${user}, ${contractID}, ${limit}, ${loanData}) `);
  var paymentcontent = `<h3 class="pagehead" style="color:white !important;">Manual Payment of Lending Contract Debt<br><sup><code>Lending Contract #<span id="contractsurrenderID"></span><br><br><span id="contractFinalizeData"></span></code></sup></h3><table><tbody><tr><td>Amount of HIVE to Repay:<br><input type="text" onchange="return manualPay = $(this).val();" id="paymentAmt" style="background: white; color: black; text-align: center; width: 80%; height: 3vh; font-size: large; border-radius: 10px;"></td></tr><tr><td>Once the Outstanding Contract Balance is Paid you're given your Owner Key</td></tr><tr><td><button class="button" id="submitmanualpayment" onclick="payloan('${loanData.borrower}', '${loanData.loanId}', document.getElementById('paymentAmt').value)">Submit Payment</button></td></tr><tr><td><span id="acceptTitle"></span></td></tr><tr><td><span id="acceptOutcome"></span></td></tr></tbody></table>`;
  $("#jumbotron").fadeOut('fast');
  $("#jumbotron").promise().done(function(){
  $("#jumboHead").show();
  $("#jumboWrapper").html( paymentcontent);
  $("#userAcctPass").val(user);
      $("#contractsurrenderID").html(loanData.loanId);
      $("#contractFinalizeData").html(`${(loanData.amount / 1000).toFixed(3)} HIVE being Loaned by this Lending Contract<br>requiring ${totalpayments} <span id="surrenderpayments"></span> of ${(paymentSum / 1000).toFixed(3)} HIVE Paid Weekly<br>to the Sum of ${(totalrepay / 1000).toFixed(3)} HIVE over ${loanData.days} Days<br><br><br>Outstanding Contract Balance:<br>${((outstandingDebt / 1000).toFixed(3))} HIVE`);
      if (totalpayments == 1) {
      $("#surrenderpayments").html('payment');
      } else {
        $("#surrenderpayments").html('payments');
      }
      $("#jumbotron").css({'top':'11%','height':'auto','width':'25%'});
      $("#jumbotron").center();
      $("#jumbotron").fadeIn();
      $("#jumboTitle").text(`Manual Repayment`);
  });
};
