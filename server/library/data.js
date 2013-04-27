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
    this.loadDatasets();
}

Data.prototype.loadDataset = function (dataset) {
    var i =0;
    console.log("Getting dataset for " + dataset.name);
    for (i = 0; i < dataset.sources.length; i++) {
        console.log(dataset.sources[i].urn);
        req = http.request(dataset.sources[i].urn, function (res) {
            console.log("DONE");
            console.log( "STATUS " + res.statusCode);
        });
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
    }
}

Data.prototype.loadDatasets = function(name) {
    var i = 0;
    for (i = 0; i < config.datasets.length; i++) {
            this.loadDataset(config.datasets[i]);
    }
};

