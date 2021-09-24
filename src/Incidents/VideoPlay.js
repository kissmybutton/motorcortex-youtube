import { MediaPlayback } from "@donkeyclip/motorcortex";

export default class VideoPlay extends MediaPlayback {
  play(/*millisecond*/) {
    const video = this.element.entity.player;

    video.playVideo();
    // if (this.hasSetWaitingListener !== true) {
    //   video.addEventListener("waiting", this.waitingHandler.bind(this));
    //   this.hasSetWaitingListener = true;
    // }
    // if (this.hasSetCanplayListener !== true) {
    //   video.addEventListener("canplay", this.canplayHandler.bind(this));
    //   this.hasSetCanplayListener = true;
    // }

    return true;
  }

  waitingHandler() {
    this.setBlock("Video loading");
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
    if(this.element.entity.loaded){
      this.element.entity.player.seekTo((startFrom + millisecond) / 1000);
    }
  }
}
