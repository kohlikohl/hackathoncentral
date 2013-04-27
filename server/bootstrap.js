var express = require('express'),
    app = express(),
    hoganExpress = require('hogan-express');

//Setup
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('layout', 'layout/layout'); //rendering by default
app.set('partials', {head: "layout/head"}); //partails using by default on all pages
app.engine('html', hoganExpress);

//routes
app.get('/', require('./controllers/index'));

app.listen(3000);