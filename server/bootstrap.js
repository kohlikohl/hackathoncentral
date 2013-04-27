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
app.get('/', require('./controllers/index').homepage);
app.get('/persona/:persona', require('./controllers/index').persona);
app.use(express.static(__dirname + '/../public')); //public folder

app.listen(3000);