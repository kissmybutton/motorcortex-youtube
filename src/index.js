import VideoClip from "./VideoClip";
import VideoPlay from "./Incidents/VideoPlay";
import Volume from "./Incidents/Volume";
import MetaReveal from "./Incidents/MetaReveal";
import pkg from "../package.json";

export default {
  npm_name: pkg.name,
  version: pkg.version,
  incidents: [
    {
      exportable: VideoPlay,
      name: "Playback",
    },
    {
      exportable: Volume,
      name: "Volume",
    },
    {
      exportable: MetaReveal,
      name: "MetaReveal",
    },
  ],
  Clip: {
    exportable: VideoClip,
    attributesValidationRules: {
      width: {
        optional: true,
        type: "number",
        integer: true,
        positive: true,
      },
      height: {
        optional: true,
        type: "number",
        integer: true,
        positive: true,
      },
      startFrom: {
        optional: true,
        type: "number",
        integer: true,
        min: 0,
      },
      videoId: {
        type: "string",
      },
      volume: {
        type: "number",
        min: 0,
        max: 1,
        default: 1,
      },
      title: {
        optional: true,
        type: "string",
      },
      channel: {
        optional: true,
        type: "string",
      },
      publishedAt: {
        optional: true,
        type: "string",
      },
      viewCount: {
        optional: true,
        type: "number",
      },
      likeCount: {
        optional: true,
        type: "number",
      },
    },
  },
  capabilities: {
    speed: false,
    preview: false,
  },
  audio: "on",
};
