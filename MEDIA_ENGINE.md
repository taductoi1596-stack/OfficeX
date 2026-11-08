# OfficeX Media Engine Architecture

Version: 1.0

Status: Enterprise Design Specification

---

# 1. Purpose

The Media Engine is the centralized subsystem responsible for managing, decoding, streaming, controlling, and rendering all audio and video assets across the OfficeX platform.

Unlike the Image Engine, which handles static or lightly animated raster graphics, the Media Engine handles time-based multimedia content that requires continuous streaming, buffering, codec decoding, and synchronized playback.

The Media Engine provides multimedia functionality for:

* OfficeX PowerPoint (embedded videos, background audio, narrations)
* OfficeX Word (embedded tutorial videos, audio notes)
* OfficeX Excel (instructional media in dashboards)
* Animation Engine (synchronization with slide animations)
* Presentation Player
* OpenXML Engine

---

# 2. Design Goals

The Media Engine must be:

* Asynchronous and Stream-oriented
* High Performance (Hardware Accelerated)
* Cross Platform (Web, Desktop)
* Format Agnostic (through Codec Abstraction)
* Thread Safe
* OpenXML Compatible
* Enterprise Ready

---

# 3. Responsibilities

The Media Engine is responsible for:

* Video playback and rendering
* Audio playback and mixing
* Streaming from network or local storage
* Subtitle and Closed Captioning (VTT/SRT) processing
* Media state management (Play, Pause, Seek, Volume, Loop)
* Codec adaptation and hardware decoding delegation
* Synchronization with external timelines (e.g., Animation Engine)

---

# 4. High-Level Architecture

```text id="media01"
Media Source (URL, Blob, OpenXML Part)

↓

Stream Manager (Buffering)

↓

Codec Decoder (H.264, VP9, AAC, MP3)

↓

Media Player Controller

↓

Audio Mixer / Video Frame Extractor

↓

Rendering Engine / Audio Context
```

---

# 5. Core Components

The Media Engine consists of:

* Media Manager (Global Registry)
* Video Player (Video specific controls & frame generation)
* Audio Player (Audio specific controls & WebAudio integration)
* Stream Buffer Manager (Chunked loading)
* Codec Adapter (Delegates to native browser/OS decoders)
* Subtitle Engine (Parses and syncs VTT/SRT files)
* Timeline Synchronizer (Syncs media time with presentation time)

---

# 6. Supported Media Formats

The engine relies on the host environment (Browser/Electron) but abstracts the interface. Target formats include:

Video:
* MP4 (H.264 / HEVC)
* WebM (VP8 / VP9)
* Ogg Video

Audio:
* MP3
* AAC
* WAV
* Ogg Audio

Subtitles:
* WebVTT (.vtt)
* SubRip (.srt)

---

# 7. Media State Management

Every media object tracks:

* `readyState` (HAVE_NOTHING to HAVE_ENOUGH_DATA)
* `playbackState` (Playing, Paused, Ended, Stalled)
* `currentTime`
* `duration`
* `volume` (0.0 to 1.0)
* `muted` (boolean)
* `playbackRate` (e.g., 1.0x, 1.5x)

---

# 8. Subtitle and Captioning (Accessibility)

The Subtitle Engine parses timed text tracks.
It provides:
* Cue management (Start time, End time, Text)
* Dynamic cue rendering based on `currentTime`
* Multi-language track selection

---

# 9. Synchronization with Animation Engine

In PowerPoint, media often plays as part of an animation sequence (e.g., "Play Video on Click").
The Timeline Synchronizer ensures:
* Media starts exactly when the animation trigger fires.
* Media pauses if the presentation pauses.
* Seeking the slide timeline seeks the media timeline.

---

# 10. Memory and Resource Management

* Media files can be massive. The engine uses chunked streaming and URL.createObjectURL for memory efficiency.
* Inactive media elements are paused and their buffers may be flushed if memory pressure is high.
* Hardware decoding is preferred to reduce CPU load.

---

# 11. Acceptance Criteria

The Media Engine is considered production-ready when:
* Video and Audio can be embedded, played, paused, and seeked reliably.
* Subtitles synchronize accurately with video playback.
* Media states integrate flawlessly with the Animation Engine timeline.
* Hardware acceleration is utilized where available.
* It serves as the unified multimedia subsystem for all OfficeX applications.

End of MEDIA_ENGINE.md
