import { HTMLClip, CSSEffect, loadPlugin } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import VideoPluginDefinition from "../src/";
const VideoPlugin = loadPlugin(VideoPluginDefinition);

const MyClip = new HTMLClip({
  host: document.getElementById("clip"),
  id: "my-root-clip",
  html: `<div style="position:relative;width:1280px;height:720px;">
    <div id="video-container" style="position:absolute;inset:0;opacity:0;"></div>
    <div id="video-container2" style="position:absolute;inset:0;opacity:0;"></div>
  </div>`,
  css: ``,
  containerParams: {
    width: "1280px",
    height: "720px",
  },
});

// ── First video: 0-10s ──────────────────────────────────────────────────────

const VideoClip1 = new VideoPlugin.Clip(
  {
    startFrom: 5000,
    width: 1280,
    height: 720,
    videoId: "RUpDslHSLbU",
    volume: 0.3,
  },
  {
    selector: "#video-container",
    id: "videoClip1",
  }
);

VideoClip1.addIncident(
  new VideoPlugin.Playback({ selector: "!#video", duration: 10000 }),
  0,
);

MyClip.addIncident(VideoClip1, 0);

// Fade in video 1
MyClip.addIncident(
  new CSSEffect(
    { animatedAttrs: { opacity: 1 }, initialValues: { opacity: 0 } },
    { selector: "#video-container", duration: 400 },
  ),
  0,
);

// Fade out video 1
MyClip.addIncident(
  new CSSEffect(
    { animatedAttrs: { opacity: 0 }, initialValues: { opacity: 1 } },
    { selector: "#video-container", duration: 400 },
  ),
  9600,
);

// ── Second video: 12-22s (Eric Clapton - Layla unplugged) ───────────────────

const VideoClip2 = new VideoPlugin.Clip(
  {
    startFrom: 60000,
    width: 1280,
    height: 720,
    videoId: "f9myqi7VL9s",
    volume: 0.3,
  },
  {
    selector: "#video-container2",
    id: "videoClip2",
  }
);

VideoClip2.addIncident(
  new VideoPlugin.Playback({ selector: "!#video", duration: 10000 }),
  0,
);

MyClip.addIncident(VideoClip2, 12000);

// Fade in video 2
MyClip.addIncident(
  new CSSEffect(
    { animatedAttrs: { opacity: 1 }, initialValues: { opacity: 0 } },
    { selector: "#video-container2", duration: 400 },
  ),
  12000,
);

// Fade out video 2
MyClip.addIncident(
  new CSSEffect(
    { animatedAttrs: { opacity: 0 }, initialValues: { opacity: 1 } },
    { selector: "#video-container2", duration: 400 },
  ),
  21600,
);

// ── Player ──────────────────────────────────────────────────────────────────

new Player({ clip: MyClip, showVolume: true, pointerEvents: false });
