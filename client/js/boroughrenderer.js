goog.provide("app.renderer.Borough");

goog.require("app.data.london.boroughs");

goog.scope(function () {
    var _ = app.renderer;

    _.Borough = function (map, data) {
        this.data = data;
        this.map = map;
    };

    _.Borough.prototype.render = function () {
        console.log(this.map, this.data);
        var data = app.data.london.boroughs.folder;

        goog.array.forEach(data, function(element){
            console.log('a');
            var polygon = element.polygon,
                coords = [],
                toDraw = {};

            goog.array.forEach(polygon, function(element){
                goog.array.insert(coords, new google.maps.LatLng(element.y, element.x));
            });

            toDraw = new google.maps.Polygon({
                paths: coords,
                strokeColor: '#FF0000',
                strokeOpacity: 0.5,
                strokeWeight: 1,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });

            toDraw.setMap(this.map);

            return;
        }, this);

    };
});