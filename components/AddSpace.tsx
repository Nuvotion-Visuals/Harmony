import { Button, Modal, Page, TextInput, generateUUID, Gap, AspectRatio, Box, Item, RichTextEditor } from '@avsync.live/formation'
import { getWebsocketClient } from 'Lexi/System/Connectvity/websocket-client'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { Message as MessageProps } from 'redux-tk/spaces/types'

interface Props {
  
}

export const AddSpace = ({ }: Props) => {
  const router = useRouter()

  const [name, set_name] = useState('')
  const [description, set_description] = useState('')
  const [prompt, set_prompt] = useState('')

  const { addSpace } = useSpaces()

  const [url, set_url] = useState('')

  const ws = getWebsocketClient()
  
  useEffect(() => {
    
    ws.onmessage = (ev) => {
      const wsmessage = JSON.parse(ev.data.toString())
      if (wsmessage.type === 'pong') {
        // console.log(wsmessage)
      }
  
      const { 
        guid, 
        message, 
        type,
        conversationId,
        parentMessageId,
        chatGptLabel,
        promptPrefix,
        userLabel,
      } = JSON.parse(ev.data.toString())
      console.log(type, message)
  
      if (type === 'GENERATED_response') {
        const newMessage ={
          message,
          conversationId,
          parentMessageId,
          userLabel: 'Lexi'
        } as MessageProps
  
        console.log(newMessage)
      }

      
      if (type === 'GENERATED_partial-response') {
        const newMessage ={
          message,
          conversationId,
          parentMessageId,
          userLabel: 'Lexi'
        } as MessageProps
  
        console.log(newMessage)
      }
      
    }
  }, [])

  return (<S.new>
    <Box  my={.25} >
    <Button
      icon='chevron-left'
      iconPrefix='fas'
      href={'/spaces'}
      minimal
    />
     <Item
      pageTitle='Add Space'
    />
    </Box>
   
    <Box px={.75}>
       
        <Gap gap={.75}>
        {
        url &&
            <AspectRatio
            ratio={2}
            backgroundSrc={url}
            coverBackground
            />
        }
        <TextInput 
          label='Name'
          value={name}
          onChange={newValue => set_name(newValue)}
          autoFocus
        />
        <RichTextEditor
          placeholder='Description'
          value={description}
          onChange={newValue => set_description(newValue)}
        />
        <Gap disableWrap>

        <TextInput 
          label='Prompt'
          value={prompt}
          onChange={newValue => set_prompt(newValue)}
        />
        <Button
          icon='bolt-lightning'
          iconPrefix='fas'
          secondary
          circle
          hero
          disabled={prompt === ''}
          blink={!!prompt && !!!url}
          onClick={() => {
          set_url(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`)
          }}
        />
        </Gap>
        
        <Button
        hero
        expand
        primary={name !== ''}
        disabled={name === ''}
        onClick={() => {
            const guid = generateUUID()
            addSpace({
            guid,
            space: {
                guid,
                name,
                groupGuids: [],
                previewSrc: url,
                description
            }
            })
            setTimeout(() => {
              router.push(`/spaces/${guid}`)
            }, 1)
        }}
        text='Add'
        icon='plus'
        iconPrefix='fas'
        />
        </Gap>
    </Box>
  </S.new>)
}


const S = {
  new: styled.div`
    
  `
}