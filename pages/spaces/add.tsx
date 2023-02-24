import { Button, Modal, Page, TextInput, generateUUID, Gap, AspectRatio } from '@avsync.live/formation'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import styled from 'styled-components'

interface Props {
  
}

const Add = ({ }: Props) => {
  const router = useRouter()

  const [name, set_name] = useState('')
  const [description, set_description] = useState('')

  const { addSpace } = useSpaces()

  const [url, set_url] = useState('')

  return (<S.new>
    <Modal
      title='Add Space'
      icon='plus'
      iconPrefix='fas'
      fullscreen
      size='lg'
      isOpen
      onBack={() => router.push('/spaces')}
      content={
        <Page>
          <Gap>
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
          />
          <Gap disableWrap>
            <TextInput 
              label='Description'
              value={description}
              onChange={newValue => set_description(newValue)}

            />
            <Button
              text='Generate'
              hero
              disabled={description === ''}
              blink={!!description && !!!url}
              onClick={() => {
                set_url(`https://image.pollinations.ai/prompt/${encodeURIComponent(description)}`)
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
                  projectGuids: [],
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
        </Page>
      }
    />

  </S.new>)
}

export default Add

const S = {
  new: styled.div`
    
  `
}