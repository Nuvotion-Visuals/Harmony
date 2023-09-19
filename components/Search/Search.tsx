import { AutocompleteDropdown, Box, Button, Gap, Grid, Item, LineBreak, LoadingSpinner, Placeholders, Spacer, Tabs, Tags, TextInput } from "@avsync.live/formation";
import React, { useState, useEffect } from "react";

import * as Types from './types'
import { KnowledgePanel } from "./KnowledgePanel";
import { SearchResult } from "./SearchResult";
import { Translation } from "./Translation";
import { Dictionary } from "./Dictionary";
import { PeopleAlsoAsk } from "./PeopleAlsoAsk";
import { FeaturedSnippet } from "./FeaturedSnippet";
import { PeopleAlsoSearch } from "./PeopleAlsoSearch";
import { SearchSuggestions } from "components/SearchSuggestions";
import styled from "styled-components";
import { Image } from "./Image";
import { universalSearch } from "redux-tk/search";
import { Harmony } from "./Harmony";

interface Props {
  hero?: boolean,
  onChange?: (query: string) => void
}

type ActiveType = 'All' | 'Images' | 'Videos' | 'Harmony'

export const Search = React.memo(({ hero } : Props) => {
  const [activeType, set_activeType] = useState<ActiveType>(typeof window !== undefined ? localStorage.getItem('activeType') as ActiveType : 'All')

  const [harmonySearchResults, setHarmonySearchResults] = useState<any>(null)

  useEffect(() => {
    localStorage.setItem('harmonySearchResults', JSON.stringify(harmonySearchResults))
  }, [harmonySearchResults])

  useEffect(() => {
    localStorage.setItem('activeType', activeType)
  }, [activeType])

  const [imageSearchResults, setImageSearchResults] = useState<Types.ImageSearchResultsData | null>(null);
  async function fetchImagesData(query: string) {
    set_loading(true)
    try {
      const response = await fetch(`/tools/search/images?q=${query}`);
      const data = await response.json();
      console.log(data)
      setImageSearchResults(data);
    } catch (error) {
      console.error(error);
    }
    set_loading(false)
  }

  const [searchResults, setSearchResults] = useState<Types.SearchResultsData | null>(null);
  const [query, set_query] = useState(typeof window !== undefined ? localStorage.getItem('query') || '' : '');

  const [loading, set_loading] = useState(false)

  async function fetchData(query: string) {
    set_loading(true)
    try {
      const response = await fetch(`/tools/search?q=${query}`);
      const data = await response.json();
      setSearchResults(data);
      localStorage.setItem('searchResults', JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
    set_loading(false)
  }

  const handleSearch = (directSearch?: string) => {
    switch(activeType) {
      case 'All':
        fetchData(directSearch || query);
        break
      case 'Images':
        fetchImagesData(directSearch || query)
        break
      case 'Harmony':
        if (directSearch || query) {
          fetchHarmonyData(directSearch || query)
        }
        break
    }
  }

  const [suggestions, set_suggestions] = useState<any>([])

  async function fetchSuggestions(query: string) {
    try {
      const response = await fetch(`/tools/suggest?q=${query}`);
      const data = await response.json();
      if (data.data.suggestions.length) {
        set_suggestions(data.data.suggestions);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (query) {
      (async () => {
        await fetchSuggestions(query)
      })()
    }
    else {
      set_suggestions([])
      setSearchResults(null)
    }
    localStorage.setItem('query', query)
  }, [query])

  useEffect(() => {
    const savedResults = localStorage.getItem('searchResults')
    const savedHarmonySearchResults = localStorage.getItem('harmonySearchResults')
  
    if (savedResults) {
      setSearchResults(JSON.parse(savedResults))
    }
  
  
    if (savedHarmonySearchResults) {
      setHarmonySearchResults(JSON.parse(savedHarmonySearchResults))
    }
  }, [])

  const Content = () => (
    <>
      <LineBreak />
        {
          searchResults?.data?.results?.knowledge_panel?.title && (
            <KnowledgePanel knowledge_panel={searchResults.data.results.knowledge_panel} />
          )
        }

        {
          searchResults?.data.results?.featured_snippet?.title &&
            <FeaturedSnippet featuredSnippet={searchResults?.data.results.featured_snippet} />
        }
        
        {
          !!searchResults?.data?.results.people_also_ask?.length && (
            <>
              <LineBreak />
              <PeopleAlsoAsk 
                peopleAlsoAsk={searchResults.data.results.people_also_ask} 
                onSearch={(searchTerm) => {
                  set_query(searchTerm)
                  fetchData(searchTerm)
                }}
              />
            </>
          
          )
        }

      <LineBreak />

      {
        searchResults?.data?.results?.translation && (
          <Translation translation={searchResults.data.results.translation} />
        )
      }

      {
        searchResults?.data?.results?.dictionary && (
          <Dictionary dictionary={searchResults.data.results.dictionary} />
        )
      }

      {
        searchResults?.data?.results?.results &&
          <Box wrap py={.25}>
            <Gap>

              {
                searchResults?.data?.results && searchResults.data.results.results.map((result, index) => (
                  <SearchResult key={index} result={result} />
                ))
              }
          <Box />

          </Gap>
          <LineBreak />
        </Box>
      }
     

      {
        !!searchResults?.data?.results?.people_also_search?.length && (
          <>
            <PeopleAlsoSearch 
              peopleAlsoSearch={searchResults.data.results.people_also_search} 
              onSearch={(searchTerm) => {
                set_query(searchTerm)
                fetchData(searchTerm)
              }}
            />
          </>
        
        )
      }
      </>
  )

  const nothing = !(query && !loading && searchResults?.data?.results?.results)

  useEffect(() => {
    if (activeType === 'Images') {
      fetchImagesData(query)
    } 
    else if (activeType === 'Harmony' && query !== '') {
      fetchHarmonyData(query)
    }
  }, [activeType])

  // Add Harmony search function
  function fetchHarmonyData(query: string) {
    set_loading(true)
    try {
      const searchResults = universalSearch(query)
      console.log(searchResults)
      setHarmonySearchResults(searchResults)
      localStorage.setItem('harmonySearchResults', JSON.stringify(searchResults))
    } catch (error) {
      console.error(error)
    }
    set_loading(false)
  }

  return (
    <S.Search>
      <Box p={.5} wrap>
      <Box width='100%'>
      <AutocompleteDropdown
        value={query}
        onChange={(val : string) => {
          set_query(val)
        }}
        onEnter={handleSearch}
        canClear={query !== ''}
        onClear={() => {
          set_query('')
          localStorage.setItem('lastSearch', '')
          localStorage.setItem('searchResults', '')
          setImageSearchResults(null)
        }}
        compact={!hero}
        placeholder='Search'
        buttons={[
          {
            icon: 'search',
            iconPrefix: 'fas',
            onClick: () => handleSearch(),
            minimal: true
          }
        ]}
        items={activeType === 'Harmony' ? [] : [
          ...(query !== '' ? [{
            icon: 'search',
            subtitle: query,
            onClick: async () => {
              setTimeout(() => {
                set_query(query)
                handleSearch(query)
              }, 1)
            }
          }] : []),
          ...suggestions.map((suggestion: any) => ({
            icon: 'search',
            subtitle: suggestion.suggestion,
            onClick: async () => {
              setTimeout(() => {
                set_query(suggestion.suggestion)
                handleSearch(suggestion.suggestion)
              }, 1)
            }
          }))
        ]}
      />
      </Box>
      </Box>

      <Box px={.5} width='calc(100% - 1rem)'>
          <Button 
            text='All' 
            secondary={activeType !== 'All'}
            minimal={activeType !== 'All'}
            icon='search'
            iconPrefix="fas"
            onClick={() => set_activeType('All')}
          />
          <Button 
            text='Images' 
            secondary={activeType !== 'Images'}
            minimal={activeType !== 'Images'}
            icon="image"
            iconPrefix="fas"
            onClick={() => set_activeType('Images')}
          />
          <Button 
            text='Harmony'
            secondary={activeType !== 'Harmony'}
            minimal={activeType !== 'Harmony'}
            icon="list"
            iconPrefix="fas"
            onClick={() => set_activeType('Harmony')}
          />
          {/* <Button 
            text='Videos' 
            secondary={activeType !== 'Videos'}
            minimal={activeType !== 'Videos'}
            icon="video"
            iconPrefix="fas"
            onClick={() => set_activeType('Videos')}
          /> */}
        
          <Spacer />
      </Box>
      
      <Box py={hero ? .5 : .25} width='100%'>
        <SearchSuggestions 
          query={query}
          onSend={(suggestedQuery) => {
            fetchData(suggestedQuery)
            set_query(suggestedQuery)
          }}
          guid={''}
        />
      </Box>

      {
        loading
          ? <Placeholders
              // @ts-ignore
              message={<LoadingSpinner />}
            />
          : !nothing && activeType === 'All'
            ? <Content />
            : null
      }
      <Box wrap>
        {
          activeType === 'Images' && imageSearchResults?.data?.results?.map((searchResult, index) =>
            <Image {...searchResult} />
          )
        }
        {
          (activeType === 'Harmony') && <Harmony searchResults={harmonySearchResults} query={query}/>
        }
      </Box>
    </S.Search>
  );
})

const S = {
  Search: styled.div`
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
  `
}

