import { Box, Button, Gap, LineBreak, LoadingSpinner, Placeholders, Spacer, Tabs, Tags, TextInput } from "@avsync.live/formation";
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
    } catch (error) {
      console.error(error);
    }
    set_loading(false)
  }

  const handleSearch = () => {
    fetchData(query);
  }

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
    <div>
      <Box p={.5}>

      <TextInput 
        value={query}
        onChange={val => set_query(val)}
        onEnter={handleSearch}
        canClear={query !== ''}
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
      
      <Box px={.5} width='calc(100% - 1rem)'>
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
          {/* <Button 
            text='News' 
            secondary
            minimal
            icon="newspaper"
            iconPrefix="fas"
          /> */}
          <Spacer />
      </Box>
      
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
    </div>
  );
};