var redis = require('redis'),
    client = redis.createClient();

var Cache = module.exports = function() {
}

Cache.prototype.add = function(hash, value) {
    return client.hset("personas",hash,value);
}

Cache.prototype.exists = function(hash) {
    return client.hexists('personas',hash);
}

Cache.prototype.get = function(hash) {
    return client.hget('personas', hash);
}
