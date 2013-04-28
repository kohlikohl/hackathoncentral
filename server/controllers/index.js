var Data = require("../library/data.js"),
    when = require('when');

    redis.debug_mode = true;

var IndexController = module.exports = {};

IndexController.homepage = function(req,res) {
    var dataObject = new Data('1');
    var personas = dataObject.getPersonas();
    res.render("index", {"personas" : personas });
}

IndexController.api = function(req,res) {
    var docs = [
    {'urn' : '/api/0/personas', 'description': 'Endpoint for collection of personas'},
    {'urn' : '/api/0/personas/:persona', 'description': 'Endpoint for an individual persona and it\'s weighted dataset'},
    {'urn' : '/api/0/personas/:persona/:borough', 'description': 'Endpoint for a particular borough for an individual persona'},
    {'urn' : '/api/0/boroughs', 'description': 'Endpoint for collection of boroughs'},
    {'urn' : '/api/0/boroughs/:boroughs', 'description': 'Endpoint for an individual borough'}];
    res.json({data:docs});
}

IndexController.boroughs = function(req,res) {
    var dataObject = new Data('1');
    var boroughs = dataObject.getBoroughs(req.params.borough);
    res.set('Content-Type', 'application/json');
    res.json({data : boroughs });
}

IndexController.personas = function(req,res) {
    var dataObject = new Data('1');
    var personas = dataObject.getPersonas();
    res.set('Content-Type', 'application/json');
    res.json({data : personas });
}

IndexController.persona = function(req,res) {
    var dataObject = new Data('1'),
    count = client.get('count', function(err,result) { if (err | !result) { count = 1; } });
    client.setex("count",600,++count);

    console.log(count);
    dataObject.getPersona(req.params.persona, req.params.borough).then(
        function done(data) {
            return data;
        },
        function doh(err) {
            console.log(err);
        }
    ).then(
        function respond(personaData) {
            res.set('Content-Type', 'application/json');
            res.json({data : personaData});
        }
    );
}
