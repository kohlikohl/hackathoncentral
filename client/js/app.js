goog.provide("app.Main");

goog.require("app.StartScreen");

goog.require("app.map.styles");
goog.require("app.events.EventType");
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
        this.startscreen = new _.StartScreen();
        this.handler = new goog.events.EventHandler();

        this.handler.listen(this.startscreen, _.events.EventType.PERSONA_CLICKED, this.loadPersonaData);
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

    _.Main.prototype.loadPersonaData = function(evt){
        console.log(evt);
    };

    goog.exportSymbol('app.start', _.Main.getInstance().initialise.bind(_.Main.getInstance()));

});