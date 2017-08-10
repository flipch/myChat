/*
 * Back End Server
 */


/*
 * Imports
 */
var fs = require("fs");
var express = require("express");
var app = express();

/* Hack Logger, it's shitty i should make a better one*/
(function () {
    var oldLog = console.log;
    console.log = function (message) {
        var d = new Date();

        /* Alter original message with Timestamp */
        var timestamp = `[${d.toISOString()}]`;
        message = timestamp + message;

        /* Write same message to log directory organized by day */

        // If there's no record of \n add it!
        // Format purposes
        if (message.indexOf("\n") == -1) {
            fs.appendFile(`./Logs/${d.getYear()}_${d.getMonth()}_${d.getDay()}_log.log`, message + "\n");
        } else {
            fs.appendFile(`./Logs/${d.getYear()}_${d.getMonth()}_${d.getDay()}_log.log`, message);
        }

        oldLog.apply(console, arguments);
    };
})();

/*
 * Communication port
 */
var port = 1337;

/*
 * Render engine setup
 */

app.set('views', __dirname + '/Views');
app.set('view engine', "pug");
app.engine('pug', require('pug').__express);

/* ---------------------------------------------------------------- */

/*
 * Handler for get requests
 */
app.get("/", function (request, response) {
    response.render("index");
    console.log(`Received connection from ${request.ip}\n`);
});


/*
 * Specifies where the front end will be placed
 */
app.use(express.static(__dirname + '/Public'));
/*
 * Attaches to specified port using Socket.io
 */
var io = require('socket.io').listen(app.listen(port));

/**
 * 
 */
console.log(`---------------------------`);
console.log(`Initialized Back-End Server`);
console.log(`Listening on port ${port}`);

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function () {
        process.emit("SIGINT");
    });
}

process.on("SIGINT", function () {
    console.log(`Exiting, goodbye!`);
    console.log(`---------------------------`);
    setTimeout(function () {
        process.exit()
    }, 2500);
});