var express = require('express');
var app = express();

//ROUTES
app.get('/', require('./controllers/index'));

app.listen(3000);