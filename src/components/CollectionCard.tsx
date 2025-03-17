
import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '../lib/types';
import { Folder, ChevronRight } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'green':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'purple':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'red':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  return (
    <Link 
      to={`/collections/${collection.id}`}
      className="glass-card rounded-xl p-6 hover:shadow-elevation transition-all duration-300 flex flex-col animate-scale-in"
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-lg ${getColorClass(collection.color)} flex items-center justify-center`}>
          <Folder className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="font-medium">{collection.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{collection.bookmarkCount} bookmarks</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
      
      {collection.description && (
        <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
          {collection.description}
        </p>
      )}
    </Link>
  );
};
