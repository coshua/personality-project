import React from "react";
import styled, { keyframes } from "styled-components";
import Button from "./Button";

const fadeIn = keyframes`
0% {
  opacity: 0
}
100% {
  opacity: 1
}`;

const QuestionSpan = styled.span`
  opacity: 0;
  animation: ${fadeIn} 5s ease-in-out ${(props) => props.stagger}ms forwards;
`;

const Container = styled.div`
  text-align: center;
  span {
  }
`;

const Landing = ({ startTest, handleVideo }) => {
  const spanGenerator = (string) => {
    var split = string.split("");
    return split.map((char, index) => (
      <QuestionSpan
        key={index}
        index={index}
        stagger={index * 100}
        className="letter"
      >
        {char}
      </QuestionSpan>
    ));
  };
  return (
    <Container>
      <h1 id="animation">{spanGenerator("당신의 내면에 귀 기울어보세요")}</h1>

      <div className="control">
        <Button
          onClick={(e) => {
            startTest();
          }}
        >
          시작하기
        </Button>
      </div>
    </Container>
  );
};

export default Landing;
