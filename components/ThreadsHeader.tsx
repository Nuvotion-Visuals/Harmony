import { Button, Gap, generateUUID, Item, TextInput, RichTextEditor, Box, Dropdown, useBreakpoint, AspectRatio, } from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useSpaces_activeChannel, useSpaces_activeGroup, useSpaces_activeSpace, useSpaces_addMessage, useSpaces_addMessageToThread, useSpaces_addThread, useSpaces_addThreadToChannel, useSpaces_setActiveChannelGuid, useSpaces_setActiveGroupGuid, useSpaces_threadsByGuid } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { getWebsocketClient } from 'client/connectivity/websocket-client'
import { useLayout_decrementActiveSwipeIndex } from 'redux-tk/layout/hook'
import { Indicator } from './Indicator'
import { useLanguageAPI } from 'client/language/hooks'
import { ResponseStream } from './ResponseStream'
import { harmonySystemMessage } from 'systemMessage'
import { getStore } from 'redux-tk/store'
import { select_activeChannel, select_activeSpace, select_activeGroup } from 'redux-tk/spaces/selectors'
import { Channel, Group, Message, Space, Thread } from 'redux-tk/spaces/types'

type ActiveChannelComponentProps = {
  activeChannel: Channel
  activeSpace: Space
  activeGroup: Group
  isDesktop?: boolean
  decrementActiveSwipeIndex: () => void
}

const ActiveChannelComponent: React.FC<ActiveChannelComponentProps> = memo(({
  activeChannel,
  activeSpace,
  activeGroup,
  isDesktop,
  decrementActiveSwipeIndex
}) => {
  return (
    <Box width='100%' wrap>
      {
        activeChannel?.previewSrc &&
        <Box px={.75} width='100%'>
          <S.ThreadPoster>
            <AspectRatio
              backgroundSrc={activeChannel?.previewSrc}
              ratio={3}
              coverBackground
            />
          </S.ThreadPoster>
        </Box>
      }

      <Item minimalIcon pageTitle={activeChannel?.name}>
        <Indicator
          count={activeChannel?.threadGuids?.length}
        />
        <Dropdown
          icon='ellipsis-h'
          iconPrefix='fas'
          minimal
          minimalIcon
          items={[
            {
              icon: 'edit',
              iconPrefix: 'fas',
              name: 'Edit',
              href: `/spaces/${activeSpace?.guid}/groups/${activeGroup?.guid}/channels/${activeChannel?.guid}/edit`,
              onClick: () => {
                if (!isDesktop) {
                  decrementActiveSwipeIndex()
                }
              }
            },
            {
              icon: 'trash-alt',
              iconPrefix: 'fas',
              name: 'Delete',
            }
          ]}
        />
      </Item>

      <Box mt={-.75} width='100%'>
        <Item 
          // @ts-ignore
          subtitle={
            <RichTextEditor
              value={activeChannel?.description || ''}
              readOnly={true}
            />
          }
        />
      </Box>
    </Box>
  )
})

type SuggestBoxProps = {
  feedback: string,
  set_feedback: React.Dispatch<React.SetStateAction<string>>,
  generateThreadPrompts: () => void
}

const SuggestBox: React.FC<SuggestBoxProps> = memo(({ feedback, set_feedback, generateThreadPrompts }) => {
  const handleChange = (val: string) => {
    set_feedback(val)
  }

  const handleThreadPrompt = () => {
    generateThreadPrompts()
  }

  return (
    <Box width='100%' pb={.25}>
      <TextInput
        value={feedback}
        canClear={feedback !== ''}
        compact
        onChange={handleChange}
        placeholder='Suggest new threads'
        hideOutline
      />
      <Box pr={.5}>
        <Button
          icon='lightbulb'
          expand
          iconPrefix='fas'
          secondary
          text='Suggest'
          onClick={handleThreadPrompt}
        />
      </Box>
    </Box>
  )
})


export const ThreadsHeader = memo(() => {
  const router = useRouter()
  const { query } = router
  const { groupGuid, channelGuid } = query

  useEffect(() => {
    setActiveGroupGuid(groupGuid as string)
    setActiveChannelGuid(channelGuid as string)
  }, [groupGuid, channelGuid])

  const addThread = useSpaces_addThread()
  const addMessage = useSpaces_addMessage()
  const addThreadToChannel = useSpaces_addThreadToChannel()
  const addMessageToThread = useSpaces_addMessageToThread()
  const setActiveChannelGuid = useSpaces_setActiveChannelGuid()
  const setActiveGroupGuid = useSpaces_setActiveGroupGuid()
  
  const activeChannel = useSpaces_activeChannel()
  const activeSpace = useSpaces_activeSpace()
  const activeGroup = useSpaces_activeGroup()

  const decrementActiveSwipeIndex = useLayout_decrementActiveSwipeIndex()
  const { isDesktop } = useBreakpoint()
  
  const { language, response, loading, error, completed } = useLanguageAPI('');
  const { generate_threadPrompts } = language;
  
  const [suggestedPrompts, set_suggestedPrompts] = useState([])

  useEffect(() => {
    if (response && completed) {
      try {
        let obj = JSON.parse(response);
        set_suggestedPrompts(obj.suggestions)
      } catch (e) {}
    }
  }, [response, completed]);

  const websocketClient = getWebsocketClient()

  const [feedback, set_feedback] = useState('')

  const sendThread = (message: string) => {
    const state = getStore().getState()
    const { threadsByGuid } = state.spaces
    const activeChannel = select_activeChannel(state)
    const activeSpace = select_activeSpace(state)
    const activeGroup = select_activeGroup(state)

    let existingThreads = activeChannel?.threadGuids.map((threadGuid) => (
      `Existing thread: ${threadsByGuid[threadGuid]?.name} - ${threadsByGuid[threadGuid]?.description}`
    )).join('\n')

    const guid = generateUUID()
    const newThread = {
      guid,
      name: '',
      channelGuid,
      messageGuids: [],
      description: ''
    } as Thread
    addThread({ guid, thread: newThread })
    addThreadToChannel({ channelGuid: channelGuid as string, threadGuid: guid })

    const messageGuid = generateUUID()
    const newMessage = {
      guid: messageGuid,
      userLabel: 'You',
      message,
      conversationId: guid,
      parentMessageId: messageGuid
    } as Message
    addMessage({ guid: messageGuid, message: newMessage })
    addMessageToThread({ threadGuid: guid, messageGuid })

    const responseGuid = generateUUID()
    const newResponse = {
      guid: responseGuid,
      message: '',
      conversationId: guid,
      parentMessageId: messageGuid,
      userLabel: 'Harmony'
    } as Message
    addMessage({ guid: responseGuid, message: newResponse })
    addMessageToThread({ threadGuid: guid, messageGuid: responseGuid })

    const action = {
      type: 'message',
      guid,
      message: `
        Space Description: ${activeSpace?.description}
        Group Description: ${activeGroup?.description}
        Channel Description: ${activeChannel?.description}
        Existing threads: \n${existingThreads}
        User Message: ${message}
        Action: given the context, respond directy to the user.
      `,
      conversationId: guid,
      parentMessageId: messageGuid,
      personaLabel: 'Harmony',
      systemMessage: harmonySystemMessage,
      userLabel: 'You',
    }
    websocketClient.send(JSON.stringify(action))
  }

  const generateThreadPrompts = useCallback(() => {
    const state = getStore().getState()
    const { threadsByGuid } = state.spaces

    let existingThreads = activeChannel?.threadGuids.map((threadGuid) => (
      `Existing thread: ${threadsByGuid[threadGuid]?.name} - ${threadsByGuid[threadGuid]?.description}`
    )).join('\n')

    generate_threadPrompts(`
      Space name: ${activeSpace?.name}
      Space description: ${activeSpace?.description}
      Channel name: ${activeChannel?.name}
      Channel description: ${activeChannel?.description}
      Existing threads: \n${existingThreads}
      Your previous suggestions (optional): ${suggestedPrompts}
      User feedback (optional): ${feedback}
    `)
  }, [getStore, activeChannel, activeSpace, suggestedPrompts, feedback])

  return (
    <Gap>
      {
        activeChannel?.description &&
        <>
          <ActiveChannelComponent
            activeChannel={activeChannel}
            activeSpace={activeSpace!}
            activeGroup={activeGroup!}
            isDesktop={isDesktop}
            decrementActiveSwipeIndex={decrementActiveSwipeIndex}
          />

          <Box width={'100%'} wrap>
            <Box width='100%' pb={.5}>
              <ResponseStream 
                text={response || ''} 
                icon='paper-plane'
                onClick={(prompt) => sendThread(prompt)}
                loading={loading}
              />
            </Box>

            <SuggestBox
              feedback={feedback}
              set_feedback={set_feedback}
              generateThreadPrompts={generateThreadPrompts}
            />
        </Box>
      </>
    }
  </Gap>
  )

})

const S = {

  ThreadPoster: styled.div`
    border-radius: 1rem;
    width: 100%;
    overflow: hidden;
  `
}