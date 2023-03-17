import { Button, Modal, Page, TextInput, generateUUID, Gap, AspectRatio, Box, Item, RichTextEditor } from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import styled from 'styled-components'

interface Props {
  
}

export const EditGroup = ({ }: Props) => {
  const router = useRouter()
  const { groupGuid } = router.query

  const { activeSpaceGuid, updateGroup, groupsByGuid } = useSpaces()

  const activeGroup = groupsByGuid[groupGuid as string]

  const [name, set_name] = useState(activeGroup?.name || '')
  const [description, set_description] = useState(activeGroup?.description || '')
  const [prompt, set_prompt] = useState(activeGroup?.description || '')

  const [url, set_url] = useState(activeGroup?.previewSrc)

  return (<S.new>
    <Box  my={.25} >
    <Button
      icon='chevron-left'
      iconPrefix='fas'
      href={`/spaces/${activeSpaceGuid}/groups/${activeGroup.guid}`}
      minimal
    />
     <Item
      pageTitle='Edit Group'
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
            if (name && activeGroup?.guid) {
              updateGroup({
              guid: activeGroup.guid,
              group: {
                  guid: activeGroup.guid,
                  channelGuids: activeGroup.channelGuids,
                  name,
                  previewSrc: url,
                  description
              }
              })
              setTimeout(() => {
                router.push(`/spaces/${activeSpaceGuid}/groups/${activeGroup.guid}`)
              }, 1)
            }
          }}
          text='Save'
          icon='save'
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