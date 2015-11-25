/*
	Node.js Icecast listener count monitor.
	Built by James Baber (In 10C3 at the time of creation) for Backwell School Radio.
*/

// Get required libraries for the script
najax = require("najax");
mysql = require("mysql");

// Introductory text
console.log("Monitoring the listener count for the schoolradio icecast server");

// Mysql connection settings
var connection = mysql.createConnection({
    host: "localhost",
    user: "radiospy",
    password: "radiolistenercounter1",
    database: "schoolradio"
});

// Setup MySQL error handling
connection.on("error", function(err) {
    // Announce error
    console.log("Error connecting to MYSQL database.")
    console.log(err);
    process.exit()
});

// Start the MySQL DB connection
connection.connect();

// Time constants
var waitTime = 10; // Seconds between logs
var interval = 1000 * waitTime;
console.log("Seconds between logs: " + waitTime);

// Function to select substring based on beginning and end markers
function parseData(strToParse, strStart, strFinish) {
	var str = strToParse.match(strStart + "(.*?)" + strFinish);
	if (str != null) {
		return(str[1]);
	}
}

function logData(data) {
    // Prepare query string to insert new datapoint
	var query = "INSERT INTO listenercount (count) VALUES (" + data + ");";
    
    // Perform query on database
    connection.query(query, function(err, rows, fields) {
        console.log(rows)
    });
}

setInterval(function() {
	// Perform an ajax call to the icecast web interface
	najax("http://localhost", function(html) {
        
        // Tidy up the loaded HTML
		html = html.replace(/(\r\n|\n|\r)/gm,"");
        
        // Pull the listener count out of the Icecast status page
		var listeners = parseData(html, '<td>Current Listeners:</td><td class="streamdata">', "</td></tr>");
        
        // Push it to the database
		logData(listeners);
	});
}, interval);
