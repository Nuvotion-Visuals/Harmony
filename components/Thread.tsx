import { scrollToElementById, Box, Button, Dropdown, Gap, generateUUID, Item, Label, LineBreak, LoadingSpinner, ParseHTML, RichTextEditor, Spacer, TextInput } from '@avsync.live/formation'
import { getWebsocketClient } from 'client/connectivity/websocket-client'
import { useLanguageAPI } from 'client/language/hooks'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSpaces_activeThreadGuid, useSpaces_addMessage, useSpaces_addMessageToThread, useSpaces_messagesByGuid, useSpaces_removeThread, useSpaces_removeThreadFromChannel, useSpaces_setActiveThreadGuid, useSpaces_updateThread } from 'redux-tk/spaces/hook'
import { Thread as ThreadProps, Message as MessageProps } from 'redux-tk/spaces/types'
import styled from 'styled-components'
import { Indicator } from './Indicator'
import { ItemMessage } from './ItemMessage'
import { ThreadSuggestions } from './ThreadSuggestions'
import { harmonySystemMessage } from 'systemMessage'
import { JsonValidator } from 'client/utils'
import { useRouter } from 'next/router'
import { getStore } from 'redux-tk/store'
import { isEqual } from 'lodash'

interface EditThreadTitleProps {
  newThreadName: string
  newThreadDescription: string | null
  guid: string
  channelGuid: string
  messageGuids: string[]
  set_newThreadName: (val: string) => void
  set_newThreadDescription: (val: string) => void
  onSaveClick: () => void
  set_edit: (edit: boolean) => void
  edit: boolean
}

const EditThreadTitle = React.memo<EditThreadTitleProps>(
  ({
    newThreadName,
    newThreadDescription,
    onSaveClick,
    set_newThreadName,
    set_newThreadDescription,
    set_edit,
    edit
  }) => {
    return (
      <Box width={'100%'} px={.75} wrap>
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
              onClick={onSaveClick}
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
    )
  }, (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps)
  }
)

type ThreadTitleProps = {
  expanded: boolean
  text: string
  subtitle: string | undefined
  onExpand: () => void
  messageCount?: number
  onClickReplyButton: () => void
  onClickDropdownReply: () => void
  onClickGenerateTitle: () => void
  onClickEdit: () => void
  onClickDelete: () => void
}

const ThreadTitle: React.FC<ThreadTitleProps> = React.memo((props) => {
  const {
    expanded,
    text,
    subtitle,
    onExpand,
    messageCount,
    onClickReplyButton,
    onClickDropdownReply,
    onClickGenerateTitle,
    onClickEdit,
    onClickDelete
  } = props
  
  return (
    <Item
      icon={expanded ? 'caret-down' : 'caret-right'}
      iconPrefix='fas'
      minimalIcon
      text={text}
      subtitle={subtitle}
      onClick={() => onExpand()}
    >
      <Indicator count={messageCount} />
      <div onClick={e => {
        e.preventDefault()
        e.stopPropagation()
      }}>
        <Box wrap maxWidth={2} ml={.25} mr={.25} >
          {
            !expanded &&
              <Box mb={.25} >
                <Button
                  icon='reply'
                  iconPrefix='fas'
                  minimal
                  minimalIcon
                  onClick={onClickReplyButton}
                />
              </Box>
          }
          <Dropdown
            icon='ellipsis-h'
            iconPrefix='fas'
            minimal
            minimalIcon
            items={[
              {
                icon: 'reply',
                iconPrefix: 'fas',
                name: 'Reply',
                onClick: onClickDropdownReply
              },
              {
                icon: 'lightbulb',
                iconPrefix: 'fas',
                name: 'Generate title',
                onClick: onClickGenerateTitle
              },
              {
                icon: 'edit',
                iconPrefix: 'fas',
                name: 'Edit',
                onClick: onClickEdit
              },
              {
                icon: 'trash-alt',
                iconPrefix: 'fas',
                name: 'Delete',
                onClick: onClickDelete
              }
            ]}
          />
        </Box>
      </div>
    </Item>
  )
  }, (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps)
  }
)

interface ReplyProps {
  expanded: boolean,
  guid: string,
  active: boolean,
  setActiveThreadGuid: (guid: string) => void,
  sendMessageToWebsocket: (message: any) => void,
}

const Reply = React.memo((props: ReplyProps) => {
  const { expanded, guid, active, setActiveThreadGuid, sendMessageToWebsocket } = props

  return (
    <>
      {
        expanded &&
        <Box width={'100%'} wrap>
          <Gap>
            <ThreadSuggestions guid={guid} onSend={message => sendMessageToWebsocket(message)} />
            {
              !active &&
              <Box width='100%' px={.75} my={.25}>
                <Button
                  expand
                  icon='reply'
                  iconPrefix='fas'
                  text={active ? 'Replying' : 'Reply'}
                  secondary
                  disabled={active}
                  onClick={() => {
                    scrollToElementById(`bottom_${guid}`, {
                      behavior: 'smooth',
                      block: 'end',
                      inline: 'nearest'
                    })
                    setActiveThreadGuid(guid)
                  }}  
                />
              </Box>
            }
          </Gap>
        </Box>
      }
    </>
  )
})


interface Props extends ThreadProps {
  threadGuid: string,
  expanded: boolean,
  onExpand: () => void,
  messages: MessageProps[],
  active: boolean
}

export const Thread = React.memo(({
    guid,
    name,
    channelGuid,
    messageGuids,
    description,
    threadGuid,
    expanded,
    onExpand,
    messages,
    active
 }: Props) => {

  const [newThreadName, set_newThreadName] = useState(name)
  const [newThreadDescription, set_newThreadDescription] = useState(description)
 
  const [messageContent, set_messageContent] = useState('')

  useEffect(() => {
    const state = getStore().getState()
    const { messagesByGuid } = state.spaces
    const newMessageContent = messageGuids?.map((messageGuid, index) => {
      const message = messagesByGuid?.[messageGuid]
      return message?.message
    }).join('\n')
    
    if (newMessageContent !== messageContent) {
      set_messageContent(newMessageContent)
    }
  }, [JSON.stringify(messageGuids)])

  const { language, response, loading, error, completed } = useLanguageAPI(messageContent);
  const { generate_title } = language;
  
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
        scrollToElementById(`bottom_${guid}`, {
          behavior: 'auto',
          block: 'end',
          inline: 'nearest'
        })
        console.log(response)
      } catch (e) {}
    }
  }, [response, completed]);
  
  const addMessage = useSpaces_addMessage()
  const addMessageToThread = useSpaces_addMessageToThread()
  const updateThread = useSpaces_updateThread()
  const removeThreadFromChannel = useSpaces_removeThreadFromChannel()
  const removeThread = useSpaces_removeThread()
  const setActiveThreadGuid = useSpaces_setActiveThreadGuid()

  const [edit, set_edit] = useState(false)
  useEffect(() => {
    set_newThreadName(name)
    set_newThreadDescription(description)
  }, [edit])

  const sendMessageToWebsocket = useCallback((message: string) => {
  const websocketClient = getWebsocketClient()

  const messageGuid = generateUUID()
  const newMessage = {
    guid: messageGuid,
    message,
    conversationId: guid,
    parentMessageId: messageGuid,
    userLabel: 'You'
  } as MessageProps
  addMessage({ guid: messageGuid, message: newMessage })
  addMessageToThread({ threadGuid, messageGuid })
  const action = {
    type: 'message',
    guid,
    message,
    conversationId: threadGuid,
    parentMessageId: messageGuid,
    personaLabel: 'Harmony',
    systemMessage: harmonySystemMessage,
    userLabel: 'You'
  }
  websocketClient.send(JSON.stringify(action))

  // Insert new message in anticipation of response
  const responseGuid = generateUUID()
  const newResponse = {
    guid: responseGuid,
    message: '',
    conversationId: guid,
    parentMessageId: messageGuid,
    userLabel: 'Harmony'
  } as MessageProps
  addMessage({ guid: responseGuid, message: newResponse })
  addMessageToThread({ threadGuid, messageGuid: responseGuid })
}, [addMessage, addMessageToThread, getWebsocketClient, guid, threadGuid, harmonySystemMessage])

  useEffect(() => {
    if (messageGuids?.length === 2 && !name && !description) {
      const message = messages.find(msg => msg.guid === messageGuids[1])
      if (message?.complete) {
        generate_title(messageContent)
      }
    }
  }, [messages])


  const jsonValidatorRef = useRef(new JsonValidator())

  const router = useRouter()
  const { message: messageGuidFromQuery } = router.query

  const onSaveClick = useCallback(() => {
    updateThread({
      guid,
      thread: {
        guid,
        name: newThreadName,
        channelGuid,
        messageGuids,
        description: newThreadDescription,
        threadGuid
      } as ThreadProps
    })
    set_edit(false)
  }, [guid, newThreadName, newThreadDescription, channelGuid, messageGuids, threadGuid])

  const onClickReplyButton = useCallback(() => {
    setActiveThreadGuid(guid)
    scrollToElementById(`bottom_${guid}`, {
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    })
  }, [guid])

  const onClickDropdownReply = useCallback(() => {
    setActiveThreadGuid(guid)
    scrollToElementById(`bottom_${guid}`, {
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    })
  }, [guid])

  const onClickGenerateTitle = useCallback(() => {
    generate_title(messageContent)
  }, [messageContent])

  const onClickEdit = useCallback(() => {
    set_edit(!edit)
  }, [edit])

  const onClickDelete = useCallback(() => {
    removeThreadFromChannel({ threadGuid: guid, channelGuid })
    removeThread(guid)
    if (active) {
      setActiveThreadGuid(null)
    }
  }, [guid, channelGuid, active])

  return (<S.Thread active={active}>
    <Box width='100%'>
    
      {
        edit
          ? (
            <EditThreadTitle
              newThreadName={newThreadName}
              newThreadDescription={newThreadDescription || ''}
              guid={guid}
              channelGuid={channelGuid}
              messageGuids={messageGuids}
              set_newThreadName={val => set_newThreadName(val)}
              set_newThreadDescription={val => set_newThreadDescription(val)}
              onSaveClick={onSaveClick}
              set_edit={edit => set_edit(edit)}
              edit={edit}
            />
          )
          : (
            <ThreadTitle
              expanded={expanded}
              text={
                loading
                ? jsonValidatorRef.current.parseJsonProperty(response, 'name') || 'Thinking...'
                : name ? name : 'Thinking...'
              }
              subtitle={
                loading
                ? jsonValidatorRef.current.parseJsonProperty(response, 'description') || ''
                : description ? description : undefined
              }
              onExpand={() => onExpand()}
              messageCount={messageGuids.length}
              onClickReplyButton={onClickReplyButton}
              onClickDropdownReply={onClickDropdownReply}
              onClickGenerateTitle={onClickGenerateTitle}
              onClickEdit={onClickEdit}
              onClickDelete={onClickDelete}
            />
          )
    }
    
    </Box>
    <div id={`top_${guid}`} />
    {
      messages?.map((message, index) => {
        return (
          expanded && message && 
            <ItemMessage 
              key={`message{${index}}`}
              {
                ...message
              }
              threadGuid={threadGuid}
              active={false}
            />
        )
      })
    }
    
    <Reply
      expanded={expanded} 
      guid={guid} 
      active={active} 
      setActiveThreadGuid={setActiveThreadGuid} 
      sendMessageToWebsocket={sendMessageToWebsocket} 
    />
   <div id={`bottom_${guid}`} />
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
    border-radius: .125rem 0 0 .125rem;
    margin: .25rem 0;
    padding: .25rem 0;
    border-bottom: 1px solid var(--F_Surface_0);
  `
}