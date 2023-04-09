import { Box, TextInput, Page } from '@avsync.live/formation'
import React from 'react'
import { useLayout_setActiveSwipeIndex } from 'redux-tk/layout/hook'
import { useLexi_searchQuery, useLexi_setSearchQuery } from 'redux-tk/lexi/hook'

interface Props {
  
}

export const SearchBar = React.memo(({ }: Props) => {
  const searchQuery = useLexi_searchQuery()
  const set_searchQuery = useLexi_setSearchQuery()

  const setActiveSwipeIndex = useLayout_setActiveSwipeIndex()

  return (
    <Page >
      <Box>
        <TextInput
          compact
          iconPrefix='fas'
          placeholder='Search'
          value={searchQuery}
          onChange={newValue => set_searchQuery(newValue)}
          canClear={!!searchQuery}
          onEnter={() => setActiveSwipeIndex(2)}
          buttons={searchQuery ? [
            {
              minimal: true,
              icon: 'search',
              iconPrefix: 'fas',
              onClick: () => setActiveSwipeIndex(2)
            },
          ] : undefined}
        />
      </Box>
    </Page>
  )
})

