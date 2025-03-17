
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { CollectionCard } from '../components/CollectionCard';
import { EmptyState } from '../components/EmptyState';
import { getCollections } from '../lib/bookmarkHelpers';
import { FolderIcon, Plus, Filter } from 'lucide-react';

const Collections = () => {
  const [collections, setCollections] = useState(getCollections());
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
              Collections
            </span>
            <h1 className="text-3xl font-display font-bold mt-2">Your Collections</h1>
            <p className="text-muted-foreground mt-2">Organize your bookmarks into themed collections.</p>
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
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors"
              aria-label="Add collection"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Collection
            </button>
          </div>
        </div>
        
        {collections.length === 0 ? (
          <EmptyState type="collections" onAction={() => {}} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map(collection => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Collections;
