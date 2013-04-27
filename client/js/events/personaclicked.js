goog.provide("app.events.PersonaClickedEvent");

goog.require("app.events.EventType");

goog.require("goog.events.Event");

goog.scope(function(){

    var _ = app.events;

    _.PersonaClickedEvent = function(persona){
        goog.base(this, _.EventType.PERSONA_CLICKED);

        this.persona = persona;
    };

    goog.inherits(_.PersonaClickedEvent, goog.events.Event);
});