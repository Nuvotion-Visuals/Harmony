import styled from 'styled-components'

import Link from 'next/link'
import React from 'react'

type LinkType = {
  href: string,
  children?: React.ReactNode,
  newTab?: boolean
}

const MyLink = ({ children, href, newTab }: LinkType) => {
  return (
    <Link href={href || '#'}>
      <S_A href={href || '#'}>
        { children }
      </S_A>
    </Link>
  )
}

export default MyLink

const S_A = styled.a`
  color: inherit;
  text-decoration: none;

  &:active {
    color: inherit;
  }
  &:hover {
    color: inherit;
  }
`