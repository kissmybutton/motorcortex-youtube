import { HTMLClip, loadPlugin } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import VideoPluginDefinition from "../src/";
const VideoPlugin = loadPlugin(VideoPluginDefinition);

const MyClip = new HTMLClip({
  host: document.getElementById("clip"),
  id: "my-root-clip",
  html: `<div id="video-container"></div>`,
  css: `
    #video-container{
        width: 1280px;
        height: 720px;
    }
  `,
  containerParams: {
    width: "1280px",
    height: "720px",
  },
});

const VideoClip = new VideoPlugin.Clip(
  {
    startFrom: 5000,
    width: 1280,
    height: 720,
    videoId: "RUpDslHSLbU",
    volume: 0.3,
  },
  {
    selector: "#video-container",
    id: "videoClip",
  }
);

const Playback = new VideoPlugin.Playback({
  selector: "!#video",
  duration: 10000,
});

MyClip.addIncident(VideoClip, 500);
VideoClip.addIncident(Playback, 500);


new Player({ clip: MyClip, showVolume: true });
