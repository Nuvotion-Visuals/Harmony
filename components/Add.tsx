import { Button, Modal, Page, TextInput, generateUUID, Gap, AspectRatio, Box, Item, RichTextEditor } from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import styled from 'styled-components'

interface Props {
  
}

export const Add = ({ }: Props) => {
  const router = useRouter()

  const [name, set_name] = useState('')
  const [description, set_description] = useState('')
  const [prompt, set_prompt] = useState('')

  const { addSpace } = useSpaces()

  const [url, set_url] = useState('')

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
            router.push('/spaces')
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