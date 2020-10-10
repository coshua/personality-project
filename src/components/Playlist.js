export const Playlist = [
  { title: "memories", src: "/audios/memories.mp3" },
  { title: "tomorrow", src: "/audios/tomorrow.mp3" },
  { title: "ukulele", src: "/audios/ukulele.mp3" },
  { title: "rain_thunder", src: "/audios/rain_thunder.mp3" },
];

export const initialMusic = Playlist.map((audio) => {
  return {
    title: audio.title,
    playing: false,
    volume: 0.3,
    src: audio.src,
    ref: null,
  };
});
