goog.provide("App");

goog.require("goog.dom");
goog.require("goog.events.EventTarget");

goog.scope(function(){

    var App = function () {
        goog.base(this);
    };

    goog.inherits(App, goog.events.EventTarget);
    goog.addSingletonGetter(App);

    App.prototype.initialise = function () {
        this.initialiseMap();
    };

    App.prototype.initialiseMap = function () {
        var mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(-34.397, 150.644),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            map = new google.maps.Map(goog.dom.getElementByClass('js-map-canvas'), mapOptions);

    };

    goog.exportSymbol('app.start', App.getInstance().initialise.bind(App.getInstance()));

});