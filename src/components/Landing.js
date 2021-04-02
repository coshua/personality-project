import React, { useState, useContext } from "react";
import styled, { keyframes, css } from "styled-components";
import Button from "./Button";
import LangContext from "../utils/LangContext";

const fadeIn = keyframes`
0% {
  opacity: 0
}
100% {
  opacity: 1
}`;

const fadeOut = keyframes`
  0% {
    opacity: 1
  }
  100% {
    opacity: 0
  }
`;

const QuestionSpan = styled.span`
  opacity: 0;
  animation: ${fadeIn} 5s ease-in-out ${(props) => props.stagger}ms forwards;
`;

const Information = styled.p`
  font-size: ${(props) => props.size * 2}vw;
  opacity: 0;
  animation: ${fadeIn} 1.5s ease-in-out ${(props) => props.delay || "2s"}
    forwards;
  ${(props) =>
    props.fadeOut === true &&
    css`
      animation: ${fadeOut} 3s ease-in-out forwards;
    `}
  @media only screen and (min-width: 600px) {
    font-size: ${(props) => props.size}vw;
    padding: 0.7vw 1.5vw;
  }
`;

const Container = styled.div`
  text-align: center;
  ${(props) =>
    props.fadeOut === true &&
    css`
      animation: ${fadeOut} 3s ease-in-out forwards;
    `}
`;

const Landing = ({ startTest, handleFadeout, setBackground }) => {
  const lang = useContext(LangContext);
  const [fadeOut, setFadeOut] = useState(false);
  const spanGenerator = (string) => {
    var split = string.split("");
    return split.map((char, index) => (
      <QuestionSpan
        key={index}
        index={index}
        stagger={index * 200}
        className="letter"
      >
        {char}
      </QuestionSpan>
    ));
  };
  return (
    <Container fadeOut={fadeOut}>
      <h2 id="animation">
        {lang === "ko"
          ? spanGenerator("당신의 내면에 귀 기울여보세요")
          : spanGenerator("Listen to your inner voice")}
      </h2>
      <Information fadeOut={fadeOut} size={2} delay="5s">
        {lang === "ko"
          ? "10분 정도 당신의 이야기를 들려주세요"
          : "Tell your story"}
      </Information>
      <Information fadeOut={fadeOut} size={1.7} delay="7s">
        {lang === "ko"
          ? "이어폰 착용을 권장합니다"
          : "Recommend wearing earphones"}
      </Information>
      <div className="control">
        <Button
          onClick={(e) => {
            setFadeOut(true);
            handleFadeout();
            setTimeout(() => {
              startTest();
              setBackground({
                backgroundImage:
                  "linear-gradient( 65deg, #000000, #000000, rgb(68, 68, 68))",
                backgroundColor: "0,0,0,0",
              });
            }, 3000);
          }}
        >
          시작하기
        </Button>
      </div>
    </Container>
  );
};

export default React.memo(Landing);
