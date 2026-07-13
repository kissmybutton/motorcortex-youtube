# MotorCortex-Youtube

YouTube video playback plugin for MotorCortex with timeline control (play, pause, seek), volume animation, and optional video metadata overlay.

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

| Attr          | Type   | Default | Description                                      |
| ------------- | ------ | ------- | ------------------------------------------------ |
| `videoId`     | string | --      | YouTube video ID (required)                       |
| `width`       | number | 640     | Player width in pixels                            |
| `height`      | number | 360     | Player height in pixels                           |
| `startFrom`   | number | 0       | Start offset in milliseconds                      |
| `volume`      | number | 1       | Initial volume (0-1)                              |
| `title`       | string | --      | Video title (enables metadata overlay)            |
| `channel`     | string | --      | Channel name (optional)                           |
| `publishedAt` | string | --      | Publish date string (optional)                    |
| `viewCount`   | number | --      | View count (optional, auto-formatted: 1.2M, 500K) |
| `likeCount`   | number | --      | Like count (optional, auto-formatted)             |

When `title` is provided, a metadata overlay card is rendered on the video. Use the `MetaReveal` incident to animate it in and out.

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

| Param                  | Description                        |
| ---------------------- | ---------------------------------- |
| `animatedAttrs.volume` | Target volume (0-1)                |
| `initialValues.volume` | Starting volume (0-1) — **required** |

### MetaReveal

Animates the metadata overlay's opacity and the card's vertical slide. Requires `title` in clip attrs. Selector must be `!#meta`.

```javascript
// Fade in at 1s: slide down from above, opacity 0→1
videoClip.addIncident(
  new VideoPlugin.MetaReveal(
    { animatedAttrs: { opacity: 1 }, initialValues: { opacity: 0 } },
    {
      selector: "!#meta",
      duration: 400,
      easing: "easeOutCubic",
      cardSlideFrom: "-12",
      cardSlideY: "0",
    },
  ),
  1000,
);

// Fade out at 6.4s: slide back up, opacity 1→0
videoClip.addIncident(
  new VideoPlugin.MetaReveal(
    { animatedAttrs: { opacity: 0 }, initialValues: { opacity: 1 } },
    {
      selector: "!#meta",
      duration: 600,
      easing: "easeInCubic",
      cardSlideFrom: "0",
      cardSlideY: "-12",
    },
  ),
  6400,
);
```

| Param                   | Description                                 |
| ----------------------- | ------------------------------------------- |
| `animatedAttrs.opacity` | Target opacity (0-1)                        |
| `initialValues.opacity` | Starting opacity (0-1) — **required**       |
| `cardSlideFrom`         | Starting translateY in px (e.g. `"-12"`)    |
| `cardSlideY`            | Target translateY in px (e.g. `"0"`)        |

The overlay displays a frosted-glass card with the video title, channel (with icon), publish date, view count, and like count. Fields other than `title` are optional — only provided fields are shown.

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
