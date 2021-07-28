/****************************************************************************
* On document load
***************************************************************************/
let userLocalCheck = window.localStorage.getItem("user");
let tokenLocalcheck = window.localStorage.getItem("token");
var particlesStart;
$(document).ready(function() {
  try {
    userLocalCheck = window.localStorage.getItem("user");
    tokenLocalcheck = window.localStorage.getItem("token");
  } catch (e){
    console.log(`Couldn't get user or token`);
  }
  $('#jumboMove').click();

  socket.emit('latency', Date.now(), function(startTime, cb) {
      var latency = ((Date.now() - startTime) / 2).toFixed(2);
      if(!oldLatency) oldLatency = latency;
      $("#ping").html(latency);
      if(latency < oldLatency) {
        flashwin($("#ping"));
      } else if (latency > oldLatency) {
        flashlose($("#ping"));
      } else if(latency == oldLatency) {

      }

  });


particlesStart = function() {
  $('#particles-js').css({'background-position':'right','background-repeat':' no-repeat','background-size':'100% !important','background-color':'rgba(0,0,0,0)','background':'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)','background-image':'none'});
   particlesJS("particles-js", {
  "particles": {
      "number": {
          "value": 400,
          "density": {
              "enable": true,
              "value_area": 1000
          }
      },
      "shape": {
         "type": "image",
         "stroke": {
           "width": 0,
           "color": "#444444"
         },
         "image": {
           "src": "/img/logo-hive.png",
            "width": 110,
            "height": 100
          }
        },
      "opacity": {
          "value": 1,
          "anim": {
              "enable": true
          }
      },
      "size": {
          "value": 10,
          "random": true,
          "anim": {
              "enable": true,
              "speed": 3
          }
      },
      "line_linked": {
          "enable": false,
          "distance": 0,
          "color": "#000000",
          "opacity": 0,
          "width": 0
      },
      "move": {
        "enable": true,
        "speed": 0.5,
        "direction": "top",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": true,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
   }
});
/*
   particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 100,
        "density": {
          "enable": true,
          "value_area": 700
        }
      },
      "color": {
        "value": "#000000"
      },
      "shape": {
         "type": "image",
         "stroke": {
           "width": 1,
           "color": "#444444"
         },
         "image": {
           "src": "/img/logo-hive.png",
            "width": 110,
            "height": 100
          }
        },
      "opacity": {
        "value": 1,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 3,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 12,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "size_min": 3,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 200,
        "color": "#00ff00",
        "opacity": 0.2,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "top",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": true,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "window",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "bubble"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 15,
          "size": 15,
          "duration": 1,
          "opacity": 1,
          "speed": 1
        },
        "repulse": {
          "distance": 20,
          "duration": 1,
        },
        "attract": {
          "distance": 50,
          "duration": 1
        },
        "push": {
          "particles_nb": 3
        },
        "remove": {
          "particles_nb": 3
        }
      }
    },
    "retina_detect": true
  });
  */
}
  particlesStart();
});


var bgclick = 0;
$("#particles-js").on('click',function(){
  bgclick++;
  if(bgclick === 42){
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window["pJSDom"] = [];
    showSuccess('Nyan Nyan Nyan Nyan NyanNyanNyan Nyan Nyan');
    $('#chatClose').click();
    $('#jumboClose').click();
    nyannyan.play();
    $('#particles-js').css({'background-position':'right','background-repeat':' no-repeat','background-size':'60% !important','background-color':'#043564 !important','background-image':'url("http://127.0.0.1/img/nyan.gif")'});
   // /$('#particles-js').css({'background-image':'/img/nyan.gif'});
   particlesJS("particles-js", {
     "particles": {
       "number": {
         "value": 100,
         "density": {
           "enable": false,
           "value_area": 800
         }
       },
       "color": {
         "value": "#ffffff"
       },
       "shape": {
         "type": "star",
         "stroke": {
           "width": 0,
           "color": "#000000"
         },
         "polygon": {
           "nb_sides": 5
         }
       },
       "opacity": {
         "value": 0.5,
         "random": false,
         "anim": {
           "enable": false,
           "speed": 1,
           "opacity_min": 0.1,
           "sync": false
         }
       },
       "size": {
         "value": 4,
         "random": true,
         "anim": {
           "enable": false,
           "speed": 40,
           "size_min": 0.1,
           "sync": false
         }
       },
       "line_linked": {
         "enable": false,
         "distance": 150,
         "color": "#ffffff",
         "opacity": 0.4,
         "width": 1
       },
       "move": {
         "enable": true,
         "speed": 14,
         "direction": "left",
         "random": false,
         "straight": true,
         "out_mode": "out",
         "bounce": false,
         "attract": {
           "enable": false,
           "rotateX": 600,
           "rotateY": 1200
         }
       }
     },
     "interactivity": {
       "detect_on": "canvas",
       "events": {
         "onhover": {
           "enable": false,
           "mode": "grab"
         },
         "onclick": {
           "enable": true,
           "mode": "repulse"
         },
         "resize": true
       },
       "modes": {
         "grab": {
           "distance": 200,
           "line_linked": {
             "opacity": 1
           }
         },
         "bubble": {
           "distance": 400,
           "size": 40,
           "duration": 2,
           "opacity": 8,
           "speed": 3
         },
         "repulse": {
           "distance": 200,
           "duration": 0.4
         },
         "push": {
           "particles_nb": 4
         },
         "remove": {
           "particles_nb": 2
         }
       }
     },
     "retina_detect": false
   });
 } else if(bgclick === 43){
       nyannyan.pause();
     window.pJSDom[0].pJS.fn.vendors.destroypJS();
     window["pJSDom"] = [];
     particlesStart();
 }
//http://vincentgarreau.com/particles.js/assets/img/kbLd9vb_new.gif
});



function heartbeat(){
  hbeats++;
  if((hbeats % 4) == 1) {
    $('#pingheart').html('<i class="fas fa-fw fa-heart"></i>');
    //$('#pingheart').css({'font-size':'small'});
    flashwin($('#pingheart'));
  } else if((hbeats % 3) == 1) {
    $('#pingheart').html('<i class="fas fa-fw fa-heartbeat"></i>');
        flashwin($('#pingheart'));
    //$('#pingheart').css({'font-size':'revert'});
    //$('#pingheart').animate({'font-size':'normal'}, 500);
  } else {
    //$('#pingheart').css({'font-size':'large'});
  }
  if(hbeats >= 4) hbeats = 0;
}

var hbeats = 0;
//var heartbeating = setInterval(heartbeat, 1000);

function stopHeart() {
  console.log(`stop heart`)
  clearInterval(heartbeating);
}



var latency = 0;
var oldLatency;
var pingsend = setInterval(function() {
  var pingdead = setInterval(function() {
    $('#pingheart').html('<i class="fas fa-fw fa-heart-broken" style="color:red;" title="Connection to Server has Been Lost!"></i>');
  }, 9000);
    socket.emit('latency', Date.now(), function(startTime, cb) {
      if(startTime) clearInterval(pingdead);
        latency = ((Date.now() - startTime) / 2).toFixed(2);
        if(typeof oldLatency == undefined) oldLatency = latency;
        $("#ping").html(latency);
        if(latency < oldLatency) {
          //flashwin($("#ping"));
          oldLatency = latency;
        } else if (latency > oldLatency) {
          //flashlose($("#ping"));
          oldLatency = latency;
        } else if(latency == oldLatency) {
          oldLatency = latency;
        } else if(latency > 1000) {
          $('#pingheart').html('<i class="fas fa-fw fa-heart-broken" style="color:red;" title="Connection to Server is Unstable"></i>');
          $("#ping").html(`Connection Lost!`);
        }

    });
  }, 3000);

//Logut button
$("#logout").on('click',function(){
	socket.close();
  socket.open();
});


/****************************************************************************
* Mouse actions
***************************************************************************/
/*Active button stay down hack */
jQuery('push_button2').click(function(){
   jQuery(this).toggleClass('push_button2:active');
});

//Login button function 2FA needs to be implemented..?
/*
$("#login").on('click',function(){
  console.log(`Logging in?`);
  if (typeof userLocalCheck != undefined) {
      showSuccess(`${userLocalCheck} Account Found!`);
      socket.emit("loginopen", {username: userLocalCheck},function(err, data){
        if (err) return showErr(err);
        showSuccess(data);
      });
  }
});
*/

window.onload = function() {


};


var minichartopen = true;
$('#alertPriceClose').click(function() {
  if(minichartopen == true) {
      $('#alertPriceClose').html("<i class='fa fa-caret-up'></i>");
      $('#alertpricepanel').animate({'bottom':'-33%'},500);
      minichartopen = false;
  } else {
    $('#alertPriceClose').html("<i class='fa fa-caret-down'></i>")
    $('#alertpricepanel').animate({'bottom':'6%'},500);
    minichartopen = true;
  }
});


//Chat input hotkey disabler - needs work still
$('#chatText.trollslot').click(function()  {
	if($('#hotkeyToggle').hasClass('on') && $('#hotkeyToggle').hasClass('enabled')) {
	$('#hotkeyToggle')[0].click();
			$('#hotkeyToggle').addClass('enabled');
	}
});

$('#chatText.trollslot').blur(function(){
	if($('#hotkeyToggle').hasClass('enabled')) {
	$('#hotkeyToggle')[0].click();
}});

$('#sound').click(function() {
		// on odd clicks do this
		if (!$('#sound').hasClass("soundon")) {
			$('#sound').html('<i class="fa fa-volume-up fa-2x" aria-hidden="true" style="padding-right:0px;"></i>');
			$('#sound').toggleClass("soundon");
      soundgen('440.0', 'triangle');
			//clicksound.play();
			//showSuccess('<i class="fa fa-2x fag-2x fa-check-circle" style="color:lawngreen;float:left;margin-top:-1%;"></i> Sound Enabled').dismissOthers();
			var soundon = true;
		}	 else {
			$('#sound').html('<i class="fa fa-volume-off fa-2x" aria-hidden="true" style="padding-right:14px;"></i>');
			$('#sound').toggleClass("soundon");
			//showErr('<i class="fa fa-2x far-2x fa-exclamation-circle" style="color:red;float:left;margin-top:-1%;"></i> Sound Disabled').dismissOthers();
			var soundon = false;
		}
});


$("#autoBetAmount").keyup( function (e) {
 //if the letter is not digit then display error and don't type anything
		$("#autoToWin").val(floor($("#autoBetAmount").val()*($("#autoMultiplier").val()-1),8));
});

$("#autoOdds").keyup(function (e) {
	if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57 ) ) {
        return false;
    }
 //if the letter is not digit then display error and don't type anything *** Line 17 is giving us some problems for sure...
    if ((($("#autoOdds").val()<=99) && ($("#autoOdds").val()>0.01)) || $("#autoOdds").val()!==""){
		    $("#autoMultiplier").val(round(99/$("#autoOdds").val(),10));
    }
    		$("#autoToWin").val(floor($("#autoBetAmount").val()*($("#autoMultiplier").val()-1),8));
});

$("#autoToWin").keyup(function (e) {
	$("#autoBetAmount").val(ceil($("#autoToWin").val()/($("#autoMultiplier").val()-1),8));
});
$("#setAutoLo").on('click',function(){
  $("#autoBetType").val("lo");
});

$("#betAmount").keyup( function (e) {
 //if the letter is not digit then display error and don't type anything
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57 ) ) {
        return false;
    }
     $("#autoToWin").val($("#autoBetAmount").val()*$("#autoMultiplier").val()-$("#autoBetAmount").val());

});

function openMainLoanTab() {
  console.log(`openMainLoanTab() called!`)
  socket.emit('loadallloans', {token: token}, function(err, data){
    if(err) {
     showErr(`An Error Occured!`);
     console.log(err)
    }
    if(data) {
      console.log(data[0])
      data = data[0]
      usersLoanDataFetch = data;
      //showSuccess(data);
    }
  });
}

function openLendingTab() {
  console.log(`openLendingTab() called!`)
    socket.emit('loadmyloans', {token: token}, function(data){
      if(data) {
        usersLoanDataFetch = data[0];
        //showSuccess(data);
      }
    });
}

function futuresPrice() {
    console.log(`futuresPrice() called!`)
    socket.emit('loadmyfutures', {token: token}, function(err, data){
      if(err) {
       showErr(`An Error Occured!`);
       console.log(err)
      }
      if(data) {
        console.log(data);
        $('#longSpotPrice').val((data.hivelongprice).toFixed(6));
        $('#shortSpotPrice').val((data.hiveshortprice).toFixed(6));
      }
    });
}

function openShares() {
    socket.emit('loadaallshares', {token: token}, function(err, data){
      if(err) {
        showErr(`An Error Occured!`);
        console.log(err)
      }
      if(data) {
        //showSuccess(data);
      }
    });
}

function openAllLoansTab() {
    console.log(`openAllLoansTab() called!`)
    socket.emit('loadallloans', {token: token}, function(err, data){
      if(err) {
       showErr(`An Error Occured!`);
       console.log(err)
      }

      if(data) {
        showSuccess(data)
        data = data[0]
        usersLoanDataFetch = data;
        //showSuccess(data);
      }
    });
}

function createNewMainBorrow() {
  if(debug === true) console.log(`createNewMainBorrow`);
  if(typeof $("#borrowCreateAmount").val() == undefined) showErr('Amount is not Specified!');
  if(typeof $("#borrowCreateDuration").val() == undefined) showErr('Duration is not Specified!');
  if(typeof $("#borrowCreateInterest").val() == undefined) showErr('Interest is not Specified!');
  createNewLendingContract(parseInt($("#borrowCreateAmount").val()), parseInt($("#borrowCreateDuration").val()), parseInt($("#borrowCreateInterest").val()), false);
}

function createNewMainLoan() {
  if(debug === true) console.log(`createNewMainLoan`);
  if(typeof $("#loanCreateAmount").val() == undefined) showErr('Amount is not Specified!');
  if(typeof $("#loanCreateDuration").val() == undefined) showErr('Duration is not Specified!');
  if(typeof $("#loanCreateInterest").val() == undefined) showErr('Interest is not Specified!');
  createNewLendingContract(parseInt($("#loanCreateAmount").val()), parseInt($("#loanCreateDuration").val()), parseInt($("#loanCreateInterest").val()), true);
}

function createNewLendCont() {
  if(debug === true) console.log(`createNewLendCont`);
  if(typeof $("#newamount").val() == undefined) showErr('Amount is not Specified!');
  if(typeof $("#newdays").val() == undefined) showErr('Duration is not Specified!');
  if(typeof $("#newfee").val() == undefined) showErr('Preview Failed to Calculate!');
  createNewLendingContract(parseInt($("#newamount").val()), parseInt($("#newdays").val()), parseInt($("#newfee").val()), true);
}

function loginPush(username, token) {
  console.log(`loginPush(${username}, ${token})`);
  socket.emit('login', {
      username: username,
      password: token,
      '2fa': $('#2fa').val()
  }, function(err, data) {
    if(err)console.log(err);
    if(data){
      console.log(data);
    }
  })
}

jQuery.fn.center = function () {
    this.css("position","absolute !important");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px !important");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +  $(window).scrollLeft()) + "px !important");
    return this;
}

/*******************************************************************************************************************
* Key presses actions
*******************************************************************************************************************/

var contractMenu = function(ele, contractID, data) {
  $('.iw-contextMenu').contextMenu('destroy'); $('.iw-cm-menu').contextMenu('destroy');
  var contMenu;
  if(contractID == undefined) return;
  if(ele == undefined) return;
  data = JSON.parse(JSON.stringify(data));
  socket.emit("loanmenu", {
      element: ele,
      data: data,
      contractID: contractID
  }, function(err, data) {
      if (err) {
          return showErr(`Error: ${err}`);
      }
      if (data) {
          console.log(data);
          var menutype = data.menu;
          var loanId = data.loanId;
          var deployuser = data.user;
          var messageid = contractID;

          if(menutype === "admin"){
            contMenu = [
              {
                  name: `<code style="font-size:smaller;align-text:center;color:black;text-shadow:none;" title="Click Here to Open Transaction on HiveBlocks.com">${data.loanId}</code>`,
                  fun: function () {
                    showSuccess(`Opening Transaction on HiveBlocks.com...`);
                    return window.open(`https://hiveblocks.com/tx/${loanId}`);
                  }
              },
              {
                  name: '🧾View Contract',
                  fun: function () {
                          getUserBlog(user)
                  }
              },
              {
                  name: '💀Cancel Contract',
                  fun: function () {
                    if(data.state != 'accepted'){
                      console.log(`data`);
                      console.log(data);
                      cancelContract(loanId)
                    } else {
                      showErr(`ERROR: Cannot Cancel Active Loans!`);
                    }
                  }
              },
              /*{
                  name: '🛠Edit Contract',
                  fun: function () {
                          getUserBlog(user)
                  }
              },*/
              {
                  name: '💸View Lender Profile',
                  fun: function () {
                          getUserBlog(user)
                  }
              },
              {
                  name: '🤑View Borrower Profile',
                  fun: function () {
                          getUserBlog(user)
                  }
              }
            ];
          } else if (menutype === "moderator") {
            contMenu = [
              {
                name: `<code style="font-size:smaller;align-text:center;color:black;text-shadow:none;" title="Click Here to Open Transaction on HiveBlocks.com">${data.loanId}</code>`,
                fun: function () {
                  showSuccess(`Opening Transaction on HiveBlocks.com...`);
                  return window.open(`https://hiveblocks.com/tx/${loanId}`);
                }
              },
              {
                  name: '🧾View Contract',
                  fun: function () {
                          getUserBlog(user)
                  }
              },
              {
                  name: '💸View Lender Profile',
                  fun: function () {
                          getUserBlog(user)
                  }
              },
              {
                  name: '🤑View Borrower Profile',
                  fun: function () {
                          getUserBlog(user)
                  }
              }
            ];
          } else {
            contMenu = [
              {
                name: `<code style="font-size:smaller;align-text:center;color:black;text-shadow:none;" title="Click Here to Open Transaction on HiveBlocks.com">${data.loanId}</code>`,
                fun: function () {
                  showSuccess(`Opening Transaction on HiveBlocks.com...`);
                  return window.open(`https://hiveblocks.com/tx/${loanId}`);
                }
              },
              {
                  name: '🧾View Contract',
                  fun: function () {
                          getUserBlog(user)
                  }
              },
              {
                  name: '💀Cancel Contract',
                  fun: function () {
                    if(user == deployuser ){
                      console.log(`data`);
                      console.log(data);
                      cancelContract(loanId)
                    } else if(data.state != 'accepted') {
                      showErr(`Cannot Cancel Active Contracts!`);
                    } else {
                      showErr(`Invalid Permissions to Cancel Contract!`);
                    }

                  }
              },
              {
                  name: '💸View Lender Profile',
                  fun: function () {
                          getUserBlog(user)
                  }
              },
              {
                  name: '🤑View Borrower Profile',
                  fun: function () {
                          getUserBlog(user)
                  }
              },
            ];
          }
          console.log(ele)
          //ele.context.activeElement
          // triggerOn:'contextmenu'
          try {
            $(ele[0]).contextMenu(contMenu, {'sizeStyle': 'content', 'closeOther': true,  'displayAround': 'cursor', 'closeOnClick': true, 'trigger': 'focusin', 'containment': ele[0].firstChild, 'position': 'left'});
          } catch(e){
            console.log(e)
          }
      }
});
}

var updatebet = function(el, amount) {
    el.val(amount).keyup();
};

/*********************************************************************************
* CHAT
********************************************************************************/

var userMenu = function(el, data, msgid) {
  $('.iw-contextMenu').contextMenu('destroy'); $('.iw-cm-menu').contextMenu('destroy');
    var menutype = data.menu;
    var socketid = data.socketid;
    console.log(el)
    socket.emit("chatmenu", {
        username: data,
        socketid: socketid
    }, function(err, data) {
        if (err) {
            showErr("Something Messed Up!");
        }
        if (data) {
            //console.log(data);
            menutype = data.menu;
            user = data.user;
            source = data.source;
            uid = data.uid;
            messageid = data.rng;
        }

        if (menutype === "admin") {
            menu = [
              {name: '👤 Profile',fun: function () {getUserProfile(user)}},
              {name: '🔎Blog <i class="fas fa-external-link-alt" title="Clicking this will Open a New Window"></i>',fun: function () {getUserBlog(user)}},
              {name: '<b>💲Tip</b>',fun: function() {$("#tipbalance").val($("#balance").val());
                        bootbox.dialog({
                            message: '<center><span class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style=""><i class="fa fa-at fa-2x"></i></span>' +
                                '<b><input type="text" class="form-control" placeholder="User" aria-describedby="basic-addon1" id="tipto" style="" ></b><span class="input-group-addon addon-sexy" style="">User</span></span>' +
                                '<br><span class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style=""><b>Tip</b></span>' +
                                '<b><input type="number" class="form-control" placeholder="0.000" id="tipamount" aria-describedby="basic-addon1"></b>' +
                                '<span class="input-group-addon addon-sexy" style="padding:5px;"><img src="img/rhom.svg" class="modalLogo"></span></span>' +
                                "<script>var currencyLogo = $('img.dd-selected-image').attr('src');$('img.modalLogo').attr('src', currencyLogo);</script>",
                            title: `<center><b class="sexytitle">Rhom-Roller.com</b><br>Tip Some ${$('#currentCurrency').val().toUpperCase()} to Another User Instantly</center>`,
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
                                                token = data.token;
                                                return showErr("Tip Send Failed!");
                                            }
                                            //console.log(data);
                                            token = data.token; //token is always returned
                                                $("#balance").val((data.balance / 100000000).toFixed(8));
                                            showSuccess("Tip Sent!");
                                        });
                                    }
                                }
                            }
                        });
                        $("#tipto").val(user);
                    }
                },
                {name: '<b>💬Message</b>',fun: function(){$("#chatText").val(`/msg ${user} `);$("#chatText").focus();},},
                {
                    name: '<b>📊Stats</b>',
                    fun: function() {
                        userstatsDialogAdmin(data.user);
                    }
                },
                {
                    name: '<b>🗑️Delete</b>',
                    fun: function() {
                        //console.log("ADMIN MENU: DELETE " + user);
                        //console.log(`data`);
                        //console.log(data);

                        socket.emit('deletemsg', {
                            msgid: msgid,
                            token: token
                        }, function(err, data) {
                            if (err) {
                              token = data.token;
                                alertChatMessage({
                                    message: err,
                                    date: (new Date).toUTCString()
                                });
                            }
                            if (data) {
                                token = data.token;
                                showSuccess(`Chat Message Deleted`);
                            }

                        });
                    }
                },
                {
                    name: '<b>🔒Lock</b>',
                    fun: function() {
                        //console.log("ADMIN MENU: LOCK " + user);
                        //console.log(`data`);
                        //console.log(data);

                        socket.emit('lockuser', {
                            username: user,
                            token: token
                        }, function(err, data) {
                            if (err) {
                                token = data.token;
                                alertChatMessage({
                                    message: err,
                                    time: Date.now()
                                });
                            }
                            if (data) {
                              token = data.token;
                                //showSuccess(`${JSON.parse(data)}`);
                            }

                        });
                    }
                },
                {
                    name: '<b>🔓Unlock</b>',
                    fun: function() {
                        //console.log("ADMIN MENU: UNLOCK " + user);
                        //console.log(`data`);
                        //console.log(data);

                        socket.emit('unlockuser', {
                          username: user,
                          token: token
                        }, function(err, data) {
                            if (err) {
                              token = data.token;
                                alertChatMessage({
                                    message: err,
                                    time: Date.now()
                                });
                            }
                            if (data) {
                              token = data.token;
                                //showSuccess(`${JSON.parse(data)}`);
                            }

                        });
                    }
                },
                {
                    name: '<b>🔇Mute</b>',
                    fun: function() {
                        socket.emit('mute', {
                            username: user,
                            token: token
                        }, function(err, data) {
                            if (err) {
                              token = data.token;
                                alertChatMessage({
                                    message: err,
                                    date: (new Date).toUTCString()
                                });
                            }
                            if (data) {
                              token = data.token;
                                showSuccess(`User Muted!`);
                            }

                        });
                    }
                }, {
                    name: '<b>🔊Unmute</b>',
                    fun: function() {
                        socket.emit('unmute', {
                            username: user,
                            token: token
                        }, function(err, data) {
                            if (err) {
                              token = data.token;
                                alertChatMessage({
                                    message: err,
                                    date: (new Date).toUTCString()
                                });
                            }
                            if (data) {
                              token = data.token;
                                showSuccess(`User Unmuted`);
                            }

                        });
                    }
                },
                {
                    name: '<b>👞Kick</b>',
                    fun: function() {
                        console.log("ADMIN MENU: KICK " + user);
                        socket.emit('getSocketId', {
                            username: user,
                            token: token
                        }, function(err, data) {
                            if (err) {
                              token = data.token;
                                return showErr(err);
                            }
                            if (data) {
                              token = data.token;
                                var socketmsgid = data;
                                socket.emit('kickuser', {
                                    username: user,
                                    socketid: data.socketid,
                                    msg: "Admin Menu Kicked You!",
                                    token: token
                                }, function(err, data) {
                                    if (err) {
                                      token = data.token;
                                        console.log(err);
                                        return showErr("Unable to Find IP!").dismissOthers;
                                    }
                                    if (data) {
                                      token = data.token;
                                        var msg = data.msg;
                                        alertChatMessage({
                                            message: msg,
                                            date: (new Date).toUTCString()
                                        });
                                    }
                                });
                            }
                        });
                    }
                },
                {
                    name: '<b>⛔Ban</b>',
                    fun: function() {
                        console.log("ADMIN MENU: BAN " + user);
                        alertChatMessage({
                            message: "This Function isn't Implemented Yet!",
                            date: (new Date).toUTCString()
                        });
                    }
                },
                {
                    name: '<b>🌐IP</b>',
                    fun: function() {
                        console.log("ADMIN MENU: IP " + user);
                        socket.emit('getIP', {
                            username: user,
                            token: token
                        }, function(err, data) {
                            if (err) {
                              token = data.token;
                              return showErr(err);
                            }
                            if (data) {
                                token = data.token;
                                var userip = data.ip;
                                var username = data.username;
                                userip = ipParse(userip);
                                alertChatMessage({
                                    message: `${username}'s IP Address: ${userip}`,
                                    date: (new Date).toUTCString()
                                });
                            }
                        });
                    }
                },
                {
                    name: '<b>☂️RainBan</b>',
                    fun: function() {
                        socket.emit('rainban', {
                            user: user,
                            token: token
                        }, function(err, data) {
                            if (err) {
                              token = data.token;
                                showErr("RainBan Failed!");
                                return;
                            }
                            if(data){
                              token = data.token;
                              alertChatMessage({
                                  message: `User Given RainBan!`,
                                  date: (new Date).toUTCString()
                              });
                            }
                        });
                    }
                },
                {
                    name: '<b>☔RainAdd</b>',
                    fun: function() {
                        socket.emit('rainadd', {
                            user: user,
                            token: token
                        }, function(err, data) {
                            if (err) {
                                token = data.token;
                                showErr("RainAdd Failed!");
                                return;
                            }
                            if(data){
                              token = data.token;
                              alertChatMessage({
                                  message: `User Given RainAdd!`,
                                  date: (new Date).toUTCString()
                              });
                            }
                        });
                    }
                },
                {
                    name: '<b>🏆Promote</b>',
                    fun: function() {
                        socket.emit('promote', {
                            username: user,
                            token: token
                        }, function(err, data) {
                            if (err) {
                              token = data.token;
                              showErr("Promote User Failed!");
                            }
                            if (data) {
                              token = data.token;
                              showSuccess(data);
                            }
                        });
                    }
                },
                {
                    name: '<b>⬇Demote</b>',
                    fun: function() {
                        socket.emit('demote', {
                            username: user,
                            token: token
                        }, function(err, data) {
                            if (err) {
                                token = data.token;
                                showErr("Demote User Failed!");
                            }
                            if (data) {
                                token = data.token;
                                showSuccess(data);
                            }
                        });
                    }
                },
                {
                    name: '<b>🧊Freeze</b>',
                    fun: function() {
                        socket.emit('freeze', {
                            token: token
                        }, function(err, data) {
                            if (err) {
                                token = data.token;
                                showErr("Site Freeze Failed!");
                            }
                            if (data) {
                                token = data.token;
                                showSuccess(`Site is Frozen!`);
                            }
                        });
                    }
                },
                {
                    name: '<b>💦Unfreeze</b>',
                    fun: function() {
                        socket.emit('unfreeze', {
                            token: token
                        }, function(err, data) {
                            if (err) {
                                token = data.token;
                                showErr("Site Unfreeze Failed!");
                            }
                            if (data) {
                                token = data.token;
                                showSuccess(`Site is Unfrozen!`);
                            }
                        });
                    }
                }
            ];
        } else if (menutype === "moderator") {
            menu = [
              {
                  name: '👤 Profile',
                  fun: function () {
                          getUserProfile(user)
                  }
              },
              {
                  name: '🔎Blog <i class="fas fa-external-link-alt" title="Clicking this will Open a New Window"></i>',
                  fun: function () {
                          getUserBlog(user)
                  }
              },
              {
              name: '<b>💲Tip</b>',
              fun: function() {
                  $("#tipbalance").val($("#balance").val());

                  bootbox.dialog({
                      message: '<center><span class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style=""><i class="fa fa-at fa-2x"></i></span>' +
                          '<b><input type="text" class="form-control" placeholder="User" aria-describedby="basic-addon1" id="tipto" style="" ></b><span class="input-group-addon addon-sexy" style="">User</span></span>' +
                          '<br><span class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style=""><b>Tip</b></span>' +
                          '<b><input type="number" class="form-control" placeholder="0.000" id="tipamount" aria-describedby="basic-addon1"></b>' +
                          '<span class="input-group-addon addon-sexy" style="padding:5px;"><img src="img/rhom.svg" class="modalLogo"></span></span>' +
                          "<script>var currencyLogo = $('img.dd-selected-image').attr('src');$('img.modalLogo').attr('src', currencyLogo);</script>",
                      title: `<center><b class="sexytitle">Rhom-Roller.com</b><br>Tip Some ${$('#currentCurrency').val().toUpperCase()} to Another User Instantly</center>`,
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
                                          token = data.token;
                                          return showErr("Tip Send Failed!");
                                      }
                                      //console.log(data);
                                      token = data.token; //token is always returned
                                      $("#balance").val((data.balance / 100000000).toFixed(8));
                                      showSuccess("Tip Sent!");
                                  });
                              }
                          }
                      }
                  });
                  $("#tipto").val(user);
              }
          },

          {
              name: '<b>💬Message</b>',
              fun: function() {
                  $("#chatText").val(`/msg ${user} `);
                  $("#chatText").focus();
              }, //END fun:function

          },

          {
              name: '<b>📊Stats</b>',
              fun: function() {
                  userstatsDialogAdmin(data.user);
              }
          },
          {
              name: '<b>🗑️Delete</b>',
              fun: function() {
                  //console.log("ADMIN MENU: DELETE " + user);
                  //console.log(`data`);
                  //console.log(data);
                  socket.emit('deletemsg', {
                      msgid: msgid,
                      token: token
                  }, function(err, data) {
                      if (err) {
                        token = data.token;
                          alertChatMessage({
                              message: err,
                              date: (new Date).toUTCString()
                          });
                      }
                      if (data) {
                          token = data.token;
                          showSuccess(`Chat Message Deleted`);
                      }

                  });
              }
          },
          {
              name: '<b>🔒Lock</b>',
              fun: function() {
                  //console.log("ADMIN MENU: LOCK " + user);
                  //console.log(`data`);
                  //console.log(data);

                  socket.emit('lockuser', {
                      username: user,
                      token: token
                  }, function(err, data) {
                      if (err) {
                          token = data.token;
                          alertChatMessage({
                              message: err,
                              time: Date.now()
                          });
                      }
                      if (data) {
                        token = data.token;
                          //showSuccess(`${JSON.parse(data)}`);
                      }

                  });
              }
          },
          {
              name: '<b>🔓Unlock</b>',
              fun: function() {
                  //console.log("ADMIN MENU: UNLOCK " + user);
                  //console.log(`data`);
                  //console.log(data);

                  socket.emit('unlockuser', {
                    username: user,
                    token: token
                  }, function(err, data) {
                      if (err) {
                        token = data.token;
                          alertChatMessage({
                              message: err,
                              time: Date.now()
                          });
                      }
                      if (data) {
                        token = data.token;
                          //showSuccess(`${JSON.parse(data)}`);
                      }

                  });
              }
          },
          {
              name: '<b>🔇Mute</b>',
              fun: function() {
                  socket.emit('mute', {
                      username: user,
                      token: token
                  }, function(err, data) {
                      if (err) {
                        token = data.token;
                          alertChatMessage({
                              message: err,
                              date: (new Date).toUTCString()
                          });
                      }
                      if (data) {
                        token = data.token;
                          showSuccess(`User Muted!`);
                      }

                  });
              }
          }, {
              name: '<b>🔊Unmute</b>',
              fun: function() {
                  socket.emit('unmute', {
                      username: user,
                      token: token
                  }, function(err, data) {
                      if (err) {
                        token = data.token;
                          alertChatMessage({
                              message: err,
                              date: (new Date).toUTCString()
                          });
                      }
                      if (data) {
                        token = data.token;
                          showSuccess(`User Unmuted`);
                      }

                  });
              }
          },
          {
              name: '<b>👞Kick</b>',
              fun: function() {
                  console.log("ADMIN MENU: KICK " + user);
                  socket.emit('getSocketId', {
                      username: user,
                      token: token
                  }, function(err, data) {
                      if (err) {
                        token = data.token;
                          return showErr(err);
                      }
                      if (data) {
                        token = data.token;
                          var socketmsgid = data;
                          socket.emit('kickuser', {
                              username: user,
                              socketid: data.socketid,
                              msg: "Admin Menu Kicked You!",
                              token: token
                          }, function(err, data) {
                              if (err) {
                                token = data.token;
                                  console.log(err);
                                  return showErr("Unable to Find IP!").dismissOthers;
                              }
                              if (data) {
                                token = data.token;
                                  var msg = data.msg;
                                  alertChatMessage({
                                      message: msg,
                                      date: (new Date).toUTCString()
                                  });
                              }
                          });
                      }
                  });
              }
          },
          {
              name: '<b>⛔Ban</b>',
              fun: function() {
                  console.log("ADMIN MENU: BAN " + user);
                  alertChatMessage({
                      message: "This Function isn't Implemented Yet!",
                      date: (new Date).toUTCString()
                  });
              }
          },
          {
              name: '<b>🌐IP</b>',
              fun: function() {
                  console.log("ADMIN MENU: IP " + user);
                  socket.emit('getIP', {
                      username: user,
                      token: token
                  }, function(err, data) {
                      if (err) {
                        token = data.token;
                        return showErr(err);
                      }
                      if (data) {
                          token = data.token;
                          var userip = data.ip;
                          var username = data.username;
                          userip = ipParse(userip);
                          alertChatMessage({
                              message: `${username}'s IP Address: ${userip}`,
                              date: (new Date).toUTCString()
                          });
                      }
                  });
              }
          },
          {
              name: '<b>☂️RainBan</b>',
              fun: function() {
                  socket.emit('rainban', {
                      user: user,
                      token: token
                  }, function(err, data) {
                      if (err) {
                        token = data.token;
                          showErr("RainBan Failed!");
                          return;
                      }
                      if(data){
                        token = data.token;
                        alertChatMessage({
                            message: `User Given RainBan!`,
                            date: (new Date).toUTCString()
                        });
                      }
                  });
              }
          },
          {
              name: '<b>☔RainAdd</b>',
              fun: function() {
                  socket.emit('rainadd', {
                      user: user,
                      token: token
                  }, function(err, data) {
                      if (err) {
                          token = data.token;
                          showErr("RainAdd Failed!");
                          return;
                      }
                      if(data){
                        token = data.token;
                        alertChatMessage({
                            message: `User Given RainAdd!`,
                            date: (new Date).toUTCString()
                        });
                      }
                  });
              }
          },
            ];
        } else {
          menu = [
            {
                name: '👤 Profile',
                fun: function () {
                        getUserProfile(user)
                }
            },
            {
                name: '🔎Blog <i class="fas fa-external-link-alt" title="Clicking this will Open a New Window"></i>',
                fun: function () {
                        getUserBlog(user)
                }
            },
            {
            name: '<b>💲Tip</b>',
            fun: function() {
                $("#tipbalance").val($("#balance").val());
                bootbox.dialog({
                    message: '<center><span class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style=""><i class="fa fa-at fa-2x"></i></span>' +
                        '<b><input type="text" class="form-control" placeholder="User" aria-describedby="basic-addon1" id="tipto" style="" ></b><span class="input-group-addon addon-sexy" style="">User</span></span>' +
                        '<br><span class="input-group autoBettitleC" style="width:69%;background:#181E28;"><span class="input-group-addon addon-sexy" style=""><b>Tip</b></span>' +
                        '<b><input type="number" class="form-control" placeholder="0.000" id="tipamount" aria-describedby="basic-addon1"></b>' +
                        '<span class="input-group-addon addon-sexy" style="padding:5px;"><img src="img/rhom.svg" class="modalLogo"></span></span>' +
                        "<script>var currencyLogo = $('img.dd-selected-image').attr('src');$('img.modalLogo').attr('src', currencyLogo);</script>",
                    title: `<center><b class="sexytitle">Rhom-Roller.com</b><br>Tip Some ${$('#currentCurrency').val().toUpperCase()} to Another User Instantly</center>`,
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
                                        token = data.token;
                                        return showErr("Tip Send Failed!");
                                    }
                                    //console.log(data);
                                    token = data.token; //token is always returned
                                    $("#balance").val((data.balance/ 100000000).toFixed(8));
                                    showSuccess("Tip Sent!");
                                });
                            }
                        }
                    }
                });
                $("#tipto").val(user);
            }
        },
        {
            name: '<b>💬Message</b>',
            fun: function() {
                $("#chatText").val(`/msg ${user} `);
                $("#chatText").focus();
            }, //END fun:function

        },
        {
            name: '<b>📊Stats</b>',
            fun: function() {
                userstatsDialog(user);
            }
        }
          ];
        }
        try {
          $(el).contextMenu(menu, {'sizeStyle': 'content', 'closeOther': true, 'displayAround': 'cursor', 'closeOnClick': true, 'trigger': 'focusin', 'containment': el.firstChild, 'position': 'top'});

        } catch(e) {
          console.log(e)
        }
      });


};

$("#sendChat").on('click',function(){
  if(chatToken == undefined) return showErr(`Chat Error - Are You Logged In?`);
    socket.emit('chatmessage', {message: $("#trollslot").val(), token: chatToken}, function(err, data){
      if (err) showErr(err);
      $("#trollslot").val("");
    });
});

$("#trollslot").keypress(function(event){
  if(chatToken == undefined) return showErr(`Chat Error - Are You Logged In?`);
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == "13"){
        socket.emit('chatmessage', {message: $("#trollslot").val(), token: chatToken}, function(err, data){
          if (err) showErr(err);
          $("#trollslot").val("");
        });
    }
});

$("#longMarginTotal").keypress(function(){
  if($("#longMarginTotal").val() < 1){
    $("#longMarginTotal").val(1);
  } else if ($("#longMarginTotal").val() > 10) {
    $("#longMarginTotal").val(10);
  } else {
    $("#longMarginTotal").val($("#longMarginTotal").val().toFixed(0));
  }
});

$("#withdrawInteger").change(function(){
  if($("#withdrawInteger").val() < 0.001){
    $("#withdrawInteger").val(0.000);
  } else if ($("#withdrawInteger").val() > $("#tipbalance").val()) {
    $("#withdrawInteger").val($("#tipbalance").val());
  } else {
    $("#withdrawInteger").val($("#tipbalance").val());
  }
});

$('#withdrawbalance').on('click',function(){
  wdCalc();
});//END shmdf

function copyStringToClipboard (str) {
   var el = document.createElement('textarea');
   el.value = str;
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   el.select();
   document.execCommand('copy');
   showSuccess(`Copied ${str.slice(0,24)}.. to Clipboard!`);
   document.body.removeChild(el);
}
