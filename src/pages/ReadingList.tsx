
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { SearchBar } from '../components/SearchBar';
import { BookmarkCard } from '../components/BookmarkCard';
import { EmptyState } from '../components/EmptyState';
import { getReadingList, searchBookmarks } from '../lib/bookmarkHelpers';
import { BookOpen, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Bookmark } from '../lib/types';
import { useToast } from '@/hooks/use-toast';

const ReadingList = () => {
  const [readingList, setReadingList] = useState<Bookmark[]>([]);
  const [searchResults, setSearchResults] = useState<Bookmark[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchReadingList = async () => {
      setLoading(true);
      try {
        const result = await getReadingList();
        setReadingList(result);
      } catch (error) {
        console.error('Error fetching reading list:', error);
        toast({
          title: "Error loading reading list",
          description: "There was a problem loading your reading list.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReadingList();
  }, [toast]);
  
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    
    try {
      // Filter search results to only include items in the reading list
      const allSearchResults = await searchBookmarks(query);
      const filteredResults = allSearchResults.filter(bookmark => bookmark.isReadLater);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching reading list:', error);
      toast({
        title: "Error searching reading list",
        description: "There was a problem with your search.",
        variant: "destructive"
      });
    }
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
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : displayedBookmarks.length === 0 ? (
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
