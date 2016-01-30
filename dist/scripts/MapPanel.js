"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var d3 = require("d3");
var _ = require("underscore");

var LoadingOverlay = require("./LoadingOverlay.js");
var crimedata = require("./crimedata.js");
var mapsutil = require("./mapsutil.js");

var crimeTypes = [
// Property
"BURGLARY", "ROBBERY", "THEFT", "MOTOR VEHICLE THEFT", "ARSON", "DECEPTIVE PRACTICE", "CRIMINAL DAMAGE",
// Personal
"ASSAULT", "BATTERY",
// Sexual
"CRIMINAL SEXUAL ABUSE", "CRIM SEXUAL ASSAULT", "SEX OFFENSE", "PROSTITUTION",
// Domestic
"CRIMINAL TRESPASS", "PUBLIC PEACE VIOLATION", "INTERFERENCE WITH PUBLIC OFFICER", "KIDNAPPING", "OFFENSE INVOLVING CHILDREN",
// Substances
"NARCOTICS", "LIQUOR LAW VIOLATION",
// OTHER
"OTHER OFFENSE", "WEAPONS VIOLATION"];

var MapPanel = function () {
    function MapPanel() {
        var cfg = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, MapPanel);

        var _cfg$lat = cfg.lat;
        var lat = _cfg$lat === undefined ? 10 : _cfg$lat;
        var _cfg$lng = cfg.lng;
        var lng = _cfg$lng === undefined ? 10 : _cfg$lng;
        var _cfg$zoom = cfg.zoom;
        var zoom = _cfg$zoom === undefined ? 11 : _cfg$zoom;
        var el = cfg.el;
        var _cfg$bounds = cfg.bounds;
        var bounds = _cfg$bounds === undefined ? {
            min: new google.maps.LatLng(-Infinity, -Infinity),
            max: new google.maps.LatLng(Infinity, Infinity),
            zoom: [10, 21]
        } : _cfg$bounds;

        this.el = d3.select(el);
        this.map = new google.maps.Map(this.el.node(), {
            center: { lat: lat, lng: lng },
            zoom: zoom,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        mapsutil.boundMapPos(this.map, new google.maps.LatLngBounds(bounds.min, bounds.max));

        mapsutil.boundMapZoom(this.map, bounds.zoom);

        this.spinner = new LoadingOverlay(this.el.node());

        this.loadData();
    }

    _createClass(MapPanel, [{
        key: "loadData",
        value: function loadData() {
            var _this = this;

            var year = new Date().getFullYear();
            if (!crimedata.hasYearLoaded(year)) {
                (function () {
                    if (!crimedata.isYearRequested(year)) {
                        crimedata.loadYear(year);
                    }
                    // If our data is taking more than 1/2 second to load let people
                    // know that we're actually doing something
                    var spinTimer = setTimeout(_this.spinner.show.bind(_this.spinner), 500);
                    crimedata.onYearLoad(year, function () {
                        clearTimeout(spinTimer);
                        _this.spinner.hide();
                        _this.displayData();
                    });
                })();
            } else {
                this.displayData();
            }
        }
    }, {
        key: "displayData",
        value: function displayData() {
            var year = arguments.length <= 0 || arguments[0] === undefined ? new Date().getFullYear() : arguments[0];

            year = year.toString();
            var crimes = crimedata.all({
                where: function where(crime) {
                    return crime.year === year;
                }
            });

            var crimePoints = crimes.map(function (crime) {
                return {
                    location: new google.maps.LatLng(parseFloat(crime.latitude), parseFloat(crime.longitude))
                };
            });

            var heatmap = new google.maps.visualization.HeatmapLayer({
                map: this.map,
                data: crimePoints,
                dissipating: true
            });
        }
    }]);

    return MapPanel;
}();

module.exports = MapPanel;