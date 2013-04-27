var redis = require('redis'),
    http = require('http'),
    when = require('when'),
    config = require(__dirname+'/data/model.json');

var Data = module.exports = function (args) {
        this.args_ = args;
        this.datasets_ = {};
        this.reduction_ = {};
};

Data.prototype.getPersonas = function() {
    return config.personas;
};

Data.prototype.getDataSets = function() {
    return config.datasets;
};

Data.prototype.getPersona = function() {
    var deferred = when.defer()
    this.loadDatasets().then(
        function gotEm(datasets) {
            deferred.resolve(this.reduceDatasets(datasets.pop().pop()));
        }.bind(this),
        function darn() {
            deferred.reject("Darn it!");
        }
    );

    return deferred.promise;
};

Data.prototype.reduceDatasets = function(datasets) {
    var i, j, k, name, running, count;
    this.reduction_ = {};
    console.log(datasets);

    for (i = 0; i < config.datasets.length; i++) {
        name = config.datasets[i].name;
        for(j in datasets[name]) {
            for(k = 0; k < datasets[name][j].length; k++) {
                if (typeof this.reduction_[datasets[name][j][k].identifier] === 'undefined') {
                    this.reduction_[datasets[name][j][k].identifier] = {name: datasets[name][j][k].name,labels:{},values:{},scores:{}, score : 0.00};
                }
                if (typeof this.reduction_[datasets[name][j][k].identifier].values[name] === 'undefined') {
                    this.reduction_[datasets[name][j][k].identifier].labels[name] = [];
                    this.reduction_[datasets[name][j][k].identifier].values[name] = [];
                    this.reduction_[datasets[name][j][k].identifier].scores[name] = [];
                }

                this.reduction_[datasets[name][j][k].identifier].labels[name].push(datasets[name][j][k].label);
                this.reduction_[datasets[name][j][k].identifier].values[name].push(datasets[name][j][k].value);
                this.reduction_[datasets[name][j][k].identifier].scores[name].push(datasets[name][j][k].score);
            }
            
        }
    }

    for(var borough in this.reduction_) {
        running = 0, count = 0;
        for(var factors in this.reduction_[borough].scores) {
            running += this.reduction_[borough].scores[factors].reduce(function(a,b){ return a + b} );
            count += this.reduction_[borough].scores[factors].length;
        }
        this.reduction_[borough].score = running/count;
    }
    return this.reduction_;
}

Data.prototype.storeSource = function(data, name, sourceDef) {
    var resource = JSON.parse(data), source = [], output = this.datasets_;
    for (var i = 0; i < resource.columns.length; i++) {
        source.push({ 
                identifier: resource.columns[i].area.identifier,
                name: resource.columns[i].area.label,
                label: sourceDef.name,
                label_identifier: sourceDef.identifier,
                value : resource.rows[0].values[i].value
            });
    }

    if (typeof output[name] === 'undefined') {
        output[name] =  {};
    }

    output[name][sourceDef.identifier] = this.normalise(source);

    return output;
};

Data.prototype.normalise = function(sourceData) {
    var min = 9999999999, max = 0, i = 0, range = 0

    for(i = 0; i < sourceData.length; i++) {
        if (min > sourceData[i].value) {
            min = sourceData[i].value;
        }
        if (max < sourceData[i].value) {
            max = sourceData[i].value;
        }
    }

    range = max - min;

    for(i = 0; i < sourceData.length; i++) {
        sourceData[i].score = (sourceData[i].value-min)/range;
    }

    return sourceData;
}

Data.prototype.loadSource = function(source,datasetName) {
    var deferred = when.defer();
    req = http.request(source.urn, function(res) {
        console.log("Loading " + datasetName + "...");
        var data = "", storeSource = this.storeSource.bind(this);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('end', function() {
            deferred.resolve(storeSource(data,datasetName,source));
        });

    }.bind(this));

    req.on('error', function(e) {
            deferred.reject(new Error('problem with request: ' + e.message));
    });

    req.end();

    return deferred.promise;
}


Data.prototype.loadDataset = function (dataset) {
    var i =0,deferreds = [], deferred = when.defer();
    for (i = 0; i < dataset.sources.length; i++) {
        deferreds.push(this.loadSource(dataset.sources[i],dataset.name));
    }
    return when.all(deferreds);
};

Data.prototype.loadDatasets = function(name) {
    var i = 0, deferreds = []
    for (i = 0; i < config.datasets.length; i++) {
            deferreds.push(this.loadDataset(config.datasets[i]));
    }
    return when.all(deferreds);
};

