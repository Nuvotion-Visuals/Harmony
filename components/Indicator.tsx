import React from 'react';
import styled from 'styled-components';

interface Props {
  count?: number;
}

export const Indicator = ({ count }: Props): JSX.Element => {
  return (
    <S.Indicator active={count !== undefined && count > 0}> 
      {count && count > 0 ? count : '·'}
    </S.Indicator>
  );
};
const S = {
  Indicator: styled.div<{
    active: boolean
  }>`
    font-size: 14px;
    width: 1rem;
    min-width: 1rem;
    height: 1rem;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    font-family: monospace;
    align-items: center;
    color: var(--F_Font_Color_Disabled);
  `
}