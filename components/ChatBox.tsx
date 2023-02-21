import { Box, RichTextEditor, useBreakpoint, Button } from '@avsync.live/formation'
import React from 'react'
import { useLexi } from 'redux-tk/lexi/hook'
import styled from 'styled-components'

interface Props {
  onEnter: () => void
}

export const ChatBox = ({ onEnter }: Props) => {
  const {
    query,
    set_query,
  } = useLexi()

  const { isMobile } = useBreakpoint()

  return (<Box width='calc(100% - 2px)' ml={1/16}>
    <RichTextEditor
      key='testley'
      value={query} 
      onChange={(value : string) => value === '<p><br></p>' ? null : set_query(value)} 
      height={'160px'}
      // onEnter={newQuery => {
      //   if (!isMobile) {
      //     onEnter()
      //   }
      // }}
      placeholder='Chat'
      outset
    >
      <Button
        icon='paper-plane'
        iconPrefix='fas'
        minimal
        onClick={onEnter}
      />
      <Button
        icon='microphone'
        iconPrefix='fas'
        minimal
      />
      <Button
        icon='plus'
        iconPrefix='fas'
        minimal
      />
      <S.VSpacer />
    </RichTextEditor>
  </Box>)
}

const S = {
  VSpacer: styled.div`
    height: 100%;
  `
}
