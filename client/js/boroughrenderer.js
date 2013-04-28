goog.provide("app.renderer.Borough");

goog.require("app.data.london.boroughs");

goog.require("goog.math");

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
                toDraw = {},
                random = goog.math.randomInt(100);

            goog.array.forEach(polygon, function(element){
                goog.array.insert(coords, new google.maps.LatLng(element.y, element.x));
            });

            toDraw = new google.maps.Polygon({
                paths: coords,
                strokeColor: this.gradientColor_(random).cssColor,
                strokeOpacity: 0.4,
                strokeWeight: 1,
                fillColor: this.gradientColor_(random).cssColor,
                fillOpacity: 0.20
            });

            toDraw.setMap(this.map);

            return;
        }, this);

    };

    _.Borough.prototype.gradientColor_ = function (percent) {
        var color1 = {
                r: 243,
                g: 221,
                b: 70
            },
            color2 = {
                r: 24,
                g: 151,
                b: 111
            };
        var newColor = {};

        function makeChannel(a, b) {
            return(a + Math.round((b - a) * (percent / 100)));
        }

        function makeColorPiece(num) {
            num = Math.min(num, 255);   // not more than 255
            num = Math.max(num, 0);     // not less than 0
            var str = num.toString(16);
            if (str.length < 2) {
                str = "0" + str;
            }
            return(str);
        }

        newColor.r = makeChannel(color1.r, color2.r);
        newColor.g = makeChannel(color1.g, color2.g);
        newColor.b = makeChannel(color1.b, color2.b);
        newColor.cssColor = "#" +
            makeColorPiece(newColor.r) +
            makeColorPiece(newColor.g) +
            makeColorPiece(newColor.b);
        return(newColor);
    }
});