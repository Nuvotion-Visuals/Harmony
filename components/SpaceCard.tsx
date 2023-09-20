import { Box, Spacer, AspectRatio, Gap, Item } from '@avsync.live/formation'
import React from 'react'
import styled from 'styled-components'
import { Badge } from './Badge'

interface Props {
  previewSrc?: string,
  name?: string,
  groupsCount?: number,
  channelsCount?: number,
  threadsCount?: number,
  messageCount?: number,
  children?: React.ReactNode
}

export const SpaceCard = React.memo(({ previewSrc, name, groupsCount, channelsCount, threadsCount, messageCount, children }: Props) => {
  const SpaceName = React.memo(() => (<S.SpaceName>
    <Box>
      <Item pageTitle={name}>
      { children }

      </Item>
      </Box>

      </S.SpaceName>
    ))

  return (<S.SpaceCard>
    {
      previewSrc &&
        <>
          <S.OverlayContainer>
              <S.Overlay>
                <SpaceName />
              </S.Overlay>
              <S.OverlayBottom>
              <S.SpaceStats>
                <Spacer />
                <Badge 
                  groupsCount={groupsCount || 0}
                  channelsCount={channelsCount || 0}
                  threadsCount={threadsCount || 0}
                  messageCount={messageCount || 0}
                />
              </S.SpaceStats>
              
              </S.OverlayBottom>
              <AspectRatio
                ratio={16/9}
                backgroundSrc={previewSrc}
                coverBackground
              />
          </S.OverlayContainer>
        </>
    }
    {
      !name && <Box py={.75}>
        <Gap gap={.75}>
          <Item
            title='Create a Space'
            subtitle='Spaces organize your work into groups of channels.'
          />
          <Item
            text="Let's Work Together"
            subtitle='Hi, my name is Harmony. I can help you with any project. Think of me as your virtual coworker.'
          />
        </Gap>
      </Box>
    }
  </S.SpaceCard>)
})

const S = {
  SpaceCard: styled.div`
    width: 100%;
  `,
  OverlayContainer: styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    top: 0;
    z-index: 2;
  `,
  Overlay: styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 3;
    background: linear-gradient(to top, hsla(0, 0%, 7%, 0) 0%, hsla(0, 0%, 7%,.4) 40%, hsla(0, 0%, 7%,.5) 100%);
  `,
  OverlayBottom: styled.div`
    position: absolute;
    bottom: 0;
    z-index: 1;
    width: 100%;
    background: linear-gradient(to bottom, hsla(0, 0%, 7%, 0) 0%, hsla(0, 0%, 7%,.4) 40%, hsla(0, 0%, 7%,.5) 100%);
  `,
  SpaceName: styled.div`
    width: 100%;
  `,
  SpaceStats: styled.div`
    width: calc(100% - .75rem);
    height: 2rem;
    padding: .25rem;
    display: flex;
  `,
  PosterContainer: styled.div`
    border-radius: .75rem;
    overflow: hidden;
    width: 100%;
  `
}