goog.provide("app.ui.PersonaSwitcher");

goog.require("app.events.PersonaClickedEvent");

goog.require("goog.dom");
goog.require("goog.dom.classlist");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventType");
goog.require("goog.events.EventTarget");

goog.scope(function () {
    var _ = app.ui;

    _.PersonaSwitcher = function () {
        goog.base(this);

        this.handler = new goog.events.EventHandler(this);

        this.switcherControl = goog.dom.getElementByClass('js-personas-switcher-control');
        this.personasSwitcher = goog.dom.getElementByClass('js-persona-switcher');
        this.personaName = goog.dom.getElementByClass('js-persona-name');

        this.handler.listen(this.switcherControl, goog.events.EventType.CLICK, this.showPersonas_);
        this.handler.listen(this.personasSwitcher, goog.events.EventType.CLICK, this.personaClicked_);
    };

    goog.inherits(_.PersonaSwitcher, goog.events.EventTarget);

    _.PersonaSwitcher.prototype.showPersonas_ = function (evt) {
        goog.dom.classlist.toggle(this.personasSwitcher, 'show');
    };

    _.PersonaSwitcher.prototype.personaClicked_ = function (evt) {
        var target = evt.target,
            persona = goog.dom.dataset.get(target, "persona"),
            personaName = goog.dom.dataset.get(target, "personaName");

        if (!persona) {
            return;
        }

        goog.dom.setTextContent(this.personaName, personaName);

        this.dispatchEvent(new app.events.PersonaClickedEvent(persona));

        goog.dom.classlist.toggle(this.personasSwitcher, 'show');

        evt.preventDefault();
    };

    _.PersonaSwitcher.prototype.show = function(){
        goog.dom.classlist.remove(this.switcherControl, 'hidden');
    };
});