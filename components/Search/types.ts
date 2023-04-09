export interface SearchResult {
  title: string;
  description: string;
  url: string;
  is_sponsored: boolean;
  favicons: {
    high_res: string;
    low_res: string;
  };
}

export interface Translation {
  source_language: string;
  target_language: string;
  source_text: string;
  target_text: string;
}

export interface Dictionary {
  word: string;
  phonetic: string;
  audio: string;
  definitions: string[];
  examples: string[];
}

export interface KnowledgePanel {
  type: string | null;
  title: string | null;
  description: string | null;
  url: string | null;
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
}

export interface SearchResultsData {
  status: number;
  data: {
    results: {
      results: SearchResult[];
      knowledge_panel: KnowledgePanel;
      dictionary?: Dictionary; // Move dictionary to the results object
      translation?: Translation; // Move translation to the results object
    };
  };
}
