goog.provide("app.StartScreen");

goog.require("goog.events.EventType");
goog.require("goog.events.EventHandler");
goog.require("goog.dom");

goog.scope(function(){
    var _ = app;

    _.StartScreen = function() {
        this.handler = new goog.events.EventHandler();
        this.handler.listen(goog.dom.getElementByClass('js-persona-container'), goog.events.EventType.CLICK, this);
    };

    _.StartScreen.prototype.handleEvent = function(){

    };

});