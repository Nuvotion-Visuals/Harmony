import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Groups } from 'components/Groups'
import { AspectRatio, Box, SpacesSidebar, generateUUID, Item, LineBreak, Dropdown, TextInput, Icon, Button, Gap } from '@avsync.live/formation'
import { useSpaces } from 'redux-tk/spaces/hook'
import { useRouter } from 'next/router'

interface Props {

}

export const SpaceSidebar = ({ }: Props) => {
  const router = useRouter()

  const { spaceGuid } = router.query

  const { spacesInfo, addSpace, setActiveSpaceGuid, spaceGuids, activeSpace, removeSpace, activeSpaceGuid, addGroup, addGroupToSpace } = useSpaces()

  const [activeSpaceIndex, set_activeSpaceIndex] = useState(spaceGuids.indexOf(spaceGuid as string))

  const [newSpaceName, set_newSpaceName] = useState(activeSpace?.name || '')

  useEffect(() => {
    set_activeSpaceIndex(spaceGuids.indexOf(spaceGuid as string))
  }, [spaceGuid])


  // useEffect(() => {
  //   if (spacesInfo.length > 0) {
  //     setActiveSpaceGuid(spaceGuids[activeSpaceIndex])
  //   }
  // }, [activeSpaceIndex])
  

  const [newDescription, set_newDescription] = useState('')
  const [newGroupName, set_newGroupName] = useState('')

  useEffect(() => {
    if (activeSpace?.name) {
      set_newSpaceName(activeSpace.name)
    }
    if (activeSpace?.description) {
      set_newDescription(activeSpace.description)
    }
  }, [activeSpace?.name]) 

  const add = () => {
    set_newGroupName('')
    if (activeSpace?.guid) {
      const guid = generateUUID()
      addGroup({
        guid,
        group: {
          guid,
          name: newGroupName,
          channelGuids: []
        }
      })
      addGroupToSpace({
        spaceGuid: activeSpace.guid,
        groupGuid: guid
      })
    }
  }

  return (<S.GroupsSidebar>
    <SpacesSidebar 
      activeSpaceIndex={activeSpaceIndex}
      onClickIndex={(index : number) => set_activeSpaceIndex(index)}
      spaces={[
        ...spacesInfo.map(space => (
          {
            name: space.name,
            href: `/spaces/${space.guid}`,
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
        {
          activeSpace?.name
            ? <>
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
                      text: 'Edit',
                      icon: 'edit',
                      iconPrefix: 'fas',
                      href: `/spaces/${activeSpaceGuid}/edit`
                    },
                    {
                      text: 'Remove',
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
              </>
            : <Box py={.75}>
                <Gap gap={.75}>
               
                <Item
                  title='Create a Space'
                  subtitle='Spaces organize your work into groups of channels.'
                />
                 <Item
                  text="Let's Work Together"
                  subtitle='Hi, my name is Lexi. I can help you with any project. Think of me as your virtual coworker.'
                />
                </Gap>
              </Box>
        }
 
      <Groups />

      {
        activeSpace?.name &&
          <Item
            content={<Box mr={-.5}>  
            <TextInput
              value={newGroupName}
              onChange={newValue => set_newGroupName(newValue)}
              iconPrefix='fas'
              compact
              placeholder='Add group'
              autoFocus
              hideOutline
              onEnter={add}
              buttons={[
                {
                  icon: 'plus',
                  iconPrefix: 'fas',
                  minimal: true,
                  onClick: add
                }
              ]}
            />
            </Box>}
          />
      }
    </Box>
  </S.GroupsSidebar>)
}

const S = {
  GroupsSidebar: styled.div`
    display: flex;
    height: calc(100% - var(--F_Header_Height));
    align-items: flex-start;
  `
}