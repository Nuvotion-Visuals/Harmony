import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import * as Types from './types'
import { Box, Button, Gap, Item, Label, LabelColor, LineBreak, scrollToElementById } from '@avsync.live/formation'

interface Props extends Types.Image {
  
}

export const Image = (props: Props) => {
  const [expanded, set_expanded] = useState(false)

  const elementRef = useRef<HTMLImageElement>(null)

  const handleEnterFullScreen = () => {
    const element = elementRef.current

    if (element) {
      element.requestFullscreen()
    }
  }

  const handleExitFullScreen = () => {
    document.exitFullscreen()
  }

  const handleDoubleClick = () => {
    if (document.fullscreenElement) {
      handleExitFullScreen()
    } else {
      handleEnterFullScreen()
    }
  }

  useEffect(() => {
    if (expanded) {
      scrollToElementById(`image_${props.id}`, {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }
  }, [expanded])

  const downloadImage = () => {
    const link = document.createElement('a')
    link.download = `image_${props.id}`
    link.href = props.url
    link.click()
  }

  const getLabelFromMegapixels = (megapixels: number) => {
    if (megapixels < 1) {
      return { label: 'SD', labelColor: 'gray' }
    } else if (megapixels >= 1 && megapixels < 2) {
      return { label: 'HD', labelColor: 'red' }
    } else if (megapixels >= 2 && megapixels < 8) {
      return { label: 'Full HD', labelColor: 'orange' }
    } else if (megapixels >= 8 && megapixels < 33) {
      return { label: '4K', labelColor: 'green' }
    } else if (megapixels >= 33 && megapixels < 132) {
      return { label: '8K', labelColor: 'purple' }
    } else {
      return { label: '16K', labelColor: 'pink' }
    }
  }
  const megapixels = ((props.width * props.height) / 1000000).toFixed(1)
  const label = getLabelFromMegapixels(Number(megapixels))

  return (<>
    <S.ImageContainer focus={expanded} onClick={() => !expanded ? set_expanded(true) : null}>
      <div id={`image_${props.id}`} />
      {
        expanded &&
          <Item 
            subtitle={props.origin.website.domain}
          >
            {
              expanded &&
                <Box py={.25}>
                  <Button 
                    icon='times' 
                    iconPrefix='fas'
                    circle
                    hero
                    onClick={() => set_expanded(false)}
                    secondary
                  />
                </Box>
            }
          </Item>
      }
     
      <S.Image 
        src={expanded ? props.url : props.preview.url} 
        focus={expanded} 
        ref={elementRef}
        onClick={expanded ? handleEnterFullScreen : undefined}
        onDoubleClick={handleDoubleClick}
      />
      <Box pt={.25} mr={.25} wrap width='100%'>
        <Item 
          subtitle={`${props.height}×${props.width}`}         
          minimalIcon={!expanded}
        >
          {
            label.label !== 'SD' &&
              <Label labelColor={label.labelColor as LabelColor} label={label.label} />
          }
          
        </Item>
        <Item
          text={expanded ? undefined : props.origin.title}
          title={expanded ? props.origin.title : undefined}
          minimalIcon={!expanded}
        >
          {
            expanded && <>
              <Button 
                icon='download' 
                iconPrefix='fas' 
                circle 
                minimal
                onClick={downloadImage}
              />
             <Button icon='up-right-from-square' iconPrefix='fas'  minimal/>

            </>
          }
        </Item>

        <Item
          subtitle={props.origin.website.name}
          minimalIcon={!expanded}
        />
      </Box>
    </S.ImageContainer>
    {
      expanded  && <LineBreak />
    }
  </>)
}

const S = {
  ImageContainer: styled.div<{
    focus: boolean
  }>`
    width: ${props => props.focus ? '100%' : 'calc(50% - 1rem)'};
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: ${props => props.focus ? '0' : '.5rem'};
    cursor: pointer;
    padding-bottom: ${props => props.focus ? '1rem' : '0rem'};
  `,
  Image: styled.img<{
    focus: boolean
  }>`
    width: 100%;
    height: 100%;
    border-radius: ${props => props.focus ? '0' : '1rem'};
  `
}