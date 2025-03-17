
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { SearchBar } from '../components/SearchBar';
import { BookmarkCard } from '../components/BookmarkCard';
import { EmptyState } from '../components/EmptyState';
import { AddBookmarkModal } from '../components/AddBookmarkModal';
import { getBookmarks, searchBookmarks, generateId } from '../lib/bookmarkHelpers';
import { Bookmark, Plus, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Bookmark as BookmarkType } from '../lib/types';

const Index = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [searchResults, setSearchResults] = useState<BookmarkType[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const result = await getBookmarks();
        setBookmarks(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        toast({
          title: "Error loading bookmarks",
          description: "There was a problem loading your bookmarks.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookmarks();
  }, [toast]);
  
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    setSearchResults(searchBookmarks(query));
  };
  
  const handleAddBookmark = (data: any) => {
    const newBookmark = {
      id: generateId(),
      title: data.title,
      url: data.url,
      favicon: `https://www.google.com/s2/favicons?domain=${data.url}&sz=128`,
      description: data.description,
      tags: data.tags,
      createdAt: new Date().toISOString(),
      lastVisited: null,
      collectionId: data.collectionId,
      isArchived: false,
      isReadLater: data.isReadLater,
      visitCount: 0
    };
    
    // If we're in a Chrome extension environment, add the bookmark using Chrome API
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.create({
        parentId: data.collectionId || '1', // Default to bookmarks bar if no collection
        title: data.title,
        url: data.url
      }, (newChromeBookmark) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          toast({
            title: "Error adding bookmark",
            description: chrome.runtime.lastError.message,
            variant: "destructive"
          });
        } else {
          setBookmarks(prev => [newBookmark, ...prev]);
          toast({
            title: "Bookmark added",
            description: "Your bookmark has been added successfully.",
          });
        }
      });
    } else {
      // Fallback for non-extension environment
      setBookmarks(prev => [newBookmark, ...prev]);
      toast({
        title: "Bookmark added",
        description: "Your bookmark has been added successfully.",
      });
    }
  };
  
  const displayedBookmarks = searchResults !== null ? searchResults : bookmarks;
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
              All Bookmarks
            </span>
            <h1 className="text-3xl font-display font-bold mt-2">Your Bookmarks</h1>
            <p className="text-muted-foreground mt-2">Manage all your saved bookmarks in one place.</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              className="inline-flex items-center justify-center rounded-lg border border-border bg-white/50 hover:bg-secondary px-4 py-2 text-sm font-medium transition-colors"
              aria-label="Filter options"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors"
              aria-label="Add bookmark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Bookmark
            </button>
          </div>
        </div>
        
        <div className="mb-8 max-w-xl">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : displayedBookmarks.length === 0 ? (
          <EmptyState 
            type="bookmarks" 
            onAction={() => setIsModalOpen(true)} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedBookmarks.map(bookmark => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        )}
      </div>
      
      <AddBookmarkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddBookmark={handleAddBookmark} 
      />
    </Layout>
  );
};

export default Index;
