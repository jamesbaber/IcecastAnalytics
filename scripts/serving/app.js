/*
	Node.js Icecast listener count monitor.
	Built by James Baber (In 10C3 at the time of creation) for Backwell School Radio.
*/

var express = require('express');
var app = express();
var fetcher = require("./fetch.js");
var cors = require('cors')

app.use(function(err, req, res, next) {
    if(!err) return next(); // you also need this line
    console.log("error!!!");
    res.send("error!!!");
});

app.use(cors())

app.get('/', function(req, res) {
    console.log("Request: " + req.query.start + " to " + req.query.start)
    
    var rawData = fetcher.fetchData(req.query.start, req.query.stop, function(data) {
        res.send(JSON.stringify(data));
    });
    
});


// Every minute do a dummy request to keep the SQL DB connection alive
setInterval(function() {
	fetcher.keepAlive();
}, 60000);

app.listen(8080);
