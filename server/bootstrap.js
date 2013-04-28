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
app.get('/api/0/',require('./controllers/index').api);
app.get('/api/0/personas', require('./controllers/index').personas);
app.get('/api/0/personas/:persona', require('./controllers/index').persona);
app.get('/api/0/personas/:persona/:borough', require('./controllers/index').persona);
app.get('/api/0/boroughs', require('./controllers/index').boroughs);
app.get('/api/0/boroughs/:boroughs', require('./controllers/index').boroughs);


//static routes
app.use('/-/js/closure/', express.static(__dirname + '/../client/bin/closure/closure/goog'));
app.use('/-/js/closure/deps', express.static(__dirname + '/../client/bin/js/'));
app.use('/-/js', express.static(__dirname + '/../client/js/'));
app.use(express.static(__dirname + '/../public')); //public folder

app.listen(process.env.PORT || 3000);