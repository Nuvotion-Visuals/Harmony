import { Label, Spacer, Box, Gap, TextInput, Select, Button, LineBreak, ExpandableLists, Dropdown } from '@avsync.live/formation'
import React, { useState } from 'react'
import styled from 'styled-components'

interface Props {
  
}

export const ProjectAssets = ({ }: Props) => {
    const [value, set_value] = useState<any>([
      {
        expanded: true,
        value: {
          item: {
            icon: 'message',
            iconPrefix: 'fas',
            labelColor: 'none',
            text: 'Chat',
          },
          list: [
  
          ]
        }
      },
      {
        expanded: true,
        value: {
          item: {
            icon: 'image',
            iconPrefix: 'fas',
            labelColor: 'none',
            text: 'Images',
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
            text: 'Videos',
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
            text: 'Realms',
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
            text: 'Sounds',
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
            text: 'Music',
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
            text: 'Visuals',
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
            text: 'Documents',
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
            text: 'Emails',
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
            text: 'Story',
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
            text: 'Characters',
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
            text: 'Code',
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
  
    return (<>
        <TextInput
          placeholder='Search assets'
          value={search}
          onChange={newVal => set_search(newVal)}
          compact
          secondaryIcon='search'
          iconPrefix='fas'
          canClear
          hideOutline
        />
      
      <LineBreak />
    
      <ExpandableLists 
        value={value.map((expandableList, i) => ({
          ...expandableList,
          value: {
            item: {
              ...expandableList.value.item,
              children: <>
                <Spacer />
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