import React from 'react'
import styled from 'styled-components'

interface Props {
  large?: boolean
}

export const Logo = React.memo(({ large }: Props) => {
  return (
    <S.LogoContainer large={large || false}>
    <S.Logo src='/cute-harmony.png' />
    </S.LogoContainer>
  )
})

const S = {
LogoContainer: styled.div<{
  large: boolean
}>`
    width: 60px;
    min-width: 60px;
    max-width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;;
    border-radius: .5rem;
    transform: ${props => props.large ? 'scale(4)' : 'none'};
    &:hover {
      background: var(--F_Surface);
    }
  `,
  Logo: styled.img`
    width: 100%;
  `,
  Connection: styled.div`
    position: absolute;
    z-index:1;
    transform: scale(.5);
    transform-origin: center;
    opacity: .4;
    `,
}