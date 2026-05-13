# MotorCortex-Youtube

YouTube video playback plugin for MotorCortex with timeline control (play, pause, seek) and volume animation.

## Installation

```bash
npm install @kissmybutton/motorcortex-youtube
```

Peer dependency: `@donkeyclip/motorcortex >= 9.24.0`

## Quick start

```javascript
import { HTMLClip, loadPlugin } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import MCVideo from "@kissmybutton/motorcortex-youtube";
const VideoPlugin = loadPlugin(MCVideo);

const clip = new HTMLClip({
  host: document.getElementById("clip"),
  html: '<div id="video-container"></div>',
  css: '#video-container { width: 1280px; height: 720px; }',
  containerParams: { width: "1280px", height: "720px" },
});

const videoClip = new VideoPlugin.Clip(
  {
    videoId: "RUpDslHSLbU",
    startFrom: 5000,    // start 5s into the video
    width: 1280,
    height: 720,
    volume: 0.3,        // 0-1
  },
  {
    selector: "#video-container",
  }
);

// Play 10 seconds of the video
videoClip.addIncident(
  new VideoPlugin.Playback({
    selector: "!#video",
    duration: 10000,
  }),
  0,
);

clip.addIncident(videoClip, 0);
new Player({ clip, showVolume: true });
```

## Clip attrs

| Attr        | Type   | Default | Description                                      |
| ----------- | ------ | ------- | ------------------------------------------------ |
| `videoId`   | string | --      | YouTube video ID (required)                       |
| `width`     | number | 640     | Player width in pixels                            |
| `height`    | number | 360     | Player height in pixels                           |
| `startFrom` | number | 0       | Start offset in milliseconds                      |
| `volume`    | number | 1       | Initial volume (0-1)                              |

## Incidents

### Playback

Controls video playback. Selector must always be `!#video`.

```javascript
new VideoPlugin.Playback({
  selector: "!#video",
  duration: 15000,  // play for 15 seconds
});
```

### Volume

Animates the YouTube player's volume over time. **Both `animatedAttrs` and `initialValues` must be provided.**

```javascript
// Fade volume from 0.8 to 0 over 3 seconds
videoClip.addIncident(
  new VideoPlugin.Volume(
    {
      animatedAttrs: { volume: 0 },
      initialValues: { volume: 0.8 },
    },
    { selector: "!#video", duration: 3000 },
  ),
  7000,
);
```

| Param          | Description                                |
| -------------- | ------------------------------------------ |
| `animatedAttrs.volume` | Target volume (0-1)                |
| `initialValues.volume` | Starting volume (0-1) — **required** |

Use cases:
- Duck video volume when narration plays on top
- Fade out volume before video ends
- Fade in volume at the start

## Multiple videos

Multiple `VideoPlugin.Clip` instances are supported in the same session. The YouTube IFrame API is loaded once and reused for subsequent players.

## Notes

- The YouTube IFrame API requires an internet connection
- Videos must be embeddable (not restricted by the uploader)
- `startFrom` is in milliseconds, not seconds

## License

[MIT License](https://opensource.org/licenses/MIT)

## Sponsored by

[<img src="https://presskit.donkeyclip.com/logos/donkey%20clip%20logo.svg" width=250></img>](https://donkeyclip.com)
