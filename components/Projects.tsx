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
    const { activeSpace, projectsByGuid, addProjectToSpace, addProject } = useSpaces()

    const [value, set_value] = useState<Lists>([])

    useEffect(() => {
      if (activeSpace?.projectGuids) {
        set_value(activeSpace?.projectGuids.map(projectGuid => ({
          expanded: true,
          value: {
            item: {
              src: projectsByGuid[projectGuid].previewSrc,
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

    const [newProjectName, set_newProjectName] = useState('')
    const [newProjectDescription, set_newProjectDescription] = useState('')
  
    return (<>
        <TextInput
          placeholder='Search Space'
          value={search}
          onChange={newVal => set_search(newVal)}
          compact
          iconPrefix='fas'
          canClear={!!search}
          hideOutline
        />
      
      <LineBreak />

        <Item
          subtitle='Projects'
          
        >
          <Spacer />
          <Dropdown
            icon='plus'
            iconPrefix='fas'
            minimal
            circle
            items={[
              {
                children: <div onClick={e => e.stopPropagation()}>
                  <Box minWidth={13.5}>
                    <TextInput
                      value={newProjectName}
                      onChange={newValue => set_newProjectName(newValue)}
                      iconPrefix='fas'
                      label='Name'
                    
                    />
                    
                  </Box>
                </div>,
              },
              {
                children: <div onClick={e => e.stopPropagation()}>
                  <Box minWidth={13.5}>
                    <TextInput
                      value={newProjectDescription}
                      onChange={newValue => set_newProjectDescription(newValue)}
                      iconPrefix='fas'
                      label='Description'

                    />
                    
                  </Box>
                </div>,
              },
              {
                content: <>
                  <Button
                    {... {
                      text: 'Add Project',
                      icon: 'plus',
                      iconPrefix: 'fas',
                      minimal: true,
                      onClick: () => {
                        if (activeSpace?.guid) {
                          const guid = generateUUID()
                          addProject({
                            guid,
                            project: {
                              guid,
                              previewSrc: `https://image.pollinations.ai/prompt/${encodeURIComponent(newProjectDescription)}`,
                              name: newProjectName,
                              description: newProjectDescription,
                              groupGuids: []
                            }
                          })
                          addProjectToSpace({
                            spaceGuid: activeSpace.guid,
                            projectGuid: guid
                          })
                        }
                      }
                    }}
                  />
                  <AspectRatio
                    ratio={2}
                    backgroundSrc={`https://image.pollinations.ai/prompt/${encodeURIComponent(newProjectDescription)}`}
                    coverBackground
                  />
                </>
              }
            ]}
          />
        </Item>
    
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
                        <Box minWidth={13.5}>
                          <TextInput
                            value={newProjectName}
                            onChange={newValue => set_newProjectName(newValue)}
                            iconPrefix='fas'
                            compact
                            placeholder='Project name'
                            buttons={[
                              {
                                icon: 'arrow-right',
                                iconPrefix: 'fas',
                                minimal: true,
                                onClick: () => {
                                  if (activeSpace?.guid) {
                                    const guid = generateUUID()
                                    addProject({
                                      guid,
                                      project: {
                                        guid,
                                        name: newProjectName,
                                        groupGuids: []
                                      }
                                    })
                                    addProjectToSpace({
                                      spaceGuid: activeSpace.guid,
                                      projectGuid: guid
                                    })
                                  }
                                }
                              }
                            ]}
                          />
                        </Box>
                      </div>,
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