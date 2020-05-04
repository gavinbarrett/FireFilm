"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Selector =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Selector, _React$Component);

  var _super = _createSuper(Selector);

  function Selector(props) {
    var _this;

    _classCallCheck(this, Selector);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "updateFile", function (event) {
      // update the filepath
      _this.setState({
        filepath: event.target.files[0]
      });
    });

    _defineProperty(_assertThisInitialized(_this), "uploadFile", function () {
      // send image with POST request
      console.log("Current file: " + _this.state.filepath.name);
      var imgData = new FormData();
      imgData.append("file", _this.state.filepath, _this.state.filepath.name); //imgData.append("file", this.state.filepath, "error.png");

      fetch('/upload', {
        method: "POST",
        body: imgData
      }).then(function (response) {
        return console.log(response);
      });
    });

    _this.state = {
      filepath: null
    };
    return _this;
  }

  _createClass(Selector, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return (
        /*#__PURE__*/
        React.createElement("div", {
          id: "selectWrapper"
        },
        /*#__PURE__*/
        React.createElement("input", {
          id: "inf",
          type: "file",
          name: "file",
          accept: "image/x-png,image/gif,image/jpeg",
          onChange: this.updateFile
        }),
        /*#__PURE__*/
        React.createElement("button", {
          id: "f",
          type: "submit",
          className: "file-submit",
          onClick: function onClick() {
            _this2.uploadFile();
          }
        }, "Submit File"))
      );
    }
  }]);

  return Selector;
}(React.Component);

function Page() {
  return (
    /*#__PURE__*/
    React.createElement(React.Fragment, null,
    /*#__PURE__*/
    React.createElement("div", {
      id: "page"
    },
    /*#__PURE__*/
    React.createElement(Selector, null)))
  );
}

ReactDOM.render(
/*#__PURE__*/
React.createElement(Page, null), document.getElementById('root'));