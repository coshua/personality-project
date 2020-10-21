import { Howl } from "howler";

var Player = function (playlist) {
  this.playlist = playlist;
};

Player.prototype = {
  play: function (title, duration = 5000) {
    var self = this;
    var sound;
    if (title) {
      var data = self.playlist.filter((audio) => audio.title === title)[0];

      if (data.howl) {
        sound = data.howl;
      } else {
        sound = data.howl = new Howl({
          src: [`audios/${data.title}.mp3`],
          html5: true,
          loop: true,
          volume: data.volume,
          xhr: {
            method: "GET",
            headers: {
              "Content-Type": "audio/mpeg",
            },
            withCredentials: true,
          },
        });
      }
      sound.play();
      sound.fade(0, data.volume, duration);
      self.title = title;
    }
  },

  pause: function () {
    var self = this;
    console.log(self.title);
    if (self.title) {
      var data = self.playlist.filter((audio) => audio.title === self.title)[0];
      if (data.howl) {
        var sound = data.howl;
        sound.pause();
        console.log("Sound pause");
      }
    }
  },

  stop: function (duration = 5000) {
    var self = this;
    if (self.title) {
      var data = self.playlist.filter((audio) => audio.title === self.title)[0];
      if (data.howl) {
        var sound = data.howl;
        sound.fade(data.volume, 0, duration);
        console.log(
          "Volume " + data.volume + " to 0 in " + duration + " miliseconds"
        );
        setTimeout(() => {
          console.log("sound stop");
          sound.stop();
        }, duration);
      }
    }
  },
};

var player = new Player([
  {
    title: "rain",
    volume: 0.06,
    howl: null,
  },
  {
    title: "nature",
    volume: 0.07,
    howl: null,
  },
  {
    title: "memories",
    volume: 0.1,
    howl: null,
  },
  {
    title: "satie",
    volume: 1,
    howl: null,
  },
  {
    title: "tomorrow",
    volume: 0.1,
    howl: null,
  },
  {
    title: "ukulele",
    volume: 0.02,
    howl: null,
  },
]);

export default player;
