
import React from 'react';
import { Bookmark } from '../lib/types';
import { formatDate, extractDomain } from '../lib/bookmarkHelpers';
import { ExternalLink, Clock, Star, MoreVertical } from 'lucide-react';

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark }) => {
  const domain = extractDomain(bookmark.url);
  
  return (
    <div className="group glass-card rounded-xl p-4 transition-all duration-300 hover:shadow-elevation animate-scale-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md overflow-hidden bg-secondary flex items-center justify-center">
            {bookmark.favicon ? (
              <img 
                src={bookmark.favicon} 
                alt={`${domain} favicon`} 
                className="h-6 w-6 object-contain" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = domain.charAt(0).toUpperCase();
                }}
              />
            ) : (
              <span className="text-lg font-medium">{domain.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-sm line-clamp-1">{bookmark.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center">
              <span className="line-clamp-1">{domain}</span>
              <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground mx-1.5"></span>
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDate(bookmark.lastVisited || bookmark.createdAt)}</span>
            </p>
          </div>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-full hover:bg-secondary transition-colors" aria-label="More options">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      
      {bookmark.description && (
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {bookmark.description}
        </p>
      )}
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {bookmark.tags.slice(0, 3).map(tag => (
            <span 
              key={tag} 
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {bookmark.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground">
              +{bookmark.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {bookmark.visitCount > 0 && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Star className="h-3 w-3 mr-0.5 fill-amber-400 stroke-amber-500" />
              <span>{bookmark.visitCount}</span>
            </div>
          )}
          
          <a 
            href={bookmark.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-1.5 rounded-full hover:bg-secondary transition-colors"
            aria-label={`Visit ${bookmark.title}`}
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        </div>
      </div>
    </div>
  );
};
