
import React from 'react';
import { Bookmark, FolderPlus, BookPlus } from 'lucide-react';

interface EmptyStateProps {
  type: 'bookmarks' | 'collections' | 'reading-list';
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction }) => {
  const getContent = () => {
    switch (type) {
      case 'bookmarks':
        return {
          icon: <Bookmark className="h-10 w-10 text-muted-foreground" />,
          title: 'No bookmarks yet',
          description: 'Save your first bookmark to get started.',
          buttonText: 'Add Bookmark',
        };
      case 'collections':
        return {
          icon: <FolderPlus className="h-10 w-10 text-muted-foreground" />,
          title: 'No collections yet',
          description: 'Create your first collection to organize your bookmarks.',
          buttonText: 'Create Collection',
        };
      case 'reading-list':
        return {
          icon: <BookPlus className="h-10 w-10 text-muted-foreground" />,
          title: 'Your reading list is empty',
          description: 'Save bookmarks to your reading list to view them here.',
          buttonText: 'Browse Bookmarks',
        };
      default:
        return {
          icon: <Bookmark className="h-10 w-10 text-muted-foreground" />,
          title: 'Nothing to see here',
          description: 'This section is empty.',
          buttonText: 'Go Back',
        };
    }
  };
  
  const content = getContent();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        {content.icon}
      </div>
      <h3 className="text-lg font-medium">{content.title}</h3>
      <p className="mt-2 text-muted-foreground max-w-md">{content.description}</p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors"
        >
          {content.buttonText}
        </button>
      )}
    </div>
  );
};
