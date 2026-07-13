'use strict';

var motorcortex = require('@donkeyclip/motorcortex');

class VideoClip extends motorcortex.BrowserClip {
  get html() {
    this.width = this.attrs.width || 640;
    this.height = this.attrs.height || 360;
    this.startFrom = this.attrs.startFrom || 0;
    const meta = this._hasMetadata();
    return `
      <div style="position:relative;width:100%;height:100%;">
        <div class="yt-player-target"></div>
        ${meta ? this._metadataHtml() : ""}
      </div>
    `;
  }
  get css() {
    return `
      #video{
        display:none;
      }
      .yt-meta-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 5;
        pointer-events: none;
        opacity: 0;
        display: flex;
        align-items: flex-start;
      }
      .yt-meta-card {
        margin: 32px;
        padding: 22px 28px;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 420px;
        transform: translateY(-12px);
      }
      .yt-meta-title {
        font-size: 16px;
        font-weight: 600;
        line-height: 1.35;
        margin-bottom: 10px;
        letter-spacing: -0.01em;
      }
      .yt-meta-row {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.75);
        line-height: 1;
      }
      .yt-meta-row + .yt-meta-row {
        margin-top: 6px;
      }
      .yt-meta-row svg {
        flex-shrink: 0;
        opacity: 0.6;
      }
      .yt-meta-stats {
        display: flex;
        gap: 14px;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      .yt-meta-stat {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
      }
      .yt-meta-stat svg {
        flex-shrink: 0;
        opacity: 0.55;
      }
    `;
  }
  _hasMetadata() {
    return !!this.attrs.title;
  }
  _metadataHtml() {
    const a = this.attrs;
    const iconChannel = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    const iconDate = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
    const iconViews = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    const iconLikes = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';
    let rows = "";
    if (a.channel) rows += `<div class="yt-meta-row">${iconChannel}<span>${a.channel}</span></div>`;
    if (a.publishedAt) rows += `<div class="yt-meta-row">${iconDate}<span>${a.publishedAt}</span></div>`;
    let stats = "";
    if (a.viewCount != null) stats += `<div class="yt-meta-stat">${iconViews}<span>${this._formatCount(a.viewCount)} views</span></div>`;
    if (a.likeCount != null) stats += `<div class="yt-meta-stat">${iconLikes}<span>${this._formatCount(a.likeCount)} likes</span></div>`;
    return `
      <div class="yt-meta-overlay" id="yt-meta">
        <div class="yt-meta-card">
          <div class="yt-meta-title">${a.title}</div>
          ${rows}
          ${stats ? `<div class="yt-meta-stats">${stats}</div>` : ""}
        </div>
      </div>
    `;
  }
  _formatCount(n) {
    if (n == null) return "";
    const num = Number(n);
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return String(num);
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
    // Guard against double call (real clip + ClipCopy)
    if (this._playerCreated) return;
    this._playerCreated = true;
    this.contextLoading();
    const that = this;
    let player;
    const customEntity = {
      player,
      startFrom: this.startFrom,
      loaded: false,
      initialVolume: this.attrs.volume ?? 1,
      subscribeVideoListener: event => that.subscribeVideoListener(event)
    };
    this.entity = customEntity;
    this.setCustomEntity("video", customEntity);

    // Register metadata overlay as a custom entity so MetaReveal can
    // animate it via the !#meta selector.
    if (this._hasMetadata()) {
      const metaOverlay = this.context.getElements(".yt-meta-overlay")[0];
      const metaCard = this.context.getElements(".yt-meta-card")[0];
      if (metaOverlay) {
        this.setCustomEntity("meta", {
          html_element: metaOverlay,
          card_element: metaCard || null
        });
      }
    }
    const createPlayer = () => {
      player = new window.YT.Player(this.context.getElements(".yt-player-target")[0], {
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

    // If YouTube API is already loaded, create player directly
    if (window.YT && window.YT.Player) {
      createPlayer();
      return;
    }

    // First time — load the script. Use a global queue so multiple clips
    // waiting for the same script all get created when it's ready.
    if (!window._ytPluginQueue) {
      window._ytPluginQueue = [];
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => {
        const queue = window._ytPluginQueue;
        window._ytPluginQueue = null;
        for (const fn of queue) {
          fn();
        }
      };
    }
    if (window._ytPluginQueue) {
      window._ytPluginQueue.push(createPlayer);
    } else {
      createPlayer();
    }
  }
}

class VideoPlay extends motorcortex.MediaPlayback {
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

/**
 * Volume — Effect that animates the YouTube player's volume.
 *
 * Selector: !#video
 * animatedAttrs: { volume: <target 0-1> }
 * initialValues: { volume: <start 0-1> }  — REQUIRED
 *
 * Both animatedAttrs and initialValues must be provided.
 * getScratchValue is not reliably called for custom entity Effects.
 */
class Volume extends motorcortex.Effect {
  getScratchValue() {
    return this.element?.entity?.initialVolume ?? 1;
  }
  onProgress(millisecond) {
    const entity = this.element?.entity;
    if (!entity?.player || !entity.loaded) return;
    const fraction = this.getFraction(millisecond);
    const initial = this.initialValue ?? entity.initialVolume ?? 1;
    const target = this.targetValue;
    const current = initial + (target - initial) * fraction;
    const vol = Math.round(Math.max(0, Math.min(1, current)) * 100);
    entity.player.setVolume(vol);
  }
}

/**
 * MetaReveal — Effect that animates the metadata overlay's opacity and
 * the card's translateY for a slide-in / slide-out feel.
 *
 * Selector: !#meta
 * animatedAttrs: { opacity: <target 0-1> }
 * Props: { cardSlideY: "0px" | "12px" } — optional translateY for the card
 *
 * The entity must have:
 *   - html_element: the overlay DOM node (.yt-meta-overlay)
 *   - card_element: the card DOM node (.yt-meta-card)
 */
class MetaReveal extends motorcortex.Effect {
  getScratchValue() {
    return 0;
  }
  onProgress(millisecond) {
    const entity = this.element?.entity;
    if (!entity) return;
    const overlay = entity.html_element;
    const card = entity.card_element;
    if (!overlay) return;
    const fraction = this.getFraction(millisecond);
    const initial = this.initialValue ?? 0;
    const target = this.targetValue;
    const current = initial + (target - initial) * fraction;
    overlay.style.opacity = current;
    if (card && this.props.cardSlideY != null) {
      // Interpolate translateY: starts from props.cardSlideFrom, ends at props.cardSlideY
      const fromY = parseFloat(this.props.cardSlideFrom ?? "12");
      const toY = parseFloat(this.props.cardSlideY);
      const y = fromY + (toY - fromY) * fraction;
      card.style.transform = `translateY(${y}px)`;
    }
  }
}

var name = "@kissmybutton/motorcortex-youtube";
var version = "1.5.0";
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
	"@donkeyclip/motorcortex": ">=7.5.5 < 10"
};
var devDependencies = {
	"@babel/cli": "7.23.0",
	"@babel/core": "7.23.2",
	"@babel/eslint-parser": "7.22.15",
	"@babel/plugin-syntax-jsx": "7.22.5",
	"@babel/plugin-transform-react-jsx": "7.22.15",
	"@babel/preset-env": "7.23.2",
	"@donkeyclip/motorcortex": "9.12.0",
	"@donkeyclip/motorcortex-player": "2.10.11",
	"@rollup/plugin-babel": "5.3.1",
	"@rollup/plugin-commonjs": "21.1.0",
	"@rollup/plugin-json": "4.1.0",
	"@rollup/plugin-node-resolve": "13.3.0",
	"@size-limit/preset-big-lib": "6.0.4",
	"babel-loader": "8.3.0",
	concurrently: "6.5.1",
	"core-js": "3.33.1",
	"css-loader": "6.8.1",
	eslint: "7.32.0",
	"eslint-config-prettier": "8.10.0",
	"eslint-config-standard": "16.0.3",
	"eslint-plugin-babel": "5.3.1",
	"eslint-plugin-import": "2.29.0",
	"eslint-plugin-node": "11.1.0",
	"eslint-plugin-prettier": "4.2.1",
	"eslint-plugin-promise": "5.2.0",
	husky: "7.0.4",
	prettier: "2.8.8",
	rimraf: "3.0.2",
	rollup: "2.79.1",
	"rollup-plugin-terser": "7.0.2",
	"size-limit": "6.0.4",
	webpack: "5.89.0",
	"webpack-cli": "4.10.0",
	"webpack-dev-server": "4.15.1"
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
  }, {
    exportable: Volume,
    name: "Volume"
  }, {
    exportable: MetaReveal,
    name: "MetaReveal"
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
      },
      title: {
        optional: true,
        type: "string"
      },
      channel: {
        optional: true,
        type: "string"
      },
      publishedAt: {
        optional: true,
        type: "string"
      },
      viewCount: {
        optional: true,
        type: "number"
      },
      likeCount: {
        optional: true,
        type: "number"
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
