import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;
  -webkit-transition: opacity 1s ease-in-out;
  transition: opacity 1s ease-in-out;
  margin: 1rem;
  /* 크기 */
  height: 2rem;
  font-size: 1rem;
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
  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`;

function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}

export default Button;
