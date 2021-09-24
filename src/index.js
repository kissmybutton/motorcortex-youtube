import VideoClip from "./VideoClip";
import VideoPlay from "./Incidents/VideoPlay";
import { name, version } from "../package.json";

export default {
  npm_name: name,
  version: version,
  incidents: [
    {
      exportable: VideoPlay,
      name: "Playback",
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
        type: "string"
      },
    },
  },
  capabilities: {
    speed: false,
    preview: false,
  },
  audio: "on",
};
