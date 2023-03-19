import { Box, TextInput, Page } from '@avsync.live/formation'
import React from 'react'
import { useLayout } from 'redux-tk/layout/hook'
import { useLexi } from 'redux-tk/lexi/hook'

interface Props {
  
}

export const Search = React.memo(({ }: Props) => {
    const {
    searchQuery, set_searchQuery
  } = useLexi()

  const { setActiveSwipeIndex } = useLayout()

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

