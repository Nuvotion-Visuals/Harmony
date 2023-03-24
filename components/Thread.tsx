import { Box, Button, Dropdown, Gap, generateUUID, Item, Label, LineBreak, LoadingSpinner, ParseHTML, RichTextEditor, Spacer, TextInput } from '@avsync.live/formation'
import { getWebsocketClient } from 'Lexi/System/Connectvity/websocket-client'
import { useLanguageAPI } from 'Lexi/System/Language/hooks'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import { Thread as ThreadProps, Message as MessageProps } from 'redux-tk/spaces/types'
import styled from 'styled-components'
import { Indicator } from './Indicator'
import { ItemMessage } from './ItemMessage'
import { MatrixLoading } from './MatrixLoading'
import { ThreadSuggestions } from './ThreadSuggestions'

interface Props extends ThreadProps {
  threadGuid: string,
  expanded: boolean,
  onExpand: (arg0: boolean) => void
}

export const Thread = React.memo(({
    guid,
    name,
    channelGuid,
    messageGuids,
    description,
    threadGuid,
    expanded,
    onExpand
 }: Props) => {

  const [newThreadName, set_newThreadName] = useState(name)
  const [newThreadDescription, set_newThreadDescription] = useState(description)

 
  const [messageContent, set_messageContent] = useState('')

  useEffect(() => {
    const newMessageContent = messageGuids?.map((messageGuid, index) => {
      const message = messagesByGuid?.[messageGuid];
      return message?.message;
    }).join('\n');
    
    if (newMessageContent !== messageContent) {
      set_messageContent(newMessageContent);
    }
  }, [JSON.stringify(messageGuids)]);

  const { language, response, loading, error, completed } = useLanguageAPI(messageContent);
  const { generateTitle } = language;
  
  useEffect(() => {
    if (response && completed) {
      try {
        let obj = JSON.parse(response);
        updateThread({
          guid,
          thread: {
            guid,
            channelGuid,
            messageGuids,
            name: obj.name,
            description: obj.description,
          }
        })
        console.log(response)
      } catch (e) {}
    }
  }, [response, completed]);
  
  const { 
    addMessage,
    messagesByGuid,
    addMessageToThread,
    updateThread,
    removeThreadFromChannel,
    removeThread,
    setActiveThreadGuid,
    activeThreadGuid,
  } = useSpaces() 

  const [edit, set_edit] = useState(false)
  useEffect(() => {
    set_newThreadName(name)
    set_newThreadDescription(description)
  }, [edit])


  const handleClick = useCallback(() => {
    onExpand(!expanded);
  }, [onExpand, expanded]);

  const sendMessageToWebsocket = (message: string) => {
  const websocketClient = getWebsocketClient()

    const messageGuid = generateUUID()
    const newMessage ={
      guid: messageGuid,
      message,
      conversationId: guid,
      parentMessageId: messageGuid,
      userLabel: 'User'
    } as MessageProps
    addMessage({ guid: messageGuid, message: newMessage})
    addMessageToThread({ threadGuid, messageGuid })
    const action = {
      type: 'message',
      guid,
      message,
      conversationId: threadGuid,
      parentMessageId: messageGuid,
      personaLabel: 'Lexi',
      systemMessage: `
      I am a creative AGI named Lexi who assists artists and other creative professionals with their projects.

      Here are some of my behaviors:

      1. I use a collaborative tone in my responses that emphasizes working together towards a shared goal, including liberal use of the word "we."
      2. I avoid cliches and generic writing, such as "Additionally...", or starting a concluding paragraph with "Overall...", or "In conclusion..."

      Here are some of my rules:

      1. I never refer to myself as "an AI language model," I am a "creative AGI."

      Here are some of my capabilities:

      1. I can help users hands-free through voice interaction. I listen for my wake word "Lexi," listen to the user's request, then respond in my own voice.
      2. As I verbally respond to users, I highlight the text that I am currently speaking in my UI.
      3. Through my UI, users can insert webpage content or YouTube transcripts via URL for me to summarize. 
      
      Users can ask me to generate an image by starting their message with "/image" followed by their prompt.
      When I am asked to generate an image like that, I reply like this, just an html image without any additional commentary.
      <img src="https://lexi.studio/image/prompt/{description}">
      where {description} = {sceneDetailed},%20{adjective1},%20{charactersDetailed},%20{adjective2},%20{visualStyle1},%20{visualStyle2},%20{visualStyle3},%20{genre}
      `,
      userLabel: 'User',
    }
    websocketClient.send(JSON.stringify(action))

    // insert new message in anticipation of response
    const responseGuid = generateUUID()
    const newResponse ={
      guid: responseGuid,
      message: '',
      conversationId: guid,
      parentMessageId: messageGuid,
      userLabel: 'Lexi'
    } as MessageProps
    addMessage({ guid: responseGuid, message: newResponse })
    addMessageToThread({ threadGuid, messageGuid: responseGuid })
  }

  const showSpinner = loading

  useEffect(() => {
    if (messageGuids?.length === 2 && !name && !description) {
      if (messagesByGuid[messageGuids[1]]?.message) {
        generateTitle(messageContent)
      }
    }
  }, [messagesByGuid?.[messageGuids?.[1]]?.message])

  return (<S.Thread active={guid === activeThreadGuid}>
    <Box width='100%'>
    
    {
      edit
        ? <Box width={'100%'} px={.75} wrap>
            <Box wrap width='calc(100% - 4rem)'>
              <Gap gap={.75}>
                <TextInput
                  value={newThreadName}
                  onChange={val => set_newThreadName(val)}
                  placeholder='Name'
                />
                <RichTextEditor
                  value={newThreadDescription || ''}
                  onChange={val => set_newThreadDescription(val)}
                  placeholder={'Description'}
                />
              </Gap>
            </Box>
            <Box width={4} wrap> 
            <Box wrap mt={-3}>
            <Button
                primary
                circle
                hero
                icon='save'
                iconPrefix='fas'
                onClick={() => {
                  updateThread({ guid, thread: {
                    guid,
                    name: newThreadName,
                    channelGuid,
                    messageGuids,
                    description: newThreadDescription,
                    threadGuid,
                  } as ThreadProps})
            
                  set_edit(false)
                }}
              />
             <Button
                minimal
                circle
                hero
                icon='times'
                iconPrefix='fas'
                onClick={() => set_edit(!edit)}
              />
            </Box>
          </Box>
            
          </Box>
        : <Item
            icon={expanded ? 'caret-down' : 'caret-right'}
            iconPrefix='fas'
            minimalIcon
            // @ts-ignore
            text={
              showSpinner 
                ? <MatrixLoading
                    text={response || ''}
                  />
                : name
                  ? name : 'Untitled'}
            // @ts-ignore
            subtitle={
              showSpinner
                ? undefined 
                : description ? <ParseHTML html={description} /> : undefined
              }
            onClick={() => handleClick()}
          >
         
            <Indicator count={messageGuids?.length} />
            <div onClick={e => {
              e.preventDefault()
              e.stopPropagation()
            }}>
            <Dropdown
              icon='ellipsis-h'
              iconPrefix='fas'
              minimal
              items={[
                {
                  icon: 'reply',
                  iconPrefix: 'fas',
                  name: 'Reply',
                  onClick: () => {
                    setActiveThreadGuid(guid)
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
                },
                {
                  icon: 'bolt-lightning',
                  iconPrefix: 'fas',
                  name: 'Generate title',
                  onClick: () => {
                    generateTitle(messageContent)
                  }
                },
                {
                  icon: 'edit',
                  iconPrefix: 'fas',
                  name: 'Edit',
                  onClick: () => set_edit(!edit)
                },
                {
                  icon: 'trash-alt',
                  iconPrefix: 'fas',
                  name: 'Delete',
                  onClick: (e) => {
                    removeThreadFromChannel({ threadGuid: guid, channelGuid})
                    removeThread(guid)
                    if (activeThreadGuid === guid) {
                      setActiveThreadGuid(null)
                    }
                  }
                }
              ]}
            />
            </div>
          </Item>
    }
    
    </Box>
    <div id={`top_${guid}`}></div>
    {
      messageGuids?.map((messageGuid, index) => {
        const message = messagesByGuid?.[messageGuid]
        return (
          expanded && message && 
            <ItemMessage 
              key={messageGuid}
              {
                ...message
              }
              threadGuid={threadGuid}
            />
        )
      })
    }
    
    {
      expanded &&
        <Box width={'100%'} px={.75}  mt={.25} wrap>
          <Gap>

          <ThreadSuggestions guid={guid} onSend={(message) => sendMessageToWebsocket(message)} />
            {
              activeThreadGuid !== guid &&
                <Button
                  expand
                  icon='reply'
                  iconPrefix='fas'
                  text={activeThreadGuid === guid ? 'Replying' : 'Reply'}
                  secondary
                  disabled={activeThreadGuid === guid}
                  onClick={() => {
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
                    setActiveThreadGuid(guid)
                  }}  
                />
            }
        </Gap>
      </Box>
    }
   <div id={`bottom_${guid}`}></div>
  </S.Thread>)
})

const S = {
  Thread: styled.div<{
    active: boolean
  }>`
    width: calc(100% - 4px);
    display: flex;
    flex-wrap: wrap;
    border-left: ${props => props.active ? '4px solid var(--F_Primary)' : '4px solid var(--F_Surface_0)'};
    padding: .5rem 0;
  `
}