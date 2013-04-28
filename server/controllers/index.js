var Data = require("../library/data.js");
var when = require('when');

var IndexController = module.exports = {};

IndexController.homepage = function(req,res) {
    var dataObject = new Data('1');
    var personas = dataObject.getPersonas();
    res.render("index", {"personas" : personas });
}

IndexController.persona = function(req,res) {
    var dataObject = new Data('1');
    var personaData = dataObject.getPersona(req.params.persona, req.params.identifier);
    dataObject.getPersona(req.params.persona, req.params.identifier).then(
        function done(data) {
            return data;
        },
        function doh(err) {
            console.log(err);
        }
    ).then(
        function respond(personaData) {
            res.send({status: "ok",help: "help",data:personaData});
        }
    );
}

IndexController.region = function(req,res) {
    data.getRegion(req.params.identifier);
}

IndexController.borough = function(req,res) {
    data.getBorough(req.params.identifier);
}
