import { Button, Modal, Page, TextInput, generateUUID, Gap, AspectRatio, Box, Item, RichTextEditor } from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import styled from 'styled-components'

interface Props {
  
}

export const EditChannel = ({ }: Props) => {
  const router = useRouter()
  const { channelGuid, groupGuid } = router.query

  const { activeSpaceGuid, updateChannel, channelsByGuid, activeThreadGuid } = useSpaces()

  const activeChannel = channelsByGuid[channelGuid as string]

  const [name, set_name] = useState(activeChannel?.name || '')
  const [description, set_description] = useState(activeChannel?.description || '')
  const [prompt, set_prompt] = useState(activeChannel?.description || '')

  const [url, set_url] = useState(activeChannel?.previewSrc)

  return (<S.new>
    <Box  my={.25} >
    <Button
      icon='chevron-left'
      iconPrefix='fas'
      href={'/spaces'}
      minimal
    />
     <Item
      pageTitle='Edit Channel'
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
          set_url(`https://lexi.studio/image/prompt/${encodeURIComponent(prompt)}`)
          }}
        />
        </Gap>
        
        <Button
          hero
          expand
          primary={name !== ''}
          disabled={name === ''}
          onClick={() => {
            if (name && activeChannel?.guid) {
              updateChannel({
              guid: activeChannel.guid,
              channel: {
                  guid: activeChannel.guid,
                  assetGuids: [],
                  threadGuids: activeChannel.threadGuids,
                  groupGuid: activeChannel.groupGuid,
                  name,
                  previewSrc: url,
                  description
              }
              })
              router.push(`/spaces/${activeSpaceGuid}/groups/${groupGuid}/channels/${channelGuid}`)
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