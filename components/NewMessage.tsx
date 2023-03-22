import { Box, Button, Gap, generateUUID, RichTextEditor, TextInput } from '@avsync.live/formation'
import edit from 'pages/spaces/edit'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Thread as ThreadProps } from 'redux-tk/spaces/types'
import { useSpaces } from 'redux-tk/spaces/hook'

interface Props {
  channelGuid: string,
  thread: boolean,
  onSend: (message: string) => void
  newThreadName?: string,
  set_newThreadName?: (newName: string) => void,
  newThreadDescription?: string,
  set_newThreadDescription?: (newDescription: string) => void,
  threadName?: string,
  primary?: boolean
}

export const NewMessage = ({ channelGuid, thread, onSend, newThreadName, set_newThreadName, newThreadDescription, set_newThreadDescription, threadName, primary }: Props) => {
  const [message, set_message] = useState('')

  const [edit, set_edit] = useState(false)
  const [newThread, set_newThread] = useState(true)

  return (
    <Box wrap width={'100%'} maxWidth='700px'> 
      <Gap gap={.75}>
        <Box wrap width={'100%'}>
            <Gap>
                    {
                      edit && 
                        <>
                          <Gap disableWrap>
          
                          <TextInput 
                            iconPrefix='fas'
                            placeholder='Subject'
                            value={newThreadName}
                            onChange={(val) => set_newThreadName(val)}
                          />
          
                          </Gap>
                          <RichTextEditor
                            placeholder='Description'
                            value={newThreadDescription}
                            onChange={val => set_newThreadDescription(val)}
                          />
                        </>
                    }
                  
                  <RichTextEditor
                    placeholder='Type a message'
                    value={message}
                    onChange={val => set_message(val)}
                  >
                    <Button 
                      icon='paper-plane'
                      iconPrefix='fas'
                      minimal
                      onClick={() => {
                        onSend(message)
                        set_message('')
                      }}
                    />
                    <Button
                      icon={'microphone'}
                      iconPrefix='fas'
                      minimal
                    />
                
                    <Box
                      height='100%'
                    />
                  </RichTextEditor>
                  
                  </Gap>
              
        </Box>
      </Gap>
    </Box>
  )
}

const S = {
  NewMessage: styled.div`
    
  `
}