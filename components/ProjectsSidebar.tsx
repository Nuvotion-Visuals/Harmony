import React, { useState } from 'react'
import styled from 'styled-components'

import { ProjectAssets } from 'components/ProjectAssets'
import { AspectRatio, Box, SpacesSidebar } from '@avsync.live/formation'

interface Props {
  
}

export const ProjectsSidebar = ({ }: Props) => {

  

  const [spaces, set_spaces] = useState([
    {
      name: 'Lexi',
      src: '/assets/lexi-circle.png',
    },
    {
      name: 'AVsync.LIVE Artists Chicago',
      src: 'https://api.avsync.live/uploads/avsync_logo_border_45b816cca1.png',
    },
    {
      name: 'Glitch Artists Chicago',
      src: 'https://api.avsync.live/uploads/Mosh_Banner_626d750b85.png',
    },
  {
      name: '',
      icon: 'plus',
      iconPrefix: 'fas'
    },
  ])

  const [activeSpaceIndex, set_activeSpaceIndex] = useState(0)

  return (<S.ProjectsSidebar>
    <Box></Box>
    <SpacesSidebar 
      activeSpaceIndex={activeSpaceIndex}
      onClickIndex={(index : number) => set_activeSpaceIndex(index)}
      spaces={spaces}
    />
    <Box wrap width='100%'>
      <AspectRatio ratio={2/1} backgroundSrc='/assets/lexi-banner.png' coverBackground></AspectRatio>
      <ProjectAssets />

    </Box>
  </S.ProjectsSidebar>)
}

const S = {
  ProjectsSidebar: styled.div`
    display: flex;
    height: calc(100% - var(--F_Header_Height));
    align-items: flex-start;
  `
}