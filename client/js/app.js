goog.provide("app.Main");

goog.require("app.map.styles");
goog.require("goog.dom");
goog.require("goog.events.EventTarget");

goog.scope(function(){

    var _ = app;

    _.Main = function () {
        goog.base(this);
    };

    goog.inherits(_.Main, goog.events.EventTarget);
    goog.addSingletonGetter(_.Main);

    _.Main.prototype.initialise = function () {
        this.initialiseMap();
        this.bindStartScreen();
    };

    _.Main.prototype.initialiseMap = function () {
        var mapOptions = {
                zoom: 10,
                center: new google.maps.LatLng(51.509597,-0.113983),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: app.map.styles
            },
            map = new google.maps.Map(goog.dom.getElementByClass('js-map-canvas'), mapOptions);

    };

    _.Main.prototype.bindStartScreen = function(){

    };

    goog.exportSymbol('app.start', _.Main.getInstance().initialise.bind(_.Main.getInstance()));

});