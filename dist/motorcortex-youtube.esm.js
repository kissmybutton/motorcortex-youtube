import { BrowserClip, MediaPlayback } from '@donkeyclip/motorcortex';

class VideoClip extends BrowserClip {
  get html() {
    this.width = this.attrs.width || 640;
    this.height = this.attrs.height || 360;
    this.startFrom = this.attrs.startFrom || 0;
    return `
      <div></div>
    `;
  }
  get css() {
    return `
      #video{
        display:none;
      }
    `;
  }
  subscribeVideoListener(funct) {
    if (!this.subscribers) {
      this.subscribers = [];
    }
    this.subscribers.push(funct);
  }
  setVolume(vol) {
    this.entity.player.setVolume(vol * 100 * (this.attrs.volume || 1));
  }
  onAfterRender() {
    this.contextLoading();
    const that = this;
    let player;
    const customEntity = {
      player,
      startFrom: this.startFrom,
      loaded: false,
      subscribeVideoListener: event => that.subscribeVideoListener(event)
    };
    this.entity = customEntity;
    this.setCustomEntity("video", customEntity);
    const tag = this.context.document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    this.context.rootElement.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player(this.context.getElements("div")[0], {
        height: this.attrs.height,
        width: this.attrs.width,
        videoId: this.attrs.videoId,
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
          start: this.startFrom / 1000
        },
        events: {
          onReady: () => {
            customEntity.loaded = true;
            customEntity.player = player;
            const res = that.DescriptiveIncident.volumeChangeSubscribe(that.id, that.setVolume.bind(that));
            that.setVolume(res);
            that.contextLoaded();
          },
          onStateChange: function (event) {
            if (that.subscribers) {
              for (let i = 0; i < that.subscribers.length; i++) {
                that.subscribers[i](event.data);
              }
            }
          }
        }
      });
    };
  }
}

class VideoPlay extends MediaPlayback {
  onInitialise() {
    this.element.entity.subscribeVideoListener(this.stateChange.bind(this));
  }
  play(millisecond) {
    const entity = this.element.entity;
    const currentState = entity.player.getPlayerState();
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
  stateChange(state) {
    switch (state) {
      case 3:
        this.waitingHandler();
        break;
      case 1:
        this.canplayHandler();
    }
  }
  waitingHandler() {
    this.setBlock("Video loading", {
      exceptional: true
    });
  }
  canplayHandler() {
    this.unblock();
  }
  stop() {
    const video = this.element.entity.player;
    video.pauseVideo();
  }
  onProgress(fraction, millisecond) {
    const startFrom = millisecond + this.element.entity.startFrom;
    if (this.element.entity.player.getPlayerState() === -1 || this.element.entity.player.getPlayerState() === 5) {
      this.element.entity.player.pauseVideo();
    }
    this.element.entity.player.seekTo(startFrom / 1000);
  }
}

var name = "@kissmybutton/motorcortex-youtube";
var version = "1.2.0";
var description = "Your plugin description here";
var main = "dist/motorcortex-youtube.cjs.js";
var module = "dist/motorcortex-youtube.esm.js";
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
	"@donkeyclip/motorcortex": ">=7.5.5 < 10"
};
var devDependencies = {
	"@babel/cli": "7.21.5",
	"@babel/core": "7.22.1",
	"@babel/eslint-parser": "7.21.8",
	"@babel/plugin-syntax-jsx": "7.21.4",
	"@babel/plugin-transform-react-jsx": "7.22.3",
	"@babel/preset-env": "7.22.4",
	"@donkeyclip/motorcortex": "9.7.0",
	"@donkeyclip/motorcortex-player": "2.10.8",
	"@rollup/plugin-babel": "5.3.1",
	"@rollup/plugin-commonjs": "21.1.0",
	"@rollup/plugin-json": "4.1.0",
	"@rollup/plugin-node-resolve": "13.3.0",
	"@size-limit/preset-big-lib": "6.0.4",
	"babel-loader": "8.3.0",
	concurrently: "6.5.1",
	"core-js": "3.25.5",
	"css-loader": "6.7.1",
	eslint: "7.32.0",
	"eslint-config-prettier": "8.5.0",
	"eslint-config-standard": "16.0.3",
	"eslint-plugin-babel": "5.3.1",
	"eslint-plugin-import": "2.26.0",
	"eslint-plugin-node": "11.1.0",
	"eslint-plugin-prettier": "4.2.1",
	"eslint-plugin-promise": "5.2.0",
	husky: "7.0.4",
	prettier: "2.7.1",
	rimraf: "3.0.2",
	rollup: "2.79.1",
	"rollup-plugin-terser": "7.0.2",
	"size-limit": "6.0.4",
	webpack: "5.74.0",
	"webpack-cli": "4.10.0",
	"webpack-dev-server": "4.11.1"
};
var pkg = {
	name: name,
	version: version,
	description: description,
	main: main,
	module: module,
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

export { index as default };
