import { MediaPlayback } from "@donkeyclip/motorcortex";

export default class VideoPlay extends MediaPlayback {
  onInitialise(){
    this.element.entity.subscribeVideoListener(this.stateChange.bind(this));
  }

  play(/*millisecond*/) {
    const entity = this.element.entity;
    const currentState = entity.player.getPlayerState();
    if(!entity.player) {
      return this.waitingHandler();
    }
    if(currentState === -1 || currentState === 3){
      return this.waitingHandler();
    }
    entity.player.playVideo();

    return true;
  }

  stateChange(state){
    switch (state) {
      case 3:
        this.waitingHandler();
        break;
      case 1:
        this.canplayHandler();
    }
  }

  waitingHandler() {
    this.setBlock("Video loading", { exceptional: true });
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
