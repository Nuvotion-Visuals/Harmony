import { Box, Button, Gap, TextInput } from '@avsync.live/formation'
import { getWebsocketClient } from 'client/connectivity/websocket-client'
import { useLanguageAPI } from 'client/language/hooks'
import React, { useCallback, useEffect, useState } from 'react'
import { useSpaces_activeChannel, useSpaces_messagesByGuid, useSpaces_threadsByGuid } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { ResponseStream } from './ResponseStream'
import { getStore } from 'redux-tk/store'

interface Props {
  onSend: (message: string) => void,
  guid: string,
  query: string
}

export const SearchSuggestions = ({ onSend, guid, query }: Props) => {
  const threadsByGuid = useSpaces_threadsByGuid()
  const activeChannel = useSpaces_activeChannel()
  const { language, response, loading, error, completed } = useLanguageAPI('')
  const { generate_searchQueries } = language
  const [suggestedPrompts, set_suggestedPrompts] = useState([])
  const [feedback, set_feedback] = useState('')

  const generateSearchQueries = useCallback(async () => {
    const state = getStore().getState()
    const { messagesByGuid } = state.spaces
    
    const existingMessages = threadsByGuid?.[guid]?.messageGuids.map((messageGuid) => (
      `Existing message: ${messagesByGuid?.[messageGuid]?.message}`
    )).join('\n')

    await generate_searchQueries(`
      Channel name: ${activeChannel?.name}
      Channel description: ${activeChannel?.description}
      Thread name: ${threadsByGuid?.[guid]?.name}
      Thread description: ${threadsByGuid?.[guid]?.description}
      Existing messages in thread: \n${existingMessages}
      Your previous suggestions (optional): ${suggestedPrompts}
      User feedback (optional): ${feedback}
      Existing search term (optional): ${query}
    `)
  }, [activeChannel, threadsByGuid, guid, suggestedPrompts, feedback, query])

  useEffect(() => {
    if (response && completed) {
      try {
        const obj = JSON.parse(response)
        set_suggestedPrompts(obj.suggestions)
      } catch (e) {
        console.error('JSON Parsing Error:', e)
      }
    }
  }, [response, completed])

  return (
    <Box width='100%'>
      <Gap gap={0.25}>
        <ResponseStream
          icon='search'
          text={response || ''}
          onClick={(prompt) => {
            onSend(prompt)
            set_suggestedPrompts([])
            set_feedback('')
          }}
          loading={loading}
        />

        <Box width='100%' px={0.5} mb={0.25}>
          <TextInput
            value={feedback}
            onChange={val => set_feedback(val)}
            placeholder='Suggest new searches'
            canClear={feedback !== ''}
            compact
            hideOutline
          />

          <Box>
            <Button
              secondary
              icon='lightbulb'
              text='Suggest'
              iconPrefix='fas'
              onClick={generateSearchQueries}
            />
          </Box>
        </Box>
      </Gap>
    </Box>
  )
}

const S = {
  ThreadSuggestions: styled.div`
    width: 100%;
  `
}