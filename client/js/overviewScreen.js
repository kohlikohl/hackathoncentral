goog.provide("app.OverviewScreen");

goog.require("app.events.PersonaClickedEvent");

goog.require("goog.events.EventType");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventHandler");
goog.require("goog.dom");
goog.require("goog.dom.dataset");
goog.require("goog.fx.dom.FadeOutAndHide");

goog.scope(function(){
    var _ = app;

    _.OverviewScreen = function() {
        goog.base(this);

        this.handler = new goog.events.EventHandler();
    };

    goog.inherits(_.OverviewScreen, goog.events.EventTarget);

    _.OverviewScreen.prototype.display = function(evt){
        console.log(evt);
        var xhr = /** @type {goog.net.XhrIo} */ (evt.target);

        if(xhr.getStatus() == 200){
            this.display_(xhr.getResponseJson());
        }
    };

    _.OverviewScreen.prototype.display_ = function(json){
        console.log(json);
        var fader = new goog.fx.dom.FadeOutAndHide(goog.dom.getElementByClass('js-persona-container'), 500);
        fader.play();
    };

});