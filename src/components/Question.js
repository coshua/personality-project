import React, { useState, useEffect, useCallback } from "react";
import questionnaire from "../utils/questionnaire";
import styled, { keyframes, css } from "styled-components";
import { darken } from "polished";

const fadeOut = keyframes`
  0% {
    opacity: 1
  }
  100% {
    opacity: 0
  }
`;

const fadeIn = keyframes`
0% {
  opacity: 0
}
100% {
  opacity: 1
}`;

const Container = styled.div`
  box-sizing: border-box;
  width: 80%;
  text-align: center;
  img {
    max-width: 100%;
    margin: auto;
  }
`;

const QuestionContainer = styled.div`
  text-align: center;
  padding: 2rem;
  margin-bottom: 2rem;
  @media only screen and (min-width: 600px) {
    margin-bottom: 0;
  }
`;

const QuestionSpan = styled.span`
  ${(props) =>
    props.animate === "fadeOut" &&
    css`
      animation: ${fadeOut} 1s ease-in-out forwards;
    `}
  ${(props) =>
    props.animate === "fadeIn" &&
    css`
      opacity: 0;
      animation: ${fadeIn} 5s ${props.stagger}ms forwards;
    `}
    ${(props) =>
    props.animate === "narationFadeIn" &&
    css`
      opacity: 0;
      display: block;
      animation: ${fadeIn} 3s ${props.stagger}ms forwards;
    `}
  ${(props) =>
    props.animate === "narationFadeOut" &&
    css`
      display: block;
      animation: ${fadeOut} 1s forwards;
    `}
`;

const Button = styled.button`
  font-size: 3.5vw;
  box-sizing: border-box;
  color: inherit;
  display: inline-block;
  outline: none;
  border-radius: 8px;
  border: 1px solid transparent;
  text-decoration: none;
  background-color: rgba(0, 0, 0, 0);
  overflow: hidden;
  width: 100%;
  font-family: inherit;
  text-align: center;
  cursor: pointer;
  transition: border-color 1s;
  display: ${(props) => props.display || true};
  ${(props) =>
    props.animate === "fadeOutDelay" &&
    css`
      animation: ${fadeOut} 1s ease-in-out 1s forwards;
    `}
  ${(props) =>
    props.animate === "fadeOut" &&
    css`
      animation: ${fadeOut} 1s ease-in-out forwards;
    `}
    ${(props) =>
    props.animate === "fadeIn" &&
    css`
      opacity: 0;
      animation: ${fadeIn} 1s ease-in-out ${props.delay}ms forwards;
    `}
  &:hover {
    border: 1px solid ${darken(0.3, "#FFF")};
  }
  &:active {
    border: 1px solid ${darken(0.3, "#FFF")};
    background-color: rgba(0, 0, 0, 0.3);
  }
  p {
    margin: 1.2rem 1rem;
  }
  & + & {
    margin-top: 2rem;
  }
  @media only screen and (min-width: 600px) {
    font-size: 1.6vw;
    width: 40%;
    & + & {
      margin-left: 10%;
      margin-top: 2.5rem;
    }
  }
`;

const Question = ({
  handleAnswer,
  index,
  setIndex,
  handleBackground,
  handleMusic,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const [variation, setVariation] = useState(-1); //0 question for P,1 requires question for J
  const [animation, setAnimation] = useState({
    question: "fadeIn",
    response: ["fadeIn", "fadeIn"],
  });
  // eslint-disable-next-line
  useEffect(
    () => {
      if (questionnaire[index].naration) {
        console.log("narationSlide");
        var arr = questionnaire[index].naration;
        var delay = arr[arr.length - 1][1];
        console.log(delay);
        setTimeout(() => {
          console.log("First timeout");
          handleMusic(0);
          handleBackground(0);
          setAnimation((prev) => {
            return { ...prev, question: "fadeOut" };
          });
        }, delay + 3000);
        var clickDelay = questionnaire[index].delay
          ? delay + questionnaire[index].delay
          : delay + 5000;
        console.log(clickDelay);
        setTimeout(() => {
          console.log("second timeout");
          setIndex(index + 1);
          setAnimation((prev) => ({
            ...prev,
            question: "fadeIn",
          }));
        }, clickDelay);
      }
    }, // eslint-disable-next-line
    [index]
  );

  const spanGenerator = (string) => {
    var split = string.split("");
    return split.map((char, index) => (
      <QuestionSpan
        key={index}
        animate={animation.question}
        index={index}
        stagger={index * 100}
        className="letter"
      >
        {char}
      </QuestionSpan>
    ));
  };

  const narationGenerator = useCallback(
    (arr) => {
      console.log("narationGenerator");
      return arr.map((sentence, index) => (
        <QuestionSpan
          key={index}
          animate={
            animation.question === "fadeOut"
              ? "narationFadeOut"
              : "narationFadeIn"
          }
          stagger={sentence[1]}
        >
          {sentence[0]}
        </QuestionSpan>
      ));
    },
    [animation]
  );

  const renderResponse = (v) => {
    if (variation !== -1) {
      return (
        <p>{questionnaire[index].response[variation].subresponse[v].answer}</p>
      );
    } else if (questionnaire[index].response[v].hasOwnProperty("answerImage")) {
      return (
        <img src={questionnaire[index].response[v].answerImage} alt="desk" />
      );
    } else return <p>{questionnaire[index].response[v].answer}</p>;
  };

  const handleClick = (v) => {
    if (variation === -1) {
      if (questionnaire[index].response[v].type)
        handleAnswer(questionnaire[index].response[v].type);
      if (questionnaire[index].response[v].hasOwnProperty("subquestion")) {
        setVariation(v);
        setAnimation({ question: "fadeIn", response: ["fadeIn", "fadeIn"] });
      } else {
        setIndex(index + 1);
        setAnimation({ question: "fadeIn", response: ["fadeIn", "fadeIn"] });
      }
    } else {
      handleAnswer(
        questionnaire[index].response[variation].subresponse[v].type
      );
      setVariation(-1);
      setIndex(index + 1);
      setAnimation({ question: "fadeIn", response: ["fadeIn", "fadeIn"] });
    }
  };

  return (
    <Container>
      <QuestionContainer>
        {questionnaire[index].naration
          ? narationGenerator(questionnaire[index].naration)
          : variation === -1
          ? spanGenerator(questionnaire[index].question)
          : spanGenerator(questionnaire[index].response[variation].subquestion)}
      </QuestionContainer>

      {questionnaire[index].naration ? (
        <></>
      ) : (
        <>
          <Button
            animate={animation.response[0]}
            delay={
              variation === -1
                ? questionnaire[index].question.length * 100
                : questionnaire[index].response[variation].subquestion.length *
                  100
            }
            onClick={(e) => {
              handleMusic(0);
              handleBackground(0);
              setAnimation({
                question: "fadeOut",
                response: ["fadeOutDelay", "fadeOut"],
              });
              setTimeout(
                () => handleClick(0),
                questionnaire[index].delay || 2000
              );
            }}
          >
            {renderResponse(0)}
          </Button>{" "}
          <Button
            animate={animation.response[1]}
            delay={
              variation === -1
                ? questionnaire[index].question.length * 100
                : questionnaire[index].response[variation].subquestion.length *
                  100
            }
            onClick={(e) => {
              handleMusic(1);
              handleBackground(1);
              setAnimation({
                question: "fadeOut",
                response: ["fadeOut", "fadeOutDelay"],
              });
              setTimeout(
                () => handleClick(1),
                questionnaire[index].delay || 2000
              );
            }}
          >
            {renderResponse(1)}
          </Button>
        </>
      )}
    </Container>
  );
};

export default React.memo(Question);
