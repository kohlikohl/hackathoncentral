var data = require("../library/data.js");

var IndexController = module.exports = {};

IndexController.homepage = function(req,res) {
    data.getPersonas();
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
