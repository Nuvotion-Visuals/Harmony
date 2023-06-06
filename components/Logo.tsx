import React from 'react'
import styled from 'styled-components'

interface Props {
  large?: boolean
}

export const Logo = React.memo(({ large }: Props) => {
  return (
    <S.LogoContainer large={large || false}>
    <S.Logo src='/harmony-white.svg' />
    </S.LogoContainer>
  )
})

const S = {
LogoContainer: styled.div<{
  large: boolean
}>`
    width: 48px;
    min-width: 48px;
    max-width: 48px;
    height: var(--F_Header_Height);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    position: relative;;
    background: var(--F_Primary);
    border-radius: 100%;
    * {
      border-radius: 100%;
    }
    transform: ${props => props.large ? 'scale(4)' : 'none'};
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