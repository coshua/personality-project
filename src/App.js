import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import questionnaire from "./utils/questionnaire";
import Landing from "./components/Landing";
import Question from "./components/Question";
import Result from "./components/Result";
import Statistics from "./components/Statistics";
import styled, { createGlobalStyle } from "styled-components";
import { getLuminance } from "polished";
import { preloadImage } from "./components/utilFunctions";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
import player from "./components/Player";
import Toast from "light-toast";
Amplify.configure(aws_exports);

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }
  body {
    font-family: "Noto Sans KR", sans-serif;
    font-size: 100%
    height: 100%;
    color: ${(props) =>
      getLuminance(`rgba(${props.backgroundColor})`) >= getLuminance("#dedede")
        ? "#000000"
        : "#dedede"};
    background-image: ${(props) =>
      (props.backgroundImage && props.backgroundImage) ||
      `url('/images/flowers.jpg')`};
    background-color: rgba(${(props) =>
      props.backgroundColor || "255,255,255,0.3"});
    background-blend-mode: soft-light;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    transition: background-color 2s;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: fixed;
    transition: opacity 2s;
    opacity: ${(props) => props.videoOpacity || "0"};
    z-index: -1;
  }

  @media only screen and (min-width: 600px) {
    html {
      font-size: 125%;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Span = styled.span`
  margin: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ShareSpan = styled.span`
  display: inline-block;
  margin-top: 5px;
  height: 69px;
  top: 5px;
  & > img {
    bottom: 0;
  }
`;

const QUESTIONS_LENGTH = questionnaire.length;

const initialState = {
  E: 0,
  I: 0,
  N: 0,
  S: 0,
  T: 0,
  F: 0,
  J: 0,
  P: 0,
};

const videoList = {
  rain: {
    src: "/videos/rain1920.mp4",
    opacity: 0.55,
  },
  star: {
    src: "/videos/star1280.mp4",
    opacity: 1,
  },
};

const App = () => {
  useEffect(() => {
    window.Kakao.init("77148d309b8680577a6ff34d93e29776");
    console.log(window.Kakao.isInitialized());
  }, []);
  const [score, setScore] = useState(initialState);
  const [answer, setAnswer] = useState(""); //for statistics
  const [start, setStart] = useState(false);
  const [index, setIndex] = useState(0);
  const [music, setMusic] = useState({
    title: null,
    volume: 1,
    pause: false,
  });
  const [video, setVideo] = useState(null);
  const [background, setBackground] = useState({
    backgroundImage: 'url("/images/flowers.jpg")',
    backgroundColor: "255,255,255,0.3",
  });
  const [reserve, setReserve] = useState({});

  const stopMusic = (volume = music.volume || 1, fadeDuration = 2000) => {
    if (!music.pause) {
      player.stop(volume, fadeDuration);
      return fadeDuration;
    }
  };

  const playMusic = (title = "rain", volume = 1, fadeDuration = 3000) => {
    setMusic({ ...music, title: title, volume: volume });
    if (!music.pause) {
      var delay = stopMusic();
      setTimeout(() => {
        player.play(title, volume, fadeDuration);
      }, delay);
    }
  };

  const handleVideo = (title, delay = 2000) => {
    setVideo({ ...video, opacity: "0" });
    setTimeout(
      () => setVideo({ src: videoList[title].src, opacity: "0" }),
      2000
    );
    setTimeout(
      () => setVideo({ ...video, opacity: videoList[title].opacity }),
      delay
    );
  };

  const handleMusic = (v, interval = 2000) => {
    if (questionnaire[index].response[v].hasOwnProperty("music"))
      playMusic(questionnaire[index].response[v].music);
    if (questionnaire[index].hasOwnProperty("useReserve")) {
      playMusic(reserve.music);
    }
  };

  const handleBackground = (v, interval = 2000) => {
    if (questionnaire[index].response[v].hasOwnProperty("reservedBackground")) {
      setReserve({
        background: questionnaire[index].response[v].reservedBackground,
        music: questionnaire[index].response[v].reservedMusic,
      });
    }
    if (questionnaire[index].hasOwnProperty("useReserve")) {
      handleFadeout();
      let img = preloadImage(reserve.background.backgroundImage);
      setTimeout(
        () =>
          setBackground({
            backgroundImage: `url("${img.src}")`,
            backgroundColor: reserve.background.backgroundColor,
          }),
        interval
      );
    }
    if (questionnaire[index].hasOwnProperty("video")) {
      handleFadeout();
      handleVideo(questionnaire[index].video, questionnaire[index].delay);
    }
    if (questionnaire[index].response[v].hasOwnProperty("background")) {
      handleFadeout();
      setVideo({ ...video, opacity: "0" });

      if (
        questionnaire[index].response[v].background.backgroundImage.startsWith(
          "linear"
        )
      ) {
        setTimeout(
          () =>
            setBackground({
              backgroundImage:
                questionnaire[index].response[v].background.backgroundImage,
              backgroundColor:
                questionnaire[index].response[v].background.backgroundColor,
            }),
          interval
        );
      } else {
        let img = preloadImage(
          questionnaire[index].response[v].background.backgroundImage
        );
        setTimeout(
          () =>
            setBackground({
              backgroundImage: `url("${img.src}")`,
              backgroundColor:
                questionnaire[index].response[v].background.backgroundColor,
            }),
          interval
        );
      }
    }
  };

  const handleFadeout = () => {
    var color = background.backgroundColor.split(",");
    setBackground({
      ...background,
      backgroundColor: color[0] + "," + color[1] + "," + color[2] + ",1",
    });
  };

  const refreshPage = () => {
    setScore(initialState);
    setAnswer("");
    setStart(false);
    setBackground({
      backgroundImage: "url('/images/flowers.jpg')",
      backgroundColor: "255,255,255,0.5",
    });
    setIndex(0);
    setVideo(null);
  };

  const startTest = () => {
    refreshPage();
    setStart(true);
  };

  const handleAnswer = (type) => {
    setScore({
      ...score,
      [type]: score[type] + 1,
    });
    setAnswer(answer + type);
  };

  const calcResult = () => {
    let str = "";
    str += score.E > score.I ? "E" : "I";
    str += score.N > score.S ? "N" : "S";
    str += score.T > score.F ? "T" : "F";
    str += score.J > score.P ? "J" : "P";
    return str;
  };

  return (
    <Container>
      <GlobalStyle
        backgroundImage={background.backgroundImage}
        backgroundColor={background.backgroundColor}
        videoOpacity={video !== null ? video.opacity : 1}
      />
      {video !== null ? (
        <video muted autoPlay loop preload="auto" src={video.src}>
          <source type="video/mp4" />
          <strong>Your browser does not support the video tag</strong>
        </video>
      ) : (
        <></>
      )}
      <Router>
        <Switch>
          <Route path="/statistics" component={Statistics} />
          <Route
            exact
            path="/"
            render={() => (
              <>
                <Content>
                  <button onClick={() => player.play("rain")}>rain</button>
                  <button onClick={() => player.pause()}>pause</button>
                  <button onClick={() => player.stop()}>stop</button>
                  <button onClick={() => player.play("tomorrow")}>
                    tomorrow
                  </button>
                  {!start ? (
                    <Landing startTest={startTest} handleVideo={handleVideo} />
                  ) : index === QUESTIONS_LENGTH ? (
                    <Result
                      answer={answer}
                      calcResult={calcResult}
                      startTest={startTest}
                      refreshPage={refreshPage}
                    />
                  ) : (
                    <Question
                      index={index}
                      setIndex={setIndex}
                      playMusic={playMusic}
                      handleAnswer={handleAnswer}
                      handleBackground={handleBackground}
                      handleMusic={handleMusic}
                    />
                  )}
                </Content>
                <Span>
                  {!music.pause ? (
                    <i
                      className="fas fa-headphones fa-lg"
                      onClick={() => {
                        player.pause();
                        setMusic({ ...music, pause: true });
                      }}
                    ></i>
                  ) : (
                    <i
                      className="fas fa-volume-mute fa-lg"
                      onClick={() => {
                        setMusic({ ...music, pause: false });
                        player.play(music.title, music.volume, 0);
                      }}
                    ></i>
                  )}
                  <img
                    src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
                    alt="share"
                    onClick={(e) =>
                      window.Kakao.Link.sendCustom({
                        templateId: 36312,
                        templateArgs: {
                          image_url:
                            "https://myanimal.kokkiri.kr/assets/img/promotion/img_character14@2x.png",
                        },
                      })
                    }
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("personality.jutopia.net");
                      Toast.info("Copied to Clipboard", 2000);
                    }}
                  >
                    url
                  </button>
                  <Link to="/statistics">stat</Link>
                </Span>
              </>
            )}
          />
        </Switch>
      </Router>
    </Container>
  );
};

export default App;
