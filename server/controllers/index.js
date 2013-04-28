var Data = require("../library/data.js");
var when = require('when');

var IndexController = module.exports = {};

IndexController.homepage = function(req,res) {
    var dataObject = new Data('1');
    var personas = dataObject.getPersonas();
    res.render("index", {"personas" : personas });
}

IndexController.personas = function(req,res) {
    var dataObject = new Data('1');
    var personas = dataObject.getPersonas();
    res.send({"personas" : personas });
}

IndexController.persona = function(req,res) {
    var dataObject = new Data('1');
    dataObject.getPersona(req.params.persona, req.params.borough).then(
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
