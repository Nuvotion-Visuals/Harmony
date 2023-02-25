import { Label, Spacer, Box, Gap, TextInput, Select, Button, LineBreak, ExpandableLists, Dropdown, Item, ItemProps, Icon, generateUUID, AspectRatio } from '@avsync.live/formation'
import React, { useEffect, useState } from 'react'
import { useSpaces } from 'redux-tk/spaces/hook'
import styled from 'styled-components'

interface Props {
  
}

type List = {
  expanded: boolean,
  value: {
    item: ItemProps,
    list: ItemProps[]
  }
}

type Lists = List[]

export const Groups = ({ }: Props) => {
    const { activeSpace, groupsByGuid, addChannel, channelsByGuid, addChannelToGroup, removeChannel, removeGroup, removeChannelFromGroup, removeGroupFromSpace } = useSpaces()

    const [value, set_value] = useState<Lists>([])

    const spaceGroupGuids = activeSpace?.groupGuids
    const spaceChannelGuids = activeSpace?.groupGuids.map(groupGuid => groupsByGuid[groupGuid]?.channelGuids)

    useEffect(() => {
      if (activeSpace?.groupGuids) {
        set_value(activeSpace?.groupGuids.map((groupGuid, i) => ({
          expanded: value[i]?.expanded || false,
          value: {
            item: {
              icon: value[i]?.expanded ? 'caret-down' : 'caret-right',
              iconPrefix: 'fas',
              labelColor: 'none',
              subtitle: groupsByGuid[groupGuid].name,
            },
            list: groupsByGuid[groupGuid].channelGuids.map(channelGuid => ({
                icon: 'hashtag',
                iconPrefix: 'fas',
                labelColor: 'none',
                subtitle: channelsByGuid[channelGuid].name
            }))
          }
        })))
      }
     
    }, [activeSpace?.groupGuids, groupsByGuid, channelsByGuid, spaceGroupGuids, spaceChannelGuids])
  
    const [newDescription, set_newDescription] = useState('')
    const [newChannelName, set_newChannelName] = useState('')

    return (<>
        {/* <TextInput
          placeholder='Search Space'
          value={search}
          onChange={newVal => set_search(newVal)}
          compact
          iconPrefix='fas'
          canClear={!!search}
          hideOutline
        /> */}

      
      <ExpandableLists 
        
        value={value.map((expandableList, i) => ({
          ...expandableList,
          value: {
            item: {
              ...expandableList.value.item,
              children: <>
                <Spacer />
                <Dropdown
                  icon='plus'
                  iconPrefix='fas'
                  minimal
                  circle
                  items={[
                    {
                      children: <div onClick={e => e.stopPropagation()}>
                      <Box minWidth={13.5} py={.25}>  
                        <TextInput
                          value={newChannelName}
                          onChange={newValue => set_newChannelName(newValue)}
                          iconPrefix='fas'
                          autoFocus
                          compact
                          placeholder='New Channel name'
                          buttons={[
                            {
                              icon: 'arrow-right',
                              iconPrefix: 'fas',
                              minimal: true,
                              onClick: () => {
                                if (activeSpace?.guid) {
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
                              }
                            }
                          ]}
                        />
                        </Box>
                      </div>
                    },
                  ]}
                />
                <Dropdown
                  icon='ellipsis-vertical'
                  iconPrefix='fas'
                  minimal
                  circle
                  items={[
                    {
                      children: <div onClick={e => e.stopPropagation()}>
                        <Box minWidth={13.5} mt={.25}>
                          <TextInput
                            value={newChannelName}
                            onChange={newValue => set_newChannelName(newValue)}
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
                        <Box minWidth={13.5} mb={.25}>
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
                        removeGroupFromSpace({ spaceGuid: activeSpace?.guid, groupGuid: spaceGroupGuids[i]})

                      }
                    }
                  ]}
                />
              </>
            },
            list: expandableList.value.list
            // .filter(listItem => listItem.text.toLowerCase().includes(search.toLowerCase()))
            .map((listItem, listItemIndex1) =>
              ({
                ...listItem,
                onClick: () => {},
                children: <Dropdown 
                  icon='ellipsis-vertical'
                  iconPrefix='fas'
                  minimal
                  items={[
                    {
                      text: 'Rename',
                      icon: 'edit',
                      iconPrefix: 'fas',
                      onClick: () => {}
                    },
                    {
                      text: 'Delete',
                      icon: 'trash-alt',
                      iconPrefix: 'fas',
                      onClick: () => {
                        removeChannelFromGroup({ groudId: spaceGroupGuids[i], channelGuid: spaceChannelGuids[i][listItemIndex1]})
                        // removeChannel(spaceChannelGuids[i][listItemIndex1])
                        // set_value(value.map(valItem => ({
                        //   ...valItem,
                        //   value: {
                        //     ...valItem.value,
                        //     list: valItem.value.list.filter((val, listIndex) => listItemIndex1 !== listIndex)
                        //   }
                        // })))
                      }
                    }
                  ]}
                />
              })  
            )
          }
        }))}
        onExpand={index => set_value(value.map((item, i) => i === index ? ({...item, expanded: !item.expanded}) : item))}
      />
    </>
    )
}

const S = {
  Compose: styled.div`
    
  `
}