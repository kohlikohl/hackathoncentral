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
            var polygon = element.polygon,
                coords = [],
                toDraw = {};

            goog.array.forEach(polygon, function(element){
                goog.array.insert(coords, new google.maps.LatLng(element.x, element.y));
            });

            toDraw = new google.maps.Polygon({
                paths: coords,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });

            toDraw.setMap(this.map);

            return;
        });

//        var triangleCoords = [
//            new google.maps.LatLng(25.774252, -80.190262),
//            new google.maps.LatLng(18.466465, -66.118292),
//            new google.maps.LatLng(32.321384, -64.75737)
//        ];
//
//        bermudaTriangle = new google.maps.Polygon({
//            paths: triangleCoords,
//            strokeColor: '#FF0000',
//            strokeOpacity: 0.8,
//            strokeWeight: 3,
//            fillColor: '#FF0000',
//            fillOpacity: 0.35
//        });
//
//        bermudaTriangle.setMap(map);
    };
});