# MotorCortex-Youtube

**Table of Contents**

- [MotorCortex-Youtube](#motorcortex-youtube)
  - [Demo](#demo)
- [Intro / Features](#intro--features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Importing and Loading](#importing-and-loading)
- [Creating Incidents](#creating-incidents)
  - [Clip](#clip)
  - [Playback](#playback)
- [Adding Incidents in your clip](#adding-incidents-in-your-clip)
- [Contributing](#contributing)
- [License](#license)
- [Sponsored by](#sponsored-by)

## Demo

[Check it out here](https://kissmybutton.github.io/motorcortex-youtube/demo/)

# Intro / Features
Using MotorCortex-Youtube you can easily add a youtube video in your clip.

The Plugin exposes two Incidents in total:

- the video Clip
- the Playback incident
# Getting Started

## Installation

```bash
$ npm install --save @kissmybutton/motorcortex-youtube
# OR
$ yarn add @kissmybutton/motorcortex-youtube
```

## Importing and loading

```javascript
import { loadPlugin } from "@kissmybutton/motorcortex";
import MCVideo from "@kissmybutton/motorcortex-youtube";
const VideoPlugin = loadPlugin(MCVideo);
```
# Creating Incidents
## Clip

The Clip is used to create a new video clip and you can pass to it all of the core video information such as the video id from youtube and the size:

```javascript
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
### Clip Attrs
As shown on the example the supported attributes that the "Clip" Incident accepts are:

- videoId: an string id from the viedeo that you would like to use from utube
- width: (optional). The desired width of the video in pixels. You only need to define it by an integer
- height (optional). The desired height of the video in pixels. You only need to define it by an integer
- startFrom (optional / defaluts to 0). If passed the video will be loaded directly with start on the specified millisecond

## Playback

The Playback Incident is used to define the execution of the video. The only thing to set is the duration.

```javascript
const Playback = new VideoPlugin.Playback({
  selector: "!#video", // that's mandatory, it should always have the value "!#video" and it targets the video of the VideoPlugin.Clip
  duration: 20000, // the duration of the playback in milliseconds
});
```

#### IMPORTANT 
All `Playback Incidents` should have as a `selector` : `!#video`

# Adding Incidents in your clip

```javascript
clipName.addIncident(incidentName,startTime);
```

# Contributing 

In general, we follow the "fork-and-pull" Git workflow, so if you want to submit patches and additions you should follow the next steps:
1.	**Fork** the repo on GitHub
2.	**Clone** the project to your own machine
3.	**Commit** changes to your own branch
4.	**Push** your work back up to your fork
5.	Submit a **Pull request** so that we can review your changes

# License

[MIT License](https://opensource.org/licenses/MIT)

# Sponsored by
[![Kiss My Button](https://presskit.kissmybutton.gr/logos/kissmybutton-logo-small.png)](https://kissmybutton.gr)
