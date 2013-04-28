goog.provide("app.renderer.Detail");

goog.require("goog.dom");
goog.require("goog.fx.dom.FadeInAndShow");
goog.require("goog.fx.dom.FadeOutAndHide");
goog.require("goog.dom.dataset");

goog.scope(function () {
    var _ = app.renderer;

    _.Detail = function () {
        this.chartConf = {
            size: 90,
            bgColor: "red"
        };

        this.renderedOnce = false;

        this.nameElement = goog.dom.getElementByClass('js-borough-name');
        this.averageColourElement = goog.dom.getElementByClass('js-average-colour');
        this.scoreElement = goog.dom.getElementByClass('js-borough-score');

        this.locationDetails = goog.dom.getElementByClass('js-location-details');

        this.crimeChart = goog.dom.getElementByClass('js-chart-safety');
        this.pollutionChart = goog.dom.getElementByClass('js-chart-pollution');
        this.costChart = goog.dom.getElementByClass('js-chart-cost');
        this.employmentChart = goog.dom.getElementByClass('js-chart-employment');
        this.educationChart = goog.dom.getElementByClass('js-chart-education');
        this.servicesChart = goog.dom.getElementByClass('js-chart-services');
    };

    _.Detail.prototype.reset = function () {
        console.log(this.locationDetails);
        var fader;

        if (this.locationDetails.style.display === 'none') {
            return;
        }

        fader = new goog.fx.dom.FadeOutAndHide(this.locationDetails, 500);
        fader.play();

        this.renderedOnce = false;
    };

    _.Detail.prototype.render = function (data) {

        if (!this.renderedOnce) {
            this.renderOnce_();
        }

        goog.dom.setTextContent(this.nameElement, data.name);
        goog.dom.setTextContent(this.scoreElement, Math.round(data.score * 100));

        this.averageColourElement.style.backgroundColor = this.gradientColor_(Math.round(data.score * 100)).cssColor;

        this.render_(this.crimeChart, "crime", data);
        this.render_(this.pollutionChart, "pollution", data);
        this.render_(this.costChart, "income", data);
        this.render_(this.employmentChart, "employment", data);
        this.render_(this.educationChart, "education", data);
        this.render_(this.servicesChart, "services", data);

    };

    _.Detail.prototype.render_ = function(element, property, data){
        goog.dom.dataset.set(element, 'percent', Math.round(data.aggregates[property] * 100));
        goog.object.extend(this.chartConf,{'fgColor': this.gradientColor_(Math.round(data.aggregates[property] * 100)).cssColor});
        $(element).donutchart(this.chartConf).donutchart("animate");
    };

    _.Detail.prototype.renderOnce_ = function () {
        var fader = new goog.fx.dom.FadeInAndShow(this.locationDetails, 500);
        fader.play();

        this.renderedOnce = true;
    };

    _.Detail.prototype.gradientColor_ = function (percent) {
        var color1 = {
                r: 243,
                g: 221,
                b: 70
            },
            color2 = {
                r: 24,
                g: 151,
                b: 111
            };
        var newColor = {};

        function makeChannel(a, b) {
            return(a + Math.round((b - a) * (percent / 100)));
        }

        function makeColorPiece(num) {
            num = Math.min(num, 255);   // not more than 255
            num = Math.max(num, 0);     // not less than 0
            var str = num.toString(16);
            if (str.length < 2) {
                str = "0" + str;
            }
            return(str);
        }

        newColor.r = makeChannel(color1.r, color2.r);
        newColor.g = makeChannel(color1.g, color2.g);
        newColor.b = makeChannel(color1.b, color2.b);
        newColor.cssColor = "#" +
            makeColorPiece(newColor.r) +
            makeColorPiece(newColor.g) +
            makeColorPiece(newColor.b);
        return(newColor);
    }
});