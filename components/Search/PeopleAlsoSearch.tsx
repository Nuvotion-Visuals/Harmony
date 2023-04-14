import React from 'react'
import * as Types from './types'
import { Box, Gap, Item, LineBreak } from '@avsync.live/formation'

interface Props {
  peopleAlsoSearch: Types.PeopleAlsoSearch,
  onSearch: (searchTerm: string) => void
}

export const PeopleAlsoSearch = ({ peopleAlsoSearch, onSearch }: Props) => {
  return (<Box width='100%' py={.5} wrap>
    <Gap gap={.25}>
      {
        peopleAlsoSearch.map(peopleSearch => 
          <Item
            subtitle={peopleSearch.title}
            icon='search'
            iconPrefix='fas'
            onClick={() => onSearch(peopleSearch.title)}
          />
        )
      }
    </Gap>
  </Box>)
}