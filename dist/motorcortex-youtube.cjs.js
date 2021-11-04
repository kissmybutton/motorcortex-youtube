'use strict';

var motorcortex = require('@donkeyclip/motorcortex');

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var fails$3 = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var fails$2 = fails$3; // Detect IE8's incomplete defineProperty implementation

var descriptors = !fails$2(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, {
    get: function () {
      return 7;
    }
  })[1] != 7;
});

var FunctionPrototype$2 = Function.prototype;
var bind = FunctionPrototype$2.bind;
var call$3 = FunctionPrototype$2.call;
var callBind = bind && bind.bind(call$3);
var functionUncurryThis = bind ? function (fn) {
  return fn && callBind(call$3, fn);
} : function (fn) {
  return fn && function () {
    return call$3.apply(fn, arguments);
  };
};

var check = function (it) {
  return it && it.Math == Math && it;
}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


var global$g = // eslint-disable-next-line es/no-global-this -- safe
check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || // eslint-disable-next-line no-restricted-globals -- safe
check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func -- fallback
function () {
  return this;
}() || Function('return this')();

var global$f = global$g;
var TypeError$6 = global$f.TypeError; // `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible

var requireObjectCoercible$1 = function (it) {
  if (it == undefined) throw TypeError$6("Can't call method on " + it);
  return it;
};

var global$e = global$g;
var requireObjectCoercible = requireObjectCoercible$1;
var Object$2 = global$e.Object; // `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject

var toObject$1 = function (argument) {
  return Object$2(requireObjectCoercible(argument));
};

var uncurryThis$3 = functionUncurryThis;
var toObject = toObject$1;
var hasOwnProperty = uncurryThis$3({}.hasOwnProperty); // `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty

var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

var DESCRIPTORS$3 = descriptors;
var hasOwn$1 = hasOwnProperty_1;
var FunctionPrototype$1 = Function.prototype; // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe

var getDescriptor = DESCRIPTORS$3 && Object.getOwnPropertyDescriptor;
var EXISTS$1 = hasOwn$1(FunctionPrototype$1, 'name'); // additional protection from minified / mangled / dropped function names

var PROPER = EXISTS$1 && function something() {
  /* empty */
}.name === 'something';

var CONFIGURABLE = EXISTS$1 && (!DESCRIPTORS$3 || DESCRIPTORS$3 && getDescriptor(FunctionPrototype$1, 'name').configurable);
var functionName = {
  EXISTS: EXISTS$1,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

var objectDefineProperty = {};

// https://tc39.es/ecma262/#sec-iscallable

var isCallable$5 = function (argument) {
  return typeof argument == 'function';
};

var isCallable$4 = isCallable$5;

var isObject$4 = function (it) {
  return typeof it == 'object' ? it !== null : isCallable$4(it);
};

var global$d = global$g;
var isObject$3 = isObject$4;
var document = global$d.document; // typeof document.createElement is 'object' in old IE

var EXISTS = isObject$3(document) && isObject$3(document.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

var DESCRIPTORS$2 = descriptors;
var fails$1 = fails$3;
var createElement = documentCreateElement; // Thank's IE8 for his funny defineProperty

var ie8DomDefine = !DESCRIPTORS$2 && !fails$1(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () {
      return 7;
    }
  }).a != 7;
});

var global$c = global$g;
var isObject$2 = isObject$4;
var String$2 = global$c.String;
var TypeError$5 = global$c.TypeError; // `Assert: Type(argument) is Object`

var anObject$1 = function (argument) {
  if (isObject$2(argument)) return argument;
  throw TypeError$5(String$2(argument) + ' is not an object');
};

var call$2 = Function.prototype.call;
var functionCall = call$2.bind ? call$2.bind(call$2) : function () {
  return call$2.apply(call$2, arguments);
};

var global$b = global$g;
var isCallable$3 = isCallable$5;

var aFunction = function (argument) {
  return isCallable$3(argument) ? argument : undefined;
};

var getBuiltIn$2 = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global$b[namespace]) : global$b[namespace] && global$b[namespace][method];
};

var uncurryThis$2 = functionUncurryThis;
var objectIsPrototypeOf = uncurryThis$2({}.isPrototypeOf);

var getBuiltIn$1 = getBuiltIn$2;
var engineUserAgent = getBuiltIn$1('navigator', 'userAgent') || '';

var global$a = global$g;
var userAgent = engineUserAgent;
var process = global$a.process;
var Deno = global$a.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version$1;

if (v8) {
  match = v8.split('.'); // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us

  version$1 = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
} // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0


if (!version$1 && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);

  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version$1 = +match[1];
  }
}

var engineV8Version = version$1;

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = engineV8Version;
var fails = fails$3; // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing

var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol(); // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances

  return !String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
  !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL$1 = nativeSymbol;
var useSymbolAsUid = NATIVE_SYMBOL$1 && !Symbol.sham && typeof Symbol.iterator == 'symbol';

var global$9 = global$g;
var getBuiltIn = getBuiltIn$2;
var isCallable$2 = isCallable$5;
var isPrototypeOf = objectIsPrototypeOf;
var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;
var Object$1 = global$9.Object;
var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable$2($Symbol) && isPrototypeOf($Symbol.prototype, Object$1(it));
};

var global$8 = global$g;
var String$1 = global$8.String;

var tryToString$1 = function (argument) {
  try {
    return String$1(argument);
  } catch (error) {
    return 'Object';
  }
};

var global$7 = global$g;
var isCallable$1 = isCallable$5;
var tryToString = tryToString$1;
var TypeError$4 = global$7.TypeError; // `Assert: IsCallable(argument) is true`

var aCallable$1 = function (argument) {
  if (isCallable$1(argument)) return argument;
  throw TypeError$4(tryToString(argument) + ' is not a function');
};

var aCallable = aCallable$1; // `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod

var getMethod$1 = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};

var global$6 = global$g;
var call$1 = functionCall;
var isCallable = isCallable$5;
var isObject$1 = isObject$4;
var TypeError$3 = global$6.TypeError; // `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive

var ordinaryToPrimitive$1 = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject$1(val = call$1(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject$1(val = call$1(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject$1(val = call$1(fn, input))) return val;
  throw TypeError$3("Can't convert object to primitive value");
};

var shared$1 = {exports: {}};

var global$5 = global$g; // eslint-disable-next-line es/no-object-defineproperty -- safe

var defineProperty$1 = Object.defineProperty;

var setGlobal$1 = function (key, value) {
  try {
    defineProperty$1(global$5, key, {
      value: value,
      configurable: true,
      writable: true
    });
  } catch (error) {
    global$5[key] = value;
  }

  return value;
};

var global$4 = global$g;
var setGlobal = setGlobal$1;
var SHARED = '__core-js_shared__';
var store$1 = global$4[SHARED] || setGlobal(SHARED, {});
var sharedStore = store$1;

var store = sharedStore;
(shared$1.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.19.0',
  mode: 'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});

var uncurryThis$1 = functionUncurryThis;
var id = 0;
var postfix = Math.random();
var toString = uncurryThis$1(1.0.toString);

var uid$1 = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

var global$3 = global$g;
var shared = shared$1.exports;
var hasOwn = hasOwnProperty_1;
var uid = uid$1;
var NATIVE_SYMBOL = nativeSymbol;
var USE_SYMBOL_AS_UID = useSymbolAsUid;
var WellKnownSymbolsStore = shared('wks');
var Symbol$1 = global$3.Symbol;
var symbolFor = Symbol$1 && Symbol$1['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

var wellKnownSymbol$1 = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;

    if (NATIVE_SYMBOL && hasOwn(Symbol$1, name)) {
      WellKnownSymbolsStore[name] = Symbol$1[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  }

  return WellKnownSymbolsStore[name];
};

var global$2 = global$g;
var call = functionCall;
var isObject = isObject$4;
var isSymbol$1 = isSymbol$2;
var getMethod = getMethod$1;
var ordinaryToPrimitive = ordinaryToPrimitive$1;
var wellKnownSymbol = wellKnownSymbol$1;
var TypeError$2 = global$2.TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive'); // `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive

var toPrimitive$1 = function (input, pref) {
  if (!isObject(input) || isSymbol$1(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;

  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol$1(result)) return result;
    throw TypeError$2("Can't convert object to primitive value");
  }

  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

var toPrimitive = toPrimitive$1;
var isSymbol = isSymbol$2; // `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey

var toPropertyKey$1 = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

var global$1 = global$g;
var DESCRIPTORS$1 = descriptors;
var IE8_DOM_DEFINE = ie8DomDefine;
var anObject = anObject$1;
var toPropertyKey = toPropertyKey$1;
var TypeError$1 = global$1.TypeError; // eslint-disable-next-line es/no-object-defineproperty -- safe

var $defineProperty = Object.defineProperty; // `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty

objectDefineProperty.f = DESCRIPTORS$1 ? $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) {
    /* empty */
  }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError$1('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var DESCRIPTORS = descriptors;
var FUNCTION_NAME_EXISTS = functionName.EXISTS;
var uncurryThis = functionUncurryThis;
var defineProperty = objectDefineProperty.f;
var FunctionPrototype = Function.prototype;
var functionToString = uncurryThis(FunctionPrototype.toString);
var nameRE = /^\s*function ([^ (]*)/;
var regExpExec = uncurryThis(nameRE.exec);
var NAME = 'name'; // Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name

if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return regExpExec(nameRE, functionToString(this))[1];
      } catch (error) {
        return '';
      }
    }
  });
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

var VideoClip = /*#__PURE__*/function (_BrowserClip) {
  _inherits(VideoClip, _BrowserClip);

  var _super = _createSuper(VideoClip);

  function VideoClip() {
    _classCallCheck(this, VideoClip);

    return _super.apply(this, arguments);
  }

  _createClass(VideoClip, [{
    key: "html",
    get: function get() {
      this.width = this.attrs.width || 640;
      this.height = this.attrs.height || 360;
      this.startFrom = this.attrs.startFrom || 0;
      return "\n      <div></div>\n    ";
    }
  }, {
    key: "css",
    get: function get() {
      return "\n      #video{\n        display:none;\n      }\n    ";
    }
  }, {
    key: "subscribeVideoListener",
    value: function subscribeVideoListener(funct) {
      if (!this.subscribers) {
        this.subscribers = [];
      }

      this.subscribers.push(funct);
    }
  }, {
    key: "setVolume",
    value: function setVolume(vol) {
      this.entity.player.setVolume(vol * 100 * (this.attrs.volume || 1));
    }
  }, {
    key: "onAfterRender",
    value: function onAfterRender() {
      var _this = this;

      this.contextLoading();
      var that = this;
      var player;
      var customEntity = {
        player: player,
        startFrom: this.startFrom,
        loaded: false,
        subscribeVideoListener: function subscribeVideoListener(event) {
          return that.subscribeVideoListener(event);
        }
      };
      this.entity = customEntity;
      this.setCustomEntity("video", customEntity);
      var tag = this.context.document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      this.context.rootElement.appendChild(tag);

      window.onYouTubeIframeAPIReady = function () {
        player = new window.YT.Player(_this.context.getElements("div")[0], {
          height: _this.attrs.height,
          width: _this.attrs.width,
          videoId: _this.attrs.videoId,
          playerVars: {
            controls: 0,
            playsinline: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            ecver: 2,
            start: _this.startFrom / 1000
          },
          events: {
            onReady: function onReady() {
              customEntity.loaded = true;
              customEntity.player = player;
              var res = that.DescriptiveIncident.volumeChangeSubscribe(that.id, that.setVolume.bind(that));
              that.setVolume(res);
              that.contextLoaded();
            },
            onStateChange: function onStateChange(event) {
              if (that.subscribers) {
                for (var i = 0; i < that.subscribers.length; i++) {
                  that.subscribers[i](event.data);
                }
              }
            }
          }
        });
      };
    }
  }]);

  return VideoClip;
}(motorcortex.BrowserClip);

var VideoPlay = /*#__PURE__*/function (_MediaPlayback) {
  _inherits(VideoPlay, _MediaPlayback);

  var _super = _createSuper(VideoPlay);

  function VideoPlay() {
    _classCallCheck(this, VideoPlay);

    return _super.apply(this, arguments);
  }

  _createClass(VideoPlay, [{
    key: "onInitialise",
    value: function onInitialise() {
      this.element.entity.subscribeVideoListener(this.stateChange.bind(this));
    }
  }, {
    key: "play",
    value: function play(millisecond) {
      var entity = this.element.entity;
      var currentState = entity.player.getPlayerState();

      if (currentState === -1 || currentState === 3) {
        entity.player.seekTo((millisecond + this.element.entity.startFrom) / 1000);
        entity.player.playVideo();
        return this.waitingHandler();
      }

      if (currentState !== 1) {
        entity.player.seekTo((millisecond + this.element.entity.startFrom) / 1000);
        entity.player.playVideo();
      }

      return true;
    }
  }, {
    key: "stateChange",
    value: function stateChange(state) {
      switch (state) {
        case 3:
          this.waitingHandler();
          break;

        case 1:
          this.canplayHandler();
      }
    }
  }, {
    key: "waitingHandler",
    value: function waitingHandler() {
      this.setBlock("Video loading", {
        exceptional: true
      });
    }
  }, {
    key: "canplayHandler",
    value: function canplayHandler() {
      this.unblock();
    }
  }, {
    key: "stop",
    value: function stop() {
      var video = this.element.entity.player;
      video.pauseVideo();
    }
  }, {
    key: "onProgress",
    value: function onProgress(fraction, millisecond) {
      var startFrom = millisecond + this.element.entity.startFrom;

      if (this.element.entity.player.getPlayerState() === -1 || this.element.entity.player.getPlayerState() === 5) {
        this.element.entity.player.pauseVideo();
      }

      this.element.entity.player.seekTo(startFrom / 1000);
    }
  }]);

  return VideoPlay;
}(motorcortex.MediaPlayback);

var name = "@kissmybutton/motorcortex-youtube";
var version = "1.0.0";
var description = "Your plugin description here";
var main = "dist/motorcortex-youtube.cjs.js";
var module$1 = "dist/motorcortex-youtube.esm.js";
var browser = "dist/motorcortex-youtube.umd.js";
var author = "KissMyButton PC (kissmybutton.gr) <opensource@kissmybutton.gr>";
var repository = {
	type: "git",
	url: "https://github.com/kissmybutton/motorcortex-youtube"
};
var license = "MIT";
var engines = {
	node: ">=10"
};
var scripts = {
	concurrently: "concurrently -c \"cyan.bold,magenta.bold\" --names \"JS,Styles\"",
	"lint:styles": "stylelint  --allow-empty-input \"src/**.css\" \"src/**/*.scss\" --config .stylelintrc.json",
	"lint:js": "eslint -c .eslintrc src/**/*.js",
	lint: "npm run concurrently \"npm:lint:js\" \"npm:lint:styles\"",
	"lint:fix": "npm run concurrently  \"npm:lint:js -- --fix\" \"npm:lint:styles -- --fix\"",
	build: "npm run build:lib && npm run build:demo",
	"build:lib": "rollup -c",
	start: "npm run build:lib && concurrently -c \"cyan.bold,magenta.bold\" \"npm:build:lib -- -w\"  \"npm:start:demo\" ",
	"start:demo": "webpack serve --mode=development --config ./demo/webpack.config.js",
	"build:demo": "webpack --mode=production --config ./demo/webpack.config.js",
	test: "HERE GOES YOUR TEST TASK",
	"test:prod": "npm run lint",
	prepare: "husky install"
};
var keywords = [
	"motorcortex"
];
var config = {
	commitizen: {
		path: "cz-conventional-changelog"
	}
};
var peerDependencies = {
	"@donkeyclip/motorcortex": ">=7.5.5"
};
var devDependencies = {
	"@babel/cli": "7.16.0",
	"@babel/core": "^7.16.0",
	"@babel/eslint-parser": "^7.16.0",
	"@babel/plugin-syntax-jsx": "^7.16.0",
	"@babel/plugin-transform-react-jsx": "^7.16.0",
	"@babel/preset-env": "^7.16.0",
	"@donkeyclip/motorcortex": "^7",
	"@donkeyclip/motorcortex-player": "^2.3.6",
	"@rollup/plugin-babel": "^5.3.0",
	"@rollup/plugin-commonjs": "^21.0.1",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-node-resolve": "^13.0.6",
	"@size-limit/preset-big-lib": "^6.0.4",
	"babel-loader": "8.2.3",
	concurrently: "^6.3.0",
	"core-js": "^3.19.0",
	"css-loader": "^6.5.0",
	eslint: "7.32.0",
	"eslint-config-prettier": "8.3.0",
	"eslint-config-standard": "16.0.3",
	"eslint-plugin-babel": "5.3.1",
	"eslint-plugin-import": "^2.25.2",
	"eslint-plugin-node": "11.1.0",
	"eslint-plugin-prettier": "^4.0.0",
	"eslint-plugin-promise": "^5.1.1",
	husky: "^7.0.0",
	prettier: "2.4.1",
	rimraf: "^3.0.2",
	rollup: "^2.59.0",
	"rollup-plugin-terser": "7.0.2",
	"size-limit": "^6.0.4",
	webpack: "^5.61.0",
	"webpack-cli": "^4.9.1",
	"webpack-dev-server": "^4.4.0"
};
var pkg = {
	name: name,
	version: version,
	description: description,
	main: main,
	module: module$1,
	browser: browser,
	author: author,
	repository: repository,
	license: license,
	engines: engines,
	scripts: scripts,
	keywords: keywords,
	"lint-staged": {
	"*.{json,md,yml,yaml}": [
		"prettier --write"
	],
	"*.css": [
		"prettier --write",
		"stylelint  \"src/**.css\" --config .stylelintrc.json --fix"
	],
	"*.{js,jsx}": [
		"prettier --write",
		"eslint --fix"
	]
},
	config: config,
	peerDependencies: peerDependencies,
	devDependencies: devDependencies
};

var index = {
  npm_name: pkg.name,
  version: pkg.version,
  incidents: [{
    exportable: VideoPlay,
    name: "Playback"
  }],
  Clip: {
    exportable: VideoClip,
    attributesValidationRules: {
      width: {
        optional: true,
        type: "number",
        integer: true,
        positive: true
      },
      height: {
        optional: true,
        type: "number",
        integer: true,
        positive: true
      },
      startFrom: {
        optional: true,
        type: "number",
        integer: true,
        min: 0
      },
      videoId: {
        type: "string"
      },
      volume: {
        type: "number",
        min: 0,
        max: 1,
        default: 1
      }
    }
  },
  capabilities: {
    speed: false,
    preview: false
  },
  audio: "on"
};

module.exports = index;
