import { Box, Button, Gap, Item, Spacer } from '@avsync.live/formation';
import { getWebsocketClient } from 'Lexi/System/Connectvity/websocket-client';
import { useLanguageAPI } from 'Lexi/System/Language/hooks';
import React, { useEffect, useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook';
import styled from 'styled-components'
import { MatrixLoading } from './MatrixLoading';

interface Props {
  onSend: (message: string) => void,
  guid: string
}

export const ThreadSuggestions = ({ onSend, guid }: Props) => {
    const { 
    addThread,
    addMessage,
    threadsByGuid,
    addThreadToChannel,
    addMessageToThread,
    setActiveChannelGuid,
    setActiveGroupGuid,
    activeChannel,
    activeSpace,
    activeGroup,
    messagesByGuid
    } = useSpaces() 

    const { language, response, loading, error, completed } = useLanguageAPI('');
    const { generateFollowUpMessages } = language;
    
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
  
    useEffect(() => {
      set_suggestedPrompts([])
      if (activeChannel?.description && getWebsocketClient?.send) {
        generateFollowUpMessages(`
  Space name: ${activeSpace?.name}
  Space description: ${activeSpace?.description}
  
  Channel name: ${activeChannel?.name}
  Channel description: ${activeChannel?.description} 

  Thread name ${threadsByGuid?.[guid]?.name}
  Thread description ${threadsByGuid?.[guid]?.description}
  
  Existing messages in thread: \n${existingMessages}`)
      }
    }, [guid])

  return (<S.ThreadSuggestions>
    {
      suggestedPrompts?.length
        ? <Box width='100%' px={.5} mb={.25}>
            <Gap>
            {
                suggestedPrompts?.map(prompt =>
                <Item
                  subtitle={prompt}
                  icon='bolt-lightning'
                  onClick={() => {
                    onSend(prompt)
                  }}
                >
                
                </Item>
                )
            }
            </Gap>
        </Box>
        : loading && !completed
        ? <MatrixLoading
            text={response || ''}
          />
        : <Box width='100%'>
          <Button expand  minimal secondary icon='bolt-lightning' iconPrefix='fas' onClick={() => generateFollowUpMessages(`
  Space name: ${activeSpace?.name}
  Space description: ${activeSpace?.description}
  
  Channel name: ${activeChannel?.name}
  Channel description: ${activeChannel?.description} 

  Thread name ${threadsByGuid?.[guid]?.name}
  Thread description ${threadsByGuid?.[guid]?.description}
  
  Existing messages in thread: \n${existingMessages}`)} />
          </Box>
    }
  </S.ThreadSuggestions>)
}

const S = {
  ThreadSuggestions: styled.div`
    width: 100%;
  `
}