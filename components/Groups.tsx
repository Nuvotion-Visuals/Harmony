import { 
  Spacer, 
  Box, 
  TextInput, 
  ExpandableLists, 
  Dropdown, 
  ItemProps, 
  generateUUID, 
  LabelColor, 
  Item
} from '@avsync.live/formation'
import React, { useEffect, useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'
import { useRouter } from 'next/router'

type List = {
  expanded: boolean,
  value: {
    item: ItemProps,
    list: ItemProps[]
  }
}

type Lists = List[]

interface Props {
  
}

export const Groups = ({ }: Props) => {
    const router = useRouter()

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
      addGroupToSpace
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
            assetGuids: []
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
            icon: ('hashtag' as IconName),
            iconPrefix: ('fas' as IconPrefix),
            labelColor: ('none' as LabelColor),
            subtitle: channelsByGuid[channelGuid]?.name,
            href: `/spaces/${activeSpaceGuid}/groups/${groupGuid}/channels/${channelGuid}`,
            active: router.asPath === `/spaces/${activeSpaceGuid}/groups/${groupGuid}/channels/${channelGuid}`
          }))
          return ({
            expanded: value[i]?.expanded || true,
            value: {
              item: {
                icon: value[i]?.expanded ? 'caret-down' : 'caret-right',
                iconPrefix: 'fas',
                labelColor: 'none',
                subtitle: groupsByGuid[groupGuid]?.name,
              },
              list: [
                ...groupsList,
                {
                  content: <Box mr={-.5}><TextInput
                    value={newChannelName}
                    onChange={newValue => set_newChannelName(newValue)}
                    iconPrefix='fas'
                    autoFocus
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
     
    }, [activeSpace?.groupGuids, groupsByGuid, channelsByGuid, newChannelName, router.asPath, activeSpaceGuid])
  
    return (<>
      <ExpandableLists 
        value={value.map((expandableList, i) => ({
          reorderId: `list_${i}`,
          ...expandableList,
          value: {
            item: {
              ...expandableList.value.item,
              children: <div onClick={e => e.stopPropagation()}>
                <Spacer />
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
                      <Dropdown 
                        icon={listItem.active ? 'ellipsis-vertical' : undefined}
                        iconPrefix='fas'
                        minimal
                        items={[
                          {
                            text: 'Edit',
                            icon: 'edit',
                            iconPrefix: 'fas',
                            onClick: () => {}
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
                    </div>
                })  
              )
            }
        }))}
        onExpand={index => set_value(value.map((item, i) => i === index ? ({...item, expanded: !item.expanded}) : item))}
      />

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