import { Box, RichTextEditor, useBreakpoint, Button } from '@avsync.live/formation'
import React from 'react'
import { useLexi } from 'redux-tk/lexi/hook'
import styled from 'styled-components'

interface Props {
  onEnter: () => void,
  children: React.ReactNode
}

export const ChatBox = ({ onEnter, children }: Props) => {
 

  const { isMobile } = useBreakpoint()

  return (<Box width='calc(100% - 2px)' ml={1/16}>
    <RichTextEditor
      key='testley'
      value={query} 
      onChange={(value : string) => value === '<p><br></p>' ? null : set_query(value)} 
      height='160px'
      // onEnter={newQuery => {
      //   if (!isMobile) {
      //     onEnter()
      //   }
      // }}
      placeholder='Chat'
      outset
    >
     {
      children
     }
    </RichTextEditor>
  </Box>)
}

const S = {
  VSpacer: styled.div`
    height: 100%;
  `
}
