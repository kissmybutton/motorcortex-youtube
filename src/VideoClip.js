import { BrowserClip } from "@donkeyclip/motorcortex";
export default class VideoClip extends BrowserClip {
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

  subscribeVideoListener(funct){
    if(!this.subscribers){
      this.subscribers = [];
    }
    this.subscribers.push(funct);
  }

  onAfterRender() {
    const that = this;
    let player;
    const customEntity = {
      player,
      startFrom: this.startFrom,
      loaded: false,
      subscribeVideoListener: (event) => that.subscribeVideoListener(event),
    };
    this.setCustomEntity("video", customEntity);
    const tag = this.context.document.createElement("script");

    tag.src = "https://www.youtube.com/iframe_api";
    this.context.rootElement.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      player = new YT.Player(this.context.getElements("div")[0], {
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
          },
          onStateChange: function(event){
            if(that.subscribers) {
              for(let i=0; i<that.subscribers.length; i++) {
                that.subscribers[i](event.data);
              }
            }
          },
        },
      });
    };

    //
    // // 4. The API will call this function when the video player is ready.
    // function onPlayerReady(event) {
    //   event.target.playVideo();
    // }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    // let done = false;
    // function onPlayerStateChange(event) {
    //   if (event.data == YT.PlayerState.PLAYING && !done) {
    //     setTimeout(stopVideo, 6000);
    //     done = true;
    //   }
    // }
    // function stopVideo() {
    //   player.stopVideo();
    // }
  }
}
