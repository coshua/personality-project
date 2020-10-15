import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 1.5vw;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 1vw 4vw;
  -webkit-transition: opacity 1s ease-in-out;
  transition: opacity 1s ease-in-out;
  margin: 1rem;
  /* 크기 */
  font-size: 4.3vw;
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
    font-size: 2.5vw;
    padding: 0.7vw 1.5vw;
  }
`;

function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}

export default Button;
