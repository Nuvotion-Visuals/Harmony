import { Label, Box, Gap, TextInput, Select, Button, LineBreak, ExpandableLists, Dropdown } from '@avsync.live/formation'
import React, { Children, useEffect, useState } from 'react'
import styled from 'styled-components'

interface Props {
  
}

export const Compose = ({ }: Props) => {
    const [value, set_value] = useState<any>([
      {
        expanded: true,
        value: {
          item: {
            icon: 'image',
            iconPrefix: 'fas',
            labelColor: 'none',
            title: 'Images',
          },
          list: [
  
          ]
        }
      },
      {
        expanded: false,
        value: {
          item: {
            icon: 'video',
            iconPrefix: 'fas',
            labelColor: 'none',
            title: 'Videos',
          },
          list: [
          ]
        }
      },
      {
        expanded: false,
        value: {
          item: {
            icon: 'globe',
            iconPrefix: 'fas',
            labelColor: 'none',
            title: 'Realms',
          },
          list: [
          ]
        }
      },
      {
        expanded: false,
        value: {
          item: {
            icon: 'volume-up',
            iconPrefix: 'fas',
            labelColor: 'none',
            title: 'Sounds',
          },
          list: [
          ]
        }
      },
      {
        expanded: false,
        value: {
          item: {
            icon: 'music',
            iconPrefix: 'fas',
            labelColor: 'none',
            title: 'Music',
          },
          list: [
          ]
        }
      },
      {
        expanded: false,
        value: {
          item: {
            icon: 'bolt-lightning',
            iconPrefix: 'fas',
            labelColor: 'none',
            title: 'Visuals',
          },
          list: [
          ]
        }
      },
      {
        expanded: false,
        value: {
          item: {
            icon: 'file',
            iconPrefix: 'fas',
            labelColor: 'none',
            title: 'Documents',
          },
          list: [
          ]
        }
      },
      {
        expanded: false,
        value: {
          item: {
            icon: 'envelope',
            iconPrefix: 'fas',
            labelColor: 'none',
            title: 'Emails',
          },
          list: [
          ]
        }
      },
      {
        expanded: false,
        value: {
          item: {
            icon: 'book',
            iconPrefix: 'fas',
            labelColor: 'none',
            title: 'Story',
          },
          list: [ 
          ]
        }
      },
      {
        expanded: false,
        value: {
          item: {
            icon: 'users',
            iconPrefix: 'fas',
            labelColor: 'none',
            title: 'Characters',
          },
          list: [
          ]
        }
      },
    
      {
        expanded: false,
        value: {
          item: {
            icon: 'code',
            iconPrefix: 'fas',
            labelColor: 'none',
            title: 'Code',
          },
          list: [
          ]
        }
      }
    ])

    const [search, set_search] = useState('')

    const add = (index: number) => {
      set_value(value.map((expandableList, i) => i === index ? ({
        ...expandableList,
        expanded: true,
        value: {
          item: {
            ...expandableList.value.item,
            children: <Gap>
            <Label label={expandableList.value.list.length} labelColor='purple' />
              {
                expandableList.value.item.children
              }
            </Gap>
          },
          list: [
            {
              title: 'Untitled',
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
  
    return (<>
      <Box p={.75}>
        <TextInput
          placeholder='Search projects'
          value={search}
          onChange={newVal => set_search(newVal)}
          compact
          secondaryIcon='search'
          iconPrefix='fas'
          canClear
          buttons={[
            {
              icon: 'search',
              iconPrefix: 'fas',
              minimal: true
            }
          ]}
        />
      </Box>
      
      <LineBreak />
    
      <ExpandableLists 
        value={value.map((expandableList, i) => ({
          ...expandableList,
          value: {
            item: {
              ...expandableList.value.item,
              children: <Gap>
                <Label label={expandableList.value.list.length} labelColor={expandableList.value.list.length > 0 ? 'purple' : 'gray'} />
                <Button 
                  icon='plus' 
                  iconPrefix='fas' 
                  minimal 
                  onClick={(e) => {
                    add(i)
                    e.stopPropagation()
                  }} 
                  />
              </Gap>
            },
            list: expandableList.value.list.filter(listItem => listItem.title.toLowerCase().includes(search.toLowerCase())).map((listItem, listItemIndex1) =>
              ({
                ...listItem,
                children: <Dropdown 
                icon='ellipsis-vertical'
                iconPrefix='fas'
                minimal
                items={[
                  {
                    title: 'Rename',
                    icon: 'edit',
                    iconPrefix: 'fas',
                    onClick: () => {}
                  },
                  {
                    title: 'Delete',
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