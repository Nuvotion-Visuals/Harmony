import { RichTextEditor, useBreakpoint } from '@avsync.live/formation'
import React from 'react'
import { useLexi } from 'redux-tk/lexi/hook'

interface Props {
  onEnter: () => void
}

export const ChatBox = ({ onEnter }: Props) => {
  const {
    query,
    set_query,
  } = useLexi()

  const { isMobile } = useBreakpoint()

  return (<>
    <RichTextEditor
      key='testley'
      value={query} onChange={(value : string) => value === '<p><br></p>' ? null : set_query(value)} 
      height={'160px'}
      onEnter={newQuery => {
        if (!isMobile) {
          onEnter()
        }
      }}
    />
  </>)
}
