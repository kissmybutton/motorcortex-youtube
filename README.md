# motorcortex-youtube

## Installation

```bash
$ npm install --save @kissmybutton/motorcortex-youtube
# OR
$ yarn add @kissmybutton/motorcortex-youtube
```

## Importing

```javascript
import MotorCortex from "@kissmybutton/motorcortex";
import MCVideo from "@kissmybutton/motorcortex-youtube";
```

## Loading

```javascript
const VideoPlugin = MotorCortex.loadPlugin(MCVideo);
```

## API

The Plugin exposes two Incidents in total:

- the video Clip
- the Playback incident

### Clip

The Clip is used to create a new video clip and you can pass to it all of the core video information such as the video id from youtube and the size:

```javascript
import MotorCortex from "@kissmybutton/motorcortex";
import MCVideo from "@kissmybutton/motorcortex-youtube";
const VideoPlugin = MotorCortex.loadPlugin(MCVideo);

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
```

As shown on the example the supported attributes that the "Clip" Incident accepts are:

- videoId: an string id from the viedeo that you would like to use from utube
- width: (optional). The desired width of the video in pixels. You only need to define it by an integer
- height (optional). The desired height of the video in pixels. You only need to define it by an integer
- startFrom (optional / defaluts to 0). If passed the video will be loaded directly with start on the specified millisecond

### Playback

The Playback Incident is used to define the execution of the video. The only thing to set is the duration.

```javascript
import MotorCortex from "@kissmybutton/motorcortex";
import MCVideo from "@kissmybutton/motorcortex-youtube";
const VideoPlugin = MotorCortex.loadPlugin(MCVideo);

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
  selector: "!#video", // that's mandatory, it should always have the value "!#video" and it targets the video of the VideoPlugin.Clip
  duration: 20000, // the duration of the playback in milliseconds
});

VideoClip.addIncident(Playback, 0);
```

Demo:[https://kissmybutton.github.io/motorcortex-video/demo/](https://kissmybutton.github.io/motorcortex-youtube/demo/)

## License

[MIT License](https://opensource.org/licenses/MIT)
[![Kiss My Button](https://presskit.kissmybutton.gr/logos/kissmybutton-logo-small.png)](https://kissmybutton.gr)
