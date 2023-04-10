import styled from 'styled-components'

import Link from 'next/link'
import React from 'react'

type LinkType = {
  href: string,
  children?: React.ReactNode,
  newTab?: boolean
}

const MyLink = React.memo(({ children, href, newTab }: LinkType) => {
  return (
    <Link href={href || '#'}>
      <S_A href={href || '#'} target={newTab ? '_blank' : '_self'}>
        { children }
      </S_A>
    </Link>
  )
})

export default MyLink

const S_A = React.memo(styled.a`
  color: inherit;
  text-decoration: none;

  &:active {
    color: inherit;
  }
  &:hover {
    color: inherit;
  }
`)