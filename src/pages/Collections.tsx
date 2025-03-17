
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { SearchBar } from '../components/SearchBar';
import { CollectionCard } from '../components/CollectionCard';
import { EmptyState } from '../components/EmptyState';
import { getCollections } from '../lib/bookmarkHelpers';
import { Collection, LayoutGrid, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Collections = () => {
  const [collections, setCollections] = useState(getCollections());
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const filteredCollections = searchQuery
    ? collections.filter(collection => 
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : collections;
  
  const handleCreateCollection = () => {
    // This would open a modal to create a collection
    toast({
      title: "Coming soon",
      description: "Collection creation will be available in the next update.",
    });
  };
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
              Collections
            </span>
            <h1 className="text-3xl font-display font-bold mt-2">Your Collections</h1>
            <p className="text-muted-foreground mt-2">Organize bookmarks into meaningful collections.</p>
          </div>
          
          <button
            onClick={handleCreateCollection}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors w-full md:w-auto"
            aria-label="Create collection"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
          </button>
        </div>
        
        <div className="mb-8 max-w-xl">
          <SearchBar onSearch={handleSearch} placeholder="Search collections..." />
        </div>
        
        {filteredCollections.length === 0 ? (
          <EmptyState 
            type="collections" 
            onAction={handleCreateCollection} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCollections.map(collection => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Collections;
