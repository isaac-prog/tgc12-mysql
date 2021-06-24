const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const mysql = require('mysql2/promise');
const helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
});

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

    app.get('/actor/:actor_id/update', async(req,res)=>{
        //fetch the actor
        let query = "select * from actor where actor_id = ?";

        // actors will always be an array regardless of the number of results
        let [actors] =  await connection.execute(query, [ req.params.actor_id ]);
        
        // extract out the first element from the results
        let targetActor = actors[0];

        res.render('update_actor', {
            'actor': targetActor
        })
    })

    app.post('/actor/:actor_id/update', async(req,res)=>{
        // let first_name = req.body.first_name;
        // let last_name = req.body.last_name;
        // can use destructuring instead
        let { firstName, lastName} = req.body;
        let query = `update actor set first_name = ?, last_name = ? where
                            actor_id = ?;`
        let bindings = [firstName, lastName, req.params.actor_id];
        console.log(bindings);
        await connection.execute(query, bindings);
        res.redirect('/')

    })

    app.get('/actor/:actor_id/delete', async(req,res)=>{
        let [actor] = await connection.execute(
            "select * from actor where actor_id = ?",
            [ req.params.actor_id]
        )
        let targetActor = actor[0];
        res.render('delete_actor',{
            'actor': targetActor
        })
    })

    app.post('/actor/:actor_id/delete', async(req,res)=>{
        let query = " delete from actor where actor_id = ?"
        await connection.execute(query, [ req.params.actor_id]);
        res.redirect('/')
    })

    app.get('/countries', async(req,res)=>{
        let query = "select * from country";
        let [countries] = await connection.execute(query);
        res.render('countries', {
            'countries': countries
        })
    })

    app.get('/country/:country_id/update', async(req,res)=>{
        let [country] = await connection.execute(
            "select * from country where country_id = ?", 
            [req.params.country_id]
        );
        let targetCountry = country[0];
        res.render('update_country',{
            'country': targetCountry
        })
    })


    app.post('/country/:country_id/update', async(req,res)=>{
        let query = "update country set country = ? where country_id = ?"
        let bindings = [ req.body.country, req.params.country_id];
        await connection.execute(query, bindings);
        res.redirect('/countries');
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

    app.get('/film/create', async (req,res)=>{
        let [languages] = await connection.execute("select * from language");
        let [actors] = await connection.execute("select * from actor");
        res.render('create_film',{
            'languages': languages,
            'actors': actors
        })
    })

    app.post('/film/create', async(req,res)=>{
        let {
            title, description, language, rentalRate, rentalDuration, replacementCost
        } = req.body;

        let query = `
             insert into film 
                 (title, description, language_id, rental_rate, rental_duration, replacement_cost)
                 values (?, ?, ?, ?, ?, ?)
            `
        // when you are creating with a row with many to many relationship
        // create the row FIRST
        // then add in the relationship
        let bindings = [title, description, language, rentalRate, rentalDuration, replacementCost ];
        let [results] = await connection.execute(query, bindings);

        // create the relationship
        // req.body.actors can be one of the three possible values:
        // - if the user didn't actors => undefined
        // - if the user select only one actor => the id of the actor
        // - if the user select more than one actor => an array of ids of selected actors
        // let actors = req.body.actors || [];
        // actors = Array.isArray(actors) ? actors : [actors];

        // actors now will be an ARRAY
        if (req.body.actors) {
            console.log(req.body.actors);
            let actors = [];
            if (Array.isArray(req.body.actors)) {
                actors = req.body.actors; 
            } else {
                actors.push(req.body.actors);
            }

            // the actors array will one or more elements
            for (let a of actors) {
                let bindings =   [ results.insertId, a];
                console.log(bindings);
                connection.execute(
                    "insert into film_actor (film_id, actor_id) values (?, ?)", bindings
                  );
            }
        }


        res.send("New film has been added");
    })

    app.get('/film/:film_id/update', async (req,res)=>{
        // retrieve the film that the user is updating
        let [films] = await connection.execute(
            'select * from film where film_id = ?',
            [req.params.film_id]
        );
        let targetFilm = films[0];

        let [languages] = await connection.execute("select * from language");

        res.render('update_film',{
            'film': targetFilm,
            'languages': languages
        })
    })

    app.post('/film/:film_id/update', async (req,res)=>{

        let { title, description, language, rentalRate,
                rentalDuration, replacementCost} = req.body;

        let query = `update film set title=?, 
                    description = ?,
                    language_id = ?,
                    rental_rate = ?,
                    rental_duration = ?,
                    replacement_cost = ?
                    where film_id = ?`

        let bindings = [
            title, description, language, rentalRate, 
                rentalDuration, replacementCost, req.params.film_id
        ]

        await connection.execute(query, bindings);
        res.send("Film has been updated")
    })

    // show all the cities in a table instead
    app.get('/city', async(req,res)=>{
        let query = `select * from city
                       join country
                       on city.country_id = country.country_id
                       order by city.city`;
        let [cities] = await connection.execute(query);
        res.render('cities',{
            'cities': cities
        })
    })

    app.get('/city/create', async (req,res)=> {
        let [countries] = await connection.execute("select * from country order by country");
        res.render('create_city',{
            'countries': countries
        })
    })

    app.post('/city/create', async (req,res)=>{
        let { city, country} = req.body;
        let query = "insert into city (city, country_id) values (?,?)";
        let bindings = [city, country];
        await connection.execute(query, bindings);
        res.send("New city has been created")
    })

    app.get('/city/:city_id/update', async(req,res)=>{
        let [city] = await connection.execute("select * from city where city_id = ?", 
                                [req.params.city_id]
                            );
        let targetCity = city[0];

        let [countries] = await connection.execute('select * from country order by country');

        res.render('update_city', {
            'city': targetCity,
            'countries': countries
        })  
    })

    app.post('/city/:city_id/update', async (req,res)=>{
        let { city, country} = req.body;

         // validation: check that the country provided by the form actually exists    
        let checkCountryQuery = "select * from country where country_id = ?";
        let [checkCountry] = await connection.execute(checkCountryQuery, [req.body.country]);
       
        if (checkCountry.length > 0) {
            let query =`update city set city = ?, country_id =?
            where city_id = ?`;
            let bindings = [city, country, req.params.city_id];
            await connection.execute(query, bindings);
            res.redirect('/city');
        } else {
            res.send("Invalid city");
        }

       
    })

    

}
main();

// start server
app.listen(3000, ()=>{
    console.log("Server has started")
})