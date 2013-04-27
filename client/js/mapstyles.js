goog.provide("app.map.styles");

/**
 * This styles the map
 * @type {Array}
 */
app.map.styles = [
    {
        "stylers": [
            { "visibility": "simplified" }
        ]
    },
    {
        "stylers": [
            { "saturation": -100 },
            { "lightness": -65 },
            { "gamma": 0.78 }
        ]
    },
    {
        "elementType": "labels",
        "stylers": [
            { "visibility": "off" }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            { "lightness": 20 }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            { "lightness": -24 }
        ]
    },
    {
        "stylers": [
            { "lightness": -17 }
        ]
    }
];