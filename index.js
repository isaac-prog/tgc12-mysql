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

    // show all the cities in a table instead
    app.get('/city', async(req,res)=>{
        let query = `select * from city
                       join country
                       on city.country_id = country.country_id`;
        let [cities] = await connection.execute(query);
        res.render('cities',{
            'cities': cities
        })
    })

    // search for actor
    app.get('/search', async(req,res)=>{
        
        // the MASTER query (the always true query in other words)
        let query = "select * from actor where 1";

        if (req.query.search_terms) {
            // if the program reaches here, it means
            // that req.query.search_terms is not null, not empty, not undefined, not a zero, not a NaN and
            // not empty string

            // append to the query
            query += ` and (first_name like '%${req.query.search_terms}%'
                       or last_name like '%${req.query.search_terms}%')`
        }

        console.log("Final query =", query);

        let [actors] = await connection.execute(query);
        res.render('search',{
            'actors': actors,
            'search_terms': req.query.search_terms
        })
    })

    /* create a search for customer */
    app.get('/customer', async(req,res)=>{

        // 1. write the code to display the customers
        // in a table

        // 2. put in the form
        // one field to search by the first name and last name
        // one field to search by the email address

        // 3. modify the query based on whether req.query has
        // any value for the texte input
    })

}
main();

// start server
app.listen(3000, ()=>{
    console.log("Server has started")
})