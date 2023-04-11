import { AspectRatio, Button, Gap, Grid, Page, TextInput, useBreakpoint } from '@avsync.live/formation'
import React, { useState } from 'react'
import { useSpaces_spacesInfo } from 'redux-tk/spaces/hook'
import styled from 'styled-components'
import MyLink from './Link'
import { SpaceCard } from './SpaceCard'

interface Props {
  
}

const SpacesDashboard = ({ }: Props) => {
  const spacesInfo = useSpaces_spacesInfo()
    const { isMobile, isDesktop } = useBreakpoint()
    const [searchQuery, set_searchQuery] = useState('')
  return (<S.SpacesDashboard>
    <S.Inner isDesktop={isDesktop}>
      <Gap gap={isMobile ? 1 : 1.5}>
      <Page noPadding>
        <TextInput
          iconPrefix='fas'
          placeholder='Search'
          value={searchQuery}
          onChange={(newValue: string) => set_searchQuery(newValue)}
          canClear
          buttons={[
            {
              minimal: true,
              icon: 'search',
              iconPrefix: 'fas',
              onClick: () => {

              }
            },
          ]}
        />
      </Page>
    
    <Grid maxWidth={isMobile ? 10 : 18} gap={isMobile ? .75 : 1.5} >
      {
        spacesInfo.filter(space => space.name.toLowerCase().includes(searchQuery.toLowerCase())).map(space =>
          <MyLink href={`/spaces/${space.guid}`}>
          <S.CardContainer>
          <SpaceCard
            {...space}
          />
          </S.CardContainer>

          </MyLink>

        )
      }
      <MyLink href='/spaces/add'>
      <S.AddContainer>
        <AspectRatio ratio={16/9}>
          <Button icon='plus' iconPrefix='fas' hero minimal />
        </AspectRatio>
      </S.AddContainer>

      </MyLink>
     
    </Grid>
    </Gap>
    </S.Inner>
   
  </S.SpacesDashboard>)
}

export default SpacesDashboard

const S = {
  SpacesDashboard: styled.div`
    width: calc(100% - 1.5rem);
    min-height: calc(100vh - 1.5rem);
    padding: .75rem;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--F_Background_Alternating);
  `,
  Inner: styled.div<{
    isDesktop: boolean
  }>`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: ${props => props.isDesktop ? '90vw' : 'none'};
  `,
  CardContainer: styled.div`
    border-radius: 1rem;
    background: var(--F_Surface_0);
    * {
      cursor: pointer;
    }
  `,
  AddContainer: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    border-radius: 1rem;
    box-shadow: var(--F_Outline);
    &:hover {
    box-shadow: var(--F_Outline_Hover);

    }
  `
}