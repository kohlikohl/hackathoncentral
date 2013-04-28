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
    this.loadDatasets(persona).then(
        function gotEm(datasets) {
            deferred.resolve(this.reduce(this.map(datasets.pop().pop()),persona,borough));
        }.bind(this),
        function darn() {
            deferred.reject("Darn it!");
        }
    );

    return deferred.promise;
};

Data.prototype.getById = function(resource,id) {
    for(var i = 0; i < resource.length; i++) {
        if (resource[i].identifier == id) return resource[i];
    }
    return false;
}

Data.prototype.map = function(data) {
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

Data.prototype.reduce = function(map,persona,borough) {
    var min = {}, max = {};
    if (typeof persona !== 'undefined') {
        persona = this.getById(config.personas,persona);
    }

    for(var borough in map) {
        running = 0, count = 0;
        for(var factors in map[borough].scores) {
            running += Math.abs(persona.weighting[factors]) * map[borough].scores[factors].reduce(function(a,b){ 
                return a + b} );
            count +=  Math.abs(persona.weighting[factors]) * map[borough].scores[factors].length;
        }
        map[borough].score = running/count;
    }
    return map;
}

Data.prototype.storeSource = function(data, name, sourceDef, persona) {
    var resource = JSON.parse(data), source = [], output = this.datasets_;
    for (var i = 0; i < resource.columns.length; i++) {
        source.push({ 
                identifier: resource.columns[i].area.identifier,
                name: resource.columns[i].area.label,
                label: sourceDef.name,
                label_identifier: sourceDef.identifier,
                group : name,
                type: sourceDef.type,
                value : resource.rows[0].values[i].value
            });
    }

    if (typeof output[name] === 'undefined') {
        output[name] =  {};
    }

    output[name][sourceDef.identifier] = this.normalise(source,persona);

    return output;
};

Data.prototype.normalise = function(sourceData, persona) {
    var min = 9999999999, max = 0, i = 0, range = 0
    console.log(persona);
    if (typeof persona !== 'undefined') {
        persona = this.getById(config.personas,persona);
    }

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
        if (sourceData[i].type == 'min')  {
            sourceData[i].score = 1 - sourceData[i].score;
        }
        console.log("Weighting for " + sourceData[i].group + " is " + persona.weighting[sourceData[i].group]);
        if (persona.weighting[sourceData[i].group] < 0)  {
            sourceData[i].score = 1 - sourceData[i].score;
        }
    }

    return sourceData;
}

Data.prototype.loadSource = function(source,datasetName,persona) {
    var deferred = when.defer();
    req = http.request(source.urn, function(res) {
        var data = "", storeSource = this.storeSource.bind(this);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('end', function() {
            deferred.resolve(storeSource(data,datasetName,source,persona));
        });

    }.bind(this));

    req.on('error', function(e) {
            deferred.reject(new Error('problem with request: ' + e.message));
    });

    req.end();

    return deferred.promise;
}


Data.prototype.loadDataset = function (dataset,persona) {
    var i =0,deferreds = [], deferred = when.defer();
    for (i = 0; i < dataset.sources.length; i++) {
        deferreds.push(this.loadSource(dataset.sources[i],dataset.name,persona));
    }
    return when.all(deferreds);
};

Data.prototype.loadDatasets = function(persona) {
    var i = 0, deferreds = []
    for (i = 0; i < config.datasets.length; i++) {
            deferreds.push(this.loadDataset(config.datasets[i],persona));
    }
    return when.all(deferreds);
};

