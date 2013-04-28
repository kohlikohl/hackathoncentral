goog.provide("app.StartScreen");

goog.require("app.events.PersonaClickedEvent");

goog.require("goog.events.EventType");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventHandler");
goog.require("goog.dom");
goog.require("goog.dom.dataset");

goog.scope(function(){
    var _ = app;

    _.StartScreen = function() {
        goog.base(this);

        this.handler = new goog.events.EventHandler();
        this.handler.listen(goog.dom.getElementByClass('js-persona-container'), goog.events.EventType.CLICK, this);

        this.personaName = goog.dom.getElementByClass('js-persona-name');
    };

    goog.inherits(_.StartScreen, goog.events.EventTarget);

    _.StartScreen.prototype.handleEvent = function(evt){
        var target = evt.target,
            persona = goog.dom.dataset.get(target, "persona"),
            personaName = goog.dom.dataset.get(target, "personaName");

        if(!persona){
            return;
        }

        goog.dom.setTextContent(this.personaName, personaName);

        this.dispatchEvent(new _.events.PersonaClickedEvent(persona));

        evt.preventDefault();
    };

});