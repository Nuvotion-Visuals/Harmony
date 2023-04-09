import { TextInput } from "@avsync.live/formation";
import React, { useState, useEffect } from "react";

interface SearchResult {
  title: string;
  description: string;
  url: string;
  is_sponsored: boolean;
  favicons: {
    high_res: string;
    low_res: string;
  };
}

interface Translation {
  source_language: string;
  target_language: string;
  source_text: string;
  target_text: string;
}

interface Dictionary {
  word: string;
  phonetic: string;
  audio: string;
  definitions: string[];
  examples: string[];
}

interface KnowledgePanel {
  type: string;
  title: string;
  description: string;
  url: string;
  metadata: {
    title: string;
    value: string;
  }[];
  books: {
    title: string;
    year: string;
  }[];
  tv_shows_and_movies: {
    title: string;
    year: string;
  }[];
  images: {
    url: string;
    alt?: string;
    source?: string;
  }[];
  translation?: Translation; // Add translation to the KnowledgePanel interface
  dictionary?: Dictionary; // Add dictionary to the KnowledgePanel interface
}

interface SearchResultsData {
  status: number;
  data: {
    results: {
      results: SearchResult[];
      knowledge_panel: KnowledgePanel;
    };
  };
}

export const SearchResults = () => {
  const [searchResults, setSearchResults] = useState<SearchResultsData | null>(null);
  const [query, set_query] = useState('');

  async function fetchData() {
    try {
      const response = await fetch(`/tools/search?q=${query}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSearch = () => {
    fetchData();
  }

  return (
    <div>
      <TextInput 
        value={query}
        onChange={val => set_query(val)}
        onEnter={handleSearch}
        canClear={query !== ''}
        buttons={[
          {
            icon: 'search',
            iconPrefix: 'fas',
            onClick: handleSearch,
            minimal: true
          }
        ]}
      />
      {/* Display the knowledge panel */}
      <div>
        {searchResults?.data?.results && (
          <KnowledgePanelComponent knowledge_panel={searchResults.data.results.knowledge_panel} />
        )}
      </div>

      {/* Display the search results */}
      <div>
        {searchResults?.data?.results && searchResults.data.results.results.map((result, index) => (
          <SearchResultComponent key={index} result={result} />
        ))}
      </div>
    </div>
  );
};


const KnowledgePanelComponent = ({ knowledge_panel }: { knowledge_panel: KnowledgePanel }) => (
  <div>
    {knowledge_panel.type && <h2>{knowledge_panel.type}</h2>}
    {knowledge_panel.title && <h3>{knowledge_panel.title}</h3>}
    {knowledge_panel.description && <p>{knowledge_panel.description}</p>}
    {knowledge_panel.url && <a href={knowledge_panel.url}>{knowledge_panel.url}</a>}
    <MetadataComponent metadata={knowledge_panel.metadata} />
    <BooksComponent books={knowledge_panel.books} />
    <TVShowsAndMoviesComponent tv_shows_and_movies={knowledge_panel.tv_shows_and_movies} />
    <ImagesComponent images={knowledge_panel.images} />
    <TranslationComponent translation={knowledge_panel.translation} />
    <DictionaryComponent dictionary={knowledge_panel.dictionary} />
  </div>
);

const SearchResultComponent = ({ result }: { result: SearchResult }) => (
  <div>
    <h3>{result.title}</h3>
    <p>{result.description}</p>
    {result.url && <a href={result.url}>{result.url}</a>}
    {result.favicons && (
      <div>
        <img src={result.favicons.low_res} alt="Website favicon" /> {/* Use low_res favicon instead of high_res */}
      </div>
    )}
  </div>
);

const MetadataComponent = ({ metadata }: { metadata: KnowledgePanel["metadata"] }) => {
  if (metadata.length === 0) return null;

  return (
    <div>
      <h4>Metadata:</h4>
      <ul>
        {metadata.map((item, index) => (
          <li key={index}>
            <strong>{item.title}:</strong> {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

const BooksComponent = ({ books }: { books: KnowledgePanel["books"] }) => {
  if (books.length === 0) return null;

  return (
    <div>
      <h4>Books:</h4>
      <ul>
        {books.map((book, index) => (
          <li key={index}>
            {book.title} ({book.year})
          </li>
        ))}
      </ul>
    </div>
  );
};

const TVShowsAndMoviesComponent = ({ tv_shows_and_movies }: { tv_shows_and_movies: KnowledgePanel["tv_shows_and_movies"] }) => {
  if (tv_shows_and_movies.length === 0) return null;

  return (
    <div>
      <h4>TV Shows and Movies:</h4>
      <ul>
        {tv_shows_and_movies.map((item, index) => (
          <li key={index}>
            {item.title} ({item.year})
          </li>
        ))}
      </ul>
    </div>
  );
};

const ImagesComponent = ({ images }: { images: KnowledgePanel["images"] }) => {
  if (images.length === 0) return null;

  return (
    <div>
      <h4>Images:</h4>
      <div>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.url} alt={image.alt} />
            {image.source && <p>Source: {image.source}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const TranslationComponent = ({ translation }: { translation?: Translation }) => {
  if (!translation) return null;

  return (
    <div>
      <h4>Translation:</h4>
      <p>
        <strong>Source Language:</strong> {translation.source_language}
      </p>
      <p>
        <strong>Target Language:</strong> {translation.target_language}
      </p>
      <p>
        <strong>Source Text:</strong> {translation.source_text}
      </p>
      <p>
        <strong>Target Text:</strong> {translation.target_text}
      </p>
    </div>
  );
};

const DictionaryComponent = ({ dictionary }: { dictionary?: Dictionary }) => {
  if (!dictionary) return null;

  return (
    <div>
      <h4>Dictionary:</h4>
      <p>
        <strong>Word:</strong> {dictionary.word}
      </p>
      <p>
        <strong>Phonetic:</strong> {dictionary.phonetic}
      </p>
      <p>
        <strong>Audio:</strong> <a href={dictionary.audio}>{dictionary.audio}</a>
      </p>
      <div>
        <h5>Definitions:</h5>
        <ul>
          {dictionary.definitions.map((definition, index) => (
            <li key={index}>{definition}</li>
          ))}
        </ul>
      </div>
      <div>
        <h5>Examples:</h5>
        <ul>
          {dictionary.examples.map((example, index) => (
            <li key={index}>{example}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
