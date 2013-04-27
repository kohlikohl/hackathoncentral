var redis = require('redis');

var config = require(__dirname+'/data/model.json');

var Data = module.exports = function (args) {
    this.args_ = args;
};

Data.prototype.getPersonas = function() {
    return config.personas;
}

Data.prototype.getDataSources = function() {
    return [];
}

