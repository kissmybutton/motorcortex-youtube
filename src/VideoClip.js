import { BrowserClip } from "@donkeyclip/motorcortex";

export default class VideoClip extends BrowserClip {
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
    const iconChannel =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    const iconDate =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
    const iconViews =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    const iconLikes =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';

    let rows = "";
    if (a.channel)
      rows += `<div class="yt-meta-row">${iconChannel}<span>${a.channel}</span></div>`;
    if (a.publishedAt)
      rows += `<div class="yt-meta-row">${iconDate}<span>${a.publishedAt}</span></div>`;

    let stats = "";
    if (a.viewCount != null)
      stats += `<div class="yt-meta-stat">${iconViews}<span>${this._formatCount(a.viewCount)} views</span></div>`;
    if (a.likeCount != null)
      stats += `<div class="yt-meta-stat">${iconLikes}<span>${this._formatCount(a.likeCount)} likes</span></div>`;

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
      subscribeVideoListener: (event) => that.subscribeVideoListener(event),
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
          card_element: metaCard || null,
        });
      }
    }

    const createPlayer = () => {
      player = new window.YT.Player(
        this.context.getElements(".yt-player-target")[0],
        {
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
            start: this.startFrom / 1000,
          },
          events: {
            onReady: () => {
              customEntity.loaded = true;
              customEntity.player = player;
              const res = that.DescriptiveIncident.volumeChangeSubscribe(
                that.id,
                that.setVolume.bind(that),
              );
              that.setVolume(res);
              that.contextLoaded();
            },
            onStateChange: function (event) {
              if (that.subscribers) {
                for (let i = 0; i < that.subscribers.length; i++) {
                  that.subscribers[i](event.data);
                }
              }
            },
          },
        },
      );
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
