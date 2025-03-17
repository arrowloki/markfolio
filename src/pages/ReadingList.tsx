
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { SearchBar } from '../components/SearchBar';
import { BookmarkCard } from '../components/BookmarkCard';
import { EmptyState } from '../components/EmptyState';
import { getReadingList, searchBookmarks } from '../lib/bookmarkHelpers';
import { BookOpen, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReadingList = () => {
  const [readingList, setReadingList] = useState(getReadingList());
  const [searchResults, setSearchResults] = useState<typeof readingList | null>(null);
  
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    
    // Filter search results to only include items in the reading list
    const allSearchResults = searchBookmarks(query);
    const filteredResults = allSearchResults.filter(bookmark => bookmark.isReadLater);
    
    setSearchResults(filteredResults);
  };
  
  const displayedBookmarks = searchResults !== null ? searchResults : readingList;
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
              Reading List
            </span>
            <h1 className="text-3xl font-display font-bold mt-2">Read Later</h1>
            <p className="text-muted-foreground mt-2">Articles and pages you've saved to read later.</p>
          </div>
          
          <button
            className="inline-flex items-center justify-center rounded-lg border border-border bg-white/50 hover:bg-secondary px-4 py-2 text-sm font-medium transition-colors"
            aria-label="Filter options"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
        
        <div className="mb-8 max-w-xl">
          <SearchBar onSearch={handleSearch} placeholder="Search reading list..." />
        </div>
        
        {displayedBookmarks.length === 0 ? (
          <EmptyState 
            type="reading-list" 
            onAction={() => window.location.href = "/"} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedBookmarks.map(bookmark => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReadingList;
