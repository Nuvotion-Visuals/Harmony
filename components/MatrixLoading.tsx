import { Box, LoadingSpinner } from '@avsync.live/formation';
import { scrollToBottom } from 'client/utils';
import React, { ReactNode, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';

interface Props {
  children?: ReactNode;
  text?: string;
  binary?: boolean,
  logo?: boolean
}

export const MatrixLoading = ({ children, text, binary, logo }: Props) => {
  const scrollContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    scrollToBottom(scrollContainerRef);
  }, [children, text]);

  const encoder = new TextEncoder();

  return (
    <S.Container logo={logo}>
      {children 
        ? children
        : binary ? encoder.encode(text) : text}
     </S.Container>
  );
};

const flicker = keyframes`
  0% {
    opacity: 0.75;
  }
  5% {
    opacity: 0.8;
  }
  10% {
    opacity: 0.7;
  }
  15% {
    opacity: 0.8;
  }
  20% {
    opacity: 0.6;
  }
  25% {
    opacity: 0.8;
  }
  30% {
    opacity: 0.8;
  }
  35% {
    opacity: 0.8;
  }
  40% {
    opacity: 0.7;
  }
  45% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.7;
  }
  55% {
    opacity: 0.8;
  }
  60% {
    opacity: 0.7;
  }
  65% {
    opacity: 0.8;
  }
  70% {
    opacity: 0.7;
  }
  75% {
    opacity: 0.8;
  }
  80% {
    opacity: 0.7;
  }
  85% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  95% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.75;
  }
`

const S = {
  Container: styled.pre<Props>`
    width: ${props => props.logo ? '100%' : 'calc(100% - 1.5rem)'};
    height: 100%;
    min-height: var(--F_Input_Height);
    position: relative;
    overflow: hidden;
    border-radius: ${props => props.logo ? '100%' : '.5rem'};
    font-size: ${props => props.logo ? '20px' : '12px'};
    color: ${props => props.logo ? 'white' : 'var(--F_Primary_Variant)'};
    display: ${props => props.logo ? 'flex' : 'block'};
    align-items: center;
    justify-content: center;
    line-height: 1.33;
    white-space: pre-wrap;
    background-image: linear-gradient(180deg,
  	#330033 25%, #003333 25%, #003333 50%,
  	#330033 50%, #330033 75%, #003333 75%, #003333);
    background-size:4px 4px;

    box-shadow:
      inset 0 0 5px #fff,
      inset 2px 0 8px #f0f,
      inset -2px 0 8px #0ff,
      inset 2px 0 30px #f0f,
      inset -2px 0 30px #0ff,
      0 0 5px #fff,
      -1.0px 0 8px #f0f,
      1px 0 8px #0ff;
    animation: ${css`${flicker} 10s ease-in-out infinite alternate`};
       
  `
};