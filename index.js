const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const mysql = require('mysql2/promise');

// create express app
let app = express();

// set the view engine hbs
app.set('view engine', 'hbs');

// all css, image files and js files are in public folder
app.use(app.static('public'));

// set up template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// routes



// start server