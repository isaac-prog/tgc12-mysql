// import in mysql2 package
const mysql = require('mysql2/promise');

// create a database connection to our MySQL server
async function main() {

    // getting a connection is asynchronous
    const connection = await mysql.createConnection({
        'host':'localhost',
        'user':'root',
        'database':'Chinook'
    })
    let query = "select * from Album";
    let [rows] = await connection.execute(query);
    console.log(rows);
}

main();