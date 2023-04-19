import { AutocompleteDropdown, Box, Button, Gap, Item, LineBreak, LoadingSpinner, Placeholders, Spacer, Tabs, Tags, TextInput } from "@avsync.live/formation";
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

interface Props {
  hero?: boolean,
  onChange?: (query: string) => void
}

export const Search = ({ hero } : Props) => {
  const [searchResults, setSearchResults] = useState<Types.SearchResultsData | null>(null);
  const [query, set_query] = useState('');

  const [loading, set_loading] = useState(false)

  async function fetchData(query: string) {
    set_loading(true)
    try {
      const response = await fetch(`/tools/search?q=${query}`);
      const data = await response.json();
      setSearchResults(data);
      localStorage.setItem('lastSearch', query);
      localStorage.setItem('searchResults', JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
    set_loading(false)
  }

  const handleSearch = (directSearch?: string) => {
    fetchData(directSearch || query);
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
  }, [query])

  useEffect(() => {
    const lastSearch = localStorage.getItem('lastSearch');
    const savedResults = localStorage.getItem('searchResults');
    if (lastSearch) {
      set_query(lastSearch);
    }
    if (savedResults) {
      setSearchResults(JSON.parse(savedResults));
    }
  }, []);

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
        items={suggestions.map((suggestion : any) => ({
          icon: 'search',
          subtitle: suggestion.suggestion,
          onClick: () => {
            setTimeout(() => {
              set_query(suggestion.suggestion)
              handleSearch(suggestion.suggestion)
            }, 1)
            // set_suggestions([])
          }
        }))}
      />
      </Box>
      </Box>

      <Box px={.5} width='calc(100% - 1rem)'>
          <Button 
            text='All' 
            icon='search'
            iconPrefix="fas"
          />
          <Button 
            text='Images' 
            secondary
            minimal
            icon="image"
            iconPrefix="fas"
          />
          <Button 
            text='Videos' 
            secondary
            minimal
            icon="video"
            iconPrefix="fas"
          />
        
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
          : !nothing
            ? <Content />
            : null
      }
    </S.Search>
  );
};

const S = {
  Search: styled.div`
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
  `
}