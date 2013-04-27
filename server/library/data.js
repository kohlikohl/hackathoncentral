var redis = require('redis');

var config = require(__dirname+'/data/model.json');

var data = module.exports = function (args) {
    this.args_ = args;
};

data.prototype.getPersonas = function() {
    return config.personas;
}

data.prototype.getDataSources = function() {
    return [];
}

