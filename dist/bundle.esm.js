import { BrowserClip, MediaPlayback } from '@donkeyclip/motorcortex';

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
      // if(!this.customEntity.loaded) return;
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
        player = new YT.Player(_this.context.getElements("div")[0], {
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
}(BrowserClip);

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
}(MediaPlayback);

var name = "my-plugin-name";
var version = "0.0.1";

var index = {
  npm_name: name,
  version: version,
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

export { index as default };
