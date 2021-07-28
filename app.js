var express = require("express"),
  app = express(),
  server = require("http").createServer(app),
  helmet = require('helmet'),
  io = require("socket.io")(server),
  session = require("express-session"),
  bodyParser = require('body-parser'),
  forker = require("child_process"),
  log = require('fancy-log');
//const debug = require('debug');
var pm2 = require(__dirname + '/snippets/pm2MetricsHost.js');
const { config } = require("./config/index.js");
var debug = config.debug;
const sec = config.sechash;
const godmodeip = config.godmodeip;
debug = true;

if(config.dbSetup === true){
  async function migrateDB() {
      log('Initializing ...');
      log('Migrating DB...');
      await require('./dbtender.js').start();
      log('DB Migration complete.');
    }
  migrateDB();
};

if(config.dbSync === true){
  async function syncDB() {
      log('Syncing DB...');
      await require('./dbsync.js').start();
      log('DB Sync Complete!');
    }
  syncDB();
};


const sessiondata = {
  secret: sec,
  saveUninitialized: false, // don't create session until something stored,
  resave: false, // don't save session if unmodified
  cookie:{maxAge:6000}
};

var sessionMiddleware = session(sessiondata);
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(helmet({contentSecurityPolicy: false})),
io.use(function(socket, next) {sessionMiddleware(socket.request, socket.request.res, next)});

let clientIp;
let appSocketList = [];
let ipAddressList = [];
//clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//  res.header('Access-Control-Allow-Origin', '*');
const reqsec = pm2.RaS;

var appSocketListMetric = pm2.appSocketList;

var webPortMetric = pm2.webPortMetric;//.set(config.port);

function httpRedirect(req, res, next){
  clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (req.headers['x-forwarded-proto'] === 'http') {
    res.redirect('http://127.0.0.1:666');
  }else{
    next();
  }
}

log(`WEB: Hive.Loans v${config.version} Started on Port: ${config.port}`);
server.listen(config.port);

log("API: Initializing Public API Routing...");
var apiHandler = forker.fork('./apirouter.js');

var mainapp = require('./socket.js');

function censor(censor) {
  var i = 0;
  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
      return '[Circular]';
    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';
    ++i; // so we know we aren't using the original object anymore
    return value;
  }
}

function simpleStringify(object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return [simpleObject]; // returns cleaned up JSON
};

//set routes to public static files
app.use("/", httpRedirect, express.static(__dirname + "/client"));

var resnum = 0;
var resarray = [];
app.get(["/api", "/api*"], (req, res) => {
  resarray.push(res);
  var requestData = {
      httpVersion: req.httpVersion,
      httpVersionMajor: req.httpVersionMajor,
      httpVersionMinor: req.httpVersionMinor,
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
  };
  apiHandler.send({type:'request', req: requestData, resnum: resnum});
  resnum++;
})

apiHandler.on('message', function(m) {
  try {
    m = JSON.parse(m);
    log(`apiHandler.on('message'`)
    log(m);
  } catch(e) {
    log(`API: Message Error`);
  }
  switch (m.type){
    case 'response':
      var response = resarray[m.resnum];
      response.json(m.payload);
      const index = resarray.indexOf(m.resnum);
        if (index > -1) {
          resarray.splice(index, 1);
        }
    break;
  }
})

app.post("/getUserById", (req, res) => {
  if (!req.body.id) {
    res.json("No ID found in reqest body.")
  } else {
    axios.get(`https://jsonplaceholder.typicode.com/users/${req.body.id}`)
      .then(function(response) {
        res.json(response.data)
      }).catch(function(error) {
        res.json("Error occured!")
      })
  }
})

/*
app.get('/', function(req, res){
  res.render('form');// if jade
  // You should use one of line depending on type of frontend you are with
  res.sendFile(__dirname + '/client/js/packages/acctrecover.js'); //if html file is root directory
 res.sendFile("index.html"); //if html file is within public directory
});

app.post('/',function(req, res){
  log(req);
  log(`======================`);
  log(res);
  res.sendFile(__dirname + '/client/js/packages/acctrecover.js');
   //var username = req.body.username;
   //var htmlData = 'Hello:' + username;
   //res.send(htmlData);
   //console.log(htmlData);
});

*/


function FixNull(a) {
  log(`APP: FixNull() Pre:`);
  log(a);
  var wow = a.filter(function (el) {
    if(el != null) {
      return el;
    }
 });
 return wow;
};


var numClients = 0;

//socket.io Routes
io.on("connection", function(socket) {
  if(typeof appSocketList != undefined && !appSocketList.includes(socket)){
    appSocketList.push(socket);
    if(debug === true) log(`APP: appSocketList: ${appSocketList}`);
  }
  if(typeof clientIp != undefined && !ipAddressList.includes(clientIp)){
    ipAddressList.push(clientIp);
    if(debug === true) log(`APP: ipAddressList: ${ipAddressList}`);
  }

  socket.on('disconnect', function() {
    if(typeof appSocketList != undefined && appSocketList.includes(socket)){
      delete appSocketList[socket];
      appSocketList = FixNull(appSocketList);
      if(debug === true) log(`APP: appSocketList: ${appSocketList}`);
    }
    if(typeof clientIp != undefined && ipAddressList.includes(clientIp)){
      delete ipAddressList[clientIp];
      ipAddressList = FixNull(ipAddressList);
      if(debug === true) log(`APP: ipAddressList: ${ipAddressList}`);
    }
  });
  //newapp = mainapp(socket, io);
  socket.request.session['ipaddress'] = clientIp;
  newapp = require('./socket.js')(socket, io);
});
