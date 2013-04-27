goog.provide("app.StartScreen");

goog.require("goog.events.EventType");
goog.require("goog.events.EventHandler");
goog.require("goog.dom");
goog.require("goog.dom.dataset");

goog.scope(function(){
    var _ = app;

    _.StartScreen = function() {
        this.handler = new goog.events.EventHandler();
        this.handler.listen(goog.dom.getElementByClass('js-persona-container'), goog.events.EventType.CLICK, this);
    };

    _.StartScreen.prototype.handleEvent = function(evt){
        var target = evt.target,
            persona = goog.dom.dataset.get(target, "persona");

        if(!persona){
            return;
        }

        console.log("Persona", persona);

        evt.preventDefault();
    };

});