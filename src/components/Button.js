// Button.js
import styled from 'styled-components';
import React from 'react'

const StyledButton = styled.button`
  background: none;
  border: none;
  color: #e1e1e1;
  cursor: pointer;
  font-size: 18px;
  font-family: inherit;
  font-weight: 800;
  position: relative;
  text-transform: uppercase;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-duration: 400ms;
  transition-property: color;

  &:focus,
  &:hover {
    color: #fff;
  }

  &:focus:after,
  &:hover:after {
    width: 100%;
    left: 0%;
  }

  &:after {
    content: "";
    pointer-events: none;
    bottom: -2px;
    left: 50%;
    position: absolute;
    width: 0%;
    height: 2px;
    background-color: #fff;
    transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
    transition-duration: 400ms;
    transition-property: width, left;
  }
`;

const Button = ({ onClick, text }) => {
  return (<StyledButton onClick= {onClick} >{text}</StyledButton>
  
  )
};

export default Button;
