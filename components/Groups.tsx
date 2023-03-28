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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSpaces_activeChannel, useSpaces_activeSpace, useSpaces_activeSpaceGuid, useSpaces_addChannel, useSpaces_addChannelToGroup, useSpaces_addGroup, useSpaces_addGroupToSpace, useSpaces_channelsByGuid, useSpaces_groupsByGuid, useSpaces_removeChannel, useSpaces_removeChannelFromGroup, useSpaces_removeGroupFromSpace } from 'redux-tk/spaces/hook'
// @ts-ignore
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'
import { useRouter } from 'next/router'
import { useLayout_incrementActiveSwipeIndex } from 'redux-tk/layout/hook'
import { Indicator } from './Indicator'
import { AddChannelInput } from './AddChannelInput'

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

export const Groups = React.memo(({ }: Props) => {
    const router = useRouter()

    const incrementActiveSwipeIndex = useLayout_incrementActiveSwipeIndex()
    const { isDesktop } = useBreakpoint()

    const activeSpace = useSpaces_activeSpace()
    const activeSpaceGuid = useSpaces_activeSpaceGuid()
    const groupsByGuid = useSpaces_groupsByGuid()
    const addChannel = useSpaces_addChannel()
    const channelsByGuid = useSpaces_channelsByGuid()
    const addChannelToGroup = useSpaces_addChannelToGroup()
    const removeChannel = useSpaces_removeChannel()
    const removeChannelFromGroup = useSpaces_removeChannelFromGroup()
    const removeGroupFromSpace = useSpaces_removeGroupFromSpace()
    const addGroup = useSpaces_addGroup()
    const addGroupToSpace = useSpaces_addGroupToSpace()
    const activeChannel = useSpaces_activeChannel()


    const [newChannelName, set_newChannelName] = useState('')

    const [value, set_value] = useState<Lists>([])

    const spaceGroupGuids = useMemo(() => activeSpace?.groupGuids, [activeSpace]);
    const spaceChannelGuids = useMemo(
      () => activeSpace?.groupGuids.map(groupGuid => groupsByGuid[groupGuid]?.channelGuids),
      [activeSpace, groupsByGuid]
    );

    const onAddChannel = useCallback((i: number) => {
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
    }, [activeSpace?.guid, newChannelName, addChannel, addChannelToGroup]);

    const [newGroupName, set_newGroupName] = useState('')
    const onAddGroup = useCallback(() => {
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
    }, [activeSpace?.guid, newGroupName, addGroup, addGroupToSpace]);

    useEffect(() => {
      if (activeSpace?.groupGuids) {
        set_value(prevValue => activeSpace?.groupGuids.map((groupGuid, i) => {
          const groupsList = groupsByGuid[groupGuid].channelGuids.map(channelGuid => ({
            icon: 'hashtag' as IconName,
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
            expanded: prevValue[i]?.expanded || true,
            value: {
              item: {
                labelColor: 'none',
                label: groupsByGuid[groupGuid]?.name,
              },
              list: [
                ...groupsList,
                {
                  content: (
                    !activeSpace?.locked && <Box>
                      <AddChannelInput
                        newChannelName={newChannelName}
                        setNewChannelName={set_newChannelName}
                        onAddChannel={onAddChannel}
                        index={i}
                      />
                    </Box>
                  ),
                },
              ],
            }
          })
        }))
      }
    }, [activeSpace?.groupGuids, groupsByGuid, channelsByGuid, activeSpaceGuid, isDesktop, incrementActiveSwipeIndex, newChannelName, addChannel, addChannelToGroup, router, removeChannel, removeChannelFromGroup, addGroup, addGroupToSpace, removeGroupFromSpace, activeChannel])

    const createAddChannelButtons = useCallback((i: number) => {
      return [
        {
          icon: 'plus' as IconName,
          iconPrefix: 'fas' as IconPrefix,
          minimal: true,
          onClick: () => onAddChannel(i),
          disabled: !newChannelName,
        },
      ]
    }, [onAddChannel, newChannelName])
    
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
                <Indicator
                  count={spaceGroupGuids?.length}
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
                        {
                          spaceChannelGuids &&
                            <Indicator
                              count={channelsByGuid[spaceChannelGuids[i][listItemIndex1]].threadGuids.length}
                            />
                        }
                        
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
        !activeSpace?.locked && activeSpace?.name &&
          <Item
            content={<Box>  
            <Box>
              <TextInput
                value={newGroupName}
                onChange={(newValue) => set_newGroupName(newValue)}
                iconPrefix="fas"
                compact
                placeholder="Add group"
                hideOutline
                onEnter={onAddGroup}
                buttons={createAddChannelButtons(0)} // Or any index, as needed.
              />
              </Box>
            </Box>}
          />
      }
    </>
    )
})