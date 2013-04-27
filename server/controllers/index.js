var Data = require("../library/data.js");

var IndexController = module.exports = {};

IndexController.homepage = function(req,res) {
    var dataObject = new Data('1');
    var personas = dataObject.getPersonas();
    res.render("index", {"personas" : personas });
}

IndexController.persona = function(req,res) {
    data.getPersona(req.params.persona, req.params.identifier);
}

IndexController.region = function(req,res) {
    data.getRegion(req.params.identifier);
}

IndexController.borough = function(req,res) {
    data.getBorough(req.params.identifier);
}
