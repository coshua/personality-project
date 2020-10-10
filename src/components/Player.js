import { Howl } from "howler";

var Player = function (playlist) {
  this.playlist = playlist;
};

Player.prototype = {
  play: function (title, volume = 1, duration = 5000) {
    var self = this;
    var sound;
    if (title) {
      var data = self.playlist.filter((audio) => audio.title === title)[0];

      if (data.howl) {
        sound = data.howl;
      } else {
        sound = data.howl = new Howl({
          src: [`audios/${data.title}>webm`, `audios/${data.title}.mp3`],
          html5: true,
          loop: true,
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
      console.log(
        "Sound play " + "Volume: " + volume + " Duration: " + duration
      );
      sound.fade(0, volume, duration);
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

  stop: function (initVolume = 1, duration = 5000) {
    var self = this;
    console.log("Self title is" + self.title);
    if (self.title) {
      var data = self.playlist.filter((audio) => audio.title === self.title)[0];
      if (data.howl) {
        var sound = data.howl;
        sound.fade(initVolume, 0, duration);
        console.log(
          "Volume " + initVolume + " to 0 in " + duration + " miliseconds"
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
    howl: null,
  },
  {
    title: "nature",
    howl: null,
  },
  {
    title: "memories",
    howl: null,
  },
  {
    title: "satie",
    howl: null,
  },
  {
    title: "tomorrow",
    howl: null,
  },
  {
    title: "ukulele",
    howl: null,
  },
]);

export default player;
