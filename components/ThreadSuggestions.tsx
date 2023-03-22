import { Box, Button, Gap, Item, RichTextEditor, Spacer, TextInput } from '@avsync.live/formation';
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

    const [feedback, set_feedback] = useState('')
  
    useEffect(() => {
      set_suggestedPrompts([])
      // @ts-ignore
      if (activeChannel?.description && getWebsocketClient?.send) {
        generateFollowUpMessages(`
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
      setTimeout(() => {
        const target = document.getElementById(`bottom_${guid}`)
        if (target) {
          target.scrollIntoView({
            behavior: "smooth", // "auto" or "smooth"
            block: "end", // "start", "center", "end", or "nearest"
            inline: "nearest" // "start", "center", "end", or "nearest"
          });
        }
      }, 100)
    }
  }, [response])

  return (<S.ThreadSuggestions>
    <Box width='100%'>
      <Gap>
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
              <Gap disableWrap>
           

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
                      generateFollowUpMessages(`
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
             
              </Gap>
           
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