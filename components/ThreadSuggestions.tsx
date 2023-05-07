import { Box, Button, Gap, Item, scrollToElementById, TextInput } from '@avsync.live/formation';
import { getWebsocketClient } from 'client/connectivity/websocket-client';
import { useLanguageAPI } from 'client/language/hooks';
import React, { useEffect, useState } from 'react'
import { useSpaces_activeChannel, useSpaces_activeSpace, useSpaces_messagesByGuid, useSpaces_threadsByGuid } from 'redux-tk/spaces/hook';
import styled from 'styled-components'
import { MatrixLoading } from './MatrixLoading';

interface Props {
  onSend: (message: string) => void,
  guid: string
}

export const ThreadSuggestions = ({ onSend, guid }: Props) => {
    const threadsByGuid = useSpaces_threadsByGuid()
    const activeChannel = useSpaces_activeChannel()
    const activeSpace = useSpaces_activeSpace()
    const messagesByGuid = useSpaces_messagesByGuid()
  

    const { language, response, loading, error, completed } = useLanguageAPI('');
    const { generate_followUpMessages } = language;
    
    const [suggestedPrompts, set_suggestedPrompts] = useState([])
  
    useEffect(() => {
      if (response && completed) {
        try {
          let obj = JSON.parse(response);
          set_suggestedPrompts(obj.suggestions)
        } catch (e) {}
      }
    }, [response, completed]);
  
    const [ existingMessages, set_existingMessages ] = useState('')
    useEffect(() => {
      if (activeChannel?.threadGuids) {
        set_existingMessages(threadsByGuid?.[guid]?.messageGuids.map((messageGuid, index) => (
          `Existing message: ${messagesByGuid?.[messageGuid]?.message}`
        )).join('\n'))
      }
    }, [threadsByGuid?.[guid]?.messageGuids])
  
    const websocketClient = getWebsocketClient()

    const [feedback, set_feedback] = useState('')
  
    useEffect(() => {
      set_suggestedPrompts([])
      // @ts-ignore
      if (activeChannel?.description && getWebsocketClient?.send) {
        generate_followUpMessages(`
  Space name: ${activeSpace?.name}
  Space description: ${activeSpace?.description}
  
  Channel name: ${activeChannel?.name}
  Channel description: ${activeChannel?.description} 

  Thread name ${threadsByGuid?.[guid]?.name}
  Thread description ${threadsByGuid?.[guid]?.description}
  
  Existing messages in thread: \n${existingMessages}
  
  Your previous suggestions (optional): ${suggestedPrompts}

  User feedback (optional): ${feedback}
  `)
      }
    }, [guid])

  useEffect(() => {
    if (response) {
      scrollToElementById(`bottom_${guid}`, {
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      }) 
    }
  }, [response])

  return (<S.ThreadSuggestions>
    <Box width='100%'>
      <Gap gap={.25}>
        {
          suggestedPrompts.length > 0 
            ? suggestedPrompts?.map(prompt =>
                <Item
                  subtitle={prompt}
                  icon='paper-plane'
                  onClick={() => {
                    onSend(prompt)
                    set_suggestedPrompts([])
                    set_feedback('')
                  }}
                >
                </Item>
              )
            : null
        }

        {
          loading 
          ? <MatrixLoading
              text={response || ''}
            />
          : 
            <Box width={'100%'}>
              <TextInput
                value={feedback}
                onChange={val => set_feedback(val)}
                placeholder='Suggest new messages'
                canClear={feedback !== ''}
                compact
                hideOutline
              />

              <Box>
                <Box width={7}>
                <MatrixLoading >
                  <Button 
                    minimal 
                    icon='bolt-lightning' 
                    text='Auto'
                    iconPrefix='fas' 
                    onClick={() => {
                      set_suggestedPrompts([])
                      generate_followUpMessages(`
                      Space name: ${activeSpace?.name}
                      Space description: ${activeSpace?.description}
                      
                      Channel name: ${activeChannel?.name}
                      Channel description: ${activeChannel?.description} 
                    
                      Thread name ${threadsByGuid?.[guid]?.name}
                      Thread description ${threadsByGuid?.[guid]?.description}
                      
                      Existing messages in thread: \n${existingMessages}
                      
                      Your previous suggestions (optional): ${suggestedPrompts}
                    
                      User feedback (optional): ${feedback}
                      `)
                    }} 
                  />
                </MatrixLoading>
                </Box>
              </Box>
            </Box>
         
        }
      </Gap>
    </Box>
  </S.ThreadSuggestions>)
}

const S = {
  ThreadSuggestions: styled.div`
    width: 100%;
  `
}