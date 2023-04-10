import React from 'react'
import * as Types from './types'
import { Box, Item, LineBreak } from '@avsync.live/formation'

interface Props {
  featuredSnippet: Types.FeaturedSnippet,
}

export const FeaturedSnippet = ({ featuredSnippet }: Props) => {
  return (<>
  <Box width='100%' py={.75} wrap>
    <Item
      text={featuredSnippet.title}
      subtitle={featuredSnippet.description}
    />
  </Box>
  </>)
}
