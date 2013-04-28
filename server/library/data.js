var redis = require('redis'),
    http = require('http'),
    when = require('when'),
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

Data.prototype.getPersona = function(persona,borough) {
    var deferred = when.defer()
    this.loadDatasets().then(
        function gotEm(datasets) {
            deferred.resolve(this.reduce(this.map(datasets.pop().pop()),persona,borough));
        }.bind(this),
        function darn() {
            deferred.reject("Darn it!");
        }
    );

    return deferred.promise;
};

Data.prototype.map = function(data,persona,borough) {
    var i, j, k, name, running, count, map = {};
    
    for (i = 0; i < config.datasets.length; i++) {
        name = config.datasets[i].name;
        for(j in data[name]) {
            for(k = 0; k < data[name][j].length; k++) {
                if (typeof map[data[name][j][k].identifier] === 'undefined') {
                    map[data[name][j][k].identifier] = {name: data[name][j][k].name,labels:{},values:{},scores:{}, score : 0.00};
                }
                if (typeof map[data[name][j][k].identifier].values[name] === 'undefined') {
                    map[data[name][j][k].identifier].labels[name] = [];
                    map[data[name][j][k].identifier].values[name] = [];
                    map[data[name][j][k].identifier].scores[name] = [];
                }

                map[data[name][j][k].identifier].labels[name].push(data[name][j][k].label);
                map[data[name][j][k].identifier].values[name].push(data[name][j][k].value);
                map[data[name][j][k].identifier].scores[name].push(data[name][j][k].score);
            }
            
        }
    }

    return map;
}

Data.prototype.reduce = function(map) {
    for(var borough in map) {
        running = 0, count = 0;
        for(var factors in map[borough].scores) {
            running += map[borough].scores[factors].reduce(function(a,b){ return a + b} );
            count += map[borough].scores[factors].length;
        }
        map[borough].score = running/count;
    }
    return map;
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

