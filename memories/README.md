# Add anniversary photos and videos

There is no three item limit. Add as many media entries as you want to the `MEMORY_MEDIA` list near the top of `index.js`, then put each file in this folder.

The playlist includes `memory-01.jpg` through `memory-03.jpg` and `video-01.mp4` through `video-03.mp4`. Add your files with those names to use the existing entries.

For example, add a photo like this:

```js
{
  type: "image",
  src: "memories/memory-04.jpg",
  caption: "Our day out",
  placeholder: "A favorite memory",
},
```

Add a video the same way, with `type: "video"` and a video filename:

```js
{
  type: "video",
  src: "memories/video-01.mp4",
  caption: "A little moment in motion",
  placeholder: "Our moments in motion",
},
```

JPG, PNG, and WebP work well for photos. MP4 (H.264) and WebM are recommended for video. Videos play muted in the carousel and include controls.

Place the files in this folder and add them to `MEMORY_MEDIA` in `index.js` so they appear for everyone on the published page.
