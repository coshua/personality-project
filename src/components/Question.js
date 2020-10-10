import React, { useState } from "react";
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
    props.animate === "fade" &&
    css`
      animation: ${fadeIn} 1s ease-in-out;
    `}
`;

const Button = styled.button`
  font-size: 0.75rem;
  box-sizing: border-box;
  color: inherit;
  display: inline-block;
  outline: none;
  border-radius: 8px;
  border: 1px solid transparent;
  text-decoration: none;
  background-color: rgba(0, 0, 0, 0);
  overflow: hidden;
  width: 70%;
  font-family: inherit;
  text-align: center;
  cursor: pointer;
  transition: border-color 1s;
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
    width: 40%;
    & + & {
      margin-left: 10%;
      margin-top: 2.5rem;
    }
  }
`;

const Question = ({
  handleAnswer,
  playMusic,
  index,
  setIndex,
  handleBackground,
  handleMusic,
}) => {
  const [variation, setVariation] = useState(-1); //0 question for P,1 requires question for J
  const [animation, setAnimation] = useState({
    question: "fadeIn",
    response: ["fadeIn", "fadeIn"],
  });

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
        {variation === -1
          ? spanGenerator(questionnaire[index].question)
          : spanGenerator(questionnaire[index].response[variation].subquestion)}
      </QuestionContainer>

      <Button
        animate={animation.response[0]}
        delay={
          variation === -1
            ? questionnaire[index].question.length * 100
            : questionnaire[index].response[variation].subquestion.length * 100
        }
        onClick={(e) => {
          handleMusic(0);
          handleBackground(0);
          setAnimation({
            question: "fadeOut",
            response: ["fadeOutDelay", "fadeOut"],
          });
          setTimeout(() => handleClick(0), questionnaire[index].delay || 2000);
        }}
      >
        {renderResponse(0)}
      </Button>

      <Button
        animate={animation.response[1]}
        delay={
          variation === -1
            ? questionnaire[index].question.length * 100
            : questionnaire[index].response[variation].subquestion.length * 100
        }
        onClick={(e) => {
          handleMusic(1);
          handleBackground(1);
          setAnimation({
            question: "fadeOut",
            response: ["fadeOut", "fadeOutDelay"],
          });
          setTimeout(() => handleClick(1), questionnaire[index].delay || 2000);
        }}
      >
        {renderResponse(1)}
      </Button>
    </Container>
  );
};

export default Question;
