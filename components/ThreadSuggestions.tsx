import { Box, Button, Gap, Item, scrollToElementById, TextInput } from '@avsync.live/formation'
import { useLanguageAPI } from 'client/language/hooks'
import React, { useCallback, useEffect, useState } from 'react'
import { getStore } from 'redux-tk/store'  // Add the import for your Redux store
import styled from 'styled-components'
import { ResponseStream } from './ResponseStream'
import { select_activeChannel, select_activeSpace } from 'redux-tk/spaces/selectors'

interface FeedbackBoxProps {
  feedback: string
  set_feedback: (value: string) => void
  generateFollowUpMessage: () => void
}

const FeedbackBox: React.FC<FeedbackBoxProps> = React.memo(({ feedback, set_feedback, generateFollowUpMessage }) => {
  return (
    <Box width={'100%'} mx={1}>
      <TextInput
        value={feedback}
        onChange={val => set_feedback(val)}
        placeholder='Suggest new messages'
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
          onClick={() => generateFollowUpMessage()}
        />
      </Box>
    </Box>
  )
})

interface Props {
  onSend: (message: string) => void
  guid: string
}

export const ThreadSuggestions = React.memo(({ onSend, guid }: Props) => {
  const { language, response, loading, error, completed } = useLanguageAPI('')
  const { generate_followUpMessages } = language
  const [suggestedPrompts, set_suggestedPrompts] = useState([])
  const [feedback, set_feedback] = useState('')

  const generateFollowUpMessage = useCallback(async () => {
    const state = getStore().getState()
    const { threadsByGuid, messagesByGuid } = state.spaces
    const activeChannel = select_activeChannel(state)
    const activeSpace = select_activeSpace(state)

    let existingMessages = threadsByGuid?.[guid]?.messageGuids.map((messageGuid) => (
      `Existing message: ${messagesByGuid?.[messageGuid]?.message}`
    )).join('\n')

    generate_followUpMessages(`
      Space name: ${activeSpace?.name}
      Space description: ${activeSpace?.description}
      
      Channel name: ${activeChannel?.name}
      Channel description: ${activeChannel?.description}

      Thread name: ${threadsByGuid?.[guid]?.name}
      Thread description: ${threadsByGuid?.[guid]?.description}

      Existing messages in thread: \n${existingMessages}
      
      Your previous suggestions (optional): ${suggestedPrompts}

      User feedback (optional): ${feedback}
    `)
  }, [feedback, suggestedPrompts])

  useEffect(() => {
    if (response && completed) {
      try {
        let obj = JSON.parse(response)
        set_suggestedPrompts(obj.suggestions)
      } catch (e) {}
    }
  }, [response, completed])

  useEffect(() => {
    if (response) {
      scrollToElementById(`bottom_${guid}`, {
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      }) 
    }
  }, [response])

  return (
    <S.ThreadSuggestions>
      <Box width='100%'>
        <Gap gap={.25}>
          <ResponseStream
            text={response || ''}
            icon='paper-plane'
            onClick={(prompt) => {
              onSend(prompt)
              set_suggestedPrompts([])
              set_feedback('')
            }}
            loading={loading}
          />
            
         <FeedbackBox
            feedback={feedback}
            set_feedback={set_feedback}
            generateFollowUpMessage={generateFollowUpMessage}
          />
        </Gap>
      </Box>
    </S.ThreadSuggestions>
  )
})

const S = {
  ThreadSuggestions: styled.div`
    width: 100%;
  `
}
