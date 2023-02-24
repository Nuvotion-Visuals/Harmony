import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Projects } from 'components/Projects'
import { AspectRatio, Box, SpacesSidebar, generateUUID, Item, LineBreak, Dropdown, TextInput, Icon } from '@avsync.live/formation'
import { useSpaces } from 'redux-tk/spaces/hook'
import { useRouter } from 'next/router'

interface Props {
  
}

export const SpaceSidebar = ({ }: Props) => {
  const router = useRouter()
  const { spacesInfo, addSpace, setActiveSpaceGuid, spaceGuids, activeSpace, removeSpace, activeSpaceGuid } = useSpaces()

  const [activeSpaceIndex, set_activeSpaceIndex] = useState(0)

  const [newSpaceName, set_newSpaceName] = useState(activeSpace?.name || '')


  useEffect(() => {
    if (spacesInfo.length > 0) {
      setActiveSpaceGuid(spaceGuids[activeSpaceIndex])
    }
  }, [activeSpaceIndex])

  const [newDescription, set_newDescription] = useState('')

  useEffect(() => {
    if (activeSpace?.name) {
      set_newSpaceName(activeSpace.name)
    }
    if (activeSpace?.description) {
      set_newDescription(activeSpace.description)
    }
  }, [activeSpace?.name]) 

  return (<S.ProjectsSidebar>
    <SpacesSidebar 
      activeSpaceIndex={activeSpaceIndex}
      onClickIndex={(index : number) => set_activeSpaceIndex(index)}
      spaces={[
        ...spacesInfo.map(space => (
          {
            name: space.name,
            src: space.previewSrc
          }
        )),
        {
          icon: 'plus',
          iconPrefix: 'fas',
          href: '/spaces/add'
        }
      ]}
    />
    <Box wrap width='100%'>
      {
        activeSpace?.previewSrc &&
          <AspectRatio
            ratio={2}
            backgroundSrc={activeSpace.previewSrc}
            coverBackground
          />
      }
     
        <Item
          pageTitle={activeSpace?.name}
        >
          <Dropdown
            icon='ellipsis-vertical'
            iconPrefix='fas'
            minimal
            circle
            items={[
              {
                children: <div onClick={e => e.stopPropagation()}>
                  <Box minWidth={13.5}>
                    <TextInput
                      value={newSpaceName}
                      onChange={newValue => set_newSpaceName(newValue)}
                      iconPrefix='fas'
                      label='Name'
                      buttons={[
                        {
                          icon: 'save',
                          iconPrefix: 'fas',
                          minimal: true,
                          onClick: () => {
                            // create team
                          }
                        }
                      ]}
                    />
                  </Box>
                </div>,
              },
              {
                children: <div onClick={e => e.stopPropagation()}>
                  <Box minWidth={13.5}>
                    <TextInput
                      value={newDescription}
                      onChange={newValue => set_newDescription(newValue)}
                      iconPrefix='fas'
                      label='Description'
                      buttons={[
                        {
                          icon: 'save',
                          iconPrefix: 'fas',
                          minimal: true,
                          onClick: () => {
                            // create team
                          }
                        }
                      ]}
                    />
                  </Box>
                </div>,
              },
              {
                text: 'Delete',
                icon: 'trash-alt',
                iconPrefix: 'fas',
                onClick: () => {
                  if (activeSpaceGuid) {
                    removeSpace(activeSpaceGuid)
                    router.push('/spaces')
                  }

                }
              }
            ]}
          />
        </Item>
        
      <LineBreak />
      <Projects />
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