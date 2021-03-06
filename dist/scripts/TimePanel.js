"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("./Component.js");

var _Component3 = _interopRequireDefault(_Component2);

var _FancySelect = require("./FancySelect.js");

var _FancySelect2 = _interopRequireDefault(_FancySelect);

var _datahub = require("./datahub.js");

var _datahub2 = _interopRequireDefault(_datahub);

var _constants = require("./constants.js");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimePanel = function (_Component) {
    _inherits(TimePanel, _Component);

    function TimePanel() {
        var cfg = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, TimePanel);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TimePanel).call(this, cfg));

        var el = cfg.el;
        var year = cfg.year;
        var month = cfg.month;


        _this.initData("month", month);
        _this.initData("year", year);

        _this.domNode = document.getElementById(el);

        new _FancySelect2.default({
            el: "year-min-select",
            start: new Date().getFullYear(),
            values: _constants2.default.years,
            listeners: {
                change: function change(_ref) {
                    var value = _ref.value;

                    _this.setData("year", {
                        min: value,
                        max: _this.getData("year").max
                    });
                }
            }
        });
        new _FancySelect2.default({
            el: "year-max-select",
            start: new Date().getFullYear(),
            values: _constants2.default.years,
            listeners: {
                change: function change(_ref2) {
                    var value = _ref2.value;

                    _this.setData("year", {
                        min: _this.getData("year").min,
                        max: value
                    });
                }
            }
        });
        new _FancySelect2.default({
            el: "month-min-select",
            start: "Jan",
            values: _constants2.default.months,
            listeners: {
                change: function change(_ref3) {
                    var value = _ref3.value;

                    _this.setData("month", {
                        min: value,
                        max: _this.getData("month").max
                    });
                }
            }
        });
        new _FancySelect2.default({
            el: "month-max-select",
            start: "Dec",
            values: _constants2.default.months,
            listeners: {
                change: function change(_ref4) {
                    var value = _ref4.value;

                    _this.setData("month", {
                        min: _this.getData("month").min,
                        max: value
                    });
                }
            }
        });

        _this.on("change", _this.handleChange.bind(_this));
        return _this;
    }

    _createClass(TimePanel, [{
        key: "handleChange",
        value: function handleChange() {
            var year = this.getData("year");
            var month = this.getData("month");
            _datahub2.default.setData("date_filter", {
                min: new Date(month.min + " " + year.min),
                max: new Date(month.max + " " + year.max)
            });
            _datahub2.default.fire("filter_changed", {
                filterKey: "date_filter"
            });
        }
    }]);

    return TimePanel;
}(_Component3.default);

exports.default = TimePanel;