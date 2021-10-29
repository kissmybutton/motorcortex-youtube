import { MediaPlayback } from "@donkeyclip/motorcortex";

export default class VideoPlay extends MediaPlayback {
  onInitialise(){
    this.element.entity.subscribeVideoListener(this.stateChange.bind(this));
  }

  play(millisecond) {
    const entity = this.element.entity;
    const currentState = entity.player.getPlayerState();

    if(currentState === -1 || currentState === 3){
      entity.player.seekTo((millisecond + this.element.entity.startFrom)/1000);
      entity.player.playVideo();
      return this.waitingHandler();
    }
    if(currentState !== 1) {
      entity.player.seekTo((millisecond + this.element.entity.startFrom) / 1000);
      entity.player.playVideo();
    }

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
    if(this.element.entity.player.getPlayerState() === -1 || this.element.entity.player.getPlayerState() === 5) {
      this.element.entity.player.pauseVideo();
    }

    this.element.entity.player.seekTo(startFrom / 1000);
  }
}
