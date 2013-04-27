var redis = require('redis');

var data = function (args) {
    this.args_ = args;
};

data.prototype.getCriterion = function() {
    return ['Student','Young Professional','Family','Retired', 'OAP']
}

data.prototype.get

