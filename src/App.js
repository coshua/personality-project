import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import questionnaire from "./utils/questionnaire";
import Landing from "./components/Landing";
import Question from "./components/Question";
import Result from "./components/Result";
import Statistics from "./components/Statistics";
import styled, { createGlobalStyle } from "styled-components";
import { getLuminance } from "polished";
import player from "./components/Player";
import ShareFooter from "./components/ShareFooter";

const GlobalStyle = createGlobalStyle`
  html {
    height: -webkit-fill-available;
    overflow-x: hidden;
  }
  body {
    position: relative;
    overflow-x: hidden;
    font-family: "Noto Sans KR", sans-serif;
    font-size: 4.3vw;
    color: ${(props) =>
      getLuminance(`rgba(${props.backgroundColor})`) >= getLuminance("#dedede")
        ? "#000000"
        : "#dedede"};
    background-image: ${(props) => props.backgroundImage};
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
    height: 100vh;
    object-fit: cover;
    position: fixed;
    transition: opacity 2s;
    opacity: ${(props) => props.videoOpacity || "0"};
    z-index: -1;
  }

  @media only screen and (min-width: 600px) {
    body {
      font-size: 2.3vw;
    }
  }
`;

const Container = styled.div`
  height: 100vh;
  height: ${(props) => props.innerHeight}px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const Content = styled.div`
  flex: 9;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

/* const Span = styled.span`
  flex: 1;
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 25%;
  font-size: 4vw;
  @media only screen and (min-width: 600px) {
    font-size: 2.5vw;
  }
`; */

/* const ShareSpan = styled.span`
  display: inline-block;
  margin-top: 5px;
  height: 69px;
  top: 5px;
  & > img {
    bottom: 0;
  }
`; */

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

const preloadImage = (src) => {
  let img = new Image();
  img.src = src;
  return img;
};

const App = () => {
  useEffect(() => {
    var script = window.document.createElement("script");
    script.addEventListener("load", (event) => {
      console.log("Kakao finished loading");
      window.Kakao.init("77148d309b8680577a6ff34d93e29776");
      console.log(window.Kakao.isInitialized());
    });
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    window.document.body.append(script);
  }, []);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  window.addEventListener("resize", () => {
    setInnerHeight(window.innerHeight);
  });

  const [score, setScore] = useState(initialState);
  const [answer, setAnswer] = useState(""); //for statistics
  const [start, setStart] = useState(false);
  const [index, setIndex] = useState(0);
  const [music, setMusic] = useState({
    title: null,
    pause: false,
  });
  const [video, setVideo] = useState(null);
  const [background, setBackground] = useState({
    backgroundImage: 'url("/images/flowers.jpg")',
    backgroundColor: "255,255,255,0.3",
  });
  const [reserve, setReserve] = useState({});

  const stopMusic = useCallback(
    (fadeDuration = 2000) => {
      if (!music.pause) {
        player.stop(fadeDuration);
        return fadeDuration;
      }
    },
    [music]
  );

  const muteMusic = () => {
    player.pause();
    setMusic((prev) => ({ ...prev, pause: true }));
  };

  const unmuteMusic = () => {
    setMusic((prev) => ({ ...prev, pause: false }));
    player.play(music.title, music.volume, 0);
  };

  const playMusic = useCallback(
    (title = "rain", fadeDuration = 3000) => {
      setMusic((prev) => ({ ...prev, title: title }));
      if (!music.pause) {
        var delay = stopMusic();
        setTimeout(() => {
          player.play(title, fadeDuration);
        }, delay);
      }
    },
    [music, stopMusic]
  );

  const handleVideo = useCallback(
    (title, delay = 2000) => {
      setVideo({ ...video, opacity: "0" });
      setTimeout(
        () => setVideo({ src: videoList[title].src, opacity: "0" }),
        2000
      );
      setTimeout(
        () => setVideo({ ...video, opacity: videoList[title].opacity }),
        delay
      );
    },
    [video]
  );

  const handleMusic = useCallback(
    (v) => {
      if (questionnaire[index].response[v].hasOwnProperty("music"))
        playMusic(questionnaire[index].response[v].music);
      if (questionnaire[index].hasOwnProperty("useReserve")) {
        playMusic(reserve.music);
      }
    },
    [index, playMusic, reserve]
  );

  const handleFadeout = useCallback(() => {
    var color = background.backgroundColor.split(",");
    setBackground((prev) => ({
      ...prev,
      backgroundColor: color[0] + "," + color[1] + "," + color[2] + ",1",
    }));
  }, [background]);

  const handleBackground = useCallback(
    (v, interval = 2000) => {
      if (
        questionnaire[index].response[v].hasOwnProperty("reservedBackground")
      ) {
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
          questionnaire[index].response[
            v
          ].background.backgroundImage.startsWith("linear")
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
          console.log(img.src);
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
    },
    [handleFadeout, handleVideo, index, reserve, video]
  );

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
    <Container innerHeight={innerHeight}>
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
          <Route
            path="/statistics"
            render={() => <Statistics type={calcResult()} />}
          />
          <Route
            path="/post"
            render={() => (
              <Result
                answer={answer}
                calcResult={calcResult}
                startTest={startTest}
                refreshPage={refreshPage}
              />
            )}
          />
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
                    <Landing
                      startTest={startTest}
                      handleVideo={handleVideo}
                      handleFadeout={handleFadeout}
                      setBackground={setBackground}
                    />
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
                <ShareFooter
                  music={music}
                  unmuteMusic={unmuteMusic}
                  muteMusic={muteMusic}
                />
              </>
            )}
          />
        </Switch>
      </Router>
    </Container>
  );
};

export default App;
