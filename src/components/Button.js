import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";

const StyledButton = styled.button`
  opacity: 0;
  transition: opacity 2s ease-in;
  ${(props) =>
    props.animation === "fadeIn" &&
    css`
      opacity: 1;
    `}
  ${(props) =>
    props.animation === "onEnd" &&
    css`
      opacity: 1;
      transition: opacity 1s ease-in-out;
    `}
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 1.5vw;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 1vw 4vw;
  margin: 1rem;
  /* 크기 */
  font-size: 5vw;
  font-family: inherit;
  /* 색상 */
  background: #228be6;
  &:hover {
    background: #339af0;
    opacity: 0.5;
  }
  &:active {
    background: #1c7ed6;
  }
  @media only screen and (min-width: 600px) {
    font-size: 2.2vw;
    padding: 0.6vw 1.3vw;
  }
`;

function Button({ children, ...rest }) {
  useEffect(() => {
    setTimeout(() => {
      setAnimation("fadeIn");
    }, 7000);
    setTimeout(() => {
      setAnimation("onEnd");
    }, 9000);
  }, []);
  const [animation, setAnimation] = useState();
  return (
    <StyledButton animation={animation} {...rest}>
      {children}
    </StyledButton>
  );
}

export default Button;
