import { Box, LoadingSpinner } from '@avsync.live/formation';
import { scrollToBottom } from 'client-utils';
import React, { ReactNode, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';

interface Props {
  children?: ReactNode;
  text?: string;
  binary?: boolean
}

export const MatrixLoading = ({ children, text, binary }: Props) => {
  const scrollContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    scrollToBottom(scrollContainerRef);
  }, [children, text]);

  const encoder = new TextEncoder();

  return (
    <S.Container>
        <S.MatrixLoading ref={scrollContainerRef}>
        <Box width='100%' height='8rem' />
       {children || binary ? encoder.encode(text) : text}
     </S.MatrixLoading>
       <S.Center>
          <LoadingSpinner chat />
        </S.Center>
    
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
    opacity: 0.5;
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
    opacity: 0.5;
  }
  95% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.75;
  }
`

const S = {
  Container: styled.div`
    width: 100%;
    height: 5rem;
    position: relative;
    overflow: hidden;
    border-radius: .5rem;
  `,
  MatrixLoading: styled.div`
    top: 0;
    position: relative;
    width: calc(100% - 1rem);
    max-height: 4rem;
    font-family: monospace;
    padding: .5rem;
    font-size: 10px;
    color: var(--F_Primary_Variant);
    overflow: scroll;
    border-radius: .5rem;
    overflow-wrap: break-word;
    /* text-shadow:
      0 0 5px var(--F_Primary_Variant),
      0 0 15px var(--F_Primary),
      0 0 30px var(--F_Primary); */
    /* animation: ${css`${flicker} 10s ease-in-out infinite alternate`}; */
    ::-webkit-scrollbar {
      display: none;
    }
  `,
  Center: styled.div`
  
    z-index: 1;
    width: 100%;
    height: 100%;
    top: 0;
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    background: linear-gradient(to top, hsla(0, 0%, 0%, .3) 0%, hsla(0, 0%, 0%,.8) 70%, hsla(0, 0%, 0%, .85) 100%);
    border-radius: .5rem;
  `
};