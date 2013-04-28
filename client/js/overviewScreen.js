goog.provide("app.OverviewScreen");

goog.require("app.events.PersonaClickedEvent");
goog.require("app.renderer.Borough");

goog.require("goog.events.EventType");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventHandler");
goog.require("goog.dom");
goog.require("goog.dom.dataset");
goog.require("goog.fx.dom.FadeOutAndHide");

goog.scope(function(){
    var _ = app;

    _.OverviewScreen = function(map) {
        goog.base(this);

        this.map = map;
        this.handler = new goog.events.EventHandler();
        this.boroughRenderer = new _.renderer.Borough(this.map);
    };

    goog.inherits(_.OverviewScreen, goog.events.EventTarget);

    _.OverviewScreen.prototype.display = function(evt){
        var xhr = /** @type {goog.net.XhrIo} */ (evt.target);

        if(xhr.getStatus() == 200){
            this.display_(xhr.getResponseJson());
        }
    };

    _.OverviewScreen.prototype.display_ = function(json){
        var personaContainer = goog.dom.getElementByClass('js-persona-container'),
            fader;

        this.boroughRenderer.render(json);

        if(personaContainer.style.display !== 'none'){
            fader = new goog.fx.dom.FadeOutAndHide(personaContainer, 500);
            fader.play();
        }

    };

    _.OverviewScreen.prototype.reset = function(){
        this.boroughRenderer.reset();
    };

});