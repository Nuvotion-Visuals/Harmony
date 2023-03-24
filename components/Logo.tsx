import { LoadingSpinner } from '@avsync.live/formation'
import React from 'react'
import styled from 'styled-components'
import { MatrixLoading } from './MatrixLoading'

interface Props {
  large?: boolean
}

export const Logo = React.memo(({ large }: Props) => {
  return (
    <S.LogoContainer large={large || false}>
    <MatrixLoading logo={true}> 
    </MatrixLoading>
    <S.Connection>
    <LoadingSpinner chat />
    </S.Connection>
    </S.LogoContainer>
  )
})

const S = {
LogoContainer: styled.div<{
  large: boolean
}>`
    width: 38px;
    min-width: 38px;
    margin-left: 19px;
    max-width: 38px;
    height: var(--F_Header_Height);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 38px;
    position: relative;;
    * {
      border-radius: 100%;
    }
    transform: ${props => props.large ? 'scale(4)' : 'none'};
  `,
  Logo: styled.img`
    height: var(--F_Input_Height);
    width: var(--F_Input_Height);
  `,
  Connection: styled.div`
    position: absolute;
    z-index:1;
    transform: scale(.5);
    transform-origin: center;
    opacity: .4;
    `,
}