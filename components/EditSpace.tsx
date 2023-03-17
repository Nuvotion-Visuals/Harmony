import { Button, Modal, Page, TextInput, generateUUID, Gap, AspectRatio, Box, Item, RichTextEditor } from '@avsync.live/formation'
import { language_generateGroups } from 'Lexi/System/Language/language'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import styled from 'styled-components'



interface Props {
  
}

export const EditSpace = ({ }: Props) => {
  const router = useRouter()

  const { activeSpace, updateSpace } = useSpaces()

  const [name, set_name] = useState(activeSpace?.name || '')
  const [description, set_description] = useState(activeSpace?.description || '')
  const [prompt, set_prompt] = useState(activeSpace?.description || '')

  const [url, set_url] = useState(activeSpace?.previewSrc)

  const generateGroups = () => {
    language_generateGroups(description, true, (message) => {
      console.log(`Groups generated: ${message}`);
      // Do something with the generated groups...
    }, (error) => {
      console.error(`Failed to generate groups: ${error}`);
      // Handle the error...
    });
  };

  return (<S.new>
    <Box  my={.25} >
    <Button
      icon='chevron-left'
      iconPrefix='fas'
      href={`/spaces/${activeSpace!.guid}`}
      minimal
    />
     <Item
      pageTitle='Edit Space'
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
         <Button
          icon='bolt-lightning'
          iconPrefix='fas'
          secondary
          circle
          hero
          blink={!!prompt && !!!url}
          onClick={() => {
            generateGroups()
          }}
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
            if (name && activeSpace?.guid) {
              updateSpace({
              guid: activeSpace.guid,
              space: {
                  guid: activeSpace.guid,
                  groupGuids: activeSpace.groupGuids,
                  name,
                  previewSrc: url,
                  description
              }
              })
              setTimeout(() => {
                router.push(`/spaces/${activeSpace.guid}`)
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