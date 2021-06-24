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

        let query = "select * from customer where 1";
        let bindings = [];
      
        if (req.query.name_search) {
            let name = req.query.name_search;
            query += ` and ( 
                first_name like ? or  last_name like ?
            )
            `
            bindings.push('%' + name + '%', '%'+ name + '%');
        }

        if (req.query.email_search) {
            let email = req.query.email_search;
            query += ` and email like ?`
            bindings.push('%' + email + '%')
        }
      
        let [customers] = await connection.execute(query, bindings);
        res.render('customers', {
            'customers': customers,
            'name_search': req.query.name_search,
            'email_search': req.query.email_search
        })
    })

    app.get('/actor/create', async (req,res)=>{
        res.render('create_actor');
    })

    app.post('/actor/create', async(req,res)=>{
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let query = "insert into actor (first_name, last_name) values (?, ?);"
        let bindings = [firstName, lastName]

        await connection.execute(query, bindings);
        res.redirect('/')
    })

    app.get('/country/create', async(req,res)=>{
        res.render('create_country');
    })

    app.post('/country/create', async (req,res)=>{
        let country = req.body.country;
        let query = "insert into country (country) values (?);"
        let bindings = [ country];

        await connection.execute(query, bindings);
        res.send("New country has been added")

    })

}
main();

// start server
app.listen(3000, ()=>{
    console.log("Server has started")
})