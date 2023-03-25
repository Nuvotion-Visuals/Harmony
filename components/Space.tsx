import { AspectRatio, Box, Item, Page, RichTextEditor } from '@avsync.live/formation'
import React from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import { Badge } from './Badge'

interface Props {
  
}

export const Space = ({ }: Props) => {
  const { activeSpace, activeSpaceStats } = useSpaces()
  
  return (<S.Space>
    <Page>
    {
      activeSpace?.previewSrc &&
      <Box pt={.75} mb={.25}>
          
          <AspectRatio
            backgroundSrc={activeSpace?.previewSrc}
            ratio={3}
            coverBackground
            borderRadius={1}
          />
      </Box>
    }
    <Item pageTitle={activeSpace?.name} src={activeSpace?.previewSrc}>
      {/* @ts-ignore */}
      <Badge
        {...activeSpaceStats}
      />
    </Item>
    <RichTextEditor
      value={activeSpace?.description || ''}
      readOnly
    />
    </Page>
    
  </S.Space>)
}

const S = {
  Space: styled.div`
    width: 100%;
  `
}