goog.provide("app.renderer.Detail");

goog.require("goog.dom");

goog.scope(function () {
    var _ = app.renderer;

    _.Detail = function () {
        this.nameElement = goog.dom.getElementByClass('js-borough-name');
        this.scoreElement = goog.dom.getElementByClass('js-borough-score');
    };

    _.Detail.prototype.render = function (data) {

        goog.dom.setTextContent(this.nameElement, data.name);
        goog.dom.setTextContent(this.scoreElement, Math.round(data.score * 100));
    };
});