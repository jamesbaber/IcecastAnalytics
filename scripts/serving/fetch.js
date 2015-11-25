/*
	Node.js Icecast listener count monitor.
	Built by James Baber (In 10C3 at the time of creation) for Backwell School Radio.
*/

// Get required libraries for the script
mysql = require("mysql");

exports.fetchData = function(startDateTime, stopDateTime, callback) {
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

    // SQL query that selects and returns all data points between the two dates selected
    var query = "SELECT * FROM listenercount WHERE datetime BETWEEN '" + startDateTime + "' AND '" + stopDateTime + "';";
    connection.query(query, function(err, rows, fields) {
        callback(rows)
    });

}

// Function to create dummy test data
function createDummyData(numberOfEntries, clearPre) {
    // Default the clearPre parameter to false
    if (!clearPre) clearPre = 0;
    
    // Mysql connection for dummy data inserting
    var connection = mysql.createConnection({
        host: "localhost",
        user: "myuser",
        password: "mypass",
        database: "icecastanalytics"
    });

    // Start the MySQL DB connection
    connection.connect();
    
    if (clearPre == true) {
        connection.query("DELETE FROM listenercount WHERE 1", function() {console.log("Wiped all data")});
    } else {
        console.log("Preserving previous records. Remember, they are now being invalidated if read as a whole")
    }
    
    // Core funtion to add a data point
    function insert() {
        var query = "INSERT INTO listenercount (count) VALUES (" + Math.random()*1000 + ");";
        connection.query(query);
    }
    
    // Repeat it until we hit x entries
    var count = 1;
    var interval = setInterval(function() {
        insert()
        console.log(count + ".) Inserting data")
        count += 1;
        if (count > numberOfEntries && numberOfEntries != 0) {
            clearInterval(interval);
            console.log("Data insertion completed")
        }
    }, 1000);
}

//createDummyData(100, true)

exports.keepAlive = function() {
    var connection = mysql.createConnection({
        host: "localhost",
        user: "myuser",
        password: "mypass",
        database: "icecastanalytics"
    });

    // Start the MySQL DB connection
    connection.connect();

    // SQL query that selects and returns all data points between the two dates selected
    var query = "SELECT * FROM listenercount WHERE 0";
    connection.query(query);

}

