const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const mysql = require('mysql2/promise');

// create express app
let app = express();

// set the view engine hbs
app.set('view engine', 'hbs');

// all css, image files and js files are in public folder
app.use(express.static('public'));

// set up template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// set up forms handling
app.use(express.urlencoded({
    extended: false
}));

async function main() {

    const connection = await mysql.createConnection({
        host:'localhost',
        user:'root',
        'database': 'sakila'
    })

    app.get('/', async (req,res)=>{
        let [actors] = await connection.execute("select * from actor");
        res.render('actors', {
            'actors': actors
        })
    })

}
main();

// start server
app.listen(3000, ()=>{
    console.log("Server has started")
})