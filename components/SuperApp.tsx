import { NavSpaces, NavTabs, Item, Placeholders, Box, DateAndTimePicker, stringInArray, useBreakpoint, Gap, Button, Page, TextInput } from '@avsync.live/formation'
import router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { object } from 'yup'

import App from './App'
interface Props {
  
}

export const SuperApp = ({ }: Props) => {
  const [ activeSwipeIndex, setActiveSwipeIndex ] = useState(0)
  const activeGuid = 'test'
  const { isMobile, isTablet } = useBreakpoint()

  const [activeSpaceIndex, set_activeSpaceIndex] = useState(2)

  const incrementSwipeIndex = () => {
    if (isMobile) {
      setActiveSwipeIndex(1)
    }
    if (isTablet) {
      setActiveSwipeIndex(0)
    }
  }


  const renderFirstPage = () => {
    return <Box wrap height='100%'>
      <Box height='var(--F_Header_Height)' width='100%'/>
      {
        [
          {
            type: 'nav',
            name: 'Chat',
            icon: 'message',
            iconPrefix: 'fas',
            href: '/',
            active: router.asPath === '/'
          },
          {
            type: 'nav',
            name: 'Projects',
            icon: 'bookmark',
            iconPrefix: 'fas',
            href: '/projects',
            active: router.asPath === '/projects'
          },
          {
            type: 'nav',
            name: 'Tasks',
            icon: 'check-square',
            iconPrefix: 'fas',
            href: '/tasks',
            active: router.asPath === '/tasks'
          },
          {
            type: 'nav',
            name: 'People',
            icon: 'users',
            iconPrefix: 'fas',
            href: '/people',
            active: router.asPath === '/people'
          },
          {
            type: 'nav',
            name: 'Characters',
            icon: 'people-arrows',
            iconPrefix: 'fas',
            href: '/characters',
            active: router.asPath === '/characters'
          },
          {
            type: 'nav',
            name: 'Entities',
            icon: 'shapes',
            iconPrefix: 'fas',
            href: '/entities',
            active: router.asPath === '/entities'
          },
          {
            type: 'nav',
            name: 'Stories',
            icon: 'book',
            iconPrefix: 'fas',
            href: '/stories',
            active: router.asPath === '/stories'
          },
          {
            type: 'nav',
            name: 'Scenes',
            icon: 'film',
            iconPrefix: 'fas',
            href: '/scenes',
            active: router.asPath === '/scenes'
          },
          {
            type: 'nav',
            name: 'Realms',
            icon: 'door-open',
            iconPrefix: 'fas',
            href: '/realms',
            active: router.asPath === '/realms'
          },
          {
            type: 'title',
            title: 'Guide',
          },
          {
            type: 'nav',
            name: 'Theory',
            icon: 'flask',
            iconPrefix: 'fas',
            href: '/guide/theory',
            active: router.asPath === '/guide/theory'
          },
          {
            type: 'nav',
            name: 'How to script',
            icon: 'scroll',
            iconPrefix: 'fas',
            href: '/guide/how-to-script',
            active: router.asPath === '/guide/how-to-script'
          },
          {
            type: 'nav',
            name: 'Recipes',
            icon: 'book',
            iconPrefix: 'fas',
            href: '/guide/recipes',
            active: router.asPath === '/guide/recipes'
          },
          {
            type: 'nav',
            name: 'FAQ',
            icon: 'question',
            iconPrefix: 'fas',
            href: '/guide/faq',
            active: router.asPath === '/guide/faq'
          },
          {
            type: 'title',
            title: 'Scripts',
          },
          {
            type: 'nav',
            name: 'Identity',
            href: `/scripts/identity`,
            icon: 'fingerprint',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/identity',
          },
          {
            type: 'nav',
            name: 'Capabilities',
            href: `/scripts/capabilities`,
            icon: 'brain',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/capabilities',
          },
          {
            type: 'nav',
            name: 'Behavior',
            href: `/scripts/behavior`,
            icon: 'puzzle-piece',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/behavior',
          },
          {
            type: 'nav',
            name: 'Purpose',
            href: `/scripts/purpose`,
            icon: 'compass',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/purpose',
          },
          {
            type: 'nav',
            name: 'Specialization',
            href: `/scripts/specialization`,
            icon: 'graduation-cap',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/specialization',
          },
          {
            type: 'nav',
            name: 'Goals',
            href: `/scripts/goals`,
            icon: 'bullseye',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/goals',
          },
          {
            type: 'nav',
            name: 'Personality',
            href: `/scripts/personality`,
            icon: 'masks-theater',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/personality',
          },
          {
            type: 'nav',
            name: 'Communication',
            href: `/scripts/communication`,
            icon: 'comments',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/communication',
          },
          {
            type: 'nav',
            name: 'User experience',
            href: `/scripts/user-experience`,
            icon: 'mouse-pointer',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/user-experience',
          },
          {
            type: 'nav',
            name: 'Evaluation',
            href: `/scripts/evaluation`,
            icon: 'balance-scale',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/evaluation',
          },
          {
            type: 'nav',
            name: 'Brand',
            href: `/scripts/brand`,
            icon: 'tag',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/brand',
          },
          {
            type: 'nav',
            name: 'Evolution',
            href: `/scripts/evolution`,
            icon: 'dna',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/evolution',
          },
          {
            type: 'nav',
            name: 'Limitations',
            href: `/scripts/limitations`,
            icon: 'traffic-light',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/limitations',
          },
          {
            type: 'nav',
            name: 'Multimodality',
            href: `/scripts/multimodality`,
            icon: 'circle-nodes',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/multimodality',
          },
          {
            type: 'nav',
            name: 'Scaling',
            href: `/scripts/scaling`,
            icon: 'arrow-up-right-dots',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/scaling',
          },
          {
            type: 'nav',
            name: 'Decision making',
            href: `/scripts/decision-making`,
            icon: 'diagram-project',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/decision-making',
          },
          {
            type: 'nav',
            name: 'Cognition',
            href: `/scripts/cognition`,
            icon: 'brain',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/cognition',
          },
          {
            type: 'nav',
            name: 'Creativity',
            href: `/scripts/creativity`,
            icon: 'palette',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/creativity',
          },
          {
            type: 'nav',
            name: 'Context',
            href: `/scripts/context`,
            icon: 'earth-africa',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/context',
          },
          {
            type: 'nav',
            name: 'Memory',
            href: `/scripts/memory`,
            icon: 'database',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/memory',
          },
          {
            type: 'nav',
            name: 'Stategy',
            href: `/scripts/strategy`,
            icon: 'chess-queen',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/strategy',
          },
          {
            type: 'nav',
            name: 'Perception',
            href: `/scripts/perception`,
            icon: 'eye',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/perception',
          },
          {
            type: 'nav',
            name: 'Ethics',
            href: `/scripts/ethics`,
            icon: 'handshake-simple',
            iconPrefix: 'fas',
            active: router.asPath === '/scripts/ethics',
          },
          {
            type: 'title',
            title: 'Legal',
          },
          {
            type: 'nav',
            name: 'Terms of service',
            href: `/legal/terms-of-service`,
            icon: 'shield-halved',
            iconPrefix: 'fas',
            active: router.asPath === '/legal/terms-of-service'
          },
          {
            type: 'nav',
            name: 'Privacy policy',
            href: `/legal/privacy-policy`,
            icon: 'mask',
            iconPrefix: 'fas',
            active: router.asPath === '/legal/privacy-policy'
          }
        ].map(item => <Item {...item}/>)
      }
    </Box>
  }

  const renderSecondPage = () => {
    return <>
      <App></App>
    </>
  }

  const renderThirdPage = () => {
    return <></>
  }

  const router = useRouter()

  const [search, set_search] = useState('')
  const [url, set_url] = useState('')

  const submitSearch = () => {
    // set_open(true)
  }

  return (<S.SuperApp>
    <S.NavHeader>
      <Gap disableWrap>
        <S.Logo src='/assets/lexi-circle.png'/>
          <Page >
            <Box>
              <Button 
                icon='microphone'
                circle
                iconPrefix='fas'
                onClick={() => set_search('')}
                minimal
              />
              <TextInput
                compact
                icon='search'
                iconPrefix='fas'
                value={search}
                onChange={newValue => set_search(newValue)}
                onEnter={submitSearch}
              />
              <Button 
                icon='times'
                circle
                iconPrefix='fas'
                disabled={search === ''}
                onClick={() => set_search('')}
                minimal
              />
              <Button 
                icon='arrow-right'
                circle
                iconPrefix='fas'
                disabled={search === ''}
                secondary={search === ''}
                onClick={submitSearch}
              />
            </Box>
            
          </Page>
          {/* <Spacer />
          <Gap autoWidth disableWrap>
          <Dropdown
            options={[
              {
                "icon": "gear",
                "iconPrefix": "fas",
                "dropDownOptions": [
                  {
                    "icon": "fingerprint",
                    iconPrefix: 'fas',
                    "text": "Identity"
                  },
                  {
                    "icon": "palette",
                    iconPrefix: 'fas',
                    "text": "Appearance"
                  },
                  {
                    "icon": "volume-high",
                    "iconPrefix": "fas",
                    "text": "Sound"
                  }
                ]
              }
            ]}
        />
          {
            router.route !== 'login' && 
              <Box mr={.75}>
                <Button
                  text='Sign out'
                  onClick={() => router.push('/login')}
                  secondary={true}
                />
              </Box>
            }
          </Gap> */}
         
        </Gap>
    </S.NavHeader>
  <NavSpaces
    activeSwipeIndex={activeSwipeIndex}
    onSwipe={index => setActiveSwipeIndex(index)}
    spaces={[]}
    activeSpaceIndex={activeSpaceIndex}
    onSetActiveSpacesIndex={index => set_activeSpaceIndex(index)}
    channels={[]}
    firstPage={renderFirstPage()}
    secondPage={renderSecondPage()}
    thirdPage={renderThirdPage()}
    dropdownOptions={[
    {
        icon: 'ellipsis-v',
        iconPrefix: 'fas',
        dropDownOptions: [
        {
            icon: 'user-plus',
            iconPrefix: 'fas',
            text: 'Invite'
        },
        {
            icon: 'share',
            iconPrefix: 'fas',
            text: 'Share'
        },
        {
            icon: 'archive',
            iconPrefix: 'fas',
            text: 'Archive',
        },
        {
            icon: 'trash-alt',
            text: 'Trash',
            onClick: () => {
            // ecEvent_Delete({
            //   eventGuid: activeGuid
            // })
            }
        },
        ] 
    }
    ]}
    navsPrimary={[
    {
        icon: 'house',
        iconPrefix: router.route.includes(`/`) ? 'fas' : 'fas',
        title: 'Home',
        href: `/`,
        active: router.route.includes(`/`)
    },
    {
        icon: 'search',
        iconPrefix: router.route.includes(`/search`) ? 'fas' : 'fas',
        title: 'Search',
        href: `/search`,
        active: router.route.includes(`/search`)
    },
    {
        icon: 'bell',
        iconPrefix: router.route === `/notifications` ? 'fas' : 'fas',
        title: 'Notifications',
        href: '/notifications',
        active: router.route === `/notifications`
    },
    {
        icon: 'user',
        iconPrefix: router.route === `/profile` ? 'fas' : 'fas',
        title: 'Profile',
        href: '/profile',
        active: router.route === `/profile`
    }
    ]}
    navsSecondary={[
    {
        title: 'Discuss',
        icon: 'message',
        iconPrefix: 'fas',
        href: `/spaces/${activeGuid}`,
        active: stringInArray(router.route, [`/spaces/[guid]`]),
        hideOptions: true,
        onClick: incrementSwipeIndex
    },
    {
        title: 'Notes',
        icon: 'list',
        iconPrefix: 'fas',
        href: `/spaces/${activeGuid}/teams`,
        active: stringInArray(router.route, [`/spaces/[guid]/notes`]),
        hideOptions: true,
        onClick: incrementSwipeIndex
    },
    {
        title: 'Files',
        icon: 'folder',
        iconPrefix: 'fas',
        href: `/spaces/${activeGuid}/files`,
        hideOptions: true,
        active: stringInArray(router.route, [
        `/spaces/[guid]/files`,
        ]),
        onClick: incrementSwipeIndex
    },
    {
        title: 'Tasks',
        icon: 'check-square',
        iconPrefix: 'fas',
        href: `/spaces/${activeGuid}/tasks`,
        hideOptions: true,
        active: router.route.includes(`/spaces/[guid]/tasks`),
        onClick: incrementSwipeIndex
    },
    
    ]}
  />
  </S.SuperApp>)
}

const S = {
  SuperApp: styled.div`
    width: 100%;
  `,
  NavHeader: styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--F_Header_Height);
    z-index: 9;
    background: var(--F_Background);
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--F_Surface);
  `,
  Logo: styled.img`
    height: var(--F_Input_Height);
    width: var(--F_Input_Height);
    position: relative;
    left: .75rem;
  `
}