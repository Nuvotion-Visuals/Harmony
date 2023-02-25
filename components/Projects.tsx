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

export const Projects = ({ }: Props) => {
    const { activeSpace, projectsByGuid, addProjectToSpace, addProject, removeGroup, addGroup, addGroupToProject } = useSpaces()

    const [value, set_value] = useState<Lists>([])

    useEffect(() => {
      if (activeSpace?.projectGuids) {
        set_value(activeSpace?.projectGuids.map(projectGuid => ({
          expanded: true,
          value: {
            item: {
              labelColor: 'none',
              text: projectsByGuid[projectGuid].name,
            },
            list: [
    
            ]
          }
        })))
      }
     
    }, [activeSpace?.projectGuids])

    const [search, set_search] = useState('')

    const add = (index: number) => {
      set_value(value.map((expandableList, i) => i === index ? ({
        ...expandableList,
        expanded: true,
        value: {
          item: {
            ...expandableList.value.item,
            children: <Gap>
            <Label label={expandableList.value.list.length.toString()} labelColor='purple' />
              {
                expandableList.value.item.children
              }
            </Gap>
          },
          list: [
            {
              text: 'Untitled',
              src: 'https://api.avsync.live/uploads/medium_scenes_12e25f0362.png',
              labelColor: 'none',
              onClick: () => {},
              
            },
            ...expandableList.value.list
          ]
          
        }
      }) : expandableList)
      )
    }
  
    const [newDescription, set_newDescription] = useState('')
    const [newGroupName, set_newGroupName] = useState('')


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
                          value={newGroupName}
                          onChange={newValue => set_newGroupName(newValue)}
                          iconPrefix='fas'
                          autoFocus
                          compact
                          placeholder='New Group name'
                          buttons={[
                            {
                              icon: 'arrow-right',
                              iconPrefix: 'fas',
                              minimal: true,
                              onClick: () => {
                                if (activeSpace?.guid) {
                                  const guid = generateUUID()
                                  addGroup({
                                    guid,
                                    group: {
                                      guid,
                                      name: newGroupName,
                                      projectGuid: '',
                                      assetGuids: []
                                    }
                                  })
                                  addGroupToProject({
                                    projectGuid: activeSpace.guid,
                                    groupGuid: guid
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
                            value={newGroupName}
                            onChange={newValue => set_newGroupName(newValue)}
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
                        // if (activeSpaceGuid) {
                        //   removeGroup(activeSpaceGuid)
                        //   // router.push('/spaces')
                        // }

                      }
                    }
                  ]}
                />
              </>
            },
            list: expandableList.value.list.filter(listItem => listItem.text.toLowerCase().includes(search.toLowerCase())).map((listItem, listItemIndex1) =>
              ({
                ...listItem,
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
                      set_value(value.map(valItem => ({
                        ...valItem,
                        value: {
                          ...valItem.value,
                          list: valItem.value.list.filter((val, listIndex) => listItemIndex1 !== listIndex)
                        }
                      })))
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