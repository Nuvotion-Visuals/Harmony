import { Box, Button, Gap, Item, LineBreak, LoadingSpinner, Placeholders, Spacer, Tabs, Tags, TextInput } from "@avsync.live/formation";
import React, { useState, useEffect } from "react";

import * as Types from './types'
import { KnowledgePanel } from "./KnowledgePanel";
import { SearchResult } from "./SearchResult";
import { Translation } from "./Translation";
import { Dictionary } from "./Dictionary";
import { PeopleAlsoAsk } from "./PeopleAlsoAsk";
import { FeaturedSnippet } from "./FeaturedSnippet";
import { PeopleAlsoSearch } from "./PeopleAlsoSearch";
import { Logo } from "components/Logo";
import { SearchSuggestions } from "components/SearchSuggestions";
import styled from "styled-components";

interface Props {
  hero?: boolean
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

  const handleSearch = () => {
    fetchData(query);
  }

  const [suggestions, set_suggestions] = useState<any>([])

  async function fetchSuggestions(query: string) {
    try {
      const response = await fetch(`/tools/suggest?q=${query}`);
      const data = await response.json();
      set_suggestions(data.data.suggestions);
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
      <TextInput 
        value={query}
        onChange={val => set_query(val)}
        onEnter={handleSearch}
        canClear={query !== ''}
        onClear={() => {
          localStorage.setItem('lastSearch', '')
        }}
        compact={!hero}
        placeholder='Search'
        buttons={[
          {
            icon: 'search',
            iconPrefix: 'fas',
            onClick: handleSearch,
            minimal: true
          }
        ]}
      />
      </Box>
      
      
      
      </Box>

      {
        !!suggestions?.length && <Box wrap width='100%' pb={.5}>
          <Gap gap={.25}>
            { 
              suggestions.map((suggestion: any) => 
                <Item 
                  icon='search'
                  subtitle={suggestion.suggestion} 
                  onClick={() => {
                    set_query(suggestion.suggestion)
                    handleSearch()
                    set_suggestions([])
                  }}  
                />
              )
            }
          </Gap>
      </Box>
      }
      
      {/* <Box px={.5} width='calc(100% - 1rem)'>
          <Button 
            text='All' 
            tab={!nothing}
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
      </Box> */}
      
      <Box py={.5} width='100%'>
        <SearchSuggestions 
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