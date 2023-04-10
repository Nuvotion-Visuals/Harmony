import { Box, Button, Gap, LineBreak, TextInput } from "@avsync.live/formation";
import React, { useState, useEffect } from "react";

import * as Types from './types'
import { KnowledgePanel } from "./KnowledgePanel";
import { SearchResult } from "./SearchResult";
import { Translation } from "./Translation";
import { Dictionary } from "./Dictionary";
import { PeopleAlsoAsk } from "./PeopleAlsoAsk";
import { FeaturedSnippet } from "./FeaturedSnippet";
import { PeopleAlsoSearch } from "./PeopleAlsoSearch";

export const Search = () => {
  const [searchResults, setSearchResults] = useState<Types.SearchResultsData | null>(null);
  const [query, set_query] = useState('');

  async function fetchData(query: string) {
    try {
      const response = await fetch(`/tools/search?q=${query}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSearch = () => {
    fetchData(query);
  }

  return (
    <div>
      <Box p={.5}>

      <TextInput 
        value={query}
        onChange={val => set_query(val)}
        onEnter={handleSearch}
        canClear={query !== ''}
        compact
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
      
      <Box px={.5}>
        <Gap>
          <Button 
            text='Search' 
            tab
          />
          <Button 
            text='Images' 
            secondary
            minimal
          />
          <Button 
            text='Videos' 
            secondary
            minimal
          />
          <Button 
            text='News' 
            secondary
            minimal
          />
           <Button 
            text='Maps' 
            secondary
            minimal
          />
        </Gap>
      </Box>

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
          searchResults?.data?.results && (
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
          <Gap>
          <Box wrap py={.25}>
            {
              searchResults?.data?.results && searchResults.data.results.results.map((result, index) => (
                <SearchResult key={index} result={result} />
              ))
            }
          </Box>
          <LineBreak />
        </Gap>
      }
     

      {
          searchResults?.data?.results?.people_also_search &&
          searchResults?.data?.results?.people_also_search?.length > 0 && (
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
    </div>
  );
};