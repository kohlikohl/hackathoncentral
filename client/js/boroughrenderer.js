'use strict';

/* global goog */
/* global google */
/* global app */

goog.provide("app.renderer.Borough");

goog.require("app.data.london.boroughs");
goog.require("app.data.london.full.boroughs");
goog.require("app.data.map.borough");
goog.require("app.renderer.Detail");

goog.require("goog.math");
goog.require("goog.dom");
goog.require("goog.dom.classlist");
goog.require("goog.events.EventHandler");

goog.scope(function () {
    var _ = app.renderer;

    _.Borough = function (map) {
        this.data = {};
        this.map = map;
        this.drawnPolygons = [];
        this.mapCenter = null;

        this.handler = new goog.events.EventHandler();
        this.handler.listen(window, goog.events.EventType.RESIZE, goog.bind(this.repositionMap, this));
        
        this.detailrenderer = new _.Detail();


    };

    _.Borough.prototype.render = function (data) {
        var boroughs = app.data.london.boroughs.folder,
            boroughMap = app.data.map.borough;

        this.data = data;

        var geoJsonObject = topojson.feature(app.data.london.full.boroughs, app.data.london.full.boroughs.objects.x);
        console.log(geoJsonObject); 

        boroughs = geoJsonObject.features;

        goog.array.forEach(boroughs, function (borough) {
            var polygon = borough.geometry.coordinates[0],
                coords = [],
                toDraw = {},
                score,
                apiMap = goog.array.find(boroughMap, function (element) {
                    return element.apiIdentifier === borough.id;
                }),
                relevantData = null;

            if (!apiMap) {
                console.log('missing for', borough.properties.name, borough.id);
            } else {
                console.log(apiMap);
                relevantData = goog.object.get(this.data.data, apiMap.apiIdentifier);
            }

            if (!relevantData) {
                console.log(this.data.data);
                console.log('fooked');
                return;
            } else {
                score = Math.round(relevantData.adjusted * 100);

                goog.array.forEach(polygon, function(element){
                    goog.array.insert(coords, new google.maps.LatLng(element[1], element[0]));
                });

                toDraw = new google.maps.Polygon({
                    paths: coords,
                    strokeColor: this.gradientColor_(score).cssColor,
                    strokeOpacity: 0.4,
                    strokeWeight: 1,
                    fillColor: this.gradientColor_(score).cssColor,
                    fillOpacity: 0.20
                });
                console.log(toDraw);
                toDraw.setMap(this.map);
                this.drawnPolygons.push(toDraw);

                google.maps.event.addListener(toDraw, 'click', goog.bind(function (evt) {
                    //cheating because it is late
                    this.renderAdditionalData(evt, relevantData, toDraw);
                }, this));

            }
        }, this);
        
        this.map.data.forEach(console.log);
    };

    _.Borough.prototype.reset = function(){
        goog.array.forEach(this.drawnPolygons, function(element){
            element.setMap(null);
        });

        this.detailrenderer.reset();
    };

    _.Borough.prototype.getPolygonBounds = function (polygon) {
        var bounds = new google.maps.LatLngBounds();
        var paths = polygon.getPaths();
        var path;

        for (var p = 0; p < paths.getLength(); p++) {
            path = paths.getAt(p);
            for (var i = 0; i < path.getLength(); i++) {
                bounds.extend(path.getAt(i));
            }
        }

        return bounds;
    };

    _.Borough.prototype.renderAdditionalData = function (evt, relevantData, polygon) {
        var bounds = this.getPolygonBounds(polygon),
            options = {
                strokeOpacity: 0.90,
                fillOpacity: 0.60
            },
            body = goog.dom.getElementsByTagNameAndClass('body')[0];

        this.resetAllPolygons();

        polygon.setOptions(options);

        //add class to body
        goog.dom.classlist.add(body, 'active-map');


        this.map.fitBounds(bounds);
        this.map.setZoom(this.map.getZoom() - 1 );
//        setTimeout(goog.bind(function(){
//            //this.map.panBy(0, 100);
//        }, this), 100);
        this.mapCenter = this.map.getCenter();

        this.detailrenderer.render(relevantData);
    };
    
    _.Borough.prototype.repositionMap = function(){
        //console.log('position', this.mapCenter);

        if(typeof this.mapCenter === 'undefined'){
            this.map.setCenter(new google.maps.LatLng(51.509597,-0.113983));
            return;
        }

        this.map.setCenter(this.mapCenter);
    };

    _.Borough.prototype.resetAllPolygons = function(){
        var options = {
            strokeOpacity: 0.40,
            fillOpacity: 0.20
        };

        goog.array.forEach(this.drawnPolygons, function(element){
            element.setOptions(options);
        });
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