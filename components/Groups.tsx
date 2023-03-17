import { 
  Spacer, 
  Box, 
  TextInput, 
  ExpandableLists, 
  Dropdown, 
  ItemProps, 
  generateUUID, 
  LabelColor, 
  Item,
  useBreakpoint,
  Label
} from '@avsync.live/formation'
import React, { useEffect, useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'
import { useRouter } from 'next/router'
import { useLayout } from 'redux-tk/layout/hook'

type List = {
  expanded: boolean,
  value: {
    item: ItemProps,
    list: ItemProps[]
  }
}

type Lists = List[]

interface Props {
  locked: boolean
}

export const Groups = ({ locked }: Props) => {
    const router = useRouter()

    const { incrementActiveSwipeIndex } = useLayout()
    const { isDesktop } = useBreakpoint()

    const { 
      activeSpace, 
      activeSpaceGuid, 
      groupsByGuid, 
      addChannel, 
      channelsByGuid, 
      addChannelToGroup, 
      removeChannel, 
      removeChannelFromGroup, 
      removeGroupFromSpace,
      addGroup,
      addGroupToSpace,
      activeChannel
    } = useSpaces()

    const [newChannelName, set_newChannelName] = useState('')

    const [value, set_value] = useState<Lists>([])

    const spaceGroupGuids = activeSpace?.groupGuids
    const spaceChannelGuids = activeSpace?.groupGuids.map(groupGuid => groupsByGuid[groupGuid]?.channelGuids)

    const onAddChannel = (i : number) => {
      if (activeSpace?.guid && newChannelName) {
        const guid = generateUUID()
        addChannel({
          guid,
          channel: {
            guid,
            name: newChannelName,
            groupGuid: activeSpace?.groupGuids[i],
            assetGuids: [],
            threadGuids: []
          }
        })
        addChannelToGroup({
          groupGuid: activeSpace.groupGuids[i],
          channelGuid: guid
        })
      }
      set_newChannelName('')
    }

    const [newGroupName, set_newGroupName] = useState('')
    const onAddGroup = () => {
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

    useEffect(() => {
      if (activeSpace?.groupGuids) {
        set_value(activeSpace?.groupGuids.map((groupGuid, i) => {
          const groupsList = groupsByGuid[groupGuid].channelGuids.map(channelGuid => ({
      
            labelColor: ('none' as LabelColor),
            subtitle: channelsByGuid[channelGuid]?.name,
            href: `/spaces/${activeSpaceGuid}/groups/${groupGuid}/channels/${channelGuid}`,
            active: router.asPath === `/spaces/${activeSpaceGuid}/groups/${groupGuid}/channels/${channelGuid}`,
            onClick: () => {
              if (!isDesktop) {
                incrementActiveSwipeIndex()
              }
            }
          }))
          return ({
            expanded: value[i]?.expanded || true,
            value: {
              item: {
                labelColor: 'none',
                subtitle: groupsByGuid[groupGuid]?.name,
              },
              list: [
                ...groupsList,
                {
                  content: !locked && <Box><TextInput
                    value={newChannelName}
                    onChange={newValue => set_newChannelName(newValue)}
                    iconPrefix='fas'
                    compact
                    hideOutline
                    placeholder='Add channel'
                    onEnter={() => onAddChannel(i)}
                    buttons={[
                      {
                        icon: 'plus',
                        iconPrefix: 'fas',
                        minimal: true,
                        onClick: () => onAddChannel(i),
                        disabled: !newChannelName
                      }
                    ]}
                  />
                </Box>
                }
              ]
            }
          }
        )}
        ))
      }
     
    }, [activeSpace?.groupGuids, groupsByGuid, channelsByGuid, newChannelName, router.asPath, activeSpaceGuid, locked])
  
    return (<>
      <ExpandableLists 
        value={value.map((expandableList, i) => ({
          reorderId: `list_${i}`,
          ...expandableList,
          value: {
            item: {
              ...expandableList.value.item,
              icon: value[i]?.expanded ? 'caret-down' : 'caret-right',
              iconPrefix: 'fas',
              minimalIcon: true,
              children: <div onClick={e => e.stopPropagation()}>
                <Spacer />
                <Box>
                <Label
                  label={`${spaceGroupGuids?.length}`}
                  labelColor='gray'
                />  
                <Dropdown
                  icon='ellipsis-h'
                  iconPrefix='fas'
                  minimal
                  circle
                  items={[
                    {
                      text: 'Edit',
                      icon: 'edit',
                      iconPrefix: 'fas',
                      href: `/spaces/${activeSpaceGuid}/groups/${activeSpace?.groupGuids[i]}/edit`
                    },
                    {
                      text: 'Remove',
                      icon: 'trash-alt',
                      iconPrefix: 'fas',
                      onClick: () => {
                        if (activeSpace?.guid && spaceGroupGuids?.length) {
                          removeGroupFromSpace({ spaceGuid: activeSpace?.guid, groupGuid: spaceGroupGuids[i]})
                        }
                      }
                    }
                  ]}
                />
                </Box>
              </div>
            },
            list: expandableList.value.list
              .map((listItem, listItemIndex1) =>
                ({
                  ...listItem,
                  
                  children: listItem.subtitle && 
                    <div onClick={e => {
                      e.stopPropagation()
                      e.preventDefault()
                    }}>
                      <Box>
                        <Label
                          label={`${channelsByGuid[spaceChannelGuids[i][listItemIndex1]].threadGuids.length}`}
                          labelColor={channelsByGuid[spaceChannelGuids[i][listItemIndex1]].threadGuids.length > 0 ? 'purple' : 'gray'}
                        />  
                        <Dropdown 
                          icon={listItem.active ? 'ellipsis-h' : undefined}
                          iconPrefix='fas'
                          key={`dropdown_${listItemIndex1}`}
                          minimal
                          items={[
                            {
                              text: 'Edit',
                              icon: 'edit',
                              iconPrefix: 'fas',
                              href: `/spaces/${activeSpaceGuid}/groups/${activeSpace?.groupGuids[i]}/channels/${activeChannel?.guid}/edit`
                            },
                            {
                              text: 'Remove',
                              icon: 'trash-alt',
                              iconPrefix: 'fas',
                              onClick: () => {
                                if (spaceGroupGuids?.length && spaceChannelGuids?.length) {
                                  removeChannelFromGroup({ groupGuid: spaceGroupGuids[i], channelGuid: spaceChannelGuids[i][listItemIndex1]})
                                  removeChannel(spaceChannelGuids[i][listItemIndex1])
                                }
                              }
                            }
                          ]}
                        />
                      </Box>
                    </div>
                })  
              )
            }
        }))}
        onExpand={index => set_value(value.map((item, i) => i === index ? ({...item, expanded: !item.expanded}) : item))}
      />

      {
        !locked && activeSpace?.name &&
          <Item
            content={<Box>  
            <TextInput
              value={newGroupName}
              onChange={newValue => set_newGroupName(newValue)}
              iconPrefix='fas'
              compact
              placeholder='Add group'
              hideOutline
              onEnter={onAddGroup}
              buttons={[
                {
                  icon: 'plus',
                  iconPrefix: 'fas',
                  minimal: true,
                  onClick: onAddGroup
                }
              ]}
            />
            </Box>}
          />
      }
    </>
    )
}