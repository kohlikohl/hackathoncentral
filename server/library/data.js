var redis = require('redis'),
    http = require('http'),
    config = require(__dirname+'/data/model.json');

var Data = module.exports = function (args) {
        this.args_ = args;
        this.datasets_ = {};
};

Data.prototype.getPersonas = function() {
    return config.personas;
};

Data.prototype.getDataSets = function() {
    return config.datasets;
};

Data.prototype.getPersona = function() {
    this.loadDataset("pollution");
}

Data.prototype.loadDataset = function(name) {
    var i = j = 0,options = {};
    for (i = 0; i < config.datasets.length; i++) {
        if (config.datasets[i].name === name) {
            console.log("Getting dataset for " + name);
            for (j = 0; j < config.datasets[i].sources.length; j++) {
                console.log(config.datasets[i].sources[j].name);
                http.request(config.datasets[i].sources[j].urn, function(response) {
                    console.log('STATUS: ' + response.statusCode);
                    console.log('HEADERS: ' + JSON.stringify(response.headers));
                    response.setEncoding('utf8');
                    response.on('data', function (chunk) {
                        console.log('BODY: ' + chunk);
                    });
                });
                
            }
            return true;
        }
    }

    return false;
};

